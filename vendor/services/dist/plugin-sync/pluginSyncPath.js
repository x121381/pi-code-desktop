import { isAbsolute, posix, relative, resolve, sep } from "node:path";
export function normalizePluginSyncRelativePath(path, options = {}) {
    const normalized = path.replaceAll("\\", "/").replace(/^\/+/u, "").replace(/\/+$/u, "");
    if (!normalized ||
        isAbsolute(path) ||
        posix.isAbsolute(path) ||
        path.includes("\\") ||
        /^[a-zA-Z]:/u.test(path) ||
        normalized.split("/").some((part) => !part || part === "." || part === "..")) {
        throw new Error(`${options.unsafePathLabel ?? "unsafe plugin sync path"}: ${path}`);
    }
    return normalized;
}
export function resolvePluginSyncPathWithin(targetRoot, path, options = {}) {
    const normalizedRoot = resolve(targetRoot);
    const normalizedPath = normalizePluginSyncRelativePath(path, options);
    const targetPath = resolve(normalizedRoot, ...normalizedPath.split("/"));
    const relativePath = relative(normalizedRoot, targetPath);
    if (relativePath === "" ||
        relativePath.startsWith(`..${sep}`) ||
        relativePath === ".." ||
        isAbsolute(relativePath)) {
        throw new Error(`${options.unsafePathLabel ?? "unsafe plugin sync path"}: ${path}`);
    }
    return targetPath;
}
//# sourceMappingURL=pluginSyncPath.js.map