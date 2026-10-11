import type { BotConfig, BotOutboundMessage } from "@zcode/shared";
import type { BotProviderAdapter, BotStreamingReplyCardState } from "./types.js";
interface FeishuProviderDeps {
    loadCredential(key: string): Promise<string | null>;
    onDeliveryResult?(bot: BotConfig, error: string | undefined): void;
}
export interface FeishuWebSocketClient {
    close(): void;
    /** SDK 自动重连耗尽后的终态；旧测试替身可不提供。 */
    terminated?: Promise<void>;
}
export declare const FEISHU_STREAMING_CARD_TAGGED_ELEMENT_BUDGET = 180;
export declare function countFeishuCardTaggedElements(state: BotStreamingReplyCardState): number;
export declare function splitFeishuStreamingCardStates(state: BotStreamingReplyCardState): BotStreamingReplyCardState[];
export declare function splitFeishuText(text: string): string[];
export declare function createFeishuWebSocketEventHandlers(params: {
    bot: BotConfig;
    onPayload: (payload: unknown) => Promise<BotOutboundMessage | undefined>;
}): {
    "im.message.receive_v1": (payload: unknown) => Promise<void>;
    "im.chat.member.bot.deleted_v1": (payload: unknown) => Promise<void>;
    "im.message.reaction.created_v1": () => Promise<undefined>;
    "card.action.trigger": (payload: unknown) => Promise<{
        toast?: undefined;
        card?: undefined;
    } | {
        toast: {
            type: string;
            content: string;
        };
        card?: undefined;
    } | {
        card: {
            type: string;
            data: Record<string, unknown>;
        };
        toast?: undefined;
    } | undefined>;
};
export declare function startFeishuBotWebSocket(params: {
    bot: BotConfig;
    deps: FeishuProviderDeps;
    onPayload: (payload: unknown) => Promise<BotOutboundMessage | undefined>;
    signal?: AbortSignal;
    onConnectionStateChange?: (state: "reconnecting" | "connected") => void;
}): Promise<FeishuWebSocketClient>;
export declare function createFeishuBotProvider(deps: FeishuProviderDeps): BotProviderAdapter;
export {};
//# sourceMappingURL=feishuProvider.d.ts.map