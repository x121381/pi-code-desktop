import { accessSync, constants, existsSync } from "node:fs";
import { delimiter, dirname, join, resolve as resolvePath } from "node:path";
import { getRuntimeToolRuntime } from "@zcode/shared";
function isExecutableFile(path) {
    try {
        accessSync(path, constants.X_OK);
        return true;
    }
    catch {
        return false;
    }
}
function resolveExistingPath(candidates) {
    for (const candidate of candidates) {
        if (!candidate) {
            continue;
        }
        if (existsSync(candidate) && isExecutableFile(candidate)) {
            return candidate;
        }
    }
    return null;
}
function resolveCommandOnPath(command, env = process.env) {
    const pathEnv = env.PATH;
    if (!pathEnv) {
        return null;
    }
    const windowsPathExt = process.platform === "win32"
        ? (env.PATHEXT?.split(";").filter(Boolean) ?? [".EXE", ".CMD", ".BAT", ".COM"])
        : [""];
    const extensions = process.platform === "win32" && !command.includes(".")
        ? windowsPathExt
        : [""];
    for (const pathEntry of pathEnv.split(delimiter)) {
        if (!pathEntry) {
            continue;
        }
        for (const extension of extensions) {
            const candidate = join(pathEntry, `${command}${extension}`);
            if (isExecutableFile(candidate)) {
                return candidate;
            }
        }
    }
    return null;
}
function resolvePlatformScopedBundledToolRoots(moduleDir) {
    const platformKey = `${process.platform}-${process.arch}`;
    return [
        resolvePath(process.cwd(), "bundled-tools", platformKey),
        resolvePath(process.cwd(), "packages", "desktop", "bundled-tools", platformKey),
        resolvePath(process.cwd(), "..", "desktop", "bundled-tools", platformKey),
        moduleDir ? resolvePath(moduleDir, "..", "..", "..", "desktop", "bundled-tools", platformKey) : null,
        moduleDir ? resolvePath(moduleDir, "..", "..", "desktop", "bundled-tools", platformKey) : null,
    ];
}
export function prependPathEntries(currentPath, entries) {
    const normalizedCurrent = currentPath?.split(delimiter).filter(Boolean) ?? [];
    return joinUniquePathEntries([...entries, ...normalizedCurrent]);
}
export function appendPathEntries(currentPath, entries) {
    const normalizedCurrent = currentPath?.split(delimiter).filter(Boolean) ?? [];
    return joinUniquePathEntries([...normalizedCurrent, ...entries]);
}
function joinUniquePathEntries(entries) {
    const nextEntries = [];
    const seen = new Set();
    for (const entry of entries) {
        if (!entry || seen.has(entry)) {
            continue;
        }
        seen.add(entry);
        nextEntries.push(entry);
    }
    return nextEntries.join(delimiter);
}
export function findRuntimeToolBinary(toolId, env = process.env) {
    const runtime = getRuntimeToolRuntime(toolId);
    const entrySegments = runtime.resolveEntrySegments(process.platform);
    const envPath = env[runtime.binaryEnvVar]?.trim();
    if (envPath && existsSync(envPath) && isExecutableFile(envPath)) {
        return envPath;
    }
    const resourcesPath = typeof process.resourcesPath === "string"
        ? process.resourcesPath
        : null;
    const runtimeRoot = env.ZCODE_SERVER_RUNTIME_ROOT?.trim();
    const moduleDir = import.meta.dirname;
    const candidate = resolveExistingPath([
        runtimeRoot ? resolvePath(runtimeRoot, "tools", runtime.bundledResourceDir, ...entrySegments) : null,
        resourcesPath ? resolvePath(resourcesPath, "tools", runtime.bundledResourceDir, ...entrySegments) : null,
        ...resolvePlatformScopedBundledToolRoots(moduleDir).map((root) => root ? resolvePath(root, runtime.bundledResourceDir, ...entrySegments) : null),
    ]);
    if (candidate) {
        return candidate;
    }
    const binaryName = entrySegments[entrySegments.length - 1];
    if (!binaryName) {
        return null;
    }
    return resolveCommandOnPath(binaryName.replace(/\.exe$/i, ""), env);
}
export function buildRuntimeToolEnvPatch(toolIds, baseEnv = process.env) {
    const envPatch = {};
    const pathEntries = [];
    for (const toolId of toolIds) {
        const runtime = getRuntimeToolRuntime(toolId);
        const binaryPath = findRuntimeToolBinary(toolId, baseEnv);
        if (!binaryPath) {
            continue;
        }
        envPatch[runtime.binaryEnvVar] = binaryPath;
        pathEntries.push(dirname(binaryPath));
    }
    if (pathEntries.length > 0) {
        envPatch.PATH = appendPathEntries(baseEnv.PATH, pathEntries);
    }
    return envPatch;
}
//# sourceMappingURL=runtimeToolResolver.js.map