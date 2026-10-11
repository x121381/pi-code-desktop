import { buildTaskWorkspaceKey } from "../lib/taskQueryCache.js";
export const WORKSPACE_TASK_PAGE_SIZE = 5;
export function resolveVisibleWorkspaceTaskKeys(params) {
    if (!params.enabled) {
        return new Set();
    }
    return new Set(params.workspaces
        .filter((workspace) => params.expandedWorkspacePaths.has(workspace.workspacePath))
        .map((workspace) => buildTaskWorkspaceKey(workspace.workspacePath, workspace.workspaceIdentity)));
}
export function resolveWorkspaceTaskVisibleLimit(limits, workspaceKey, pageSize = WORKSPACE_TASK_PAGE_SIZE) {
    const storedLimit = limits[workspaceKey];
    return typeof storedLimit === "number" && Number.isFinite(storedLimit)
        ? Math.max(pageSize, Math.floor(storedLimit))
        : pageSize;
}
export function increaseWorkspaceTaskVisibleLimit(limits, workspaceKey, pageSize = WORKSPACE_TASK_PAGE_SIZE) {
    return {
        ...limits,
        [workspaceKey]: resolveWorkspaceTaskVisibleLimit(limits, workspaceKey, pageSize) + pageSize,
    };
}
export function retainWorkspaceTaskVisibleLimits(limits, visibleWorkspaceKeys) {
    const entries = Object.entries(limits);
    const retainedEntries = entries.filter(([workspaceKey]) => visibleWorkspaceKeys.has(workspaceKey));
    if (retainedEntries.length === entries.length) {
        return limits;
    }
    return Object.fromEntries(retainedEntries);
}
//# sourceMappingURL=workspaceTaskPagination.js.map