function normalizeOptionalString(value) {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
}
export function resolveAppWorkspaceRpcTarget({ activeTarget, explicitWorkspaceIdentity, explicitRemoteSessionId, }) {
    return {
        workspaceIdentity: normalizeOptionalString(activeTarget.workspaceIdentity) ??
            normalizeOptionalString(explicitWorkspaceIdentity),
        remoteSessionId: normalizeOptionalString(activeTarget.remoteSessionId) ??
            normalizeOptionalString(explicitRemoteSessionId),
        remoteTarget: activeTarget.remoteTarget,
    };
}
//# sourceMappingURL=workspaceRpcTarget.js.map