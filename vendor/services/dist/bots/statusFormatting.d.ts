import { type ZCodeSessionFile, type ZCodeStreamEvent, type ZCodeTaskMeta } from "@zcode/shared";
export declare function taskStatus(task: ZCodeTaskMeta): string;
export declare function formatTaskRunningDuration(durationMs: number): string;
export declare function formatStatusTaskLine(task: ZCodeTaskMeta, label?: string): string;
export declare function readTaskWorkedDurationMs(snapshot: ZCodeSessionFile | null, task: ZCodeTaskMeta): number | null;
export declare function readLatestAssistantTurnChangeSummary(snapshot: ZCodeSessionFile | null): ZCodeTaskMeta["changeSummary"] | null;
export declare function normalizeStatusProgressText(value: string): string;
export declare function truncateLiveStatusProgressText(value: string, maxLength?: number): string;
export declare function formatStatusStreamToolProgress(event: Extract<ZCodeStreamEvent, {
    type: "tool_call" | "tool_call_update";
}>): string | null;
export declare function readLatestTaskProgress(snapshot: ZCodeSessionFile | null): string | null;
//# sourceMappingURL=statusFormatting.d.ts.map