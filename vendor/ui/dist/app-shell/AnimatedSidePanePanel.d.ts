import { type CSSProperties, type RefObject } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
import type { IServiceAccessor } from "@zcode/services";
import type { BrowserViewScreenshotSurfacePreparePayload, GitChangeSourceId } from "@zcode/shared";
import type { BrowserNavigationRequest, RecentClosedSidePaneTab } from "@/hooks/useAppPanels.js";
import { type BrowserSidePaneMetadata, type OpenScopedSubagentSideTabRequest, type OpenScopedWorkflowActorSessionSideTabRequest, type OpenScopedWorkflowWorkspaceSideTabRequest, type OpenScopedWorkflowArtifactSideTabRequest, type OpenScopedWorkflowRunSideTabRequest, type OpenBackgroundBashSideTabRequest, type WorkspaceSidePaneState } from "@/lib/workspaceSidePane.js";
import { type CodeViewerSource } from "@/lib/codeViewer.js";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
export declare function AnimatedSidePanePanel({ services, isDesktop, isWindowsDesktop, isVisible, sidePaneState, recentClosedSidePaneTabs, isBrowserOpen, supportsEmbeddedBrowser, workspaceAbsPath, workspaceIdentity, workspaceRemoteSessionId, activeTaskId, sidePaneOwnerId, gitState, activeGitSourceId, panelRef, panelElementRef, browserNavigationRequest, browserRestoreUrls, screenshotSurfaceRequest: screenshotSurfaceRequestProp, screenshotSurfaceTabId, fileChangeFindActiveIndex, fileChangeFindNavigationRequestId, fileChangeFindQuery, onFileChangeFindMatchCountChange, onCloseCodeViewer, onCloseGit, onActivateTab, onReorderTab, onCloseTab, onCloseOtherTabs, onCloseAllTabs, onReopenClosedTab, onOpenBrowserTab, onOpenBrowserPermissionSettings, onOpenWhiteboard: _onOpenWhiteboard, onOpenDeveloperTools, onOpenTerminalTab, onOpenReviewTab, onOpenSelectionSideConversation, onRevealGitFileInTree, onOpenBrowserUrl, onOpenCodeViewer, onOpenFileLink, onOpenSubagentSession, onOpenWorkflowActorSession, onOpenWorkflowWorkspace, onOpenWorkflowArtifact, onOpenWorkflowRun, onOpenBackgroundBash, onRefreshGit, onBrowserNavigationRequestHandled, onBrowserUrlChange, onBrowserPageMetadataChange, onSelectGitSource, frameClassName, captionControlsStyle, showWindowControls, onCloseSidePane, toggleSidePaneShortcutLabel, mobileOverlay, mobileStacked, }: {
    services: IServiceAccessor;
    frameClassName?: string;
    captionControlsStyle?: CSSProperties;
    showWindowControls?: boolean;
    onCloseSidePane?: () => void;
    toggleSidePaneShortcutLabel?: string;
    isDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isVisible: boolean;
    sidePaneState: WorkspaceSidePaneState | null;
    recentClosedSidePaneTabs: RecentClosedSidePaneTab[];
    isBrowserOpen: boolean;
    supportsEmbeddedBrowser?: boolean;
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    activeTaskId: string | null;
    sidePaneOwnerId: string | null;
    gitState: ReturnType<typeof import("@/hooks/useGitRepository.js").useGitRepository>;
    activeGitSourceId: GitChangeSourceId;
    panelRef: RefObject<PanelImperativeHandle | null>;
    panelElementRef: RefObject<HTMLDivElement | null>;
    browserNavigationRequest: BrowserNavigationRequest | null;
    browserRestoreUrls: Record<string, string>;
    screenshotSurfaceRequest?: BrowserViewScreenshotSurfacePreparePayload | null;
    screenshotSurfaceTabId?: string | null;
    fileChangeFindActiveIndex: number;
    fileChangeFindNavigationRequestId: number;
    fileChangeFindQuery: string;
    onFileChangeFindMatchCountChange: (count: number) => void;
    onCloseCodeViewer: () => void;
    onCloseGit: () => void;
    onActivateTab: (tabId: string) => void;
    /** "插件"分组打开面板 tab；缺省不渲染分组（web / 无宿主）。 */
    onReorderTab: (activeTabId: string, overTabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onCloseOtherTabs: (tabId: string) => void;
    onCloseAllTabs: () => void;
    onReopenClosedTab: (tabId: string) => void;
    onOpenBrowserTab: () => void;
    onOpenBrowserPermissionSettings?: (origin: string) => void;
    onOpenWhiteboard: () => void;
    onOpenDeveloperTools: () => void;
    onOpenTerminalTab: () => void;
    onOpenReviewTab: () => void;
    onOpenSelectionSideConversation: () => void;
    onRevealGitFileInTree?: (path: string) => void;
    onOpenBrowserUrl: (url: string) => void;
    onOpenCodeViewer: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenBackgroundBash?: (request: OpenBackgroundBashSideTabRequest) => void;
    onOpenSubagentSession: (request: OpenScopedSubagentSideTabRequest) => void;
    /** run 详情页里点 ask 节点 → 打开那个 actor 实例的 transcript tab。 */
    onOpenWorkflowActorSession?: (request: OpenScopedWorkflowActorSessionSideTabRequest) => void;
    /** run 详情页里点脚本行 → 打开该 run 的脚本 transcript tab，落到那一站。 */
    onOpenWorkflowWorkspace?: (request: OpenScopedWorkflowWorkspaceSideTabRequest) => void;
    /** run 详情页里点一张产物卡 → 打开那个产物的全尺寸查看 tab。 */
    onOpenWorkflowArtifact?: (request: OpenScopedWorkflowArtifactSideTabRequest) => void;
    /** run 目录页里点一行 → 打开那个 run 的详情页 tab（目录 → 详情是这一页存在的理由）。 */
    onOpenWorkflowRun?: (request: OpenScopedWorkflowRunSideTabRequest) => void;
    onRefreshGit: () => void;
    onBrowserNavigationRequestHandled: (requestId: string) => void;
    onBrowserUrlChange: (tabId: string, url: string) => void;
    onBrowserPageMetadataChange: (tabId: string, metadata: BrowserSidePaneMetadata) => void;
    onSelectGitSource: (value: GitChangeSourceId) => void;
    mobileOverlay?: boolean;
    mobileStacked?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AnimatedSidePanePanel.d.ts.map