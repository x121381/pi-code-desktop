import { jsx as _jsx } from "react/jsx-runtime";
import { Bot, Webhook } from "lucide-react";
import { ALL_BOT_WORKSPACES, BOT_BIND_CODE_TTL_MS } from "@zcode/shared";
import { DingDingChannelIcon, DiscordChannelIcon, FeishuChannelIcon, TelegramChannelIcon, WeComChannelIcon, WeixinChannelIcon, } from "../assets/channel-icons/index.js";
import { cn } from "../components/lib/utils.js";
export const BIND_CODE_TTL_MS = BOT_BIND_CODE_TTL_MS;
export const TELEGRAM_BOTFATHER_URL = "https://t.me/BotFather";
export function isAllWorkspacesAllowed(allowedWorkspaces) {
    return (allowedWorkspaces.length === 0 ||
        allowedWorkspaces.includes(ALL_BOT_WORKSPACES));
}
export function formatBotDisplayName(name, fallbackName) {
    return name.trim() || fallbackName;
}
export function ProviderIcon({ provider, className, }) {
    const iconSrc = provider === "telegram"
        ? TelegramChannelIcon
        : provider === "weixin"
            ? WeixinChannelIcon
            : provider === "feishu" || provider === "lark"
                ? FeishuChannelIcon
                : provider === "dingding"
                    ? DingDingChannelIcon
                    : provider === "discord"
                        ? DiscordChannelIcon
                        : provider === "wecom"
                            ? WeComChannelIcon
                            : null;
    if (iconSrc) {
        return (_jsx("img", { src: iconSrc, alt: "", "aria-hidden": "true", className: cn("size-4 object-contain", className) }));
    }
    if (provider === "webhook") {
        return _jsx(Webhook, { className: cn("size-4", className) });
    }
    return _jsx(Bot, { className: cn("size-4", className) });
}
export function runtimeText(runtime, enabled, formatRuntimeMessage) {
    if (runtime?.messageId && formatRuntimeMessage) {
        return formatRuntimeMessage(runtime.messageId);
    }
    return (runtime?.message ?? runtime?.status ?? (enabled ? "enabled" : "disabled"));
}
export function runtimeDot(runtime, enabled) {
    if (runtime?.status === "error")
        return "bg-destructive";
    if (runtime?.status === "polling" || runtime?.status === "connected")
        return "bg-success";
    if (enabled)
        return "bg-foreground-subtle";
    return "bg-border";
}
export function formatBindCountdown(ms) {
    return `${Math.max(0, Math.ceil(ms / 1000))}s`;
}
export function createDefaultCommands() {
    return {
        status: true,
        new: true,
        workspace: true,
        model: true,
        mode: true,
        thoughtLevel: true,
        reply: true,
    };
}
//# sourceMappingURL=shared.js.map