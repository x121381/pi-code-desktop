import type { ConversationFindMatch } from "@/v4/conversationFindIndex.js";
export declare const FIND_HIGHLIGHT_NAME = "zcode-v4-conversation-find";
export declare const ACTIVE_FIND_HIGHLIGHT_NAME = "zcode-v4-conversation-find-active";
export declare const SEARCH_RESULT_HIGHLIGHT_NAME = "zcode-v4-conversation-search-result";
export declare function ensureConversationFindHighlightStyle(): void;
export declare function getMountedConversationFindRange(root: HTMLElement, query: string, match: ConversationFindMatch): Range | null;
export declare function applyConversationFindHighlights({ root, query, matches, activeMatch, }: {
    root: HTMLElement;
    query: string;
    matches: readonly ConversationFindMatch[];
    activeMatch: ConversationFindMatch | null;
}): Range | null;
export declare function applySearchResultHighlight({ root, query, match, }: {
    root: HTMLElement;
    query: string;
    match: ConversationFindMatch;
}): Range | null;
export declare function scrollConversationFindRangeIntoView(range: Range): void;
export declare function clearConversationFindHighlights(): void;
export declare function clearSearchResultHighlight(): void;
//# sourceMappingURL=conversationFindHighlightDom.d.ts.map