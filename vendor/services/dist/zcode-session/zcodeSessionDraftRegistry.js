function getWorkspaceKey(target) {
    return target.workspaceIdentity?.trim() || target.workspacePath;
}
function getSessionScopedKey(target) {
    return `${getWorkspaceKey(target)}\0${target.sessionId}`;
}
export function createZCodeDeferredDraftRegistry() {
    const sessionKeys = new Set();
    return {
        remember(params, snapshot) {
            sessionKeys.add(getSessionScopedKey({
                workspacePath: snapshot.session.workspace.workspacePath,
                workspaceIdentity: snapshot.session.workspace.workspaceIdentity ?? params.workspaceIdentity,
                sessionId: snapshot.session.sessionId,
            }));
        },
        has(target) {
            return sessionKeys.has(getSessionScopedKey(target));
        },
        forget(target) {
            sessionKeys.delete(getSessionScopedKey(target));
        },
    };
}
//# sourceMappingURL=zcodeSessionDraftRegistry.js.map