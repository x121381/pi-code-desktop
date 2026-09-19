import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { createHash, randomUUID } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import lockfile from "proper-lockfile";
import { writePrivateFileAtomicSync } from "./atomic-file";
import { sessionPathKey } from "./session-path";
import { userHome } from "./user-home";

const CONFIG_VERSION = 1 as const;
const CONFIG_FILE_NAME = "session-storage.json";
const JOURNAL_FILE_NAME = "session-storage.transaction.json";
const LOCK_FILE_NAME = "session-storage.lock";
const ENV_SESSION_DIR = "PI_CODING_AGENT_SESSION_DIR";

export type SessionStorageRootKind = "active" | "historical" | "backup";
export interface SessionStorageRoot {
  path: string;
  kind: SessionStorageRootKind;
  writable: boolean;
}
export interface SessionStorageState {
  version: typeof CONFIG_VERSION;
  activeRoot: string;
  defaultRoot: string;
  source: "environment" | "config" | "default";
  readOnly: boolean;
  environmentVariable?: typeof ENV_SESSION_DIR;
  roots: SessionStorageRoot[];
}
interface StoredSessionStorageConfig {
  version: typeof CONFIG_VERSION;
  activeRoot: string;
  historicalRoots: string[];
  backupRoots: string[];
}
interface MigrationJournal {
  version: 1;
  phase: "staged" | "target_displaced" | "stage_published" | "config_switched";
  sourceRoot: string;
  targetRoot: string;
  stageRoot: string;
  displacedTarget: string;
  targetExisted: boolean;
}
export interface SessionMigrationResult {
  sourceRoot: string;
  targetRoot: string;
  backupRoot: string;
  copiedSessions: number;
  reusedSessions: number;
}
export interface PhysicalSessionRecord {
  id: string;
  cwd: string;
  path: string;
  root: string;
  rootKind: SessionStorageRootKind;
  relativePath: string;
  contents: string;
  parentSession?: string;
}

export class SessionStorageError extends Error {
  constructor(message: string, public readonly code: string, public readonly status = 400) {
    super(message);
    this.name = "SessionStorageError";
  }
}

type CacheInvalidator = () => void;
type OperationWaiter = () => void;
declare global {
  var __piSessionStorageMigration: Promise<SessionMigrationResult> | undefined;
  var __piSessionStorageInvalidators: Set<CacheInvalidator> | undefined;
  var __piSessionStorageOperations: number | undefined;
  var __piSessionStorageOperationWaiters: Set<OperationWaiter> | undefined;
  var __piSessionStorageRecoveredAgentDir: string | undefined;
}

function expandHome(input: string): string {
  if (input === "~") return userHome();
  if (input.startsWith(`~${sep}`) || input.startsWith("~/") || input.startsWith("~\\")) {
    return join(userHome(), input.slice(2));
  }
  return input;
}
function normalizeRoot(input: string): string {
  return resolve(expandHome(input.trim()));
}
function canonicalizeExistingOrFuture(input: string): string {
  const normalized = normalizeRoot(input);
  if (existsSync(normalized)) return realpathSync.native(normalized);
  let cursor = dirname(normalized);
  const missing = [basename(normalized)];
  while (!existsSync(cursor)) {
    const parent = dirname(cursor);
    if (parent === cursor) throw new SessionStorageError(`No existing parent directory for ${normalized}`, "INVALID_TARGET");
    missing.unshift(basename(cursor));
    cursor = parent;
  }
  return join(realpathSync.native(cursor), ...missing);
}
function canonicalPathKey(filePath: string): string {
  try { return sessionPathKey(realpathSync.native(filePath)); } catch { return sessionPathKey(resolve(filePath)); }
}
function samePath(left: string, right: string): boolean {
  return canonicalPathKey(left) === canonicalPathKey(right);
}
function isNestedOrSame(first: string, second: string): boolean {
  const rel = relative(first, second);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}
function configPath(): string { return join(getAgentDir(), CONFIG_FILE_NAME); }
function journalPath(): string { return join(getAgentDir(), JOURNAL_FILE_NAME); }
function lockPath(): string { return join(getAgentDir(), LOCK_FILE_NAME); }
function defaultStorageRoot(): string { return join(getAgentDir(), "sessions"); }

function uniqueRoots(roots: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of roots) {
    const root = normalizeRoot(value);
    const key = canonicalPathKey(root);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(root);
  }
  return result;
}
function parseStoredConfig(): StoredSessionStorageConfig | null {
  if (!existsSync(configPath())) return null;
  try {
    const value = JSON.parse(readFileSync(configPath(), "utf8")) as Partial<StoredSessionStorageConfig>;
    if (value.version !== CONFIG_VERSION || typeof value.activeRoot !== "string" ||
      !Array.isArray(value.historicalRoots) || !value.historicalRoots.every((v) => typeof v === "string") ||
      !Array.isArray(value.backupRoots) || !value.backupRoots.every((v) => typeof v === "string")) return null;
    return {
      version: CONFIG_VERSION,
      activeRoot: normalizeRoot(value.activeRoot),
      historicalRoots: uniqueRoots(value.historicalRoots),
      backupRoots: uniqueRoots(value.backupRoots),
    };
  } catch { return null; }
}
function makeStoredConfig(activeRoot: string, historicalRoots: string[], backupRoots: string[]): StoredSessionStorageConfig {
  const active = normalizeRoot(activeRoot);
  const activeKey = canonicalPathKey(active);
  const historical = uniqueRoots(historicalRoots).filter((root) => canonicalPathKey(root) !== activeKey);
  const historicalKeys = new Set(historical.map(canonicalPathKey));
  return {
    version: CONFIG_VERSION,
    activeRoot: active,
    historicalRoots: historical,
    backupRoots: uniqueRoots(backupRoots).filter((root) =>
      canonicalPathKey(root) !== activeKey && !historicalKeys.has(canonicalPathKey(root))),
  };
}
function writeStoredConfig(config: StoredSessionStorageConfig): void {
  mkdirSync(getAgentDir(), { recursive: true, mode: 0o700 });
  writePrivateFileAtomicSync(configPath(), `${JSON.stringify(config, null, 2)}\n`);
}

export function getSessionStorageState(): SessionStorageState {
  const stored = parseStoredConfig();
  const envValue = process.env[ENV_SESSION_DIR]?.trim();
  const configuredActive = stored?.activeRoot ?? defaultStorageRoot();
  const activeRoot = envValue ? normalizeRoot(envValue) : configuredActive;
  const activeKey = canonicalPathKey(activeRoot);
  const historical = uniqueRoots([
    ...(envValue && canonicalPathKey(configuredActive) !== activeKey ? [configuredActive] : []),
    ...(stored?.historicalRoots ?? []),
  ]).filter((root) => canonicalPathKey(root) !== activeKey);
  const historicalKeys = new Set(historical.map(canonicalPathKey));
  const backups = uniqueRoots(stored?.backupRoots ?? []).filter((root) =>
    canonicalPathKey(root) !== activeKey && !historicalKeys.has(canonicalPathKey(root)));
  return {
    version: CONFIG_VERSION,
    activeRoot,
    defaultRoot: defaultStorageRoot(),
    source: envValue ? "environment" : stored ? "config" : "default",
    readOnly: Boolean(envValue),
    ...(envValue ? { environmentVariable: ENV_SESSION_DIR } : {}),
    roots: [
      { path: activeRoot, kind: "active", writable: true },
      ...historical.map((path) => ({ path, kind: "historical" as const, writable: false })),
      ...backups.map((path) => ({ path, kind: "backup" as const, writable: false })),
    ],
  };
}
export function getSessionStorageRoots(): SessionStorageRoot[] { return getSessionStorageState().roots; }
export function isFlatActiveSessionRoot(): boolean { return getSessionStorageState().source === "environment"; }

function encodeCwdDirectory(cwd: string): string {
  const resolvedCwd = resolve(cwd);
  return `--${resolvedCwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}--`;
}
export function getSessionDirForCwd(cwd: string): string {
  const state = getSessionStorageState();
  const sessionDir = state.source === "environment"
    ? state.activeRoot
    : join(state.activeRoot, encodeCwdDirectory(cwd));
  mkdirSync(sessionDir, { recursive: true });
  return sessionDir;
}

export function registerSessionStorageCacheInvalidator(invalidator: CacheInvalidator): () => void {
  globalThis.__piSessionStorageInvalidators ??= new Set();
  globalThis.__piSessionStorageInvalidators.add(invalidator);
  return () => globalThis.__piSessionStorageInvalidators?.delete(invalidator);
}
export function invalidateSessionStorageCaches(): void {
  for (const invalidate of globalThis.__piSessionStorageInvalidators ?? []) invalidate();
}

function ensureLockFile(): void {
  mkdirSync(getAgentDir(), { recursive: true, mode: 0o700 });
  if (!existsSync(lockPath())) writeFileSync(lockPath(), "", { flag: "wx", mode: 0o600 });
}
async function acquireMigrationLock(): Promise<() => Promise<void>> {
  ensureLockFile();
  return lockfile.lock(lockPath(), {
    realpath: false,
    stale: 120_000,
    retries: { retries: 12, factor: 1.5, minTimeout: 50, maxTimeout: 1_000, randomize: true },
  });
}
async function waitForExternalMigration(): Promise<void> {
  ensureLockFile();
  while (await lockfile.check(lockPath(), { realpath: false })) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 25));
  }
}

function readJournal(): MigrationJournal | null {
  if (!existsSync(journalPath())) return null;
  try {
    const value = JSON.parse(readFileSync(journalPath(), "utf8")) as MigrationJournal;
    return value?.version === 1 && typeof value.targetRoot === "string" ? value : null;
  } catch (error) {
    throw new SessionStorageError(`Invalid session storage transaction journal: ${String(error)}`, "RECOVERY_FAILED", 500);
  }
}
function writeJournal(journal: MigrationJournal): void {
  writePrivateFileAtomicSync(journalPath(), `${JSON.stringify(journal, null, 2)}\n`);
}
function removePath(path: string, errors: Error[]): void {
  try { rmSync(path, { recursive: true, force: true }); } catch (error) { errors.push(error as Error); }
}
function renamePath(from: string, to: string, errors: Error[]): void {
  try { renameSync(from, to); } catch (error) { errors.push(error as Error); }
}
function recoverTransactionUnlocked(): void {
  const journal = readJournal();
  if (!journal) return;
  const errors: Error[] = [];
  const configuredTarget = samePath(parseStoredConfig()?.activeRoot ?? defaultStorageRoot(), journal.targetRoot);
  if (configuredTarget || journal.phase === "config_switched") {
    if (existsSync(journal.stageRoot)) removePath(journal.stageRoot, errors);
    if (existsSync(journal.displacedTarget)) removePath(journal.displacedTarget, errors);
  } else {
    if (existsSync(journal.displacedTarget)) {
      if (existsSync(journal.targetRoot)) removePath(journal.targetRoot, errors);
      if (!existsSync(journal.targetRoot)) renamePath(journal.displacedTarget, journal.targetRoot, errors);
    } else if (!journal.targetExisted && existsSync(journal.targetRoot) && !existsSync(journal.stageRoot)) {
      removePath(journal.targetRoot, errors);
    }
    if (existsSync(journal.stageRoot)) removePath(journal.stageRoot, errors);
  }
  if (errors.length === 0) {
    try { unlinkSync(journalPath()); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") errors.push(error as Error);
    }
  }
  if (errors.length > 0) {
    throw new SessionStorageError(
      `Session storage recovery failed: ${errors.map((error) => error.message).join("; ")}`,
      "RECOVERY_FAILED",
      500,
    );
  }
}
export async function ensureSessionStorageRecovered(): Promise<void> {
  const agentKey = canonicalPathKey(getAgentDir());
  if (globalThis.__piSessionStorageRecoveredAgentDir === agentKey && !existsSync(journalPath())) return;
  const release = await acquireMigrationLock();
  try {
    recoverTransactionUnlocked();
    globalThis.__piSessionStorageRecoveredAgentDir = agentKey;
  } finally { await release(); }
}

export async function waitForSessionStorageMigration(): Promise<void> {
  while (globalThis.__piSessionStorageMigration) await globalThis.__piSessionStorageMigration;
  await ensureSessionStorageRecovered();
  await waitForExternalMigration();
  while (globalThis.__piSessionStorageMigration) await globalThis.__piSessionStorageMigration;
}
export async function beginSessionStorageOperation(): Promise<() => void> {
  while (true) {
    await waitForSessionStorageMigration();
    globalThis.__piSessionStorageOperations = (globalThis.__piSessionStorageOperations ?? 0) + 1;
    if (!globalThis.__piSessionStorageMigration) break;
    endSessionStorageOperation();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    endSessionStorageOperation();
  };
}
function endSessionStorageOperation(): void {
  globalThis.__piSessionStorageOperations = Math.max(0, (globalThis.__piSessionStorageOperations ?? 1) - 1);
  if (globalThis.__piSessionStorageOperations === 0) {
    for (const waiter of globalThis.__piSessionStorageOperationWaiters ?? []) waiter();
    globalThis.__piSessionStorageOperationWaiters?.clear();
  }
}
async function waitForStorageOperations(): Promise<void> {
  if ((globalThis.__piSessionStorageOperations ?? 0) === 0) return;
  await new Promise<void>((resolveWait) => {
    globalThis.__piSessionStorageOperationWaiters ??= new Set();
    globalThis.__piSessionStorageOperationWaiters.add(resolveWait);
  });
}

export function listSessionFilesInRoot(root: string): string[] {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  const entries = readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(join(root, entry.name));
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    const directory = join(root, entry.name);
    for (const child of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (child.isFile() && child.name.endsWith(".jsonl")) files.push(join(directory, child.name));
    }
  }
  return files;
}
function assertRecognizedRoot(root: string): void {
  if (!existsSync(root)) return;
  if (!lstatSync(root).isDirectory()) throw new SessionStorageError("Target session root must be a directory", "INVALID_TARGET");
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".jsonl")) continue;
    if (!entry.isDirectory() || entry.isSymbolicLink()) {
      throw new SessionStorageError("Target must be empty or contain only session files/directories", "UNRECOGNIZED_TARGET");
    }
    for (const child of readdirSync(join(root, entry.name), { withFileTypes: true })) {
      if (!child.isFile() || !child.name.endsWith(".jsonl")) {
        throw new SessionStorageError("Target contains files not recognized as session storage", "UNRECOGNIZED_TARGET");
      }
    }
  }
}
function readSessionRecord(root: SessionStorageRoot, filePath: string): PhysicalSessionRecord {
  const contents = readFileSync(filePath, "utf8");
  let header: Record<string, unknown>;
  try { header = JSON.parse(contents.split(/\r?\n/, 1)[0]) as Record<string, unknown>; }
  catch { throw new SessionStorageError(`Malformed session header: ${filePath}`, "CORRUPT_SESSION", 409); }
  if (header.type !== "session" || typeof header.id !== "string" || !header.id) {
    throw new SessionStorageError(`Invalid session header: ${filePath}`, "CORRUPT_SESSION", 409);
  }
  return {
    id: header.id,
    cwd: typeof header.cwd === "string" ? header.cwd : "",
    path: filePath,
    root: root.path,
    rootKind: root.kind,
    relativePath: relative(root.path, filePath),
    contents,
    ...(typeof header.parentSession === "string" ? { parentSession: header.parentSession } : {}),
  };
}
export function collectPhysicalSessionRecords(): PhysicalSessionRecord[] {
  const result: PhysicalSessionRecord[] = [];
  for (const root of getSessionStorageRoots()) {
    const seen = new Set<string>();
    for (const filePath of listSessionFilesInRoot(root.path)) {
      const record = readSessionRecord(root, filePath);
      if (seen.has(record.id)) {
        throw new SessionStorageError(
          `Session id ${record.id} appears more than once in physical root ${root.path}`,
          "DUPLICATE_SESSION_IN_ROOT",
          409,
        );
      }
      seen.add(record.id);
      result.push(record);
    }
  }
  return result;
}
function splitSession(contents: string): { header: Record<string, unknown>; body: string[] } {
  const lines = contents.replace(/\r\n/g, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  return { header: JSON.parse(lines.shift() ?? "{}") as Record<string, unknown>, body: lines };
}
function normalizedHeader(record: PhysicalSessionRecord, pathToId: Map<string, string>): string {
  const { header } = splitSession(record.contents);
  if (typeof header.parentSession === "string") {
    header.parentSession = pathToId.get(canonicalPathKey(header.parentSession)) ?? canonicalPathKey(header.parentSession);
  }
  return JSON.stringify(header);
}
function validateReplicaLineage(records: PhysicalSessionRecord[], allRecords: PhysicalSessionRecord[]): PhysicalSessionRecord {
  const pathToId = new Map(allRecords.map((record) => [canonicalPathKey(record.path), record.id]));
  const headers = new Set(records.map((record) => normalizedHeader(record, pathToId)));
  const cwds = new Set(records.map((record) => canonicalPathKey(record.cwd || ".")));
  if (headers.size !== 1 || cwds.size !== 1) {
    throw new SessionStorageError(`Divergent replicas for session id ${records[0].id}`, "DIVERGENT_SESSION", 409);
  }
  const ordered = [...records].sort((a, b) => splitSession(a.contents).body.length - splitSession(b.contents).body.length);
  const active = records.find((record) => record.rootKind === "active");
  for (let index = 1; index < ordered.length; index += 1) {
    const prefix = splitSession(ordered[index - 1].contents).body;
    const body = splitSession(ordered[index].contents).body;
    if (prefix.some((line, lineIndex) => body[lineIndex] !== line)) {
      throw new SessionStorageError(`Divergent replicas for session id ${records[0].id}`, "DIVERGENT_SESSION", 409);
    }
  }
  return active ?? ordered.at(-1)!;
}
export function getAuthoritativePhysicalSessions(): PhysicalSessionRecord[] {
  const all = collectPhysicalSessionRecords();
  const byId = new Map<string, PhysicalSessionRecord[]>();
  for (const record of all) {
    const records = byId.get(record.id) ?? [];
    records.push(record);
    byId.set(record.id, records);
  }
  return [...byId.values()].map((records) => validateReplicaLineage(records, all));
}
export function findSessionReplicas(sessionId: string): PhysicalSessionRecord[] {
  const all = collectPhysicalSessionRecords();
  const records = all.filter((record) => record.id === sessionId);
  if (records.length > 1) validateReplicaLineage(records, all);
  return records;
}
function rewriteParent(contents: string, parentSession: string | undefined): string {
  const newline = contents.indexOf("\n");
  const firstLine = newline === -1 ? contents : contents.slice(0, newline).replace(/\r$/, "");
  const rest = newline === -1 ? "" : contents.slice(newline + 1);
  const header = JSON.parse(firstLine) as Record<string, unknown>;
  if (parentSession) header.parentSession = parentSession;
  else delete header.parentSession;
  return `${JSON.stringify(header)}\n${rest}${rest && !rest.endsWith("\n") ? "\n" : ""}`;
}
function activeDestination(record: PhysicalSessionRecord): string {
  const directory = getSessionDirForCwd(record.cwd || process.cwd());
  let destination = join(directory, basename(record.path));
  if (existsSync(destination)) destination = join(directory, `${randomUUID()}.jsonl`);
  return destination;
}
function materializeSessionInActiveRootInternal(sessionId: string, visiting: Set<string>): string | null {
  if (visiting.has(sessionId)) {
    throw new SessionStorageError(`Parent session cycle includes ${sessionId}`, "CORRUPT_SESSION", 409);
  }
  visiting.add(sessionId);
  const all = collectPhysicalSessionRecords();
  const records = all.filter((record) => record.id === sessionId);
  try {
    if (records.length === 0) return null;
    const authoritative = validateReplicaLineage(records, all);
    const active = records.find((record) => record.rootKind === "active");
    if (active) return active.path;
    const pathToId = new Map(all.map((record) => [canonicalPathKey(record.path), record.id]));
    const parentId = authoritative.parentSession
      ? pathToId.get(canonicalPathKey(authoritative.parentSession))
      : undefined;
    const activeParent = parentId
      ? materializeSessionInActiveRootInternal(parentId, visiting) ?? undefined
      : undefined;
    const destination = activeDestination(authoritative);
    const contents = authoritative.parentSession
      ? rewriteParent(authoritative.contents, activeParent ?? authoritative.parentSession)
      : authoritative.contents;
    mkdirSync(dirname(destination), { recursive: true });
    const tempPath = join(dirname(destination), `.${basename(destination)}-${randomUUID()}.tmp`);
    try {
      writeFileSync(tempPath, contents, { encoding: "utf8", flag: "wx", flush: true });
      renameSync(tempPath, destination);
    } finally { rmSync(tempPath, { force: true }); }
    invalidateSessionStorageCaches();
    return destination;
  } finally {
    visiting.delete(sessionId);
  }
}
/** Caller must hold a storage operation lease. */
export function materializeSessionInActiveRoot(sessionId: string): string | null {
  return materializeSessionInActiveRootInternal(sessionId, new Set());
}
/** Delete every validated physical replica so a retained backup cannot resurrect the session. */
export function deleteSessionReplicas(sessionId: string): string[] {
  const records = findSessionReplicas(sessionId);
  for (const record of records) unlinkSync(record.path);
  invalidateSessionStorageCaches();
  return records.map((record) => record.path);
}

function manifest(root: string): string {
  const hash = createHash("sha256");
  for (const filePath of listSessionFilesInRoot(root).sort((a, b) => a.localeCompare(b))) {
    hash.update(relative(root, filePath).replace(/\\/g, "/"));
    hash.update("\0");
    hash.update(readFileSync(filePath));
    hash.update("\0");
  }
  return hash.digest("hex");
}
function indexOneRoot(records: PhysicalSessionRecord[], label: string): Map<string, PhysicalSessionRecord> {
  const byId = new Map<string, PhysicalSessionRecord>();
  for (const record of records) {
    if (byId.has(record.id)) {
      throw new SessionStorageError(`${label} contains duplicate session id ${record.id}`, "DUPLICATE_SESSION_IN_ROOT", 409);
    }
    byId.set(record.id, record);
  }
  return byId;
}
function recordsForRoot(rootPath: string, kind: SessionStorageRootKind): PhysicalSessionRecord[] {
  const root = { path: rootPath, kind, writable: kind === "active" };
  return listSessionFilesInRoot(rootPath).map((filePath) => readSessionRecord(root, filePath));
}
function serializeMigrated(record: PhysicalSessionRecord, sourceToTarget: Map<string, string>): string {
  const parent = record.parentSession ? sourceToTarget.get(canonicalPathKey(record.parentSession)) : undefined;
  return record.parentSession && parent ? rewriteParent(record.contents, parent) : record.contents;
}
function semanticKey(contents: string, pathToId: Map<string, string>): string {
  const { header, body } = splitSession(contents);
  if (typeof header.parentSession === "string") {
    header.parentSession = pathToId.get(canonicalPathKey(header.parentSession)) ?? canonicalPathKey(header.parentSession);
  }
  return `${JSON.stringify(header)}\n${body.join("\n")}`;
}
function verifyStage(expected: Map<string, string>, stageRoot: string): void {
  const records = recordsForRoot(stageRoot, "active");
  const byId = indexOneRoot(records, "Staged target");
  for (const [id, contents] of expected) {
    if (byId.get(id)?.contents !== contents) {
      throw new SessionStorageError(`Verification failed for migrated session ${id}`, "VERIFY_FAILED", 500);
    }
  }
}

export async function migrateSessionStorage(
  targetRootInput: string,
  drainAndShutdown?: () => Promise<void>,
): Promise<SessionMigrationResult> {
  if (typeof targetRootInput !== "string" || !targetRootInput.trim()) {
    throw new SessionStorageError("targetRoot is required", "INVALID_TARGET");
  }
  if (globalThis.__piSessionStorageMigration) {
    throw new SessionStorageError("A session storage migration is already running", "MIGRATION_IN_PROGRESS", 409);
  }
  let settleGate!: (result: SessionMigrationResult) => void;
  let rejectGate!: (error: unknown) => void;
  const gate = new Promise<SessionMigrationResult>((resolveGate, reject) => {
    settleGate = resolveGate;
    rejectGate = reject;
  });
  void gate.catch(() => {});
  globalThis.__piSessionStorageMigration = gate;

  try {
    const releaseLock = await acquireMigrationLock();
    try {
      recoverTransactionUnlocked();
      const state = getSessionStorageState();
      if (state.readOnly) {
        throw new SessionStorageError(`${ENV_SESSION_DIR} controls session storage and cannot be changed through the API`, "ENVIRONMENT_CONTROLLED", 403);
      }
      mkdirSync(state.activeRoot, { recursive: true });
      const sourceRoot = canonicalizeExistingOrFuture(state.activeRoot);
      const targetRoot = canonicalizeExistingOrFuture(targetRootInput);
      if (isNestedOrSame(sourceRoot, targetRoot) || isNestedOrSame(targetRoot, sourceRoot)) {
        throw new SessionStorageError("Source and target roots must be distinct and not nested", "OVERLAPPING_ROOTS");
      }
      assertRecognizedRoot(targetRoot);

      await drainAndShutdown?.();
      await waitForStorageOperations();

      const sourceManifest = manifest(sourceRoot);
      const targetManifest = manifest(targetRoot);
      const sourceRecords = recordsForRoot(sourceRoot, "active");
      const targetRecords = recordsForRoot(targetRoot, "active");
      const sourceById = indexOneRoot(sourceRecords, "Source");
      const targetById = indexOneRoot(targetRecords, "Target");
      const sourceToTarget = new Map<string, string>();
      for (const record of sourceRecords) {
        sourceToTarget.set(canonicalPathKey(record.path), targetById.get(record.id)?.path ?? join(targetRoot, record.relativePath));
      }
      const allPaths = new Map<string, string>();
      for (const record of [...sourceRecords, ...targetRecords]) allPaths.set(canonicalPathKey(record.path), record.id);
      const expected = new Map<string, string>();
      let copiedSessions = 0;
      let reusedSessions = 0;
      for (const record of sourceById.values()) {
        const migrated = serializeMigrated(record, sourceToTarget);
        const existing = targetById.get(record.id);
        if (existing) {
          if (semanticKey(existing.contents, allPaths) !== semanticKey(migrated, allPaths)) {
            throw new SessionStorageError(`Session id ${record.id} differs between source and target`, "DIVERGENT_SESSION", 409);
          }
          reusedSessions++;
        } else copiedSessions++;
        expected.set(record.id, migrated);
      }

      const targetParent = dirname(targetRoot);
      mkdirSync(targetParent, { recursive: true });
      const stageRoot = join(targetParent, `.${basename(targetRoot)}.pi-stage-${randomUUID()}`);
      const displacedTarget = join(targetParent, `.${basename(targetRoot)}.pi-previous-${randomUUID()}`);
      const journal: MigrationJournal = {
        version: 1,
        phase: "staged",
        sourceRoot,
        targetRoot,
        stageRoot,
        displacedTarget,
        targetExisted: existsSync(targetRoot),
      };
      mkdirSync(stageRoot, { recursive: false });
      for (const existing of targetRecords) {
        const destination = join(stageRoot, existing.relativePath);
        mkdirSync(dirname(destination), { recursive: true });
        copyFileSync(existing.path, destination);
      }
      for (const record of sourceById.values()) {
        const existing = targetById.get(record.id);
        const destination = join(stageRoot, existing?.relativePath ?? record.relativePath);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, expected.get(record.id)!, { encoding: "utf8", flag: "w", flush: true });
      }
      verifyStage(expected, stageRoot);
      writeJournal(journal);

      if (manifest(sourceRoot) !== sourceManifest || manifest(targetRoot) !== targetManifest) {
        throw new SessionStorageError("Session storage changed while migration was staged", "SOURCE_CHANGED", 409);
      }
      try {
        if (journal.targetExisted) {
          renameSync(targetRoot, displacedTarget);
          journal.phase = "target_displaced";
          writeJournal(journal);
        }
        renameSync(stageRoot, targetRoot);
        journal.phase = "stage_published";
        writeJournal(journal);
        const stored = parseStoredConfig();
        writeStoredConfig(makeStoredConfig(targetRoot, stored?.historicalRoots ?? [], [...(stored?.backupRoots ?? []), sourceRoot]));
        journal.phase = "config_switched";
        writeJournal(journal);
        recoverTransactionUnlocked();
      } catch (error) {
        let recoveryError: unknown;
        try { recoverTransactionUnlocked(); } catch (rollbackError) { recoveryError = rollbackError; }
        if (recoveryError) throw new AggregateError([error, recoveryError], "Migration failed and rollback was incomplete");
        throw error;
      }
      invalidateSessionStorageCaches();
      const result = { sourceRoot, targetRoot, backupRoot: sourceRoot, copiedSessions, reusedSessions };
      settleGate(result);
      return result;
    } finally { await releaseLock(); }
  } catch (error) {
    rejectGate(error);
    throw error;
  } finally {
    if (globalThis.__piSessionStorageMigration === gate) globalThis.__piSessionStorageMigration = undefined;
  }
}
