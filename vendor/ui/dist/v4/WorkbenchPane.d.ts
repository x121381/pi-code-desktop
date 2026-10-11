import { type ReactNode } from "react";
import type { GitChangeSourceId, GitRepositorySummary, ZCodeProvider, ZCodeTaskChangeSummary } from "@zcode/shared";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { AssistantPreviewCardsAutoOpenRequest } from "@/lib/assistantPreviewCards.js";
import type { OpenAutomationsMain } from "@/lib/taskNavigationHistory.js";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { OpenScopedSubagentSideTabRequest, OpenBackgroundBashSideTabRequest, OpenScopedSubagentDirectorySideTabRequest, OpenSelectionSideChatRequest, OpenScopedPlanDetailSideTabRequest, OpenScopedWorkflowActorSessionSideTabRequest, OpenScopedWorkflowArtifactSideTabRequest, OpenScopedWorkflowRunSideTabRequest, OpenScopedWorkflowRunDirectorySideTabRequest, OpenScopedWorkflowWorkspaceSideTabRequest, SyncSubagentSessionTabsRequest } from "@/lib/workspaceSidePane.js";
import type { ConversationDropTargetController } from "@/v4/composer/conversationDropTarget.js";
import { type PaneBinding, type PaneSplitSide, type PaneWorkspaceScope, type SplitDirection } from "@/v4/paneLayoutStore.js";
import type { WorkbenchSessionBinding } from "@/v4/workbenchGroupStore.js";
import { type WorkbenchSessionDragPayload } from "@/v4/workbenchDragDrop.js";
import { type RectExpr } from "@/v4/workbenchLayout.js";
import type { ChatSearchResultHighlightRequest, ChatViewSummaryPanelVariant, ConversationFindMatchState } from "@/v4/legacyChatViewTypes.js";
/** primary pane 的 shell 侧绑定（activeTaskId 选择态 + 回调，不进 paneLayoutStore）。 */
export interface WorkbenchShellBinding {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    /** Prompt 模板埋点当前仅覆盖 Desktop。 */
    isDesktop?: boolean;
    readOnly?: boolean;
    compactForRemoteControl?: boolean;
    sessionId: string | null;
    /** Shell 当前真正激活的 task；split pane 接管 active task 时不等于 primary sessionId。 */
    activeSessionId?: string | null;
    activeSelectionSideChatSessionId?: string | null;
    provider?: ZCodeProvider;
    onSessionCreated?: (sessionId: string) => void;
    onSessionDeleted?: () => void;
    draftComposerHeader?: ReactNode;
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
    /** 插件 UI 侧栏：与 onOpenPlanDetail 同路径经 shell binding 下发到 SessionPane。 */
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
export interface WorkbenchLeafPaneProps {
    paneId: string;
    rect: RectExpr;
    focused: boolean;
    showFocusIndicator: boolean;
    canSplit: boolean;
    shellWorkspaceKey: string;
    /** 非 primary pane 的绑定；primary 传 null（用 shell 绑定）。 */
    binding: PaneBinding | null;
    /** session workbench group 中 primary pane 的显式绑定；无 group 时为 null。 */
    primaryBinding?: WorkbenchSessionBinding | null;
    shell: WorkbenchShellBinding;
    onFocusRequest: (paneId: string) => void;
    onSplit?: (paneId: string, direction: SplitDirection, scope: PaneWorkspaceScope) => void;
    onClosePane: (paneId: string) => void;
    onConfirmRestoredSession: (paneId: string) => void;
    onBindSession: (paneId: string, sessionId: string) => boolean | void;
    onPaneActiveSessionChange?: (scope: PaneWorkspaceScope, sessionId: string) => void;
    canDropSession?: (payload: WorkbenchSessionDragPayload) => boolean;
    onDropSession?: (paneId: string, side: PaneSplitSide, payload: WorkbenchSessionDragPayload) => void;
}
export declare function WorkbenchLeafPane({ paneId, rect, focused, showFocusIndicator, canSplit, shellWorkspaceKey, binding, primaryBinding, shell, onFocusRequest, onSplit, onClosePane, onConfirmRestoredSession, onBindSession, onPaneActiveSessionChange, canDropSession, onDropSession, }: WorkbenchLeafPaneProps): import("react/jsx-runtime").JSX.Element | null;
export declare function resolvePaneActiveSelectionSideChatSessionId(paneSessionId: string | null, shellActiveSessionId: string | null, activeSelectionSideChatSessionId: string | null | undefined): string | null;
//# sourceMappingURL=WorkbenchPane.d.ts.map