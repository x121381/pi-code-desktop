import type { ConversationShareAccessMode } from "@zcode/shared";
import type { ConversationShareFailureIssue } from "@zcode/services";
export type ConversationShareScope = "all" | "partial";
export type ConversationShareSelectionView = "selection" | "timeline";
export type ConversationShareSelectionStage = "selection" | "configuration";
export declare const DEFAULT_CONVERSATION_SHARE_ACCESS_MODE: ConversationShareAccessMode;
export interface ConversationShareAttempt {
    key: string;
    clientRequestId: string;
    disclosureAcceptedAt: number;
}
export interface ConversationShareDisplayError {
    issues: readonly ConversationShareFailureIssue[];
    issueCount: number;
    omittedIssueCount?: number;
    requestId?: string;
    clientRequestId?: string;
    operationId?: string;
    status?: number;
    code?: number;
    /** 没有服务端 issues 时展示的、按错误类型解析出的可行动文案。 */
    messageId?: string;
}
/** 发布成功但有结果物被跳过时的非阻断提示。 */
export interface ConversationShareDisplayWarnings {
    issues: readonly ConversationShareFailureIssue[];
    issueCount: number;
    omittedIssueCount?: number;
}
export type ConversationShareProgressPhase = "collecting" | "uploading" | "checking";
export interface ConversationShareSelectionDraft {
    scope: ConversationShareScope;
    stage: ConversationShareSelectionStage;
    view: ConversationShareSelectionView;
    availableRowIds: readonly number[];
    excludedRowIds: readonly number[];
    productTurnIdByRowId: Readonly<Record<number, string>>;
    accessMode: ConversationShareAccessMode;
}
export interface ConversationShareDockState {
    title?: string;
    disclosureAccepted: boolean;
    publishing: boolean;
    progress: ConversationShareProgressPhase;
    completedArtifacts: number;
    totalArtifacts: number;
    publishedShareUrl: string | null;
    error: ConversationShareDisplayError | null;
    warnings: ConversationShareDisplayWarnings | null;
    attempt: ConversationShareAttempt | null;
}
interface ConversationShareSelectionState {
    popoverOpen: boolean;
    drafts: Record<string, ConversationShareSelectionDraft>;
    dockStates: Record<string, ConversationShareDockState>;
    setPopoverOpen: (open: boolean) => void;
    setScope: (taskId: string, scope: ConversationShareScope) => void;
    setAccessMode: (taskId: string, accessMode: ConversationShareAccessMode) => void;
    syncAvailableRowIds: (taskId: string, rowIds: readonly number[]) => void;
    syncAvailableTurns: (taskId: string, turns: readonly {
        rowId: number;
        productTurnId: string;
    }[]) => void;
    toggleRow: (taskId: string, rowId: number) => void;
    /** 按 product turn 身份整轮取消选择（阻断项的「取消选择该轮」入口）。 */
    deselectProductTurn: (taskId: string, productTurnId: string) => void;
    setAllRowsSelected: (taskId: string, selected: boolean) => void;
    goToConfiguration: (taskId: string) => void;
    goToSelection: (taskId: string) => void;
    showTimeline: (taskId: string) => void;
    showSelectionPanel: (taskId: string) => void;
    finishSelection: (taskId: string) => void;
    updateDockState: (taskId: string, patch: Partial<ConversationShareDockState>) => void;
    resetForTests: () => void;
}
export declare const DEFAULT_CONVERSATION_SHARE_DOCK_STATE: ConversationShareDockState;
export declare function markConversationSharePopoverForSessionSwitch(): void;
export declare function consumeConversationSharePopoverSessionSwitch(): boolean;
export declare function getConversationShareDraft(state: Pick<ConversationShareSelectionState, "drafts">, taskId: string): ConversationShareSelectionDraft;
export declare function getConversationShareDockState(state: Pick<ConversationShareSelectionState, "dockStates">, taskId: string): ConversationShareDockState;
export declare function getConversationShareSelectedRowIds(state: Pick<ConversationShareSelectionState, "drafts">, taskId: string): number[];
export declare function getConversationShareSelectedProductTurnIds(state: Pick<ConversationShareSelectionState, "drafts">, taskId: string): string[];
export declare const useConversationShareSelectionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ConversationShareSelectionState>>;
export {};
//# sourceMappingURL=conversationShareSelectionStore.d.ts.map