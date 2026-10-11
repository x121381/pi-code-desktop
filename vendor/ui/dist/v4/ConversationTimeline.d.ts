import { type ReactNode } from "react";
import type { ApiRetryState, AttachmentRef, CommandAck, ConversationRow, ConversationRowTarget, QueueItem, SessionPhase } from "@zcode/shared/zcode-protocol-v4";
import type { AssistantFeedbackHandler } from "@/v4/ConversationRowView.js";
import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
import { type ConversationTurnNavigatorHydrationResult } from "@/v4/conversationTurnNavigatorHelpers.js";
import type { ChatSearchResultHighlightRequest, ConversationFindMatchState } from "@/v4/legacyChatViewTypes.js";
import type { ConversationSelectionReference } from "@/lib/conversationSelectionReference.js";
export interface ConversationTimelineProps {
    rows: readonly ConversationRow[];
    /** 手机远控窄屏允许整条会话 flex 链按抽屉宽度收缩；桌面布局保持原样。 */
    compactForRemoteControl?: boolean;
    /** CLI 权威 queue 中等待 model-step 注入的 guide；只改变 renderer 落位。 */
    pendingGuides?: readonly QueueItem[];
    /** runtime memory 状态，只交给当前 live turn，不进入历史虚拟列表。 */
    apiRetry?: ApiRetryState | null;
    /** 投影全序行数（rows.totalCount；窗口截断后大于 rows.length，仅用于滚动条估计/诊断）。 */
    totalCount: number;
    /**
     * 会话身份键（sessionId ?? "draft"）。切换时重置滚动锚定与测高缓存——
     * rowId 在不同 session 间会重复，测高缓存禁止跨会话串号。
     */
    sessionKey: string;
    /** renderer-local 滚动记忆 key；draft 为 null，不参与保存或恢复。 */
    scrollMemoryKey?: string | null;
    /** 行渲染上下文（theme/codePreviewSettings/workspacePath）；宿主保证引用稳定。 */
    rowContext: ConversationRowRenderContext;
    onFork?: (target: ConversationRowTarget) => void;
    onRetry?: (target: ConversationRowTarget) => void;
    onFeedbackChange?: AssistantFeedbackHandler;
    onEdit?: (target: ConversationRowTarget, newText: string, attachments?: readonly AttachmentRef[], workspaceMode?: "preserve" | "rewind") => Promise<CommandAck | boolean | void> | CommandAck | boolean | void;
    /** 还有更早历史可拉（窗口首行 > 全序首行）。 */
    canLoadOlder?: boolean;
    /** loadOlder 在途，抑制重复触发。 */
    loadingOlder?: boolean;
    /** 拉取更早一窗历史（接近顶部时自动预取）。 */
    onLoadOlder?: () => Promise<void> | void;
    /** 宽屏问题目录挂载后一次补齐当前有效分支的全部历史。 */
    onLoadAllOlder?: () => Promise<ConversationTurnNavigatorHydrationResult>;
    /**
     * 问题导航目录失效代际（store turnNavigatorDirectoryRevision）。
     * real-user query 增删后终态必须失效重探测；组件 hydration key
     * 追加此 revision，避免同一 logEpoch 内永久拦截。
     */
    turnNavigatorDirectoryRevision?: number;
    /** 与旧 ChatView 对齐：composer dock 属于同一个滚动视口，sticky 到滚动容器底部。 */
    bottomDock?: ReactNode;
    /** 分享选择面板所在的共享父容器；用于把 dock 的真实位置写入同一坐标系。 */
    selectionPanelLayoutContainerRef?: {
        current: HTMLElement | null;
    };
    /**
     * 锁定背景滚动。
     *
     * 分享选择面板只用 scrim 隔离了正文指针事件，滚动容器仍是 overflow-y-auto，
     * 原生滚动条拖拽和键盘 PageUp/Down 仍能改变 scrollTop，勾选目标会在面板下方漂走。
     */
    backgroundScrollLocked?: boolean;
    /** rows 为空时的可选内容；正式空 session 传空，草稿态传问候语。 */
    emptyState?: ReactNode;
    /**
     * 滚动容器内、消息层之上的常驻内容（分享导入的只读块 + 分割线）。
     *
     * 必须在容器内而不是做成固定横幅，才能与实时对话一起滚动；rows 为空时也要渲染，
     * 所以它落在 emptyState 分支之外。
     */
    headerSlot?: ReactNode;
    /** 草稿态让 emptyState 与同一个 bottomDock 作为整体居中，不重挂 composer。 */
    centerEmptyStateWithDock?: boolean;
    /** 窄屏/粗指针视口保留紧凑居中布局，不复用桌面草稿安全间距。 */
    compactEmptyStateWithDock?: boolean;
    /** 右侧状态面板对消息列的布局模式；auto 由 conversation container query 裁决。 */
    summaryPanelLayout?: "none" | "auto" | "inline";
    conversationFindQuery?: string;
    conversationFindActiveIndex?: number;
    conversationFindNavigationRequestId?: number;
    onConversationFindMatchStateChange?: (state: ConversationFindMatchState) => void;
    searchResultHighlightRequest?: ChatSearchResultHighlightRequest | null;
    onSearchResultHighlightDone?: (requestId: number) => void;
    sessionPhase?: SessionPhase;
    /** 宿主可调用的一次性“滚动到底部”动作；不持有 conversation 或跨 renderer 状态。 */
    scrollToBottomActionRef?: {
        current: (() => void) | null;
    };
    /** 宿主可调用的一次性 query 定位动作；不改变分享面板 view。 */
    scrollToQueryActionRef?: {
        current: ((target: {
            unitIndex: number;
            rowId: number;
        }) => void) | null;
    };
    selectionActions?: {
        enabled: boolean;
        sideActionDisabled?: boolean;
        onAddToCurrentTask: (reference: ConversationSelectionReference) => void;
        onAskInSideChat: (reference: ConversationSelectionReference) => void;
    };
    /** 分享选择阶段的本轮勾选状态；仅桌面分享时间线传入。 */
    shareSelection?: {
        eligibleRowIds: ReadonlySet<number>;
        selectedRowIds: ReadonlySet<number>;
        onToggle: (rowId: number) => void;
    };
    /** 分享选择流程存在时，左侧 rail 由分享面板或 reopen 按钮独占。 */
    hideTurnNavigator?: boolean;
}
/**
 * 虚拟滚动 timeline：动态测高（ResizeObserver 驱动 remeasure）+ 底部锚定 +
 * 「回到底部」。滚动位置/跟随态/测高缓存全部为组件实例状态——多 pane（同会话或
 * 异会话）各自独立，互不干扰；数据订阅共享经 sessionDataLayer lease 处理。
 *
 * React 性能：rows 高频变化（流式 delta），滚动相关回调全部经 ref 读取最新值，
 * 保持稳定引用；跟随态存 ref（每帧变化不触发渲染），仅「回到底部」可见性走 state。
 */
declare function ConversationTimelineImpl({ rows, compactForRemoteControl, pendingGuides, apiRetry, totalCount, sessionKey, scrollMemoryKey, rowContext, onFork, onRetry, onFeedbackChange, onEdit, canLoadOlder, loadingOlder, onLoadOlder, onLoadAllOlder, turnNavigatorDirectoryRevision, bottomDock, selectionPanelLayoutContainerRef, backgroundScrollLocked, emptyState, headerSlot, centerEmptyStateWithDock, compactEmptyStateWithDock, summaryPanelLayout, conversationFindQuery, conversationFindActiveIndex, conversationFindNavigationRequestId, onConversationFindMatchStateChange, searchResultHighlightRequest, onSearchResultHighlightDone, sessionPhase, scrollToBottomActionRef, scrollToQueryActionRef, selectionActions, shareSelection, hideTurnNavigator, }: ConversationTimelineProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationTimeline: import("react").MemoExoticComponent<typeof ConversationTimelineImpl>;
export {};
//# sourceMappingURL=ConversationTimeline.d.ts.map