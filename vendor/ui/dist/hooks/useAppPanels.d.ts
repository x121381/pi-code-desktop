import type { EmbeddedBrowserOpenUrlRequest, IPlatformService } from "@zcode/shared";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import { type BrowserSidePaneMetadata, type TreemappingSidePaneTab, type OpenScopedSubagentSideTabRequest, type OpenBackgroundBashSideTabRequest, type OpenScopedSubagentDirectorySideTabRequest, type OpenSelectionSideChatRequest, type OpenScopedPlanDetailSideTabRequest, type OpenScopedWorkflowRunSideTabRequest, type OpenScopedWorkflowRunDirectorySideTabRequest, type OpenScopedWorkflowActorSessionSideTabRequest, type OpenScopedWorkflowArtifactSideTabRequest, type OpenScopedWorkflowWorkspaceSideTabRequest, type WorkspaceSidePaneState, type WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
import type { OpenPluginUiSideTabRequest } from "@/plugin-ui/contract.js";
export interface BrowserNavigationRequest {
    id: string;
    targetTabId: string;
    url: string;
}
export interface RecentClosedSidePaneTab {
    tab: WorkspaceSidePaneTab;
    closedAt: number;
}
export declare function useAppPanels(options: {
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string | null;
    activeTaskId: string | null;
    /** 草稿态与正式任务共用稳定 id，作为侧栏对话隔离边界。 */
    sidePaneOwnerId: string | null;
    isDesktop?: boolean;
    /**
     * 展示语义：视图当前是否呈现给用户（设置页覆盖时为 false）。
     * 本 hook 刻意不消费它——Browser View 事件是 main 侧权威转发，订阅不能受可见性影响，
     * 详见下方订阅 effect 的时序约束注释。
     * 入参保留的唯一理由是回归护栏：useAppPanelsBrowserViewLifecycle 的四条用例靠传 false 表达
     * “设置页覆盖中”，一旦有人把可见性重新写回订阅条件，这些用例会立即失败。删掉入参，
     * 那层保护也就跟着消失了。
     */
    isWorkspaceVisible?: boolean;
    supportsEmbeddedBrowser?: boolean;
    defaultWhiteboardNamePrefix: string;
    platform?: Pick<IPlatformService, "onOpenBrowserUrl" | "onBrowserViewReady" | "onBrowserViewOperation" | "onBrowserViewVisibility" | "onBrowserViewCloseTab" | "onBrowserViewSuspend" | "onBrowserViewRestore" | "browserViewCloseTab" | "browserViewEnsureResident">;
}): {
    isTerminalOpen: boolean;
    setIsTerminalOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    sidePaneState: WorkspaceSidePaneState | null;
    recentClosedSidePaneTabs: RecentClosedSidePaneTab[];
    isSidePaneCollapsed: boolean;
    setIsSidePaneCollapsed: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    isSidebarVisible: boolean;
    browserNavigationRequest: BrowserNavigationRequest | null;
    setBrowserNavigationRequest: import("react").Dispatch<import("react").SetStateAction<BrowserNavigationRequest | null>>;
    handleOpenCodeViewer: (source: CodeViewerSource) => void;
    handleOpenCodeViewers: (sources: readonly CodeViewerSource[]) => void;
    handleOpenBrowserUrl: (request: string | EmbeddedBrowserOpenUrlRequest) => void;
    handleToggleBrowser: () => void;
    handleOpenBrowserTab: () => void;
    handleOpenBrowserPermissionSettings: (origin: string) => void;
    handleToggleGit: () => void;
    handleOpenGit: () => void;
    handleOpenTreemapping: (source?: TreemappingSidePaneTab["source"]) => void;
    handleOpenWhiteboard: () => void;
    handleOpenDeveloperTools: () => void;
    handleOpenTerminalTab: () => void;
    handleOpenModelTrajectory: (params: {
        taskId: string;
        title?: string | null;
    }) => void;
    handleOpenSubagentSession: (request: OpenScopedSubagentSideTabRequest) => void;
    handleOpenBackgroundBash: (request: OpenBackgroundBashSideTabRequest) => void;
    handleOpenSubagentDirectory: (request: OpenScopedSubagentDirectorySideTabRequest) => void;
    handleSyncSubagentSessionTabs: (request: import("@/lib/workspaceSidePane.js").SyncSubagentSessionTabsRequest) => void;
    handleOpenSelectionSideChat: (request: OpenSelectionSideChatRequest) => void;
    handleOpenPlanDetail: (request: OpenScopedPlanDetailSideTabRequest) => void;
    handleOpenPluginUi: (request: OpenPluginUiSideTabRequest) => void;
    handleOpenWorkflowRun: (request: OpenScopedWorkflowRunSideTabRequest) => void;
    handleOpenWorkflowRunDirectory: (request: OpenScopedWorkflowRunDirectorySideTabRequest) => void;
    handleOpenWorkflowActorSession: (request: OpenScopedWorkflowActorSessionSideTabRequest) => void;
    handleOpenWorkflowWorkspace: (request: OpenScopedWorkflowWorkspaceSideTabRequest) => void;
    handleOpenWorkflowArtifact: (request: OpenScopedWorkflowArtifactSideTabRequest) => void;
    handleToggleTerminal: () => void;
    handleToggleSidebar: () => void;
    handleToggleSidePaneCollapse: () => void;
    handleCloseCodeViewer: () => void;
    handleCloseGit: () => void;
    handleActivateSidePaneTab: (tabId: string) => void;
    handleReorderSidePaneTab: (activeTabId: string, overTabId: string) => void;
    handleCloseSidePaneTab: (tabId: string) => void;
    handleCloseOtherSidePaneTabs: (tabId: string) => void;
    handleCloseAllSidePaneTabs: () => void;
    handleReopenClosedSidePaneTab: (tabId: string) => void;
    handleBrowserNavigationRequestHandled: (requestId: string) => void;
    handleBrowserPageMetadataChange: (tabId: string, metadata: BrowserSidePaneMetadata) => void;
};
//# sourceMappingURL=useAppPanels.d.ts.map