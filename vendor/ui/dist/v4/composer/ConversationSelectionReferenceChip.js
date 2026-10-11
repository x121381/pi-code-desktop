import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { QuoteIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { isConversationSelectionReference, } from "@/lib/conversationSelectionReference.js";
import { ContextAttachmentPill } from "@/v4/composer/ContextAttachmentPill.js";
export function ConversationSelectionReferenceChip({ references, contentAlign = "start", onRemove, onRemoveAll, }) {
    const { intl, locale } = useZCodeIntl();
    if (references.length === 0)
        return null;
    const filePath = references.length === 1 ? references[0]?.path : undefined;
    // 文件引用沿用共用 pill，但不能再被「对话引用」计数隐藏来源。
    const label = filePath
        ? intl.formatMessage({ id: "chat.selections.file" }, { name: filePath.split(/[\\/]/).pop() ?? filePath })
        : intl.formatMessage({
            id: references.some((reference) => reference.path)
                ? "chat.selections.mixedCount"
                : "chat.selections.count",
        }, { count: String(references.length) });
    const removeLabel = intl.formatMessage({ id: "chat.selections.remove" });
    return (_jsx(ContextAttachmentPill, { contentAlign: contentAlign, icon: _jsx(QuoteIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), label: label, onRemoveAll: onRemoveAll, removeLabel: removeLabel, triggerProps: {
            "data-conversation-selection-reference-count": references.length,
        }, children: references.map((reference, index) => (_jsxs("div", { className: "group/reference flex gap-2 rounded-lg px-2 py-1.5 text-ui-base hover:bg-menu-hover", children: [_jsx(QuoteIcon, { className: "mt-0.5 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1", children: [reference.senderName || reference.senderId || reference.sentAt ? (_jsxs("div", { className: "mb-1 text-ui-sm text-foreground-subtle", children: [reference.senderName ||
                                    (reference.senderId
                                        ? `${reference.senderId.slice(0, 8)}…${reference.senderId.slice(-4)}`
                                        : ""), reference.sentAt ? (_jsxs(_Fragment, { children: [" ", "\u00B7", " ", new Date(reference.sentAt).toLocaleTimeString(locale, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })] })) : null] })) : null, _jsx("div", { className: "line-clamp-3 whitespace-pre-wrap break-words", children: reference.text }), reference.path || isConversationSelectionReference(reference) ? (_jsx("div", { className: "mt-0.5 break-words text-ui-sm text-foreground-subtlest", children: reference.path ? (reference.path) : isConversationSelectionReference(reference) &&
                                reference.contentType === "markdown" ? (reference.sourceTitle) : isConversationSelectionReference(reference) &&
                                reference.contentType !== "markdown" ? (_jsxs(_Fragment, { children: [intl.formatMessage({ id: `chat.selections.type.${reference.contentType}` }), " \u00B7 #", reference.sourceRowId] })) : null })) : null] }), onRemove && isConversationSelectionReference(reference) ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "size-5 shrink-0 text-foreground-subtle opacity-0 group-hover/reference:opacity-100", "aria-label": removeLabel, onClick: () => onRemove(reference.id), children: _jsx(Trash2Icon, { className: "size-3.5" }) })) : null] }, isConversationSelectionReference(reference)
            ? reference.id
            : `${index}:${reference.text}`))) }));
}
//# sourceMappingURL=ConversationSelectionReferenceChip.js.map