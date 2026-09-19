import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { interopDefault: true, moduleCache: false });
const storage = await jiti.import("./session-storage.ts");
const { scanAllSessions, invalidateAllScannedSessions } = await jiti.import("./session-scan.ts");
const { reparentDirectChildSessions } = await jiti.import("./session-reparent.ts");

const originalAgentDir = process.env.PI_CODING_AGENT_DIR;
const originalSessionDir = process.env.PI_CODING_AGENT_SESSION_DIR;

function useAgentDir(agentDir) {
  process.env.PI_CODING_AGENT_DIR = agentDir;
  delete process.env.PI_CODING_AGENT_SESSION_DIR;
  globalThis.__piSessionStorageMigration = undefined;
  globalThis.__piSessionStorageOperations = 0;
  globalThis.__piSessionStorageOperationWaiters = new Set();
  globalThis.__piSessionStorageRecoveredAgentDir = undefined;
  invalidateAllScannedSessions();
}

function writeSession(root, projectDir, fileName, header, entries = []) {
  const directory = join(root, projectDir);
  mkdirSync(directory, { recursive: true });
  const filePath = join(directory, fileName);
  writeFileSync(filePath, `${[header, ...entries].map(JSON.stringify).join("\n")}\n`, "utf8");
  return filePath;
}

function sessionHeader(id, cwd, parentSession) {
  return {
    type: "session",
    version: 3,
    id,
    timestamp: "2026-01-01T00:00:00.000Z",
    cwd,
    ...(parentSession ? { parentSession } : {}),
  };
}

test.after(() => {
  if (originalAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = originalAgentDir;
  if (originalSessionDir === undefined) delete process.env.PI_CODING_AGENT_SESSION_DIR;
  else process.env.PI_CODING_AGENT_SESSION_DIR = originalSessionDir;
  globalThis.__piSessionStorageMigration = undefined;
  globalThis.__piSessionStorageOperations = 0;
  globalThis.__piSessionStorageOperationWaiters = new Set();
  globalThis.__piSessionStorageRecoveredAgentDir = undefined;
  invalidateAllScannedSessions();
});

test("environment session root has read-only precedence over stored config", () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-env-"));
  try {
    const agentDir = join(temp, "agent");
    const configuredRoot = join(temp, "configured");
    const environmentRoot = join(temp, "environment");
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, "session-storage.json"), JSON.stringify({
      version: 1,
      activeRoot: configuredRoot,
      historicalRoots: [],
      backupRoots: [],
    }));
    useAgentDir(agentDir);
    process.env.PI_CODING_AGENT_SESSION_DIR = environmentRoot;

    const state = storage.getSessionStorageState();
    assert.equal(state.activeRoot, environmentRoot);
    assert.equal(state.defaultRoot, join(agentDir, "sessions"));
    assert.equal(state.source, "environment");
    assert.equal(state.readOnly, true);
    assert.equal(state.environmentVariable, "PI_CODING_AGENT_SESSION_DIR");
    assert.deepEqual(state.roots.map(({ path, kind }) => [path, kind]), [
      [environmentRoot, "active"],
      [configuredRoot, "historical"],
    ]);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("migration stages files, rewrites parent paths, preserves source, and scans active first", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-migrate-"));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    const targetRoot = join(temp, "target");
    useAgentDir(agentDir);

    const parentPath = writeSession(
      sourceRoot,
      "--project--",
      "parent.jsonl",
      sessionHeader("parent-id", join(temp, "project")),
    );
    const childPath = writeSession(
      sourceRoot,
      "--project--",
      "child.jsonl",
      sessionHeader("child-id", join(temp, "project"), parentPath),
    );
    let barriers = 0;

    const result = await storage.migrateSessionStorage(targetRoot, async () => { barriers++; });

    assert.equal(barriers, 1);
    assert.equal(result.copiedSessions, 2);
    assert.equal(result.reusedSessions, 0);
    assert.equal(result.backupRoot, result.sourceRoot);
    assert.equal(existsSync(parentPath), true);
    assert.equal(existsSync(childPath), true);

    const migratedParent = join(result.targetRoot, "--project--", "parent.jsonl");
    const migratedChild = join(result.targetRoot, "--project--", "child.jsonl");
    const childHeader = JSON.parse(readFileSync(migratedChild, "utf8").split(/\r?\n/, 1)[0]);
    assert.equal(childHeader.parentSession, migratedParent);

    const state = storage.getSessionStorageState();
    assert.equal(state.activeRoot, result.targetRoot);
    assert.deepEqual(state.roots.map(({ path, kind }) => [path, kind]), [
      [result.targetRoot, "active"],
      [result.sourceRoot, "backup"],
    ]);

    const scanned = await scanAllSessions();
    assert.deepEqual(scanned.map((session) => session.id).sort(), ["child-id", "parent-id"]);
    assert.ok(scanned.every((session) => session.path.startsWith(result.targetRoot)));
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("migration rejects divergent duplicate ids without switching or deleting source", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-divergent-"));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    const targetRoot = join(temp, "target");
    useAgentDir(agentDir);

    const sourcePath = writeSession(
      sourceRoot,
      "--project--",
      "source.jsonl",
      sessionHeader("same-id", join(temp, "project")),
      [{ type: "message", id: "a", parentId: null, timestamp: "2026-01-01T00:00:01.000Z", message: { role: "user", content: "source" } }],
    );
    const targetPath = writeSession(
      targetRoot,
      "--other--",
      "target.jsonl",
      sessionHeader("same-id", join(temp, "project")),
      [{ type: "message", id: "b", parentId: null, timestamp: "2026-01-01T00:00:01.000Z", message: { role: "user", content: "target" } }],
    );
    const originalTarget = readFileSync(targetPath, "utf8");

    await assert.rejects(
      storage.migrateSessionStorage(targetRoot),
      (error) => error?.code === "DIVERGENT_SESSION" && error?.status === 409,
    );

    assert.equal(existsSync(sourcePath), true);
    assert.equal(readFileSync(targetPath, "utf8"), originalTarget);
    assert.equal(storage.getSessionStorageState().activeRoot, sourceRoot);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("deletion reparenting updates duplicate physical children across retained roots", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-reparent-"));
  try {
    const agentDir = join(temp, "agent");
    const activeRoot = join(agentDir, "sessions");
    const historicalRoot = join(temp, "historical");
    const backupRoot = join(temp, "backup");
    useAgentDir(agentDir);
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, "session-storage.json"), JSON.stringify({
      version: 1,
      activeRoot,
      historicalRoots: [historicalRoot],
      backupRoots: [backupRoot],
    }));

    const project = join(temp, "project");
    const grandparent = writeSession(
      activeRoot,
      "--project--",
      "grandparent.jsonl",
      sessionHeader("grandparent-id", project),
    );
    const parent = writeSession(
      activeRoot,
      "--project--",
      "parent.jsonl",
      sessionHeader("parent-id", project, grandparent),
    );
    const historicalChild = writeSession(
      historicalRoot,
      "--project--",
      "child.jsonl",
      sessionHeader("duplicate-child-id", project, parent),
    );
    const backupChild = writeSession(
      backupRoot,
      "--project--",
      "child.jsonl",
      sessionHeader("duplicate-child-id", project, parent),
    );
    const unrelated = writeSession(
      backupRoot,
      "--project--",
      "unrelated.jsonl",
      sessionHeader("unrelated-id", project, grandparent),
    );

    const rewritten = await reparentDirectChildSessions(parent, grandparent);

    assert.equal(rewritten, 2);
    assert.equal(JSON.parse(readFileSync(historicalChild, "utf8").split(/\r?\n/, 1)[0]).parentSession, grandparent);
    assert.equal(JSON.parse(readFileSync(backupChild, "utf8").split(/\r?\n/, 1)[0]).parentSession, grandparent);
    assert.equal(JSON.parse(readFileSync(unrelated, "utf8").split(/\r?\n/, 1)[0]).parentSession, grandparent);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("migration rejects same, nested, and environment-controlled targets", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-preflight-"));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    useAgentDir(agentDir);
    mkdirSync(sourceRoot, { recursive: true });

    await assert.rejects(storage.migrateSessionStorage(sourceRoot), (error) => error?.code === "OVERLAPPING_ROOTS");
    await assert.rejects(storage.migrateSessionStorage(join(sourceRoot, "nested")), (error) => error?.code === "OVERLAPPING_ROOTS");

    process.env.PI_CODING_AGENT_SESSION_DIR = join(temp, "environment");
    await assert.rejects(
      storage.migrateSessionStorage(join(temp, "target")),
      (error) => error?.code === "ENVIRONMENT_CONTROLLED" && error?.status === 403,
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("environment session directory is a flat SDK-compatible root", () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-flat-"));
  try {
    const agentDir = join(temp, "agent");
    const environmentRoot = join(temp, "environment");
    mkdirSync(environmentRoot, { recursive: true });
    useAgentDir(agentDir);
    process.env.PI_CODING_AGENT_SESSION_DIR = environmentRoot;

    assert.equal(storage.isFlatActiveSessionRoot(), true);
    assert.equal(storage.getSessionDirForCwd(join(temp, "project")), environmentRoot);
    assert.equal(existsSync(join(environmentRoot, "--project--")), false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("retained sessions are promoted into the active root before mutation", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-promote-"));
  try {
    const agentDir = join(temp, "agent");
    const activeRoot = join(agentDir, "sessions");
    const backupRoot = join(temp, "backup");
    useAgentDir(agentDir);
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, "session-storage.json"), JSON.stringify({
      version: 1,
      activeRoot,
      historicalRoots: [],
      backupRoots: [backupRoot],
    }));

    const project = join(temp, "project");
    const backupPath = writeSession(
      backupRoot,
      "--project--",
      "retained.jsonl",
      sessionHeader("retained-id", project),
    );
    const release = await storage.beginSessionStorageOperation();
    try {
      const promoted = storage.materializeSessionInActiveRoot("retained-id");
      assert.ok(promoted);
      assert.ok(promoted.startsWith(activeRoot));
      assert.equal(existsSync(backupPath), true);
      assert.equal(existsSync(promoted), true);
      assert.equal(JSON.parse(readFileSync(promoted, "utf8").split(/\r?\n/, 1)[0]).id, "retained-id");
    } finally {
      release();
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("deleting a session removes every validated replica", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-delete-replicas-"));
  try {
    const agentDir = join(temp, "agent");
    const activeRoot = join(agentDir, "sessions");
    const backupRoot = join(temp, "backup");
    useAgentDir(agentDir);
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, "session-storage.json"), JSON.stringify({
      version: 1,
      activeRoot,
      historicalRoots: [],
      backupRoots: [backupRoot],
    }));

    const project = join(temp, "project");
    const activePath = writeSession(
      activeRoot,
      "--project--",
      "session.jsonl",
      sessionHeader("replica-id", project),
    );
    const backupPath = writeSession(
      backupRoot,
      "--project--",
      "session.jsonl",
      sessionHeader("replica-id", project),
    );

    const deleted = storage.deleteSessionReplicas("replica-id");
    assert.equal(deleted.length, 2);
    assert.equal(existsSync(activePath), false);
    assert.equal(existsSync(backupPath), false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("migration waits for in-flight storage operations before copying", async () => {
    const temp = realpathSync(mkdtempSync(join(tmpdir(), "pi-storage-barrier-")));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    const targetRoot = join(temp, "target");
    useAgentDir(agentDir);
    writeSession(sourceRoot, "--project--", "live.jsonl", sessionHeader("live-id", join(temp, "project")));

    const release = await storage.beginSessionStorageOperation();
    let drained = false;
    const pending = storage.migrateSessionStorage(targetRoot, async () => { drained = true; });
    await new Promise((resolveWait) => setTimeout(resolveWait, 80));
    assert.equal(drained, true);
    assert.equal(storage.getSessionStorageState().activeRoot, sourceRoot);
    assert.equal(existsSync(join(targetRoot, "--project--", "live.jsonl")), false);

    release();
    const result = await pending;
    assert.equal(storage.getSessionStorageState().activeRoot, result.targetRoot);
    assert.equal(existsSync(join(result.targetRoot, "--project--", "live.jsonl")), true);
    assert.equal(existsSync(join(sourceRoot, "--project--", "live.jsonl")), true);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("incomplete journals roll back without switching the active root", async () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-journal-"));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    const targetRoot = join(temp, "target");
    const stageRoot = join(temp, ".target.pi-stage-test");
    const displacedTarget = join(temp, ".target.pi-previous-test");
    useAgentDir(agentDir);
    mkdirSync(agentDir, { recursive: true });
    mkdirSync(sourceRoot, { recursive: true });
    mkdirSync(stageRoot, { recursive: true });
    writeFileSync(join(stageRoot, "orphan.jsonl"), "{}\n");
    writeFileSync(join(agentDir, "session-storage.transaction.json"), `${JSON.stringify({
      version: 1,
      phase: "staged",
      sourceRoot,
      targetRoot,
      stageRoot,
      displacedTarget,
      targetExisted: false,
    }, null, 2)}\n`);

    await storage.ensureSessionStorageRecovered();

    assert.equal(existsSync(stageRoot), false);
    assert.equal(existsSync(join(agentDir, "session-storage.transaction.json")), false);
    assert.equal(storage.getSessionStorageState().activeRoot, sourceRoot);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("duplicate ids inside one physical root are rejected", () => {
  const temp = mkdtempSync(join(tmpdir(), "pi-storage-dup-root-"));
  try {
    const agentDir = join(temp, "agent");
    const sourceRoot = join(agentDir, "sessions");
    useAgentDir(agentDir);
    writeSession(sourceRoot, "--project-a--", "a.jsonl", sessionHeader("dup-id", join(temp, "a")));
    writeSession(sourceRoot, "--project-b--", "b.jsonl", sessionHeader("dup-id", join(temp, "b")));

    assert.throws(
      () => storage.collectPhysicalSessionRecords(),
      (error) => error?.code === "DUPLICATE_SESSION_IN_ROOT" && error?.status === 409,
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
