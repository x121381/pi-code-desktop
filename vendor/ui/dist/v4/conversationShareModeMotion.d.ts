export declare const CONVERSATION_SHARE_MODE_PANEL_OFFSET_PX = 8;
export declare const CONVERSATION_SHARE_MODE_TRANSITION_DURATION_SECONDS = 0.2;
export declare const CONVERSATION_SHARE_MODE_EASING: readonly [0.4, 0, 0.2, 1];
export declare function resolveConversationShareSelectionPanelMotion(prefersReducedMotion: boolean): {
    initial: false;
    animate: {
        opacity: number;
        transform: string;
    };
    exit: {
        opacity: number;
        transform: string;
    };
    transition: {
        duration: number;
        ease?: undefined;
    };
} | {
    initial: {
        opacity: number;
        transform: string;
    };
    animate: {
        opacity: number;
        transform: string;
    };
    exit: {
        opacity: number;
        transform: string;
    };
    transition: {
        duration: number;
        ease: readonly [0.4, 0, 0.2, 1];
    };
};
export declare function resolveConversationShareSelectionScrimMotion(prefersReducedMotion: boolean): {
    initial: false;
    animate: {
        opacity: number;
    };
    exit: {
        opacity: number;
    };
    transition: {
        duration: number;
        ease?: undefined;
    };
} | {
    initial: {
        opacity: number;
    };
    animate: {
        opacity: number;
    };
    exit: {
        opacity: number;
    };
    transition: {
        duration: number;
        ease: readonly [0.4, 0, 0.2, 1];
    };
};
//# sourceMappingURL=conversationShareModeMotion.d.ts.map