export function isRemoteWorkspaceRpcTarget(target) {
    return Boolean(target.workspaceIdentity?.trim() ||
        target.remoteSessionId?.trim() ||
        target.remoteTarget);
}
export function shouldEnableWorkspaceRpc(target) {
    return (!isRemoteWorkspaceRpcTarget(target) ||
        Boolean(target.remoteSessionId?.trim()));
}
//# sourceMappingURL=workspaceRpcAvailability.js.map