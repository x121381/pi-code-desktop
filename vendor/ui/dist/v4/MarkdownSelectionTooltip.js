import { jsx as _jsx } from "react/jsx-runtime";
import { SelectionActionMenu } from "@/v4/SelectionActionMenu.js";
import { buildSelectionSideChatKey, getSelectionSideChatOpenState, requestSelectionSideChatOpen, subscribeSelectionSideChatRuntime, } from "@/lib/selectionSideChatRuntime.js";
import { useCallback, useSyncExternalStore } from "react";
import { useTextSelection } from "@/hooks/useTextSelection.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { hasExcludedConversationSelectionEndpoint } from "@/lib/conversationSelectionGuard.js";
import { CONVERSATION_SELECTION_MAX_TEXT_LENGTH, dispatchConversationSelectionAdd, createConversationSelectionReference, } from "@/lib/conversationSelectionReference.js";
export function MarkdownSelectionTooltip({ rootRef, sourceKey, sourceTitle, sourcePath, target, scopeKey, }) {
    const { intl } = useZCodeIntl();
    const inspect = useCallback(() => {
        const root = rootRef.current;
        const selection = window.getSelection();
        if (!root || !selection || selection.isCollapsed || selection.rangeCount !== 1)
            return null;
        const range = selection.getRangeAt(0);
        if (!root.contains(range.startContainer) || !root.contains(range.endContainer))
            return null;
        const element = (node) => (node instanceof Element ? node : node.parentElement);
        if (hasExcludedConversationSelectionEndpoint(element(range.startContainer), element(range.endContainer)))
            return null;
        const text = selection.toString().trim();
        if (!text)
            return null;
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height)
            return null;
        return { text, top: rect.top, bottom: rect.bottom, center: rect.left + rect.width / 2 };
    }, [rootRef]);
    const { state, close } = useTextSelection({
        rootRef,
        enabled: true,
        inspect,
        scopeKey,
        observeSelectionChange: true,
    });
    const sideKey = target.sessionId
        ? buildSelectionSideChatKey(target.workspaceKey, target.sessionId)
        : null;
    const sideState = useSyncExternalStore(subscribeSelectionSideChatRuntime, () => (sideKey ? getSelectionSideChatOpenState(sideKey) : "unavailable"), () => "unavailable");
    if (!state)
        return null;
    const createReference = () => createConversationSelectionReference({
        contentType: "markdown",
        sourceKey,
        sourceTitle,
        path: sourcePath,
        text: state.text,
    });
    return (_jsx(SelectionActionMenu, { center: state.center, top: state.top, bottom: state.bottom, singleLimit: state.text.length > CONVERSATION_SELECTION_MAX_TEXT_LENGTH, sideActionDisabled: sideState !== "ready", sideDisabledTitle: sideState === "ready"
            ? undefined
            : intl.formatMessage({
                id: sideState === "blocked"
                    ? "chat.selections.previewSideBlocked"
                    : "chat.selections.previewSideUnavailable",
            }), onAddToCurrentTask: () => {
            dispatchConversationSelectionAdd({
                targetSessionId: target.sessionId,
                workspaceKey: target.workspaceKey,
                reference: createReference(),
            });
            close();
        }, onAskInSideChat: () => {
            if (sideKey && requestSelectionSideChatOpen(sideKey, createReference()))
                close();
        } }));
}
//# sourceMappingURL=MarkdownSelectionTooltip.js.map