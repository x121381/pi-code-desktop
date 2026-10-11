const WEB_REMOTE_CONTROL_DEFAULT_NAVIGATION_CENTER_RATIO = 0.5;
const WEB_REMOTE_CONTROL_DEFAULT_NAVIGATION_MAX_HEIGHT_PX = 352;
const WEB_REMOTE_CONTROL_NAVIGATION_COLLAPSE_THRESHOLD_PX = 24;
const WEB_REMOTE_CONTROL_WORKSPACE_HEADER_HEIGHT_PX = 48;
const WEB_REMOTE_CONTROL_MIN_BODY_HEIGHT_PX = 168;
export function shouldRenderWebRemoteNavigationPanel({ isCollapsed, isMobileViewport, isWebRemoteControlShell, }) {
    return !isWebRemoteControlShell || !isMobileViewport || !isCollapsed;
}
export function getActiveWorkspaceShellPanelIds(shellPanelIds, _renderWebRemoteNavigationPanel) {
    // Bugfix: 远控顶部区域折叠时如果把 sidebar panel 从布局树里移除，
    // React 会卸载整块导航组件，展开后触发任务索引重新加载。
    // 这里保持 panelIds 稳定，改为“保活 + 视觉折叠”，避免反复 mount/unmount。
    return shellPanelIds;
}
export function getDefaultWebRemoteNavigationHeightPx(viewportHeight) {
    return Math.round(Math.max(0, Math.min(viewportHeight * WEB_REMOTE_CONTROL_DEFAULT_NAVIGATION_CENTER_RATIO -
        WEB_REMOTE_CONTROL_WORKSPACE_HEADER_HEIGHT_PX, WEB_REMOTE_CONTROL_DEFAULT_NAVIGATION_MAX_HEIGHT_PX)));
}
function getMaxWebRemoteNavigationHeightPx(viewportHeight) {
    return Math.max(0, Math.round(viewportHeight -
        WEB_REMOTE_CONTROL_WORKSPACE_HEADER_HEIGHT_PX -
        WEB_REMOTE_CONTROL_MIN_BODY_HEIGHT_PX));
}
export function resolveWebRemoteNavigationDragState({ heightPx, viewportHeight, }) {
    const maxHeightPx = getMaxWebRemoteNavigationHeightPx(viewportHeight);
    const nextHeightPx = Math.max(0, Math.min(Math.round(heightPx), maxHeightPx));
    if (nextHeightPx <= WEB_REMOTE_CONTROL_NAVIGATION_COLLAPSE_THRESHOLD_PX) {
        return { heightPx: 0, isCollapsed: true };
    }
    return { heightPx: nextHeightPx, isCollapsed: false };
}
export function resolveWebRemoteNavigationToggleState({ currentHeightPx, isCollapsed, viewportHeight, }) {
    if (!isCollapsed && currentHeightPx > WEB_REMOTE_CONTROL_NAVIGATION_COLLAPSE_THRESHOLD_PX) {
        return { heightPx: 0, isCollapsed: true };
    }
    return resolveWebRemoteNavigationDragState({
        heightPx: getDefaultWebRemoteNavigationHeightPx(viewportHeight),
        viewportHeight,
    });
}
//# sourceMappingURL=webRemoteNavigationLayout.js.map