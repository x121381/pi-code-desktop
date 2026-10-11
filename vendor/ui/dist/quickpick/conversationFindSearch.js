export function resolveConversationFindNavigationDirection(key, shiftKey) {
    if (key === "ArrowUp") {
        return "previous";
    }
    if (key === "ArrowDown") {
        return "next";
    }
    if (key === "Enter") {
        return shiftKey ? "previous" : "next";
    }
    return null;
}
export function getConversationFindState(total, preferredIndex) {
    if (total <= 0) {
        return { currentIndex: -1, total: 0 };
    }
    return {
        currentIndex: preferredIndex >= 0 && preferredIndex < total ? preferredIndex : 0,
        total,
    };
}
export function moveConversationFindSelection(state, direction) {
    if (state.total <= 0 || state.currentIndex < 0) {
        return -1;
    }
    const delta = direction === "next" ? 1 : -1;
    return (state.currentIndex + delta + state.total) % state.total;
}
export function resolveConversationFindNavigationSelection(query, state, direction) {
    return {
        activeIndex: moveConversationFindSelection(state, direction),
        query,
    };
}
//# sourceMappingURL=conversationFindSearch.js.map