import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const roots = process.argv.slice(2);
const searchRoots = roots.length > 0 ? roots : ["app", "lib", "scripts", "components", "hooks"];

async function findTests(directory) {
  const entries = await readdir(resolve(repositoryRoot, directory), {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.mjs"))
    .map((entry) => resolve(entry.parentPath, entry.name));
}

const tests = (await Promise.all(searchRoots.map(findTests))).flat().sort();
if (tests.length === 0) throw new Error("No test files found");

// node --test treats file arguments as globs, so Next.js folders like [id]
// would otherwise match a single character and silently drop the test file.
const testArgs = tests.map((file) => file.replaceAll("\\", "/").replaceAll("[", "[[]"));
const child = spawn(process.execPath, ["--test", ...testArgs], { stdio: "inherit" });
child.once("error", (error) => {
  throw error;
});
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
