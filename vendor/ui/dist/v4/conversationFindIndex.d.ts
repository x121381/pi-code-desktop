import type { ChatSearchResultHighlightRequest } from "@/v4/legacyChatViewTypes.js";
import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
export type ConversationFindRowKind = "userInput" | "assistantText";
export interface ConversationFindMatch {
    globalIndex: number;
    unitIndex: number;
    rowId: number;
    rowKind: ConversationFindRowKind;
    rowMatchIndex: number;
    start: number;
    end: number;
    sourceText: string;
}
export interface ConversationFindIndex {
    query: string;
    matches: ConversationFindMatch[];
    matchCount: number;
    loadedRowCount: number;
}
export interface ConversationFindMatchKey {
    rowId: number;
    rowKind: ConversationFindRowKind;
    rowMatchIndex: number;
}
export declare function normalizeConversationFindQuery(query: string): string;
export declare function buildConversationFindIndex(units: readonly ConversationTurnRenderUnit[], query: string, options?: {
    projectAssistantCodeComments?: boolean;
}): ConversationFindIndex;
export declare function getConversationFindMatchKey(match: ConversationFindMatch | null | undefined): ConversationFindMatchKey | null;
export declare function findConversationMatchIndexByKey(index: ConversationFindIndex, key: ConversationFindMatchKey | null | undefined): number;
export declare function resolveConversationFindActiveIndex(index: ConversationFindIndex, preferredIndex: number): number;
export declare function resolveConversationFindActiveMatch(index: ConversationFindIndex, preferredIndex: number): ConversationFindMatch | null;
export declare function resolveSearchResultHighlightMatch(index: ConversationFindIndex, request: ChatSearchResultHighlightRequest): ConversationFindMatch | null;
//# sourceMappingURL=conversationFindIndex.d.ts.map