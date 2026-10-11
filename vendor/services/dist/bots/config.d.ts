import { type BotCurrentOptions, type BotDraftOptions, type BotCommandPolicy, type BotsConfigFile, type BotProvider } from "@zcode/shared";
export { BOT_BIND_CODE_TTL_MS } from "@zcode/shared";
export declare const BOTS_CONFIG_FILE = "bot-config.v3.json";
export declare const BOTS_LEGACY_CONFIG_FILE = "bot-config.json";
export declare const BOTS_LEGACY_STATE_FILE = "bot-state.json";
export declare const BOTS_V2_STATE_FILE = "bot-state.v2.json";
export declare const BOTS_STATE_FILE = "bot-state.v3.json";
export declare const BOTS_LEGACY_MODEL_CACHE_FILE = "bots-model-cache.json";
export declare const BOTS_MODEL_CACHE_FILE = "bots-model-cache.v2.json";
export declare function createDefaultBotsConfig(): BotsConfigFile;
export declare function createDefaultBotCommands(): BotCommandPolicy;
export declare function normalizeBotCommandPolicy(commands?: Partial<BotCommandPolicy> & {
    cli?: unknown;
}): BotCommandPolicy;
export declare function normalizeBotCurrentOptions(options?: Partial<BotCurrentOptions> & {
    cli?: unknown;
    model?: unknown;
    thoughtLevel?: unknown;
}): BotCurrentOptions;
export declare function normalizeBotDraftOptions(options: BotDraftOptions): BotDraftOptions;
export declare function getDefaultBotReplyGranularity(provider?: BotProvider): import("@zcode/shared").BotReplyGranularity;
export declare function buildBotCredentialKey(botId: string): string;
export declare function buildBotWebhookSecretKey(botId: string): string;
//# sourceMappingURL=config.d.ts.map