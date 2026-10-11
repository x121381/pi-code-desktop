import type { ServiceLogger } from "../logger/serviceLogger.js";
export interface OffPeakMockGatewayOptions {
    /** queued→ready 的晋级延迟；默认 15s（演示低峰等待）。 */
    readyDelayMs?: number;
    /** ready 后须发首个 message 的窗口；默认 5min。 */
    readyTtlMs?: number;
    /** active 硬顶；默认 3h（调小可演示 400/3102 自动续跑）。 */
    activeMs?: number;
    /** 每张票准入前先回多少次 429/3105；默认 0。 */
    queue429Count?: number;
    /** 前 N 次取号直接回 3103（免费额度耗尽），用于验证错误提示后仍可重试；默认 0。 */
    quotaExhaustedCount?: number;
    /** availability 与真实取号保持不可用的时长；默认 0，E2E 用于验证服务端快照置灰。 */
    availabilityBlockedMs?: number;
    /** 429 的 Retry-After 秒数；默认 5。 */
    retryAfterS?: number;
    /** status/take 下发的 next_poll_after 秒数；默认 5。 */
    nextPollS?: number;
    /** 仅供确定性 E2E 使用的 messages 脚本；生产与普通 mock 演示均不设置。 */
    scenario?: "foreground-subagents" | "capture" | "invalid-ticket";
}
export interface OffPeakMockGatewayDeps {
    logger: ServiceLogger;
    /**
     * 准入后 messages 的转发目标：完整 messages URL + 出站头（含上游鉴权）。
     * 返回 null = 不代理，直接回一段固定的 Anthropic 响应（E2E/离线演示：agent loop 立即完成，
     * 不依赖真实模型 key）。
     */
    resolveUpstream: () => Promise<{
        url: string;
        headers: Record<string, string>;
    } | null>;
}
export declare function isOffPeakMockEnabled(env?: NodeJS.ProcessEnv): boolean;
export interface OffPeakMockGatewayHandle {
    origin: string;
    port: number;
    /** true = 端口已被另一个 host 的网关占用，本 handle 只是指向它（close 为 no-op）。 */
    external: boolean;
    close: () => Promise<void>;
}
export declare function startOffPeakMockGateway(deps: OffPeakMockGatewayDeps, options?: OffPeakMockGatewayOptions & {
    port?: number;
}): Promise<OffPeakMockGatewayHandle>;
//# sourceMappingURL=offPeakMockGateway.d.ts.map