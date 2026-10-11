import { useEffect } from "react";
const LEFT_NAVIGATION_SELECTOR = '[data-conversation-share-left-navigation="true"]';
function eventComesFromConversationShareLeftNavigation(event) {
    return event
        .composedPath()
        .some((target) => target instanceof Element && target.closest(LEFT_NAVIGATION_SELECTOR) !== null);
}
export function useConversationShareSelectionOutsideDismiss({ enabled, onDismiss, }) {
    useEffect(() => {
        if (!enabled)
            return;
        const handlePointerDown = (event) => {
            if (!eventComesFromConversationShareLeftNavigation(event))
                onDismiss();
        };
        document.addEventListener("pointerdown", handlePointerDown, true);
        return () => document.removeEventListener("pointerdown", handlePointerDown, true);
    }, [enabled, onDismiss]);
}
//# sourceMappingURL=useConversationShareSelectionOutsideDismiss.js.map