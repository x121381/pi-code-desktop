import { useCallback, useEffect, useState } from "react";
import { clearConversationSelectionReferenceLimitReason, getConversationSelectionReferenceScope, getConversationSelectionReferenceLimitReason, getConversationSelectionAddEventName, isConversationSelectionAddEvent, setConversationSelectionReferenceScope, } from "../../lib/conversationSelectionReference.js";
export function useConversationSelectionReferences(options) {
    const [references, setReferencesState] = useState(() => getConversationSelectionReferenceScope(options.sessionId, options.workspaceKey));
    const [limitReason, setLimitReason] = useState(() => getConversationSelectionReferenceLimitReason(options.sessionId, options.workspaceKey));
    useEffect(() => {
        setReferencesState(getConversationSelectionReferenceScope(options.sessionId, options.workspaceKey));
        setLimitReason(getConversationSelectionReferenceLimitReason(options.sessionId, options.workspaceKey));
    }, [options.sessionId, options.workspaceKey]);
    const setReferences = useCallback((update) => {
        setReferencesState((current) => {
            const next = typeof update === "function" ? update(current) : update;
            setConversationSelectionReferenceScope(options.sessionId, options.workspaceKey, next);
            return next;
        });
    }, [options.sessionId, options.workspaceKey]);
    useEffect(() => {
        const handleAdd = (event) => {
            if (!isConversationSelectionAddEvent(event))
                return;
            if (event.detail.targetSessionId !== options.sessionId ||
                event.detail.workspaceKey !== options.workspaceKey) {
                return;
            }
            setReferencesState(getConversationSelectionReferenceScope(options.sessionId, options.workspaceKey));
            setLimitReason(getConversationSelectionReferenceLimitReason(options.sessionId, options.workspaceKey));
        };
        window.addEventListener(getConversationSelectionAddEventName(), handleAdd);
        return () => window.removeEventListener(getConversationSelectionAddEventName(), handleAdd);
    }, [options.sessionId, options.workspaceKey]);
    const removeReference = useCallback((id) => {
        setReferences((current) => current.filter((reference) => reference.id !== id));
        setLimitReason(null);
    }, [setReferences]);
    const clearReferences = useCallback(() => {
        setReferences([]);
        setLimitReason(null);
    }, [setReferences]);
    const dismissLimitReason = useCallback(() => {
        clearConversationSelectionReferenceLimitReason(options.sessionId, options.workspaceKey);
        setLimitReason(null);
    }, [options.sessionId, options.workspaceKey]);
    return {
        references,
        limitReason,
        dismissLimitReason,
        removeReference,
        clearReferences,
    };
}
//# sourceMappingURL=useConversationSelectionReferences.js.map