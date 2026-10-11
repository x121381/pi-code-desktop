import { type ZCodeBackgroundTaskControlItem, type ZCodeBackgroundTaskControlStatus } from "./background-task-controls.js";
export type ZCodeBackgroundBashJobStatus = ZCodeBackgroundTaskControlStatus;
export type ZCodeBackgroundBashJob = ZCodeBackgroundTaskControlItem & {
    taskKind: "bash";
};
export declare function parseZCodeBackgroundBashJobs(value: unknown): ZCodeBackgroundBashJob[];
export declare function isActiveZCodeBackgroundBashJob(job: ZCodeBackgroundBashJob): boolean;
export declare function getZCodeBackgroundBashJobElapsedMs(job: ZCodeBackgroundBashJob, now?: number): number;
export declare function collectVisibleZCodeBackgroundBashJobs(jobs: readonly ZCodeBackgroundBashJob[], now?: number, thresholdMs?: number): Array<ZCodeBackgroundBashJob & {
    elapsedMs: number;
}>;
//# sourceMappingURL=background-bash-jobs.d.ts.map