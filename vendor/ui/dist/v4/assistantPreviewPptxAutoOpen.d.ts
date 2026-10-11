import type { ConversationRow, SessionPhase } from "@zcode/shared/zcode-protocol-v4";
export interface AssistantPreviewPptxCompletedTurn {
    turnId: string;
    rowId: number;
    entityId?: string;
}
export interface AssistantPreviewPptxAutoOpenTarget {
    turnId: string;
    key: string;
}
export interface AssistantPreviewPptxAutoOpenGateState {
    scopeKey: string;
    armed: boolean;
}
interface AssistantPreviewPptxAutoOpenGateInput {
    enabled: boolean;
    scopeKey: string;
    logEpoch?: string;
    phase?: SessionPhase;
    completedTurn: AssistantPreviewPptxCompletedTurn | null;
}
export interface AssistantPreviewPptxAutoOpenGateResult {
    state: AssistantPreviewPptxAutoOpenGateState;
    /** undefined=保持当前 target；null=清空；object=发布新的完成态 target。 */
    target?: AssistantPreviewPptxAutoOpenTarget | null;
}
export declare function createAssistantPreviewPptxAutoOpenGateState(): AssistantPreviewPptxAutoOpenGateState;
export declare function resolveLatestCompletedAssistantPreviewTurn(rows: readonly ConversationRow[]): AssistantPreviewPptxCompletedTurn | null;
export declare function advanceAssistantPreviewPptxAutoOpenGate(previous: AssistantPreviewPptxAutoOpenGateState, input: AssistantPreviewPptxAutoOpenGateInput): AssistantPreviewPptxAutoOpenGateResult;
export {};
//# sourceMappingURL=assistantPreviewPptxAutoOpen.d.ts.map