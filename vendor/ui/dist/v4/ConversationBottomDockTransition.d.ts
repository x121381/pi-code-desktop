import type { ReactNode } from "react";
export declare const CONVERSATION_BOTTOM_DOCK_TRANSITION_OFFSET_PX = 32;
export declare const CONVERSATION_BOTTOM_DOCK_ENTER_SCALE = 0.96;
export declare const CONVERSATION_BOTTOM_DOCK_EXIT_SCALE = 0.97;
export declare const CONVERSATION_BOTTOM_DOCK_ENTER_DURATION_SECONDS = 0.26;
export declare const CONVERSATION_BOTTOM_DOCK_EXIT_DURATION_SECONDS = 0.18;
export declare const CONVERSATION_BOTTOM_DOCK_TRANSITION_EASING: readonly [0.23, 1, 0.32, 1];
export declare function resolveConversationBottomDockMotion(prefersReducedMotion: boolean): {
    initial: false;
    animate: {
        opacity: number;
        transform: string;
        transition: {
            duration: number;
            ease?: undefined;
        };
    };
    exit: {
        opacity: number;
        transform: string;
        transition: {
            duration: number;
            ease?: undefined;
        };
    };
} | {
    initial: {
        opacity: number;
        transform: string;
    };
    animate: {
        opacity: number;
        transform: string;
        transition: {
            duration: number;
            ease: readonly [0.23, 1, 0.32, 1];
        };
    };
    exit: {
        opacity: number;
        transform: string;
        transition: {
            duration: number;
            ease: readonly [0.23, 1, 0.32, 1];
        };
    };
};
export declare function ConversationBottomDockTransition({ mode, children, }: {
    mode: "chat" | "confirmation";
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationBottomDockTransition.d.ts.map