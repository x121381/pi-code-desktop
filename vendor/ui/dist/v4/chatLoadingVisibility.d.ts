import type { ActiveWorkSummary, ConversationRow, PendingInteraction } from "@zcode/shared/zcode-protocol-v4";
/**
 * 等待用户操作时，弹窗/问答卡已经是唯一进度反馈，不能再显示 loading。
 * 这里只识别权限确认与 AskUserQuestion；ExitPlanMode 等其它 userInput 语义保持独立。
 * 软门禁后 workspaceHookReview 不再阻塞聊天。
 */
export declare function hasChatLoadingBlockingInteraction(interactions: readonly PendingInteraction[]): boolean;
export declare function hasChatLoadingBlockingActiveWork(activeWorks: readonly ActiveWorkSummary[]): boolean;
export declare function shouldShowTurnChatLoading({ blockedByActiveWork, blockedByInteraction, isLastTurn, isRunning, rows, }: {
    blockedByActiveWork: boolean;
    blockedByInteraction: boolean;
    isLastTurn: boolean;
    isRunning: boolean;
    rows: readonly ConversationRow[];
}): boolean;
//# sourceMappingURL=chatLoadingVisibility.d.ts.map