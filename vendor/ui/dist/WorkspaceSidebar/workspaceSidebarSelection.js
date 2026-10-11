export function applyWorkspaceTriggerSelection({ tabId, workspacePath, isExpanded, activateTab, toggleWorkspaceExpanded, }) {
    activateTab(tabId);
    if (isExpanded) {
        toggleWorkspaceExpanded(workspacePath);
    }
}
//# sourceMappingURL=workspaceSidebarSelection.js.map