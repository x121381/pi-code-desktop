const LOCAL_CONVERSATION_COMMAND_RE = /^\/(new|clear)\s*$/iu;
export function parseLocalConversationCommand(text) {
    const matched = LOCAL_CONVERSATION_COMMAND_RE.exec(text.trim());
    if (!matched?.[1]) {
        return null;
    }
    return matched[1].toLowerCase();
}
//# sourceMappingURL=localConversationCommands.js.map