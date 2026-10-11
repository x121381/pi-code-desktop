/**
 * 进程内存本地诊断日志的共用纯逻辑。
 *
 * main / renderer / host / agent CLI 四类进程各自采样，但写盘门控、行格式和计数器注册表
 * 只有这一份实现，避免四处各写一套阈值。本文件不依赖 Node / DOM API。
 */
export type MemorySampleRole = "main" | "renderer" | "utility_host" | "agent_node";
export type MemorySampleWriteReason = "first" | "changed" | "heartbeat";
export interface MemorySampleFields {
    rssKb?: number;
    heapUsedKb?: number;
    heapTotalKb?: number;
    externalKb?: number;
    arrayBuffersKb?: number;
}
export interface MemorySample extends MemorySampleFields {
    role: MemorySampleRole;
    /** `<provider>.<key>` → 数值；只允许纯读取得到的计数。 */
    counters: Record<string, number>;
}
export interface MemorySampleWriteGateOptions {
    /** heapUsedKb 相对上一次写盘值的变化比例阈值，默认 5%。 */
    heapDeltaRatio?: number;
    /**
     * rssKb / externalKb 相对上一次写盘值的变化比例阈值，默认 10%。
     * 真机上 host 进程 RSS 从 240MB 冲到 1.5GB、externalKb 冲到 1.3GB，而 heapUsed 几乎不动，
     * 只看 heap 的门控把这一分钟判成 heartbeat 静默丢掉；native / external 内存必须单独参与判定。
     */
    nativeDeltaRatio?: number;
    /** 无变化时的心跳间隔，默认 5 分钟。 */
    heartbeatMs?: number;
}
export interface MemorySampleWriteGate {
    /**
     * 判定本次样本是否写盘。返回非 null 时表示应写盘，并把该样本记为“上一次写盘值”。
     */
    evaluate(sample: MemorySample, nowMs: number): MemorySampleWriteReason | null;
}
export declare const MEMORY_SAMPLE_INTERVAL_MS = 60000;
export declare const MEMORY_SAMPLE_HEAP_DELTA_RATIO = 0.05;
export declare const MEMORY_SAMPLE_NATIVE_DELTA_RATIO = 0.1;
export declare const MEMORY_SAMPLE_HEARTBEAT_MS = 300000;
export declare function createMemorySampleWriteGate(options?: MemorySampleWriteGateOptions): MemorySampleWriteGate;
export declare function bytesToKb(bytes: number): number;
/** 把 Node `process.memoryUsage()` 的结果换算成 KB 字段；字段缺失时省略。 */
export declare function memoryUsageToSampleFields(usage: {
    rss?: number;
    heapUsed?: number;
    heapTotal?: number;
    external?: number;
    arrayBuffers?: number;
}): MemorySampleFields;
/**
 * 单行 `key=value` 格式：固定内存字段在前，计数器按字典序在后，全部取整。
 * 例：`[memory] role=main reason=first rssKb=1 heapUsedKb=2 app.windows=1`
 */
export declare function formatMemorySampleLine(sample: MemorySample, reason: MemorySampleWriteReason): string;
export type MemoryDiagnosticsProvider = () => Record<string, number>;
export interface MemoryDiagnosticsRegistry {
    /** 同名重复注册时后者覆盖前者；返回的 dispose 只在仍是自己时才移除。 */
    register(name: string, provider: MemoryDiagnosticsProvider): {
        dispose(): void;
    };
    /** 逐个调用 provider，键以 `<name>.` 为前缀；单个 provider 抛错只跳过它自己。 */
    collect(): Record<string, number>;
}
export declare function createMemoryDiagnosticsRegistry(): MemoryDiagnosticsRegistry;
//# sourceMappingURL=memoryDiagnostics.d.ts.map