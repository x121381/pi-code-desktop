import type { WorkspaceSidePaneState, WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
export declare const CLOSE_ACTIVE_CONTEXT_REQUEST_EVENT = "zcode:close-active-context-request";
export declare function getCloseActiveContextSidePaneTab(options: {
    isWorkspaceVisible: boolean;
    isSidePaneCollapsed: boolean;
    sidePaneState: WorkspaceSidePaneState | null;
}): WorkspaceSidePaneTab | null;
//# sourceMappingURL=closeActiveContext.d.ts.map