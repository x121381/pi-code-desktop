import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PresentationIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ContextAttachmentPill } from "@/v4/composer/ContextAttachmentPill.js";
function getReferenceText(reference) {
    return reference.selectedText || reference.text || reference.nodeName || reference.nodeType;
}
export function PptxElementReferenceChip({ references, contentAlign = "start", onOpen, onRemove, onRemoveAll, }) {
    const { intl } = useZCodeIntl();
    if (references.length === 0) {
        return null;
    }
    const label = intl.formatMessage({
        id: references.length === 1 ? "chat.pptxElements.one" : "chat.pptxElements.many",
    }, { count: String(references.length) });
    const removeLabel = intl.formatMessage({ id: "chat.pptxElements.remove" });
    return (_jsx(ContextAttachmentPill, { contentAlign: contentAlign, icon: _jsx(PresentationIcon, { className: "size-4 shrink-0 text-foreground-subtle" }), label: label, onRemoveAll: onRemoveAll, removeLabel: removeLabel, children: references.map((reference) => (_jsxs("div", { className: "group/context flex min-h-7 items-start gap-1 rounded-lg px-1 py-0.5 text-ui-base/relaxed hover:bg-menu-hover", children: [onOpen ? (_jsxs("button", { type: "button", className: "flex min-w-0 flex-1 items-start gap-2 rounded-md px-1 py-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => onOpen(reference), children: [_jsx(PresentationIcon, { className: "mt-1 size-4 shrink-0 text-foreground-subtle" }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate font-medium", children: getReferenceText(reference) }), _jsxs("span", { className: "block truncate font-mono text-ui-sm text-foreground-subtle", children: [reference.sourceTitle, " \u00B7 ", reference.slideIndex + 1, " \u00B7 ", reference.nodeId] }), reference.comment?.trim() ? (_jsx("span", { className: "line-clamp-2 text-ui-base/relaxed text-foreground-subtle", children: reference.comment })) : null] })] })) : (_jsxs("div", { className: "flex min-w-0 flex-1 items-start gap-2 px-1 py-0.5", children: [_jsx(PresentationIcon, { className: "mt-1 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate font-medium", children: getReferenceText(reference) }), _jsxs("div", { className: "truncate font-mono text-ui-sm text-foreground-subtle", children: [reference.sourceTitle, " \u00B7 ", reference.slideIndex + 1, " \u00B7 ", reference.nodeId] }), reference.comment?.trim() ? (_jsx("div", { className: "line-clamp-2 text-ui-base/relaxed text-foreground-subtle", children: reference.comment })) : null] })] })), onRemove ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "mt-0.5 size-5 shrink-0 rounded-sm text-foreground-subtle opacity-0 transition-opacity hover:text-foreground group-hover/context:opacity-100 focus-visible:opacity-100", "aria-label": removeLabel, title: removeLabel, onClick: (event) => {
                        event.stopPropagation();
                        onRemove(reference.id);
                    }, children: _jsx(Trash2Icon, { className: "size-3.5" }) })) : null] }, reference.id))) }));
}
//# sourceMappingURL=PptxElementReferenceChip.js.map