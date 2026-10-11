/**
 * 日志格式化工具
 *
 * 提供统一的时间戳和日志前缀格式化，供所有进程（main/host/server/renderer）使用。
 * 纯函数，无 Node.js 专有 API 依赖，浏览器环境安全。
 */
/**
 * 格式化时间戳为 "YYYY-MM-DD HH:mm:ss.mmm"
 */
export declare function formatTimestamp(date?: Date): string;
/**
 * 生成日志前缀，统一格式：
 * 有 PID: "[YYYY-MM-DD HH:mm:ss.mmm] [pid:12345] [source]"
 * 无 PID: "[YYYY-MM-DD HH:mm:ss.mmm] [source]"
 *
 * Node.js 进程传入 process.pid，浏览器端不传。
 */
export declare function formatLogPrefix(source: string, pid?: number): string;
//# sourceMappingURL=log-format.d.ts.map