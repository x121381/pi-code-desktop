export function resolvePendingCommandWorkspaceKey(entry) {
    const workspace = entry.clientContext?.workspace;
    if (workspace) {
        return workspace.workspaceIdentity?.trim() || workspace.workspacePath;
    }
    if (entry.replay.kind !== "input" || entry.replay.type !== "createSession") {
        return null;
    }
    // 兼容升级前已落盘的 createSession 恢复线索：协议 payload 的 workspaceId
    // 本身就是发起端 workspaceKey，不能因缺少新 clientContext 而跨 workspace 展示。
    const workspaceId = entry.replay.payload?.workspaceId;
    return typeof workspaceId === "string" && workspaceId.trim() ? workspaceId.trim() : null;
}
export function isPendingCommandForWorkspace(entry, workspacePath, workspaceIdentity) {
    return resolvePendingCommandWorkspaceKey(entry) === (workspaceIdentity?.trim() || workspacePath);
}
//# sourceMappingURL=pendingCommandWorkspace.js.map