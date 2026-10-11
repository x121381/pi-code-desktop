function hasRemoteTabIdentity(tab) {
    return Boolean(tab.workspaceIdentity || tab.remoteSessionId);
}
function isLocalWorkspaceTab(tab) {
    return !hasRemoteTabIdentity(tab);
}
export function isSameWorkspaceTab(tab, workspacePath, options) {
    if (tab.workspacePath !== workspacePath) {
        return false;
    }
    if (options?.workspaceIdentity) {
        return tab.workspaceIdentity === options.workspaceIdentity;
    }
    if (options?.remoteSessionId) {
        return tab.remoteSessionId === options.remoteSessionId;
    }
    return isLocalWorkspaceTab(tab);
}
//# sourceMappingURL=tabWorkspaceIdentity.js.map