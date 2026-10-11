import { getActiveSidePaneTab } from "@/lib/workspaceSidePane.js";
export const CLOSE_ACTIVE_CONTEXT_REQUEST_EVENT = "zcode:close-active-context-request";
export function getCloseActiveContextSidePaneTab(options) {
    if (!options.isWorkspaceVisible || options.isSidePaneCollapsed) {
        return null;
    }
    return getActiveSidePaneTab(options.sidePaneState);
}
//# sourceMappingURL=closeActiveContext.js.map