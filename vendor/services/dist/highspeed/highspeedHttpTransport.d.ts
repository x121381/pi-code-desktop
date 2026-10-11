import type { ServiceLogger } from "#src/logger/serviceLogger.js";
import type { HighspeedServiceTransport } from "./highspeedCardService.js";
/**
 * 后台请求生命期上限。必须明确大于 1s 发送等待预算：慢但合法的 draw 仍能在后台落地供下一轮使用；
 * 同时保证永不返回的连接有界结束并释放 in-flight draw（spec §3 规则 6）。
 */
export declare const HIGHSPEED_REQUEST_TIMEOUT_MS = 20000;
export declare function createHighspeedHttpTransport(options: {
    drawUrl: string;
    healthyBaseUrl: string;
    drawHeaders: () => Promise<Record<string, string>>;
    healthyHeaders: () => Promise<Record<string, string>>;
    fetchImpl?: typeof fetch;
    logger: Pick<ServiceLogger, "warn">;
    /** 单次 draw/healthy 请求的生命期上限；缺省 HIGHSPEED_REQUEST_TIMEOUT_MS。 */
    requestTimeoutMs?: number;
}): HighspeedServiceTransport;
//# sourceMappingURL=highspeedHttpTransport.d.ts.map