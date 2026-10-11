import { isWorkspaceTab } from "@/store/tabStore.js";
export function buildWebRemoteControlWorkspaceTargets({ tabs, reconnectingRemoteWorkspaceKeys = [], remoteWorkspaceErrorByWorkspaceKey = {}, }) {
    const reconnectingWorkspaceKeySet = new Set(reconnectingRemoteWorkspaceKeys);
    return tabs.filter(isWorkspaceTab).map((tab) => {
        const isRemote = Boolean(tab.workspaceIdentity || tab.remoteTarget || tab.remoteSessionId);
        const workspaceKey = tab.workspaceIdentity?.trim() || tab.workspacePath;
        const lastConnectionError = remoteWorkspaceErrorByWorkspaceKey[workspaceKey]?.trim();
        return {
            workspacePath: tab.workspacePath,
            label: tab.label,
            kind: isRemote ? "remote" : "local",
            ...(isRemote
                ? {
                    connectionState: reconnectingWorkspaceKeySet.has(workspaceKey)
                        ? "reconnecting"
                        : tab.remoteSessionId
                            ? "connected"
                            : "disconnected",
                }
                : {}),
            ...(tab.workspaceIdentity ? { workspaceIdentity: tab.workspaceIdentity } : {}),
            ...(tab.workspacePurpose ? { workspacePurpose: tab.workspacePurpose } : {}),
            ...(tab.remoteSessionId ? { remoteSessionId: tab.remoteSessionId } : {}),
            ...(isRemote && lastConnectionError ? { lastConnectionError } : {}),
        };
    });
}
export function buildConnectedRemoteWorkspaceSessionTargets({ tabs, }) {
    return tabs
        .filter(isWorkspaceTab)
        .filter((tab) => tab.remoteSessionId && tab.workspaceIdentity)
        .map((tab) => ({
        workspacePath: tab.workspacePath,
        label: tab.label,
        kind: "remote",
        connectionState: "connected",
        workspaceIdentity: tab.workspaceIdentity,
        remoteSessionId: tab.remoteSessionId,
    }));
}
export function shouldPublishCompleteWorkspaceSnapshot(hasCompletedFullTabRestore) {
    return hasCompletedFullTabRestore;
}
//# sourceMappingURL=rootPlatformWorkspaceSync.js.map