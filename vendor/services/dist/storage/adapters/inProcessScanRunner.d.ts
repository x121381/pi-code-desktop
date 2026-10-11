/**
 * 进程内扫描 runner：walker + domain 累加器 + 卷探测。
 * Worker 入口（desktop main）与单测都调用这里的 runStorageScan，保证只有一条扫描路径。
 */
import type { StorageScanProgress, VolumeProbePort } from "../app/ports.js";
import type { StorageRootSpec } from "@zcode/shared";
export interface RunStorageScanOptions {
    roots: StorageRootSpec[];
    signal: AbortSignal;
    onProgress: (progress: StorageScanProgress) => void;
    volumeProbe?: VolumeProbePort;
    /** 上报进度的最小间隔；runner 自己也节流，避免 Worker 向主线程刷消息。默认 300ms。 */
    progressIntervalMs?: number;
    concurrency?: number;
    now?: () => number;
}
export declare function runStorageScan(options: RunStorageScanOptions): Promise<StorageScanProgress>;
//# sourceMappingURL=inProcessScanRunner.d.ts.map