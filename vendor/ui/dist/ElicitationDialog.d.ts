import type { ZCodeElicitationQuestion, ZCodeElicitationRequest } from "@zcode/shared";
import type { InteractionAutoResolution } from "@zcode/shared/zcode-protocol-v4";
import type { ElicitationFormDraft } from "@/store/zcodeSessionStoreTypes.js";
interface ElicitationDialogProps {
    request: ZCodeElicitationRequest;
    autoResolution?: InteractionAutoResolution;
    onRespond: (requestId: string, action: "accept" | "decline" | "cancel", content?: Record<string, unknown>) => void;
    /** 普通 AskUserQuestion 首次暂停来源；失败返回 false 后允许下一次操作重试。 */
    onFirstInteraction?: (source: ElicitationAutoResolutionSnoozeSource) => boolean | void | Promise<boolean | void>;
    initialFormDraft?: ElicitationFormDraft;
    onFormDraftChange?: (requestId: string, draft: ElicitationFormDraft) => void;
}
export type ElicitationAutoResolutionSnoozeSource = "panelHover" | "answer" | "navigation" | "countdown";
export declare function getElicitationCountdownSeconds(autoResolution: InteractionAutoResolution | undefined, now: number): number | null;
export interface NormalizedElicitationQuestion extends ZCodeElicitationQuestion {
    key: string;
}
export interface AnswerDraft {
    selectedValues: string[];
    customAnswer: string;
}
export type DraftState = Record<string, AnswerDraft>;
export type ElicitationCustomInputKeyAction = "advance" | "submit" | "previous" | "dismiss" | "previousOption" | "nextOption";
export declare function resolveElicitationCustomInputKeyAction(event: {
    key: string;
    advanceKind?: "next" | "submit";
    ctrlKey?: boolean;
    metaKey?: boolean;
    compositionActive?: boolean;
    isComposing?: boolean;
    nativeEvent?: {
        isComposing?: boolean;
    };
    isPlanApproval?: boolean;
    hasPreviousQuestion?: boolean;
}): ElicitationCustomInputKeyAction | null;
export declare function normalizeElicitationQuestions(request: ZCodeElicitationRequest): NormalizedElicitationQuestion[];
export declare function createInitialElicitationDrafts(questions: readonly NormalizedElicitationQuestion[], request: ZCodeElicitationRequest): DraftState;
export declare function buildElicitationResponseContent(questions: readonly NormalizedElicitationQuestion[], drafts: DraftState): Record<string, unknown>;
export declare function updateElicitationDraftsForOption(drafts: DraftState, question: NormalizedElicitationQuestion, optionValue: string): DraftState;
export declare function getElicitationQuestionAdvanceKind(questions: readonly NormalizedElicitationQuestion[], questionIndex: number): "next" | "submit";
export declare function ElicitationDialog(props: ElicitationDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ElicitationDialog.d.ts.map