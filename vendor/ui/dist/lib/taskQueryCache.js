import { resolveWorkspaceStateKey } from "@/store/zcodeSessionStoreSelectors.js";
export function buildTaskWorkspaceKey(workspacePath, workspaceIdentity) {
    return resolveWorkspaceStateKey(workspacePath, workspaceIdentity);
}
export function buildTaskEntityKey(task) {
    return `${buildTaskWorkspaceKey(task.workspacePath, task.workspaceIdentity)}::${task.taskId}`;
}
export function normalizeTaskListWorkspaceScopes(scopes) {
    const uniqueScopes = new Map();
    for (const scope of scopes) {
        const workspaceKey = buildTaskWorkspaceKey(scope.workspacePath, scope.workspaceIdentity);
        if (!workspaceKey.trim()) {
            continue;
        }
        uniqueScopes.set(workspaceKey, scope);
    }
    return [...uniqueScopes.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, scope]) => scope);
}
function normalizeTaskListSearch(search) {
    return search?.trim().toLocaleLowerCase() ?? "";
}
export function buildTaskListCacheDescriptor(params) {
    const normalizedScopes = normalizeTaskListWorkspaceScopes(params.workspaceScopes);
    const workspaceKeys = normalizedScopes.map((scope) => buildTaskWorkspaceKey(scope.workspacePath, scope.workspaceIdentity));
    return {
        kind: params.kind,
        sortBy: params.sortBy,
        search: normalizeTaskListSearch(params.search),
        expanded: params.expanded,
        visibleLimit: params.expanded || params.visibleLimit === undefined ? null : params.visibleLimit,
        workspaceKeys,
    };
}
export function buildTaskListCacheKeyFromDescriptor(descriptor) {
    const workspaceSegment = descriptor.workspaceKeys.join("|");
    return [
        descriptor.kind,
        descriptor.sortBy,
        descriptor.expanded ? "expanded" : "collapsed",
        // timeline/show more 会通过 visibleLimit 从 20 提升到 40/60。
        // 如果缓存 key 不包含 limit，展开后的查询会命中旧首屏缓存并跳过刷新，导致“显示更多”不补数据。
        `limit=${descriptor.visibleLimit ?? "all"}`,
        `search=${descriptor.search}`,
        `workspaces=${workspaceSegment}`,
    ].join("::");
}
//# sourceMappingURL=taskQueryCache.js.map