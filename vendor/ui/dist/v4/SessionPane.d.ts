import { type ReactNode } from "react";
import type { GitChangeSourceId, GitRepositorySummary, ZCodeProvider, ZCodeTaskChangeSummary } from "@zcode/shared";
import type { AttachmentRef, CommandAck, ConversationSnapshot } from "@zcode/shared/zcode-protocol-v4";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { OpenAutomationsMain } from "@/lib/taskNavigationHistory.js";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { SessionOpenTrigger } from "@/lib/sessionOpenArmsTelemetry.js";
import { type ComposerRestoreRequest } from "@/v4/ConversationComposer.js";
import type { ConversationDropTargetController } from "@/v4/composer/conversationDropTarget.js";
import { type PaneWorkspaceBadge } from "@/v4/ConversationHeader.js";
import type { AssistantPreviewCardsAutoOpenRequest } from "@/lib/assistantPreviewCards.js";
import type { ChatSearchResultHighlightRequest, ChatViewSummaryPanelVariant, ConversationFindMatchState } from "@/v4/legacyChatViewTypes.js";
import type { OpenScopedPlanDetailSideTabRequest, OpenScopedWorkflowActorSessionSideTabRequest, OpenScopedWorkflowArtifactSideTabRequest, OpenScopedWorkflowRunSideTabRequest, OpenScopedWorkflowRunDirectorySideTabRequest, OpenScopedWorkflowWorkspaceSideTabRequest, OpenScopedSubagentSideTabRequest, OpenBackgroundBashSideTabRequest, OpenScopedSubagentDirectorySideTabRequest, OpenSelectionSideChatRequest, SyncSubagentSessionTabsRequest } from "@/lib/workspaceSidePane.js";
export interface SessionPaneProps {
    paneId: string;
    sessionId: string | null;
    /** 低基数打开入口，由 pane 宿主提供；缺省仅用于兼容旧调用。 */
    openTrigger?: SessionOpenTrigger;
    rootSessionId?: string;
    /** subagent 右侧详情等观察视图：不显示 composer/input，也不发送行内编辑类命令。 */
    readOnly?: boolean;
    /** 观察视图的显式例外：允许文件摘要恢复 workspace，但不开放会话编辑能力。 */
    allowWorkspaceFileRewind?: boolean;
    /** 框选副屏：保留普通 composer/tools，但隐藏并禁止 edit/retry/fork/goal。 */
    selectionSideChat?: boolean;
    /** 主会话划词动作只投递到 Side Pane 当前激活的辅助 child。 */
    activeSelectionSideChatSessionId?: string | null;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string | null;
    /** Prompt 模板埋点当前仅覆盖 Desktop；Web / 手机远控保留 UI 行为但不触发该事件。 */
    isDesktop?: boolean;
    compactForRemoteControl?: boolean;
    provider?: ZCodeProvider;
    onSessionCreated?: (sessionId: string) => void;
    /** deleteSession：删除当前会话后回到 draft（shell 起新草稿）。 */
    onSessionDeleted?: () => void;
    /** 隐藏副屏的 child 已不存在时，由宿主移除对应 tab。 */
    onSelectionSideChatUnavailable?: () => void;
    /**
     * Focus 层：全局快捷键（Esc stop）与 add-to-chat 事件只路由到
     * focused pane。单 pane 消费者（V4ChatPane）缺省 true。
     */
    focused?: boolean;
    /**
     * pane 是否真实可见。分屏的非 focused pane 仍传 true；forceMount 的隐藏侧栏 tab 传 false。
     * 只影响 foreground UI telemetry，不影响 live subscription 或后台 /event/report。
     */
    telemetryVisible?: boolean;
    /** 向右拆分新 draft 窗格（叶子数达上限时宿主不下发）。 */
    onSplitRight?: () => void;
    /** 向下拆分新 draft 窗格。 */
    onSplitDown?: () => void;
    /** 关闭本窗格（仅非 primary pane 下发；关 pane ≠ 停 session）。 */
    onClosePane?: () => void;
    /** 跨 workspace pane 的归属徽标（pane workspace ≠ shell 当前 workspace 时下发）。 */
    workspaceBadge?: PaneWorkspaceBadge;
    /**
     * 草稿态 composer 上方的 contextHeader（m5：workspace 切换菜单 + Git 分支）。
     * 由 app-shell 构造下发（依赖 workspaceTabs / 远程连接回调等壳层能力）；
     * 非 primary pane 不下发（workspace 切换是壳级动作）。
     */
    draftComposerHeader?: ReactNode;
    /** 主草稿把 drop controller 提给 app shell 的标题栏；其他 pane 只在自身 surface 消费。 */
    onDropTargetControllerChange?: (controller: ConversationDropTargetController | null) => void;
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
    /** 通知行的产物 chip → 全尺寸查看 tab。 */
    onOpenWorkflowArtifact?: (request: OpenScopedWorkflowArtifactSideTabRequest) => void;
    onOpenWorkflowRunDirectory?: (request: OpenScopedWorkflowRunDirectorySideTabRequest) => void;
    /** 工具卡上的子代理药丸 → transcript tab；与详情页子代理行同一个宿主处理器。 */
    onOpenWorkflowActorSession?: (request: OpenScopedWorkflowActorSessionSideTabRequest) => void;
    /** 工具卡上的脚本药丸 → 脚本 transcript tab；与详情页脚本行同一个宿主处理器。 */
    onOpenWorkflowWorkspace?: (request: OpenScopedWorkflowWorkspaceSideTabRequest) => void;
    conversationFindQuery?: string;
    conversationFindActiveIndex?: number;
    conversationFindNavigationRequestId?: number;
    onConversationFindMatchStateChange?: (state: ConversationFindMatchState) => void;
    searchResultHighlightRequest?: ChatSearchResultHighlightRequest | null;
    onSearchResultHighlightDone?: (requestId: number) => void;
}
export interface QueuedComposerRestoreTarget {
    baseRevision: number;
    queueItemId: string;
    sourceCommandId: string;
    inputKind: "sendText" | "sendGoalCommand";
    text: string;
    attachments: readonly AttachmentRef[];
    config?: ComposerRestoreRequest["config"];
}
export declare function resolveQueuedComposerRestore(snapshot: ConversationSnapshot, queueItemId: string): QueuedComposerRestoreTarget | null;
export declare function shouldRestoreQueuedComposerFromAck(status: CommandAck["status"]): boolean;
/**
 * 单 pane 竖切：订阅 → 渲染 rows → composer 发送 / stop（06-ui §SessionPane）。
 *
 * React 性能（vercel-react-best-practices）：
 * - 叶子组件（Header/Timeline/QueuePanel/InputControls/Composer/GoalBanner）均 memo；
 * - 所有回调用 useCallback 且**不依赖高频变化的 snapshot**——snapshot/composer 文本经 ref 读取，
 *   使回调在流式增量期间保持稳定引用，避免把新函数灌进 memo 子组件触发无谓重渲染；
 * - 模型表单的本地输入 state 下沉到对应子组件，输入时不牵动整个 pane。
 */
export declare function SessionPane({ paneId, sessionId, openTrigger, rootSessionId, readOnly, allowWorkspaceFileRewind, selectionSideChat, activeSelectionSideChatSessionId, workspacePath, workspaceIdentity, remoteSessionId, isDesktop, compactForRemoteControl, provider, onSessionCreated, onSelectionSideChatUnavailable, focused, telemetryVisible, onSplitRight, onSplitDown, onClosePane, workspaceBadge, draftComposerHeader, onDropTargetControllerChange, gitSummary, gitDirtyFileCount, gitWorktreeReviewSourceId, gitWorktreeChangeSummary, activeTaskChangeSummary, summaryPanelVariantOverride, onSummaryPanelVariantOverrideChange, onRefreshGit, onOpenGitReview, onOpenBrowserUrl, onOpenAutomationsMain, onOpenCodeViewer, onAutoOpenAssistantPptx, onOpenFileLink, onOpenSubagentSession, onOpenBackgroundBash, onOpenSubagentDirectory, onSyncSubagentSessionTabs, onOpenSelectionSideChat, onOpenPlanDetail, onOpenWorkflowRun, onOpenWorkflowArtifact, onOpenWorkflowRunDirectory, onOpenWorkflowActorSession, onOpenWorkflowWorkspace, conversationFindQuery, conversationFindActiveIndex, conversationFindNavigationRequestId, onConversationFindMatchStateChange, searchResultHighlightRequest, onSearchResultHighlightDone, }: SessionPaneProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SessionPane.d.ts.map