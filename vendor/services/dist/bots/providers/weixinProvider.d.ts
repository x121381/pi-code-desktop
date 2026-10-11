import type { BotConfig, BotInboundMessage } from "@zcode/shared";
import type { BotProviderAdapter } from "./types.js";
export declare const DEFAULT_WEIXIN_ILINK_BASE_URL = "https://ilinkai.weixin.qq.com";
interface WeixinProviderDeps {
    loadCredential(key: string): Promise<string | null>;
}
interface WeixinGetUpdatesResult {
    messages: BotInboundMessage[];
    rawMessageDiagnostics?: string[];
    rawMessageCount?: number;
    buf?: string;
}
export declare function getWeixinUpdates(params: {
    bot: BotConfig;
    deps: WeixinProviderDeps;
    buf?: string;
    signal?: AbortSignal;
}): Promise<WeixinGetUpdatesResult>;
export declare function createWeixinBotProvider(deps: WeixinProviderDeps): BotProviderAdapter;
export {};
//# sourceMappingURL=weixinProvider.d.ts.map