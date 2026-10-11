import type { ZCodeTaskPendingInteraction } from "@zcode/shared";
interface TaskInteractionBadgeProps {
    interaction?: ZCodeTaskPendingInteraction;
    legacyPending?: boolean;
    className?: string;
    /** fake-clock / SSR 注入；生产缺省使用当前绝对时间。 */
    now?: number;
    formatMessage: (id: string) => string;
    onSnoozeCountdown?: (interactionId: string) => boolean | Promise<boolean>;
}
export interface TaskInteractionBadgePresentation {
    kind: "permission" | "userInput";
    countdownProgress?: number;
    canSnooze: boolean;
}
export declare function isAskUserQuestionInteraction(interaction: ZCodeTaskPendingInteraction | undefined): boolean;
export declare function getTaskInteractionBadgePresentation(interaction: ZCodeTaskPendingInteraction | undefined, legacyPending: boolean, now: number): TaskInteractionBadgePresentation | null;
/** 普通、timeline、grouped task row 共用的阻塞交互胶囊。 */
export declare function TaskInteractionBadge({ interaction, legacyPending, className, now: injectedNow, formatMessage, onSnoozeCountdown, }: TaskInteractionBadgeProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=TaskInteractionBadge.d.ts.map