import { formatLogPrefix } from "@zcode/shared";
import { isEffectiveDevelopmentNodeEnv } from "../runtime-tools/nodeEnv.js";
export function createServiceLogger(scope, options) {
    const pid = options?.pid ?? process.pid;
    const sink = options?.sink ?? console;
    const debugOption = options?.isDebugEnabled;
    const resolveDebugEnabled = typeof debugOption === "function"
        ? debugOption
        : typeof debugOption === "boolean"
            ? () => debugOption
            : () => isEffectiveDevelopmentNodeEnv();
    function write(level, traceId, ...args) {
        // 服务层日志过去常被复用到 ZCode Agent 命名 logger，导致新 ZCode 路径继续依赖 ZCode Agent 目录。
        // 这里把通用分级日志抽到独立模块，后续删除 ZCode Agent runtime 时不会牵连非 ZCode Agent 服务。
        if (level === "debug" && !resolveDebugEnabled()) {
            return;
        }
        const source = traceId ? `${scope}][trace:${traceId}` : scope;
        const consoleFn = level === "error"
            ? sink.error
            : level === "warn"
                ? sink.warn
                : level === "debug"
                    ? (sink.debug ?? sink.log)
                    : sink.log;
        consoleFn(formatLogPrefix(source, pid), ...args);
    }
    return {
        debug: (traceId, ...args) => write("debug", traceId, ...args),
        info: (traceId, ...args) => write("info", traceId, ...args),
        warn: (traceId, ...args) => write("warn", traceId, ...args),
        error: (traceId, ...args) => write("error", traceId, ...args),
    };
}
//# sourceMappingURL=serviceLogger.js.map