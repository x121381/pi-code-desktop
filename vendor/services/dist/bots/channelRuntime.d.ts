import type { BotConfig, BotProviderCallbackResult, BotRuntimeInfo } from "@zcode/shared";
export declare const BOT_RUNTIME_LOCK_RETRY_MS = 10000;
export declare const BOT_RUNTIME_LOCK_LEASE_MS = 30000;
export interface BotRuntimeLogger {
    debug(traceId: string | undefined, message: string): void;
    info(traceId: string | undefined, message: string): void;
    warn(traceId: string | undefined, message: string): void;
}
export interface BotRuntimeStatusSink {
    getRuntimeStatus(botId: string): BotRuntimeInfo | undefined;
    setRuntimeStatus(status: BotRuntimeInfo): void;
}
export declare function createBotConnectionFingerprint(parts: readonly string[]): string;
export declare function assertBotCallbackSucceeded(provider: string, result: BotProviderCallbackResult): void;
export declare function createLatestRuntimeRefreshQueue(): {
    enqueue(reconcile: (isLatest: () => boolean) => Promise<void>): Promise<void>;
    invalidate(): void;
};
interface BotRuntimeLock {
    release(): Promise<void>;
}
export declare function isBotRuntimeLockConflictError(error: unknown): boolean;
export declare function acquireTelegramPollingLock(token: string, botId: string): Promise<BotRuntimeLock | null>;
export declare function acquireWeixinPollingLock(token: string, botId: string): Promise<BotRuntimeLock | null>;
export declare function acquireFeishuWebSocketLock(bot: Pick<BotConfig, "id" | "provider" | "feishuAppId">): Promise<BotRuntimeLock | null>;
export declare function waitFor(ms: number, signal: AbortSignal): Promise<void>;
export declare function waitForAbort(signal: AbortSignal): Promise<void>;
export {};
//# sourceMappingURL=channelRuntime.d.ts.map