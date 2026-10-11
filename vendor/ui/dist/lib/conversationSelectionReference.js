import { createUuid, CONVERSATION_SELECTION_MAX_TEXT_LENGTH, CONVERSATION_SELECTION_MAX_COUNT, CONVERSATION_SELECTION_MAX_TOTAL_LENGTH, } from "@zcode/shared";
export { buildPromptWithConversationSelections, CONVERSATION_SELECTION_MAX_TEXT_LENGTH, CONVERSATION_SELECTION_MAX_COUNT, CONVERSATION_SELECTION_MAX_TOTAL_LENGTH, } from "@zcode/shared";
const ADD_EVENT = "zcode:conversation-selection-add";
const USER_SELECT_BLOCK_PATTERN = /(?:\n\n)?# userselect:\n```userselect\n([\s\S]*?)\n```\s*$/;
const LEGACY_BLOCK_PATTERN = /(?:\n\n)?# Conversation selections:\n```zcode-conversation-selections\n([\s\S]*?)\n```\s*$/;
const referencesByScope = new Map();
const limitReasonByScope = new Map();
function referenceScopeKey(sessionId, workspaceKey) {
    return `${workspaceKey}\0${sessionId ?? "__draft__"}`;
}
export function getConversationSelectionReferenceScope(sessionId, workspaceKey) {
    return referencesByScope.get(referenceScopeKey(sessionId, workspaceKey)) ?? [];
}
export function setConversationSelectionReferenceScope(sessionId, workspaceKey, references) {
    const key = referenceScopeKey(sessionId, workspaceKey);
    if (references.length > 0)
        referencesByScope.set(key, references);
    else
        referencesByScope.delete(key);
    limitReasonByScope.delete(key);
}
export function getConversationSelectionReferenceLimitReason(sessionId, workspaceKey) {
    return limitReasonByScope.get(referenceScopeKey(sessionId, workspaceKey)) ?? null;
}
export function clearConversationSelectionReferenceScope(sessionId, workspaceKey) {
    referencesByScope.delete(referenceScopeKey(sessionId, workspaceKey));
    limitReasonByScope.delete(referenceScopeKey(sessionId, workspaceKey));
}
export function clearConversationSelectionReferenceLimitReason(sessionId, workspaceKey) {
    limitReasonByScope.delete(referenceScopeKey(sessionId, workspaceKey));
}
export function createConversationSelectionReference(input) {
    return { ...input, id: createUuid() };
}
export function getConversationSelectionDedupeKey(reference) {
    if (reference.contentType === "markdown") {
        return ["markdown", reference.sourceKey, reference.text].join("\0");
    }
    return [
        reference.sourceSessionId,
        reference.sourceRowId,
        reference.contentType,
        reference.text,
    ].join("\0");
}
export function appendConversationSelectionReference(current, reference) {
    if (reference.text.length > CONVERSATION_SELECTION_MAX_TEXT_LENGTH) {
        return { ok: false, reason: "single" };
    }
    const key = getConversationSelectionDedupeKey(reference);
    if (current.some((item) => getConversationSelectionDedupeKey(item) === key)) {
        return { ok: true, references: current, duplicate: true };
    }
    if (current.length >= CONVERSATION_SELECTION_MAX_COUNT) {
        return { ok: false, reason: "count" };
    }
    const totalLength = current.reduce((sum, item) => sum + item.text.length, 0);
    if (totalLength + reference.text.length > CONVERSATION_SELECTION_MAX_TOTAL_LENGTH) {
        return { ok: false, reason: "total" };
    }
    return { ok: true, references: [...current, reference], duplicate: false };
}
export function parsePromptConversationSelections(text) {
    const userSelectMatch = text.match(USER_SELECT_BLOCK_PATTERN);
    if (userSelectMatch) {
        return parseConversationSelectionBlock(text, userSelectMatch, (value) => {
            if (!isConversationSelectionText(value))
                return null;
            // 与发送合同一致，历史保留文件路径，普通对话继续只恢复正文。
            return value.path ? { path: value.path, text: value.text } : { text: value.text };
        });
    }
    const legacyMatch = text.match(LEGACY_BLOCK_PATTERN);
    if (!legacyMatch)
        return { visibleContent: text, references: [] };
    return parseConversationSelectionBlock(text, legacyMatch, (value) => isConversationSelectionReference(value) ? value : null);
}
function parseConversationSelectionBlock(text, match, parseItem) {
    try {
        const parsed = JSON.parse(match[1] ?? "[]");
        if (!Array.isArray(parsed))
            throw new Error("selection block is not an array");
        const references = [];
        for (const value of parsed) {
            const reference = parseItem(value);
            if (!reference)
                throw new Error("invalid selection reference");
            references.push(reference);
        }
        return {
            visibleContent: text.slice(0, match.index).trimEnd(),
            references,
        };
    }
    catch {
        return { visibleContent: text, references: [] };
    }
}
export function dispatchConversationSelectionAdd(detail) {
    const current = getConversationSelectionReferenceScope(detail.targetSessionId, detail.workspaceKey);
    const result = appendConversationSelectionReference(current, detail.reference);
    if (result.ok) {
        setConversationSelectionReferenceScope(detail.targetSessionId, detail.workspaceKey, result.references);
    }
    else {
        limitReasonByScope.set(referenceScopeKey(detail.targetSessionId, detail.workspaceKey), result.reason);
    }
    window.dispatchEvent(new CustomEvent(ADD_EVENT, { detail: { ...detail, result } }));
    return result;
}
export function isConversationSelectionAddEvent(event) {
    return event.type === ADD_EVENT && event instanceof CustomEvent;
}
export function getConversationSelectionAddEventName() {
    return ADD_EVENT;
}
function isConversationSelectionText(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return false;
    const candidate = value;
    return (typeof candidate.text === "string" &&
        (!("path" in value) ||
            (typeof candidate.path === "string" && candidate.path.trim().length > 0)) &&
        Object.keys(value).every((key) => key === "text" || key === "path"));
}
export function isConversationSelectionReference(value) {
    if (!value || typeof value !== "object")
        return false;
    const candidate = value;
    if (candidate.contentType === "markdown") {
        return (typeof candidate.id === "string" &&
            typeof candidate.text === "string" &&
            typeof candidate.sourceKey === "string" &&
            typeof candidate.sourceTitle === "string");
    }
    return (typeof candidate.id === "string" &&
        "sourceSessionId" in candidate &&
        typeof candidate.sourceSessionId === "string" &&
        "sourceRowId" in candidate &&
        typeof candidate.sourceRowId === "number" &&
        typeof candidate.text === "string" &&
        ["user", "assistant", "reasoning", "tool"].includes(candidate.contentType ?? ""));
}
//# sourceMappingURL=conversationSelectionReference.js.map