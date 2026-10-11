import { type MemoryDiagnosticsRegistry, type RendererHeapSample } from "@zcode/shared";
/**
 * renderer 内存诊断计数器注册表。
 * 各缓存/store 模块在模块加载时注册纯读取 provider；`startMemoryDiagnosticsLogger` 每 60 秒
 * 采样一次，经门控后通过 `logger.logMemoryDiagnostics` 写桌面主日志。
 */
export declare const uiMemoryDiagnosticsRegistry: MemoryDiagnosticsRegistry;
interface RendererHeapSnapshot {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
}
/** Chromium 专有的 `performance.memory`；Web 端浏览器缺失时返回 undefined。 */
export declare function readRendererHeapSnapshot(): RendererHeapSnapshot | undefined;
interface StartMemoryDiagnosticsLoggerOptions {
    intervalMs?: number;
    now?: () => number;
    readHeap?: () => RendererHeapSnapshot | undefined;
    write?: (line: string) => void;
    registry?: MemoryDiagnosticsRegistry;
    /**
     * 资源遥测出口：同一次读数除写本地
     * 诊断日志外，还经 preload 桥送 main 的 `renderer_main` 角色事件。由 App 注入
     * `platform.reportRendererHeapSample`；Web 端与手机远控没有桥，不注入即 no-op。
     */
    reportHeapSample?: (sample: RendererHeapSample) => void;
}
export interface MemoryDiagnosticsLoggerHandle {
    sampleNow(): boolean;
    stop(): void;
}
export declare function startMemoryDiagnosticsLogger(options?: StartMemoryDiagnosticsLoggerOptions): MemoryDiagnosticsLoggerHandle;
export {};
//# sourceMappingURL=memoryDiagnostics.d.ts.map