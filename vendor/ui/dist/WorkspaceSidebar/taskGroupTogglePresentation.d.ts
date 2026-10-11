export type SidebarTaskGroupToggleMessageId = "workspaceSidebar.collapseAllGroups" | "workspaceSidebar.expandAllGroups";
export interface SidebarTaskGroupTogglePresentation {
    canToggle: boolean;
    areAllExpanded: boolean;
    messageId: SidebarTaskGroupToggleMessageId;
}
export interface SidebarTaskGroupToggleRawState {
    visible: boolean;
    canToggle: boolean;
    areAllExpanded: boolean;
    transitionPending: boolean;
}
export declare function resolveSidebarTaskGroupToggleMessageId(areAllExpanded: boolean): SidebarTaskGroupToggleMessageId;
export declare function resolveSidebarTaskGroupTogglePresentation(params: {
    current: SidebarTaskGroupToggleRawState;
    previous: SidebarTaskGroupTogglePresentation | null;
}): SidebarTaskGroupTogglePresentation | null;
//# sourceMappingURL=taskGroupTogglePresentation.d.ts.map