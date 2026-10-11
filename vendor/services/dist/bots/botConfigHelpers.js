import { normalizeBotReplyGranularity, } from "@zcode/shared";
import { normalizeBotCommandPolicy, normalizeBotCurrentOptions } from "./config.js";
import { normalizeAllowedWorkspaces } from "./workspaceHelpers.js";
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
export function getContextKey(bot) {
    return bot.id;
}
export function findBot(config, botId) {
    return config.bots.find((bot) => bot.id === botId) ?? null;
}
export function findCallbackBot(config, provider, payload) {
    if (!isRecord(payload)) {
        return null;
    }
    const botId = typeof payload.botId === "string" ? payload.botId : "";
    if (botId) {
        return findBot(config, botId);
    }
    return config.bots.filter((bot) => bot.provider === provider && bot.enabled).at(0) ?? null;
}
export function findAuthorizedBot(config, actor) {
    if (actor.chatType === "group" && (actor.provider === "feishu" || actor.provider === "lark")) {
        return (config.bots.find((bot) => bot.enabled && bot.id === actor.botId && bot.provider === actor.provider) ?? null);
    }
    if (actor.provider === "weixin") {
        return (config.bots.find((bot) => bot.enabled && bot.provider === "weixin" && bot.id === actor.botId) ?? null);
    }
    return (config.bots.find((bot) => bot.enabled &&
        bot.provider === actor.provider &&
        bot.providerUserId === actor.providerUserId) ?? null);
}
export function findBoundUser(bot, actor) {
    return actor.provider === "weixin" || bot.providerUserId === actor.providerUserId ? bot : null;
}
export function normalizeBotConfig(bot) {
    const normalized = {
        ...bot,
        // Bot 配置化后 allowedWorkspaces 是唯一 workspace 权限边界；空数组统一落成 "*"。
        allowedWorkspaces: normalizeAllowedWorkspaces(bot.allowedWorkspaces),
        allowedCommands: normalizeBotCommandPolicy(bot.allowedCommands),
        currentOptions: normalizeBotCurrentOptions(bot.currentOptions),
        // Bugfix: Feishu/Lark 的回复颗粒度依赖 Card JSON 2.0 单卡更新，旧配置不能继续保留普通消息模式。
        replyMode: normalizeBotReplyGranularity(bot.provider, bot.replyMode),
    };
    if (normalized.provider !== "weixin") {
        return normalized;
    }
    // 微信使用内置 iLink 地址，保存时清理 webhookUrl，避免把其他 provider 的出站字段残留到微信配置。
    delete normalized.webhookUrl;
    return normalized;
}
function getUserCommandPolicy(bot) {
    return normalizeBotCommandPolicy(bot.allowedCommands);
}
export function isUserCommandAllowed(bot, requestedCommand) {
    if (requestedCommand === "help" ||
        requestedCommand === "message" ||
        requestedCommand === "approve" ||
        requestedCommand === "task" ||
        requestedCommand === "stop") {
        return true;
    }
    if (requestedCommand === "reconnect") {
        return getUserCommandPolicy(bot).workspace !== false;
    }
    return getUserCommandPolicy(bot)[requestedCommand] !== false;
}
export function normalizeConfigBots(config) {
    return {
        ...config,
        bots: config.bots.map(normalizeBotConfig),
    };
}
//# sourceMappingURL=botConfigHelpers.js.map