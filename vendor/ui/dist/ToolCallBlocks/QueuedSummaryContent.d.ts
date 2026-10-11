import { type ReactNode } from "react";
export declare const SUMMARY_ROLL_TRANSITION_MS = 300;
export declare const SUMMARY_ROLL_HOLD_MS = 500;
export declare const SUMMARY_ROLL_TOTAL_MS: number;
export declare function resolveQueuedSummaryPlaybackQueue<T>(queuedContent: readonly T[], timerDriftMs: number): T[];
export declare function shouldAnimateQueuedSummaryContent({ enabled, disableAnimation, reducedMotion, }: {
    enabled: boolean;
    disableAnimation?: boolean;
    reducedMotion: boolean;
}): boolean;
interface SummaryContentSnapshot {
    key: string;
    refreshVersion?: string;
    primaryText: ReactNode;
    secondaryText?: ReactNode;
    trailingText?: ReactNode;
}
export declare function shouldRefreshQueuedSummaryContent(current: Pick<SummaryContentSnapshot, "key" | "refreshVersion" | "trailingText">, next: Pick<SummaryContentSnapshot, "key" | "refreshVersion" | "trailingText">): boolean;
export declare function QueuedSummaryContent({ contentKey, contentRefreshVersion, primaryText, secondaryText, trailingText, enabled, disableAnimation, }: {
    contentKey: string;
    contentRefreshVersion?: string;
    primaryText: ReactNode;
    secondaryText?: ReactNode;
    trailingText?: ReactNode;
    enabled: boolean;
    disableAnimation?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=QueuedSummaryContent.d.ts.map