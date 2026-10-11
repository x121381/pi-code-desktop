export function isConversationReasoningRowVisible(rowId, visibility) {
    return (visibility.messageStreamShowReasoning === true ||
        visibility.messageStreamFirstReasoningRowId === rowId);
}
//# sourceMappingURL=conversationRowContext.js.map