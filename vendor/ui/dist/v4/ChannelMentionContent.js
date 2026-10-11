import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { AtSign } from "lucide-react";
import { channelContentText, } from "@zcode/shared";
import { PROMPT_MENTION_BASE_CLASS_NAME } from "@/mentions/mentionChip.js";
/** 只渲染可信消息节点；复制出的 @name 普通文本不能恢复平台身份。 */
export function ChannelMentionContent({ parts, text, }) {
    if (!parts || channelContentText(parts) !== text)
        return _jsx(_Fragment, { children: text });
    return (_jsx("span", { className: "whitespace-pre-wrap break-words", children: parts.map((part, index) => part.type === "text" ? (_jsx(Fragment, { children: part.text }, index)) : (_jsxs("span", { "data-channel-mention": part.channel, title: `${part.name} · ${part.channel === "lark" ? "Lark" : "飞书 / Feishu"}`, className: `${PROMPT_MENTION_BASE_CLASS_NAME} mx-0.5 max-w-full rounded bg-surface-hover px-1 text-foreground`, children: [_jsx(AtSign, { className: "size-3.5 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 truncate", children: part.name }), _jsx("span", { className: "text-ui-xs text-foreground-subtle", children: part.channel === "lark" ? "Lark" : "Feishu" })] }, `${part.refId}:${index}`))) }));
}
/** 合批队列按原发送者与正文顺序投影，不能把末条的节点套到整批文本上。 */
export function BotChannelMessageContent({ source, text, }) {
    const messages = source?.messages;
    const parts = messages && messages.length > 1
        ? messages.flatMap((message, index) => [
            {
                type: "text",
                text: `${index ? "\n\n" : ""}${message.senderName || message.senderId}: `,
            },
            ...(message.contentParts && channelContentText(message.contentParts) === message.text
                ? message.contentParts
                : [{ type: "text", text: message.text }]),
        ])
        : (messages?.[0]?.contentParts ?? source?.contentParts);
    return _jsx(ChannelMentionContent, { parts: parts, text: text });
}
//# sourceMappingURL=ChannelMentionContent.js.map