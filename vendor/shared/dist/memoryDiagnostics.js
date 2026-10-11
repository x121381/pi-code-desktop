/**
 * 进程内存本地诊断日志的共用纯逻辑。
 *
 * main / renderer / host / agent CLI 四类进程各自采样，但写盘门控、行格式和计数器注册表
 * 只有这一份实现，避免四处各写一套阈值。本文件不依赖 Node / DOM API。
 */
export const MEMORY_SAMPLE_INTERVAL_MS = 60_000;
export const MEMORY_SAMPLE_HEAP_DELTA_RATIO = 0.05;
export const MEMORY_SAMPLE_NATIVE_DELTA_RATIO = 0.1;
export const MEMORY_SAMPLE_HEARTBEAT_MS = 300_000;
const MEMORY_FIELD_ORDER = [
    "rssKb",
    "heapUsedKb",
    "heapTotalKb",
    "externalKb",
    "arrayBuffersKb",
];
function countersDiffer(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        if (a[key] !== b[key]) {
            return true;
        }
    }
    return false;
}
function exceedsRatio(current, previous, ratio) {
    return (current !== undefined &&
        previous !== undefined &&
        Math.abs(current - previous) > Math.max(previous, 1) * ratio);
}
export function createMemorySampleWriteGate(options = {}) {
    const heapDeltaRatio = options.heapDeltaRatio ?? MEMORY_SAMPLE_HEAP_DELTA_RATIO;
    const nativeDeltaRatio = options.nativeDeltaRatio ?? MEMORY_SAMPLE_NATIVE_DELTA_RATIO;
    const heartbeatMs = options.heartbeatMs ?? MEMORY_SAMPLE_HEARTBEAT_MS;
    let lastWritten;
    let lastWrittenAt = 0;
    return {
        evaluate(sample, nowMs) {
            let reason = null;
            if (!lastWritten) {
                reason = "first";
            }
            else if (exceedsRatio(sample.heapUsedKb, lastWritten.heapUsedKb, heapDeltaRatio) ||
                exceedsRatio(sample.rssKb, lastWritten.rssKb, nativeDeltaRatio) ||
                exceedsRatio(sample.externalKb, lastWritten.externalKb, nativeDeltaRatio)) {
                reason = "changed";
            }
            else if (countersDiffer(sample.counters, lastWritten.counters)) {
                reason = "changed";
            }
            else if (nowMs - lastWrittenAt >= heartbeatMs) {
                reason = "heartbeat";
            }
            if (reason) {
                lastWritten = { ...sample, counters: { ...sample.counters } };
                lastWrittenAt = nowMs;
            }
            return reason;
        },
    };
}
export function bytesToKb(bytes) {
    return Math.round(bytes / 1024);
}
/** 把 Node `process.memoryUsage()` 的结果换算成 KB 字段；字段缺失时省略。 */
export function memoryUsageToSampleFields(usage) {
    const fields = {};
    if (typeof usage.rss === "number")
        fields.rssKb = bytesToKb(usage.rss);
    if (typeof usage.heapUsed === "number")
        fields.heapUsedKb = bytesToKb(usage.heapUsed);
    if (typeof usage.heapTotal === "number")
        fields.heapTotalKb = bytesToKb(usage.heapTotal);
    if (typeof usage.external === "number")
        fields.externalKb = bytesToKb(usage.external);
    if (typeof usage.arrayBuffers === "number") {
        fields.arrayBuffersKb = bytesToKb(usage.arrayBuffers);
    }
    return fields;
}
/**
 * 单行 `key=value` 格式：固定内存字段在前，计数器按字典序在后，全部取整。
 * 例：`[memory] role=main reason=first rssKb=1 heapUsedKb=2 app.windows=1`
 */
export function formatMemorySampleLine(sample, reason) {
    const parts = [`[memory]`, `role=${sample.role}`, `reason=${reason}`];
    for (const field of MEMORY_FIELD_ORDER) {
        const value = sample[field];
        if (typeof value === "number" && Number.isFinite(value)) {
            parts.push(`${field}=${Math.round(value)}`);
        }
    }
    for (const key of Object.keys(sample.counters).sort()) {
        const value = sample.counters[key];
        if (typeof value === "number" && Number.isFinite(value)) {
            parts.push(`${key}=${Math.round(value)}`);
        }
    }
    return parts.join(" ");
}
export function createMemoryDiagnosticsRegistry() {
    const providers = new Map();
    return {
        register(name, provider) {
            providers.set(name, provider);
            return {
                dispose() {
                    if (providers.get(name) === provider) {
                        providers.delete(name);
                    }
                },
            };
        },
        collect() {
            const result = {};
            for (const [name, provider] of providers) {
                try {
                    for (const [key, value] of Object.entries(provider())) {
                        if (typeof value === "number" && Number.isFinite(value)) {
                            result[`${name}.${key}`] = value;
                        }
                    }
                }
                catch {
                    // 诊断 provider 只做纯读取；任一 provider 异常不能影响其他计数器或业务。
                }
            }
            return result;
        },
    };
}
//# sourceMappingURL=memoryDiagnostics.js.map