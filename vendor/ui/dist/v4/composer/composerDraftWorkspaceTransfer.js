let pendingRequest = null;
function getWorkspaceKey(path, identity) {
    return identity?.trim() || path;
}
export function requestV4ComposerDraftWorkspaceTransfer(request) {
    pendingRequest = request;
}
export function consumeV4ComposerDraftWorkspaceTransferRequest(transition) {
    if (!pendingRequest) {
        return false;
    }
    const matches = getWorkspaceKey(pendingRequest.sourceWorkspacePath, pendingRequest.sourceWorkspaceIdentity) ===
        getWorkspaceKey(transition.sourceWorkspacePath, transition.sourceWorkspaceIdentity) &&
        getWorkspaceKey(pendingRequest.targetWorkspacePath, pendingRequest.targetWorkspaceIdentity) ===
            getWorkspaceKey(transition.targetWorkspacePath, transition.targetWorkspaceIdentity);
    if (matches) {
        pendingRequest = null;
    }
    return matches;
}
export function clearV4ComposerDraftWorkspaceTransferRequest() {
    pendingRequest = null;
}
//# sourceMappingURL=composerDraftWorkspaceTransfer.js.map