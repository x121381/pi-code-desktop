import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useContext } from "react";
import { BotGroupMemberNamesContext } from "@/v4/BotGroupMemberNamesContext.js";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function BotGroupSourceLabel({ source }) {
    const { intl } = useZCodeIntl();
    const members = useContext(BotGroupMemberNamesContext);
    if (!source)
        return null;
    const provider = source.provider === "lark" ? "Lark" : intl.formatMessage({ id: "bots.group.provider.feishu" });
    const currentName = members?.botId === source.botId && members.chatId === source.chatId
        ? members.names[source.senderId]?.trim()
        : undefined;
    const savedName = source.senderName.trim();
    const name = currentName || (savedName !== source.senderId ? savedName : "") || source.senderId.slice(-6);
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-bot-group-source": "true", title: source.senderId, className: "min-w-0 max-w-full truncate rounded-sm text-ui-sm text-foreground-subtle hover:text-foreground focus-visible:outline focus-visible:outline-ring", onPointerDown: (event) => event.stopPropagation(), onClick: (event) => event.stopPropagation(), children: [provider, " \u00B7 ", name] }) }), _jsxs(PopoverContent, { align: "end", className: "max-w-[calc(100vw-2rem)] gap-1 text-ui-sm", "data-bot-group-member-details": "true", children: [_jsx("span", { className: "break-words", children: name }), _jsx("span", { className: "select-text break-all text-foreground-subtle", children: source.senderId })] })] }));
}
//# sourceMappingURL=BotGroupSourceLabel.js.map