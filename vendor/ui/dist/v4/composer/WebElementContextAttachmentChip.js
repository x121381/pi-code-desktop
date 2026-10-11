import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Globe2Icon, MousePointer2Icon, Trash2Icon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ContextAttachmentPill } from "../../v4/composer/ContextAttachmentPill.js";
function getElementTitle(context) {
    return (context.accessibleName || context.text || context.selector || context.tagName.toLowerCase());
}
function getElementMeta(context) {
    const role = context.role ? `role=${context.role}` : null;
    const tagName = context.tagName.toLowerCase();
    return [tagName, role].filter(Boolean).join(" · ");
}
export function WebElementContextAttachmentChip({ contexts, contentAlign = "start", onRemove, onRemoveAll, }) {
    const { intl } = useZCodeIntl();
    if (contexts.length === 0) {
        return null;
    }
    const label = intl.formatMessage({
        id: contexts.length === 1 ? "chat.webElements.one" : "chat.webElements.many",
    }, { count: String(contexts.length) });
    const removeLabel = intl.formatMessage({ id: "chat.webElements.remove" });
    return (_jsx(ContextAttachmentPill, { contentAlign: contentAlign, icon: _jsx(MousePointer2Icon, { className: "size-4 shrink-0 text-foreground-subtle" }), label: label, onRemoveAll: onRemoveAll, removeLabel: removeLabel, children: contexts.map((context) => (_jsxs("div", { className: "group/context flex min-h-7 cursor-default gap-2 rounded-lg px-2 py-1 text-ui-base/relaxed text-foreground hover:bg-menu-hover", children: [_jsx(Globe2Icon, { className: "mt-1 size-4 shrink-0 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate font-medium", children: getElementTitle(context) }), _jsx("div", { className: "truncate font-mono text-ui-base text-foreground-subtle", children: getElementMeta(context) }), _jsx("div", { className: "truncate text-ui-base text-foreground-subtlest", children: context.pageTitle || context.pageUrl })] }), onRemove ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "mt-0.5 size-5 shrink-0 rounded-sm text-foreground-subtle opacity-0 transition-opacity hover:text-foreground group-hover/context:opacity-100", "aria-label": removeLabel, title: removeLabel, onClick: (event) => {
                        event.stopPropagation();
                        onRemove(context.id);
                    }, children: _jsx(Trash2Icon, { className: "size-3.5" }) })) : null] }, context.id))) }));
}
//# sourceMappingURL=WebElementContextAttachmentChip.js.map