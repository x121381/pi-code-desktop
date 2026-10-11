import type { HighlighterTypes } from "@pierre/diffs";
import type { WorkerInitializationRenderOptions } from "@pierre/diffs/react";
import type { BundledTheme } from "shiki";
/**
 * @pierre/diffs 默认使用 shiki 的 JavaScript 正则引擎（shiki-js）。该引擎把 TextMate
 * 语法逐条翻译成巨型 RegExp 并在引擎级缓存里永久持有，V8 会把执行过的正则编译成原生代码放进
 * code space；双字节文本（中文注释等）还会再编译一份。主窗口和 4 个 diff worker 共用同一个
 * 256MB code range，长时间运行后会被这些正则占满，触发 renderer 的 V8 OOM
 * （CALL_AND_RETRY_LAST，old-space 仍有大量空闲，code cage "ran out of reservation"）。
 * oniguruma WASM 引擎的正则活在 wasm 线性内存里，不占 V8 代码区，且是 TextMate 语法的参考实现。
 */
export declare const DIFFS_PREFERRED_HIGHLIGHTER: HighlighterTypes;
export interface DiffsHighlighterThemeSettings {
    lightTheme: BundledTheme;
    darkTheme: BundledTheme;
}
/** diff worker 池初始化参数；主线程兜底渲染与 worker 必须使用同一个引擎选择。 */
export declare function createDiffsWorkerHighlighterOptions(settings: DiffsHighlighterThemeSettings): WorkerInitializationRenderOptions;
//# sourceMappingURL=diffsHighlighterEngine.d.ts.map