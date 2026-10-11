export const WORKSPACE_SIDEBAR_RESIZING_ATTR = "data-workspace-sidebar-resizing";
export const WORKSPACE_SIDEBAR_RESIZE_END_EVENT = "zcode:workspace-sidebar-resize-end";
const WORKSPACE_SIDEBAR_RESIZING_VALUE = "true";
const WORKSPACE_SHELL_SELECTOR = "[data-workspace-shell]";
export function setWorkspaceSidebarResizeActive({ active, panelElement, shellElement, }) {
    for (const element of [shellElement, panelElement]) {
        if (!element) {
            continue;
        }
        if (active) {
            element.setAttribute(WORKSPACE_SIDEBAR_RESIZING_ATTR, WORKSPACE_SIDEBAR_RESIZING_VALUE);
        }
        else {
            element.removeAttribute(WORKSPACE_SIDEBAR_RESIZING_ATTR);
        }
    }
    if (!active && shellElement?.dispatchEvent && typeof Event !== "undefined") {
        shellElement.dispatchEvent(new Event(WORKSPACE_SIDEBAR_RESIZE_END_EVENT));
    }
}
export function getWorkspaceSidebarResizeRootForElement(element) {
    return element?.closest(WORKSPACE_SHELL_SELECTOR) ?? null;
}
export function isWorkspaceSidebarResizeActiveForElement(element) {
    const shellElement = getWorkspaceSidebarResizeRootForElement(element);
    return (shellElement?.getAttribute(WORKSPACE_SIDEBAR_RESIZING_ATTR) === WORKSPACE_SIDEBAR_RESIZING_VALUE);
}
//# sourceMappingURL=workspaceSidebarResizeState.js.map