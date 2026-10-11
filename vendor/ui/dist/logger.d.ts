export type LogLevel = "debug" | "info" | "warn" | "error";
export declare function isLoggerLevelEnabled(_level: LogLevel): boolean;
export declare const logger: {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    lifecycle: {
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
    };
    /** 带 traceId 前缀的日志，用于全链路追踪 */
    trace: (traceId: string, level: LogLevel, ...args: unknown[]) => void;
};
/**
 * 进程内存本地诊断日志的唯一 renderer 出口。
 * 它是 renderer 生产日志策略里的“正式监控链路”例外：生产构建仍经桌面桥落盘（最多每 60s 一行、
 * 有变化才写），Web 端无桥时 no-op。业务模块不得借用它绕过生产门控。
 */
export declare function logMemoryDiagnostics(line: string): void;
//# sourceMappingURL=logger.d.ts.map