interface ConversationFindState {
    currentIndex: number;
    total: number;
}
type ConversationFindDirection = "previous" | "next";
export declare function resolveConversationFindNavigationDirection(key: string, shiftKey: boolean): ConversationFindDirection | null;
export declare function getConversationFindState(total: number, preferredIndex: number): ConversationFindState;
export declare function moveConversationFindSelection(state: ConversationFindState, direction: ConversationFindDirection): number;
export declare function resolveConversationFindNavigationSelection(query: string, state: ConversationFindState, direction: ConversationFindDirection): {
    activeIndex: number;
    query: string;
};
export {};
//# sourceMappingURL=conversationFindSearch.d.ts.map