import type { BotConfig, BotProvider, BotReplyGranularity } from "@zcode/shared";
export type BotProviderEntryId = BotProvider | "dingding";
type BotProviderEntry = {
    id: BotProvider;
    label: string;
    implemented: true;
} | {
    id: BotProviderEntryId;
    label: string;
    implemented: false;
};
export declare const BOT_PROVIDERS: BotProviderEntry[];
export declare const BOT_REPLY_GRANULARITIES: Array<{
    id: BotReplyGranularity;
    labelId: string;
    descriptionId: string;
}>;
export declare const DEFAULT_BOT_REPLY_GRANULARITY_ENTRY: {
    id: BotReplyGranularity;
    labelId: string;
    descriptionId: string;
};
export declare function getBotReplyGranularitiesForProvider(provider: BotProvider): typeof BOT_REPLY_GRANULARITIES;
export declare function getBotReplyGranularityEntryForProvider(provider: BotProvider, replyMode: BotReplyGranularity): {
    id: BotReplyGranularity;
    labelId: string;
    descriptionId: string;
};
export declare function getBotProviderRegionTagLabelId(provider: BotProviderEntryId): string | null;
export declare function buildCurrentWorkspaceId(workspacePath: string, workspaceIdentity?: string): string;
type BotProviderEntryResolution = {
    mode: "select";
    botId: string;
} | {
    mode: "create";
    provider: BotProvider;
};
export declare function resolveBotProviderEntry(bots: BotConfig[], provider: BotProvider): BotProviderEntryResolution;
export {};
//# sourceMappingURL=botsUi.d.ts.map