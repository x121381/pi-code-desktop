import type { ZCodeSessionGoal } from "./zcode-protocol/index.js";
import { type ZCodeMessageWithParts } from "./zcode-protocol-legacy-types.js";
export declare function isZCodeGoalContinuationReminderText(text: string): boolean;
export declare function isZCodeGoalContinuationReminderMessage(message: ZCodeMessageWithParts): boolean;
export declare function isZCodeGoalStateReminderText(text: string): boolean;
export declare function isZCodeGoalModelOnlyReminderMessage(message: ZCodeMessageWithParts): boolean;
export declare function isZCodeModelOnlySyntheticUserMessage(message: ZCodeMessageWithParts): boolean;
export declare function isZCodeCompactSummaryMessage(message: ZCodeMessageWithParts): boolean;
export declare function getZCodeUserVisibleMessages(messages: readonly ZCodeMessageWithParts[], _options?: {
    target?: ZCodeSessionGoal | null;
}): ZCodeMessageWithParts[];
export declare function getZCodeGoalIterationByAssistantMessageId(messages: readonly ZCodeMessageWithParts[], options?: {
    maxGoalIteration?: number;
    target?: ZCodeSessionGoal | null;
}): Map<string, number>;
export interface ZCodeGoalIterationCountTimelineItem {
    goalIteration?: number;
    status: "started" | "completed" | "failed_closed" | "cancelled";
    verification?: {
        passed?: boolean | null;
    } | null;
}
export declare function getZCodeGoalActiveIterationCount(input: {
    targetStatus?: string | null;
    timeline?: readonly ZCodeGoalIterationCountTimelineItem[] | null;
}): number;
export declare function resolveZCodeVisibleSessionTitle(input: {
    title?: string;
    messages: readonly ZCodeMessageWithParts[];
    target?: ZCodeSessionGoal | null;
    fallback?: string;
}): string;
//# sourceMappingURL=zcode-session-visible-content.d.ts.map