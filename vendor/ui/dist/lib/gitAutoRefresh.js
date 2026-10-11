export function shouldEnableGitAutoRefreshForWorkspace(params) {
    return params.enabled && params.currentWorkspaceKey === params.summaryWorkspaceKey;
}
function normalizeWatchPath(path) {
    const trimmed = path.trim();
    if (trimmed === "/" || /^[A-Za-z]:[\\/]?$/.test(trimmed)) {
        return trimmed;
    }
    return trimmed.replace(/[\\/]+$/, "");
}
export function buildGitAutoRefreshWatchPaths(summary, systemInfo) {
    if (!summary.isGitAvailable || !summary.isRepository) {
        return [];
    }
    const workspacePath = normalizeWatchPath(summary.workspacePath || summary.repoRoot);
    const platform = systemInfo?.platform?.trim();
    const canWatchWorkspaceRecursively = Boolean(platform && platform !== "linux");
    const watchPaths = [];
    if (workspacePath.length > 0 && canWatchWorkspaceRecursively) {
        watchPaths.push({
            path: workspacePath,
            recursive: true,
        });
    }
    for (const watchPath of summary.autoRefreshWatchPaths ?? []) {
        const path = normalizeWatchPath(watchPath.path);
        if (!path ||
            // 兼容旧 remote server：旧 summary 仍可能携带 workspacePath，Linux 下不能让
            // 这个历史字段重新绕过平台边界，触发慢速递归 watcher。
            (path === workspacePath && !canWatchWorkspaceRecursively) ||
            watchPaths.some((entry) => entry.path === path)) {
            continue;
        }
        watchPaths.push({
            path,
            recursive: watchPath.recursive,
        });
    }
    return watchPaths;
}
export function stringifyGitAutoRefreshWatchPaths(watchPaths) {
    return JSON.stringify(watchPaths);
}
export function parseGitAutoRefreshWatchPaths(signature) {
    const parsed = JSON.parse(signature);
    return parsed.map((watchPath) => ({
        path: watchPath.path,
        recursive: Boolean(watchPath.recursive),
    }));
}
//# sourceMappingURL=gitAutoRefresh.js.map