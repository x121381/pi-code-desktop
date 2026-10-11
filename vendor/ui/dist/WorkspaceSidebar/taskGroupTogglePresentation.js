export function resolveSidebarTaskGroupToggleMessageId(areAllExpanded) {
    return areAllExpanded
        ? "workspaceSidebar.collapseAllGroups"
        : "workspaceSidebar.expandAllGroups";
}
export function resolveSidebarTaskGroupTogglePresentation(params) {
    if (!params.current.visible) {
        return null;
    }
    if (params.current.transitionPending && params.previous) {
        return params.previous;
    }
    return {
        canToggle: params.current.canToggle,
        areAllExpanded: params.current.areAllExpanded,
        messageId: resolveSidebarTaskGroupToggleMessageId(params.current.areAllExpanded),
    };
}
//# sourceMappingURL=taskGroupTogglePresentation.js.map