import { getSupportedBotReplyGranularities } from "@zcode/shared";
export const BOT_PROVIDERS = [
    { id: "weixin", label: "Weixin", implemented: true },
    { id: "feishu", label: "Feishu", implemented: true },
    { id: "lark", label: "Lark", implemented: true },
    { id: "telegram", label: "Telegram", implemented: true },
    { id: "dingding", label: "DingTalk", implemented: false },
    { id: "discord", label: "Discord", implemented: false },
    { id: "wecom", label: "WeCom", implemented: false },
    { id: "webhook", label: "Webhook", implemented: true },
];
export const BOT_REPLY_GRANULARITIES = [
    {
        id: "assistant_changes",
        labelId: "bots.replyGranularity.assistantChanges",
        descriptionId: "bots.replyGranularity.assistantChanges.description",
    },
    {
        id: "assistant_toolcalls_changes",
        labelId: "bots.replyGranularity.assistantToolcallsChanges",
        descriptionId: "bots.replyGranularity.assistantToolcallsChanges.description",
    },
    {
        id: "summary_changes",
        labelId: "bots.replyGranularity.summaryChanges",
        descriptionId: "bots.replyGranularity.summaryChanges.description",
    },
    {
        id: "streaming_card",
        labelId: "bots.replyGranularity.streamingCard",
        descriptionId: "bots.replyGranularity.streamingCard.description",
    },
];
export const DEFAULT_BOT_REPLY_GRANULARITY_ENTRY = BOT_REPLY_GRANULARITIES[0];
export function getBotReplyGranularitiesForProvider(provider) {
    const supportedIds = new Set(getSupportedBotReplyGranularities(provider));
    return BOT_REPLY_GRANULARITIES.filter((granularity) => supportedIds.has(granularity.id));
}
export function getBotReplyGranularityEntryForProvider(provider, replyMode) {
    const granularities = getBotReplyGranularitiesForProvider(provider);
    return (granularities.find((granularity) => granularity.id === replyMode) ??
        granularities[0] ??
        DEFAULT_BOT_REPLY_GRANULARITY_ENTRY);
}
export function getBotProviderRegionTagLabelId(provider) {
    switch (provider) {
        case "lark":
            return "login.oauth.regionTag.zai";
        case "feishu":
            return "login.oauth.regionTag.bigmodel";
        default:
            return null;
    }
}
export function buildCurrentWorkspaceId(workspacePath, workspaceIdentity) {
    return workspaceIdentity?.trim() || workspacePath;
}
export function resolveBotProviderEntry(bots, provider) {
    const existingBot = bots.find((bot) => bot.provider === provider);
    if (existingBot) {
        return { mode: "select", botId: existingBot.id };
    }
    return { mode: "create", provider };
}
//# sourceMappingURL=botsUi.js.map