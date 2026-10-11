import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../components/lib/utils.js";
import { resolveConversationShareSelectionScrimMotion } from "../v4/conversationShareModeMotion.js";
export function ConversationShareSelectionScrim({ visible, interactive = false, onBackdropClick, }) {
    const prefersReducedMotion = useReducedMotion() === true;
    const motionConfig = resolveConversationShareSelectionScrimMotion(prefersReducedMotion);
    return (_jsx(AnimatePresence, { initial: false, children: visible ? (_jsx(motion.div, { "data-testid": "conversation-share-selection-scrim", "data-conversation-share-mode-motion": "scrim", "data-conversation-share-backdrop-interactive": interactive ? "true" : "false", className: cn("absolute inset-0 z-10 bg-background/60", interactive ? "pointer-events-auto" : "pointer-events-none"), onClick: interactive ? onBackdropClick : undefined, initial: motionConfig.initial, animate: motionConfig.animate, exit: motionConfig.exit, transition: motionConfig.transition }, "conversation-share-selection-scrim")) : null }));
}
//# sourceMappingURL=ConversationShareSelectionScrim.js.map