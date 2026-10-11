import { z } from "zod";
import type { OffPeakTakeNumberAvailability } from "@zcode/shared";
import type { ServiceLogger } from "../logger/serviceLogger.js";
import { type OffPeakCredentialSnapshot } from "./offPeakRuntimeModel.js";
/** 服务端准入态（两轴状态机的服务端轴）。 */
export declare const offPeakTicketStateSchema: z.ZodEnum<{
    active: "active";
    queued: "queued";
    ready: "ready";
    not_found: "not_found";
    expired: "expired";
    settled: "settled";
}>;
export type OffPeakTicketState = z.infer<typeof offPeakTicketStateSchema>;
export interface OffPeakTakeTicketResult {
    ticketId: string;
    state: OffPeakTicketState;
    position?: number;
    /** 下次轮询间隔（毫秒；服务端下发秒，此处已换算）。 */
    nextPollAfterMs?: number;
    registeredAt: number;
}
export interface OffPeakTicketStatusEntry {
    ticketId: string;
    state: OffPeakTicketState;
    position?: number;
    activeDeadline?: number;
}
export interface OffPeakBatchStatusResult {
    nextPollAfterMs?: number;
    tickets: OffPeakTicketStatusEntry[];
}
/** 类型化服务端错误：调用方按 bizCode 分流（3101 无资格 / 3103 取号超限 / 其余）。 */
export declare class OffPeakServerError extends Error {
    readonly httpStatus: number;
    readonly bizCode?: number | undefined;
    readonly nextTakeAt?: number | undefined;
    readonly requestId?: string | undefined;
    constructor(message: string, httpStatus: number, bizCode?: number | undefined, nextTakeAt?: number | undefined, requestId?: string | undefined);
}
export interface OffPeakServerClientDeps {
    /** API origin（真实服务端或 mock 网关，ZCODE_OFFPEAK_MOCK 切换在装配层）；mock 网关懒启动故允许异步。 */
    resolveOrigin: () => string | Promise<string>;
    /** 凭证快照：四个 ticket 接口统一携带同一次 selected credential snapshot。 */
    resolveCredentials: () => Promise<OffPeakCredentialSnapshot>;
    fetchImpl?: typeof fetch;
    logger: ServiceLogger;
}
export interface OffPeakServerClient {
    getTakeNumberAvailability(): Promise<OffPeakTakeNumberAvailability>;
    takeTicket(taskId: string): Promise<OffPeakTakeTicketResult>;
    batchStatus(ticketIds: string[]): Promise<OffPeakBatchStatusResult>;
    settle(ticketId: string): Promise<void>;
}
export declare function createOffPeakServerClient(deps: OffPeakServerClientDeps): OffPeakServerClient;
//# sourceMappingURL=offPeakServerClient.d.ts.map