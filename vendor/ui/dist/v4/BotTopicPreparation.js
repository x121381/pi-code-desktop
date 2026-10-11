import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { pendingTopicPreparations } from "@/v4/topicPreparationRenderUnits.js";
import { useContext, useMemo } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { DeliveryContext } from "@/v4/botGroupDeliveryContext.js";
import { ConversationUserInputBubble } from "@/v4/ConversationUserInputBubble.js";
const EMPTY_ROWS = [];
const EMPTY_PREPARATIONS = [];
export function useBotTopicPreparations() {
    const value = useContext(DeliveryContext);
    if (!value?.context?.group?.threadId || value.context.activeTaskId !== value.taskId)
        return EMPTY_PREPARATIONS;
    return value.context.group.preparation ?? EMPTY_PREPARATIONS;
}
export function BotTopicPreparationList({ items, acceptedRows = EMPTY_ROWS, provider, }) {
    const { intl } = useZCodeIntl();
    const pending = useMemo(() => pendingTopicPreparations(items, acceptedRows), [items, acceptedRows]);
    if (!pending.length)
        return null;
    return (_jsx("div", { className: "flex flex-col gap-4", "aria-live": "polite", children: pending.map((item) => (_jsxs("div", { "data-topic-preparation": item.messageId, className: "flex min-w-0 flex-col items-end", children: [_jsxs("div", { "data-topic-preparation-source": "true", className: "mb-2 flex min-w-0 max-w-full items-center gap-1.5 text-ui-sm text-foreground-subtle", children: [_jsxs("span", { className: "min-w-0 truncate", title: item.senderName, children: [provider
                                    ? `${provider === "lark" ? "Lark" : intl.formatMessage({ id: "bots.group.provider.feishu" })} · `
                                    : "", item.senderName] }), item.status !== "failed" ? (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { tabIndex: 0, role: "img", "aria-label": intl.formatMessage({ id: `chat.topicPreparation.${item.status}` }), "data-topic-preparation-loading": "true", className: "inline-flex size-4 shrink-0 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-ring", children: _jsx(LoaderCircleIcon, { "aria-hidden": "true", className: "size-3 animate-spin motion-reduce:animate-none" }) }) }), _jsx(TooltipContent, { children: intl.formatMessage({ id: `chat.topicPreparation.${item.status}` }) })] })) : null] }), _jsx(ConversationUserInputBubble, { text: item.text, contentParts: item.contentParts, rowId: item.messageId })] }, item.messageId))) }));
}
export function BotTopicPreparation({ items }) {
    const value = useContext(DeliveryContext);
    if (!value?.context?.group?.threadId || value.context.activeTaskId !== value.taskId)
        return null;
    return _jsx(BotTopicPreparationList, { items: items, provider: value.provider });
}
//# sourceMappingURL=BotTopicPreparation.js.map