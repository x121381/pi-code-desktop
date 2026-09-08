import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  compareVersions,
  fetchLatestRelease,
  nextPatchVersion,
  normalizeVersion,
  rootDir,
} from "./release-components.mjs";

const packagePath = join(rootDir, "src-tauri", "pi-code-desktop-package.json");
const cargoPath = join(rootDir, "src-tauri", "Cargo.toml");
const lockPath = join(rootDir, "src-tauri", "Cargo.lock");
const desktopPackage = JSON.parse(await readFile(packagePath, "utf8"));
const current = normalizeVersion(desktopPackage.version);
const latest = await fetchLatestRelease("x121381/pi-code-desktop", { allowMissing: true });
const next = latest && compareVersions(latest.version, current) >= 0
  ? nextPatchVersion(latest.version)
  : current;

desktopPackage.version = next;
await writeFile(packagePath, `${JSON.stringify(desktopPackage, null, 2)}\n`);

const cargo = await readFile(cargoPath, "utf8");
await writeFile(cargoPath, cargo.replace(/^(version\s*=\s*")[^"]+("\s*)$/m, `$1${next}$2`));

const lock = await readFile(lockPath, "utf8");
await writeFile(
  lockPath,
  lock.replace(/(name = "pi-code-desktop"\nversion = ")[^"]+("\n)/, `$1${next}$2`),
);
console.log(`pi-code-desktop ${current} -> ${next}`);
