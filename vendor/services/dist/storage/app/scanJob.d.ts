/**
 * 单次扫描 job：持有 AbortController，把 runner 的进度节流成 ≥ throttleMs 一次的快照事件，
 * 终态（complete / cancelled / failed）必发。状态只能 scanning → 终态。
 */
import type { StorageRootSpec, StorageUsageSnapshot } from "@zcode/shared";
import type { ScanRunnerPort } from "./ports.js";
export interface ScanJob {
    readonly jobId: string;
    readonly done: Promise<StorageUsageSnapshot>;
    cancel(): void;
}
export declare function isAbortError(error: unknown): boolean;
export declare function createScanJob(params: {
    jobId: string;
    roots: StorageRootSpec[];
    runner: ScanRunnerPort;
    now: () => number;
    throttleMs: number;
    emit: (snapshot: StorageUsageSnapshot) => void;
    setTimer?: (callback: () => void, delayMs: number) => unknown;
    clearTimer?: (handle: unknown) => void;
}): ScanJob;
//# sourceMappingURL=scanJob.d.ts.map