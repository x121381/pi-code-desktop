type WebRemoteNavigationPanelVisibilityOptions = {
    isCollapsed: boolean;
    isMobileViewport: boolean;
    isWebRemoteControlShell: boolean;
};
export type WebRemoteNavigationState = {
    heightPx: number;
    isCollapsed: boolean;
};
type WebRemoteNavigationDragStateOptions = {
    heightPx: number;
    viewportHeight: number;
};
type WebRemoteNavigationToggleStateOptions = {
    currentHeightPx: number;
    isCollapsed: boolean;
    viewportHeight: number;
};
export declare function shouldRenderWebRemoteNavigationPanel({ isCollapsed, isMobileViewport, isWebRemoteControlShell, }: WebRemoteNavigationPanelVisibilityOptions): boolean;
export declare function getActiveWorkspaceShellPanelIds(shellPanelIds: string[], _renderWebRemoteNavigationPanel: boolean): string[];
export declare function getDefaultWebRemoteNavigationHeightPx(viewportHeight: number): number;
export declare function resolveWebRemoteNavigationDragState({ heightPx, viewportHeight, }: WebRemoteNavigationDragStateOptions): WebRemoteNavigationState;
export declare function resolveWebRemoteNavigationToggleState({ currentHeightPx, isCollapsed, viewportHeight, }: WebRemoteNavigationToggleStateOptions): WebRemoteNavigationState;
export {};
//# sourceMappingURL=webRemoteNavigationLayout.d.ts.map