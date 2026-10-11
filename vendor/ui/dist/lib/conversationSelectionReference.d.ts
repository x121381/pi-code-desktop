import { type ConversationSelectionText } from "@zcode/shared";
export { buildPromptWithConversationSelections, CONVERSATION_SELECTION_MAX_TEXT_LENGTH, CONVERSATION_SELECTION_MAX_COUNT, CONVERSATION_SELECTION_MAX_TOTAL_LENGTH, type ConversationSelectionText, } from "@zcode/shared";
export type ConversationSelectionContentType = "user" | "assistant" | "reasoning" | "tool";
export interface MessageSelectionReference extends ConversationSelectionText {
    id: string;
    sourceSessionId: string;
    sourceRowId: number;
    contentType: ConversationSelectionContentType;
}
export interface MarkdownSelectionReference extends ConversationSelectionText {
    id: string;
    contentType: "markdown";
    sourceKey: string;
    sourceTitle: string;
}
export type ConversationSelectionReference = MessageSelectionReference | MarkdownSelectionReference;
export interface MarkdownSelectionTarget {
    sessionId: string | null;
    workspaceKey: string;
}
export type ConversationSelectionDisplayReference = ConversationSelectionText | ConversationSelectionReference;
interface ConversationSelectionAddEventDetail {
    targetSessionId: string | null;
    workspaceKey: string;
    reference: ConversationSelectionReference;
    result?: ConversationSelectionAppendResult;
}
export type ConversationSelectionLimitReason = "count" | "single" | "total";
export type ConversationSelectionAppendResult = {
    ok: true;
    references: readonly ConversationSelectionReference[];
    duplicate: boolean;
} | {
    ok: false;
    reason: ConversationSelectionLimitReason;
};
export declare function getConversationSelectionReferenceScope(sessionId: string | null, workspaceKey: string): readonly ConversationSelectionReference[];
export declare function setConversationSelectionReferenceScope(sessionId: string | null, workspaceKey: string, references: readonly ConversationSelectionReference[]): void;
export declare function getConversationSelectionReferenceLimitReason(sessionId: string | null, workspaceKey: string): ConversationSelectionLimitReason | null;
export declare function clearConversationSelectionReferenceScope(sessionId: string, workspaceKey: string): void;
export declare function clearConversationSelectionReferenceLimitReason(sessionId: string | null, workspaceKey: string): void;
export declare function createConversationSelectionReference(input: Omit<MessageSelectionReference, "id"> | Omit<MarkdownSelectionReference, "id">): ConversationSelectionReference;
export declare function getConversationSelectionDedupeKey(reference: ConversationSelectionReference): string;
export declare function appendConversationSelectionReference(current: readonly ConversationSelectionReference[], reference: ConversationSelectionReference): ConversationSelectionAppendResult;
export declare function parsePromptConversationSelections(text: string): {
    visibleContent: string;
    references: readonly ConversationSelectionDisplayReference[];
};
export declare function dispatchConversationSelectionAdd(detail: Omit<ConversationSelectionAddEventDetail, "result">): ConversationSelectionAppendResult;
export declare function isConversationSelectionAddEvent(event: Event): event is CustomEvent<ConversationSelectionAddEventDetail>;
export declare function getConversationSelectionAddEventName(): string;
export declare function isConversationSelectionReference(value: unknown): value is ConversationSelectionReference;
//# sourceMappingURL=conversationSelectionReference.d.ts.map