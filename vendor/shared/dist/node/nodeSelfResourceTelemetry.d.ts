/**
 * host 与 scheduler 两个 utilityProcess 自采 CPU / 内存的共用换算逻辑
 *
 * 只做差分换算：不持有定时器、也不负责发送。host 复用内存诊断日志既有的 60 秒定时器，
 * scheduler 自己起唯一的一个 unref 定时器，两边都把同一次 `process.memoryUsage()` 读数
 * 交给这里换算成一条样本。零外部进程，只用进程内 API。
 */
import type { NodeSelfResourceSample } from "../validation.js";
interface NodeCpuUsageSnapshot {
    user: number;
    system: number;
}
/** Node 进程自采周期：60 秒，与本地内存诊断日志同节拍。 */
export declare const NODE_SELF_RESOURCE_SAMPLE_INTERVAL_MS = 60000;
export interface NodeSelfResourceSamplerOptions {
    readCpuUsage?: () => NodeCpuUsageSnapshot;
    readMonotonicTimeNs?: () => bigint;
    logicalCpuCount?: number;
}
export interface NodeSelfResourceSampler {
    /**
     * 用调用方刚读到的 `memoryUsage` 换算一条样本。
     * 基线不可用（首次读数失败、时钟未前进、CPU 计数回退）时返回 null，只丢当前样本。
     */
    sample(memoryUsage: NodeJS.MemoryUsage): NodeSelfResourceSample | null;
}
export declare function createNodeSelfResourceSampler(options?: NodeSelfResourceSamplerOptions): NodeSelfResourceSampler;
export {};
//# sourceMappingURL=nodeSelfResourceTelemetry.d.ts.map