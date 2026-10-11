export declare const WORKSPACE_SIDEBAR_RESIZING_ATTR = "data-workspace-sidebar-resizing";
export declare const WORKSPACE_SIDEBAR_RESIZE_END_EVENT = "zcode:workspace-sidebar-resize-end";
type WorkspaceResizeStateElement = (Pick<HTMLElement, "removeAttribute" | "setAttribute"> & Partial<Pick<HTMLElement, "dispatchEvent">>) | null;
type WorkspaceResizeMeasuredElement = Pick<HTMLElement, "closest"> | null;
export declare function setWorkspaceSidebarResizeActive({ active, panelElement, shellElement, }: {
    active: boolean;
    panelElement?: WorkspaceResizeStateElement;
    shellElement: WorkspaceResizeStateElement;
}): void;
export declare function getWorkspaceSidebarResizeRootForElement(element: WorkspaceResizeMeasuredElement): HTMLElement | null;
export declare function isWorkspaceSidebarResizeActiveForElement(element: WorkspaceResizeMeasuredElement): boolean;
export {};
//# sourceMappingURL=workspaceSidebarResizeState.d.ts.map