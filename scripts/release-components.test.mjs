import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  compareVersions,
  createComponentManifest,
  isReleasePinValid,
  nextPatchVersion,
  normalizeVersion,
} from "./release-components.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("normalizes GitHub release tags", () => {
  assert.equal(normalizeVersion("v0.81.1"), "0.81.1");
  assert.equal(normalizeVersion("0.7.17"), "0.7.17");
  assert.throws(() => normalizeVersion("latest"), /Invalid release version/);
});

test("compares stable and prerelease versions", () => {
  assert.equal(compareVersions("0.81.1", "0.81.0"), 1);
  assert.equal(compareVersions("0.81", "0.81.0"), 0);
  assert.equal(compareVersions("1.0.0-rc.2", "1.0.0-rc.10"), -1);
  assert.equal(compareVersions("1.0.0", "1.0.0-rc.10"), 1);
});

test("bumps the patch version", () => {
  assert.equal(nextPatchVersion("v0.1.0"), "0.1.1");
  assert.equal(nextPatchVersion("1.2"), "1.2.1");
});

test("only accepts explicit pins for the exact bundled component version", () => {
  assert.equal(isReleasePinValid({ version: "0.8.7", reason: "Fork compatibility review" }, "0.8.7"), true);
  assert.equal(isReleasePinValid({ version: "0.8.8", reason: "Wrong version" }, "0.8.7"), false);
  assert.equal(isReleasePinValid({ version: "0.8.7", reason: "" }, "0.8.7"), false);
});

test("writes an auditable three-component manifest", () => {
  assert.deepEqual(
    createComponentManifest({ "pi-code-desktop": "0.1.0", pi: "0.81.1", "pi-web": "0.7.17" }),
    {
      schemaVersion: 1,
      appVersion: "0.1.0",
      components: [
        { id: "pi-code-desktop", repository: "x121381/pi-code-desktop", version: "0.1.0" },
        { id: "pi", repository: "earendil-works/pi", version: "0.81.1" },
        { id: "pi-web", repository: "agegr/pi-web", version: "0.7.17" },
      ],
    },
  );
});

test("Tauri JavaScript and Rust plugins share major and minor versions", async () => {
  const packageLock = JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));
  const cargoLock = await readFile(join(root, "src-tauri", "Cargo.lock"), "utf8");
  const rustVersions = new Map();
  let name = "";
  let version = "";
  const recordPackage = () => {
    if (name && version) rustVersions.set(name, version);
    name = "";
    version = "";
  };

  for (const line of cargoLock.split(/\r?\n/)) {
    if (line === "[[package]]") {
      recordPackage();
    } else if (!name && line.startsWith("name = ")) {
      name = line.slice(8, -1);
    } else if (name && !version && line.startsWith("version = ")) {
      version = line.slice(11, -1);
    }
  }
  recordPackage();

  const prefix = "node_modules/@tauri-apps/plugin-";
  const pluginEntries = Object.entries(packageLock.packages)
    .filter(([path]) => path.startsWith(prefix));
  assert.ok(pluginEntries.length > 0, "expected Tauri plugins in package-lock.json");

  for (const [path, metadata] of pluginEntries) {
    const rustName = `tauri-plugin-${path.slice(prefix.length)}`;
    const rustVersion = rustVersions.get(rustName);
    assert.ok(rustVersion, `${rustName} is missing from Cargo.lock`);
    assert.deepEqual(
      metadata.version.split(".").slice(0, 2),
      rustVersion.split(".").slice(0, 2),
      `${rustName} must use the same major/minor version in JavaScript and Rust`,
    );
  }
});
