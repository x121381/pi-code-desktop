import { type ReactNode } from "react";
import type { GitChangeSourceId, GitRepositorySummary, ZCodeProvider, ZCodeTaskChangeSummary } from "@zcode/shared";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { AssistantPreviewCardsAutoOpenRequest } from "@/lib/assistantPreviewCards.js";
import type { OpenAutomationsMain } from "@/lib/taskNavigationHistory.js";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { OpenScopedSubagentSideTabRequest, OpenBackgroundBashSideTabRequest, OpenScopedSubagentDirectorySideTabRequest, OpenSelectionSideChatRequest, OpenScopedPlanDetailSideTabRequest, OpenScopedWorkflowArtifactSideTabRequest, OpenScopedWorkflowRunSideTabRequest, OpenScopedWorkflowActorSessionSideTabRequest, OpenScopedWorkflowRunDirectorySideTabRequest, OpenScopedWorkflowWorkspaceSideTabRequest, SyncSubagentSessionTabsRequest } from "@/lib/workspaceSidePane.js";
import { type PaneWorkspaceScope } from "@/v4/paneLayoutStore.js";
import type { ConversationDropTargetController } from "@/v4/composer/conversationDropTarget.js";
import type { ChatSearchResultHighlightRequest, ChatViewSummaryPanelVariant, ConversationFindMatchState } from "@/v4/legacyChatViewTypes.js";
export interface V4WorkspaceChatAreaProps {
    workspacePath: string;
    workspaceIdentity?: string;
    /** Prompt 模板埋点当前仅覆盖 Desktop；Web / 手机远控保留 UI 行为但不触发该事件。 */
    isDesktop?: boolean;
    readOnly?: boolean;
    /** Settings 等覆盖层打开时为 false，隐藏 Pane 不得消费一次性 Composer 请求。 */
    foregroundEnabled?: boolean;
    remoteSessionId?: string;
    compactForRemoteControl?: boolean;
    /** primary pane 绑定的 CLI session（既有选择态 activeTaskId）；null = draft。 */
    sessionId: string | null;
    activeSelectionSideChatSessionId?: string | null;
    provider?: ZCodeProvider;
    /** primary pane createSession/fork 后接入既有选择路径（handleSelectTask）。 */
    onSessionCreated?: (sessionId: string) => void;
    /** primary pane 会话删除后回 draft（shell 起新草稿）。 */
    onSessionDeleted?: () => void;
    /**
     * 草稿态 composer contextHeader（m5：workspace 菜单 + Git 分支），
     * 仅下发给 primary pane——其余 pane 的 draft 不承载壳级 workspace 切换。
     */
    draftComposerHeader?: ReactNode;
    /** 桌面轻量草稿标题栏复用主草稿 composer 的 drop controller。 */
    onPrimaryDraftDropTargetControllerChange?: (controller: ConversationDropTargetController | null) => void;
    gitSummary?: GitRepositorySummary | null;
    gitDirtyFileCount?: number;
    gitWorktreeReviewSourceId?: GitChangeSourceId | null;
    gitWorktreeChangeSummary?: {
        added: number;
        removed: number;
    } | null;
    activeTaskChangeSummary?: ZCodeTaskChangeSummary | null;
    summaryPanelVariantOverride?: ChatViewSummaryPanelVariant | null;
    onSummaryPanelVariantOverrideChange?: (variant: ChatViewSummaryPanelVariant | null) => void;
    onRefreshGit?: () => void;
    onOpenGitReview?: (sourceId?: GitChangeSourceId) => void;
    onPaneActiveSessionChange?: (scope: PaneWorkspaceScope, sessionId: string) => void;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenAutomationsMain?: OpenAutomationsMain;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onAutoOpenAssistantPptx?: (request: AssistantPreviewCardsAutoOpenRequest) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenBackgroundBash?: (request: OpenBackgroundBashSideTabRequest) => void;
    onOpenSubagentSession?: (request: OpenScopedSubagentSideTabRequest) => void;
    onOpenSubagentDirectory?: (request: OpenScopedSubagentDirectorySideTabRequest) => void;
    onSyncSubagentSessionTabs?: (request: SyncSubagentSessionTabsRequest) => void;
    onOpenSelectionSideChat?: (request: OpenSelectionSideChatRequest) => void;
    onOpenPlanDetail?: (request: OpenScopedPlanDetailSideTabRequest) => void;
    onOpenWorkflowRun?: (request: OpenScopedWorkflowRunSideTabRequest) => void;
    onOpenWorkflowArtifact?: (request: OpenScopedWorkflowArtifactSideTabRequest) => void;
    onOpenWorkflowRunDirectory?: (request: OpenScopedWorkflowRunDirectorySideTabRequest) => void;
    onOpenWorkflowActorSession?: (request: OpenScopedWorkflowActorSessionSideTabRequest) => void;
    onOpenWorkflowWorkspace?: (request: OpenScopedWorkflowWorkspaceSideTabRequest) => void;
    conversationFindQuery?: string;
    conversationFindActiveIndex?: number;
    conversationFindNavigationRequestId?: number;
    onConversationFindMatchStateChange?: (state: ConversationFindMatchState) => void;
    searchResultHighlightRequest?: ChatSearchResultHighlightRequest | null;
    onSearchResultHighlightDone?: (requestId: number) => void;
}
/**
 * 分屏 workspace 主聊天区：多 pane 跨 workspace 工作台
 *
 * - 布局：paneLayoutStore 的二叉分割树 → 绝对定位 rect（CSS 变量驱动占比）；
 *   叶子扁平渲染（key = paneId），拆分/关闭不重挂任何存活 pane。
 * - 数据面：每个 pane 一个 V4PaneConversationProvider——连接经
 *   workspaceConnectionRegistry 按 endpoint+workspaceKey 引用计数复用
 *   （同 workspace 的 pane 共享一条 transport + SessionDataLayer）。
 * - primary pane 绑定沿用 activeTaskId（shell props，随 workspace tab 切换）；
 *   其余 pane 绑定归 paneLayoutStore，自带 workspaceScope、跨 tab 常驻。
 * - Focus 层：快捷键（Esc stop）/add-to-chat 只路由到 focused pane。
 * - 恢复守卫：restoredUnvalidated pane 各自经其 scope 的 sessions-index 验证。
 */
export declare function V4WorkspaceChatArea({ workspacePath, workspaceIdentity, isDesktop, readOnly, foregroundEnabled, remoteSessionId, compactForRemoteControl, sessionId, activeSelectionSideChatSessionId, provider, onSessionCreated, onSessionDeleted, draftComposerHeader, onPrimaryDraftDropTargetControllerChange, gitSummary, gitDirtyFileCount, gitWorktreeReviewSourceId, gitWorktreeChangeSummary, activeTaskChangeSummary, summaryPanelVariantOverride, onSummaryPanelVariantOverrideChange, onRefreshGit, onOpenGitReview, onPaneActiveSessionChange, onOpenBrowserUrl, onOpenAutomationsMain, onOpenCodeViewer, onAutoOpenAssistantPptx, onOpenFileLink, onOpenSubagentSession, onOpenBackgroundBash, onOpenSubagentDirectory, onSyncSubagentSessionTabs, onOpenSelectionSideChat, onOpenPlanDetail, onOpenWorkflowRun, onOpenWorkflowArtifact, onOpenWorkflowRunDirectory, onOpenWorkflowActorSession, onOpenWorkflowWorkspace, conversationFindQuery, conversationFindActiveIndex, conversationFindNavigationRequestId, onConversationFindMatchStateChange, searchResultHighlightRequest, onSearchResultHighlightDone, }: V4WorkspaceChatAreaProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=V4WorkspaceChatArea.d.ts.map