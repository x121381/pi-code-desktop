function normalizeCommitScopePath(path) {
    return path
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\.?\//, "")
        .replace(/\/+$/, "");
}
function normalizeBasePath(path) {
    return path.trim().replace(/\\/g, "/").replace(/\/+$/, "");
}
function normalizeWorkspaceInRepoPath(path) {
    const normalized = normalizeCommitScopePath(path);
    return normalized.length > 0 ? normalized : ".";
}
function stripBasePath(path, basePath) {
    const normalizedPath = normalizeBasePath(path);
    const normalizedBasePath = normalizeBasePath(basePath);
    if (!normalizedPath || !normalizedBasePath) {
        return null;
    }
    if (normalizedPath === normalizedBasePath) {
        return "";
    }
    const prefix = `${normalizedBasePath}/`;
    if (normalizedPath.startsWith(prefix)) {
        return normalizedPath.slice(prefix.length);
    }
    const lowerPath = normalizedPath.toLowerCase();
    const lowerPrefix = prefix.toLowerCase();
    if (lowerPath.startsWith(lowerPrefix)) {
        return normalizedPath.slice(prefix.length);
    }
    return null;
}
function addScopePath(scope, path) {
    if (path === null) {
        return;
    }
    const normalizedPath = normalizeCommitScopePath(path);
    if (normalizedPath) {
        scope.add(normalizedPath);
    }
}
function buildCurrentSessionFileScope(options) {
    const filePaths = getCurrentSessionFilePaths(options.summary);
    if (!filePaths) {
        return null;
    }
    const scope = new Set();
    const workspaceInRepoPath = normalizeWorkspaceInRepoPath(options.gitSummary.workspaceInRepoPath);
    for (const filePath of filePaths) {
        addScopePath(scope, filePath);
        addScopePath(scope, stripBasePath(filePath, options.gitSummary.repoRoot));
        addScopePath(scope, stripBasePath(filePath, options.workspacePath));
        const normalizedPath = normalizeCommitScopePath(filePath);
        if (workspaceInRepoPath !== "." && !normalizedPath.startsWith(`${workspaceInRepoPath}/`)) {
            addScopePath(scope, `${workspaceInRepoPath}/${normalizedPath}`);
        }
    }
    return scope.size > 0 ? scope : null;
}
function isPreviewFileInScope(file, scope) {
    if (!scope) {
        return true;
    }
    return [file.stagePath, file.repoRelativePath, file.workspaceRelativePath].some((path) => scope.has(normalizeCommitScopePath(path)));
}
export function getCurrentSessionFilePaths(summary) {
    const paths = Array.from(new Set((summary?.files ?? []).map((file) => file.path.trim()).filter((path) => path.length > 0)));
    return paths.length > 0 ? paths : undefined;
}
export function filterCommitPreviewFilesByCurrentSession(options) {
    const scope = buildCurrentSessionFileScope({
        summary: options.summary,
        gitSummary: options.gitSummary,
        workspacePath: options.workspacePath,
    });
    return options.files.filter((file) => isPreviewFileInScope(file, scope));
}
//# sourceMappingURL=currentSessionFileScope.js.map