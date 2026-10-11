const WSL_UNC_PATH_PATTERN = /^[\\/]{2}(?:wsl\.localhost|wsl\$)[\\/]([^\\/]+)(?:[\\/](.*))?$/iu;
export function parseWslUncWorkspacePath(path) {
    const normalizedPath = path.trim();
    const match = normalizedPath.match(WSL_UNC_PATH_PATTERN);
    const distro = match?.[1]?.trim();
    if (!match || !distro) {
        return null;
    }
    const tail = (match[2] ?? "").replaceAll("\\", "/").replace(/^\/+/, "");
    return {
        distro,
        linuxPath: tail ? `/${tail}` : "/",
        originalPath: path,
    };
}
export function isWslUncWorkspacePath(path) {
    return parseWslUncWorkspacePath(path) !== null;
}
//# sourceMappingURL=wslUncWorkspace.js.map