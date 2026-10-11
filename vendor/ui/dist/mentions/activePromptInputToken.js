import { extractActivePromptInputTrigger, } from "@/lib/promptInputTriggers.js";
function isCaretInsideToken(snapshot, cursorOffset) {
    return cursorOffset >= snapshot.tokenStart + 1 && cursorOffset <= snapshot.tokenEnd;
}
export function createActivePromptInputTokenSnapshot(selection) {
    const activeTrigger = extractActivePromptInputTrigger(selection.textBeforeCursor);
    if (!activeTrigger) {
        return null;
    }
    const tokenStart = selection.cursorOffset - activeTrigger.query.length - 1;
    const tokenEnd = selection.cursorOffset;
    return {
        ...activeTrigger,
        nodeKey: selection.nodeKey,
        tokenEnd,
        tokenStart,
        tokenText: selection.text.slice(tokenStart, tokenEnd),
    };
}
export function reconcileActivePromptInputTokenSnapshot(previous, selection, selectionOnly) {
    if (!selectionOnly || !previous) {
        return createActivePromptInputTokenSnapshot(selection);
    }
    if (previous.nodeKey !== selection.nodeKey) {
        return null;
    }
    const currentTokenText = selection.text.slice(previous.tokenStart, previous.tokenEnd);
    if (currentTokenText !== previous.tokenText) {
        return createActivePromptInputTokenSnapshot(selection);
    }
    if (!isCaretInsideToken(previous, selection.cursorOffset)) {
        return null;
    }
    // ArrowLeft/ArrowRight 只改变 selection，token 文本并未改变。
    // 若仍按光标前缀重算 query，会反复过滤候选、重置 selectedIndex 并重建虚拟列表。
    return previous;
}
export function getActivePromptInputTokenReplacementRange(snapshot, selection) {
    if (!snapshot ||
        snapshot.nodeKey !== selection.nodeKey ||
        !isCaretInsideToken(snapshot, selection.cursorOffset) ||
        selection.text.slice(snapshot.tokenStart, snapshot.tokenEnd) !== snapshot.tokenText) {
        return null;
    }
    return { end: snapshot.tokenEnd, start: snapshot.tokenStart };
}
//# sourceMappingURL=activePromptInputToken.js.map