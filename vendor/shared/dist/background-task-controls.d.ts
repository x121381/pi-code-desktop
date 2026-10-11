export type ZCodeBackgroundTaskControlStatus = "pending" | "running" | "completed" | "failed" | "killed" | "lost";
export interface ZCodeBackgroundTaskControlItem {
    jobId: string;
    toolCallId?: string;
    command: string;
    taskKind: "agent" | "bash";
    cancellable?: boolean;
    title?: string;
    status: ZCodeBackgroundTaskControlStatus;
    startedAt?: number;
    elapsedMs?: number;
    pid?: number;
    stdoutTail?: string;
    stderrTail?: string;
    outputTail?: string;
    raw?: unknown;
}
type BackgroundTaskControlKind = ZCodeBackgroundTaskControlItem["taskKind"];
/**
 * 旧 background task 事件的唯一 kind 兼容入口。
 * 新协议应直接携带 taskKind；只有历史记录缺字段时才从工具名/类型别名恢复。
 */
export declare function resolveZCodeBackgroundTaskControlKind(value: unknown): BackgroundTaskControlKind | undefined;
export declare function parseZCodeBackgroundTaskControlItems(value: unknown): ZCodeBackgroundTaskControlItem[];
export declare function isActiveZCodeBackgroundTaskControlItem(job: ZCodeBackgroundTaskControlItem): boolean;
export declare function getZCodeBackgroundTaskControlItemElapsedMs(job: ZCodeBackgroundTaskControlItem, now?: number): number;
export declare function collectVisibleZCodeBackgroundTaskControlItems(jobs: readonly ZCodeBackgroundTaskControlItem[], now?: number, thresholdMs?: number): Array<ZCodeBackgroundTaskControlItem & {
    elapsedMs: number;
}>;
export {};
//# sourceMappingURL=background-task-controls.d.ts.map