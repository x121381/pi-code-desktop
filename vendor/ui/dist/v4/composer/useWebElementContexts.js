import { useCallback, useEffect, useMemo, useState } from "react";
import { WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT, WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT, createWebElementContextId, getWebElementContextWorkspaceKey, isWebElementContextAddToChatEvent, isWebElementContextPayload, isWebElementContextRemoveFromChatEvent, } from "@/lib/webElementContext.js";
function isRemovePayload(payload) {
    const candidate = payload;
    return (typeof payload === "object" &&
        payload !== null &&
        typeof candidate.id === "string" &&
        candidate.id.length > 0 &&
        typeof candidate.workspacePath === "string" &&
        candidate.workspacePath.length > 0 &&
        (candidate.workspaceIdentity === undefined || typeof candidate.workspaceIdentity === "string"));
}
function toComposerAttachment(payload) {
    if (!isWebElementContextPayload(payload)) {
        return null;
    }
    return {
        ...payload,
        id: payload.id ?? createWebElementContextId(),
    };
}
export function useWebElementContexts({ workspacePath, workspaceIdentity, listenAddToChatEvents = true, scopeId = null, }) {
    const [contexts, setContexts] = useState([]);
    const workspaceKey = getWebElementContextWorkspaceKey(workspacePath, workspaceIdentity);
    useEffect(() => {
        setContexts([]);
    }, [scopeId, workspaceKey]);
    const removeContext = useCallback((id) => {
        setContexts((items) => items.filter((item) => item.id !== id));
    }, []);
    const clearContexts = useCallback(() => {
        setContexts([]);
    }, []);
    useEffect(() => {
        if (!listenAddToChatEvents || typeof window === "undefined") {
            return;
        }
        const handleAdd = (event) => {
            if (!isWebElementContextAddToChatEvent(event)) {
                return;
            }
            const attachment = toComposerAttachment(event.detail);
            if (!attachment) {
                return;
            }
            const eventWorkspaceKey = getWebElementContextWorkspaceKey(attachment.workspacePath, attachment.workspaceIdentity);
            if (eventWorkspaceKey !== workspaceKey) {
                return;
            }
            event.preventDefault();
            setContexts((items) => {
                const existingIndex = items.findIndex((item) => item.id === attachment.id);
                if (existingIndex < 0) {
                    return [...items, attachment];
                }
                return items.map((item) => (item.id === attachment.id ? attachment : item));
            });
        };
        const handleRemove = (event) => {
            if (!isWebElementContextRemoveFromChatEvent(event)) {
                return;
            }
            if (!isRemovePayload(event.detail)) {
                return;
            }
            const eventWorkspaceKey = getWebElementContextWorkspaceKey(event.detail.workspacePath, event.detail.workspaceIdentity);
            if (eventWorkspaceKey !== workspaceKey) {
                return;
            }
            event.preventDefault();
            removeContext(event.detail.id);
        };
        window.addEventListener(WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT, handleAdd);
        window.addEventListener(WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT, handleRemove);
        return () => {
            window.removeEventListener(WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT, handleAdd);
            window.removeEventListener(WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT, handleRemove);
        };
    }, [listenAddToChatEvents, removeContext, workspaceKey]);
    return useMemo(() => ({
        contexts,
        hasContexts: contexts.length > 0,
        removeContext,
        clearContexts,
    }), [clearContexts, contexts, removeContext]);
}
//# sourceMappingURL=useWebElementContexts.js.map