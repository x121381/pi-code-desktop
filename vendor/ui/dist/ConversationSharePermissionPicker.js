import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { Check, Globe, Info, Lock, UserRoundPen } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
const PERMISSION_OPTIONS = [
    {
        value: "private",
        labelId: "conversationShare.permission.private",
        Icon: Lock,
    },
    {
        value: "link-viewer",
        labelId: "conversationShare.permission.linkViewer",
        Icon: Globe,
    },
    {
        value: "link-editor",
        labelId: "conversationShare.permission.linkEditor",
        Icon: UserRoundPen,
    },
];
export function ConversationSharePermissionPicker({ permission, onChange, disabled = false, variant = "default", }) {
    const { intl } = useZCodeIntl();
    const compact = variant === "compact";
    return (_jsxs("div", { "data-testid": "conversation-share-permission-picker", "data-variant": variant, className: cn("flex flex-col", compact ? "min-w-0 gap-1" : "gap-1.5"), children: [_jsx("span", { "data-testid": "conversation-share-permission-label", className: cn(compact ? "text-ui-sm" : "text-ui-base", "text-foreground-subtle"), children: intl.formatMessage({ id: "conversationShare.permissionLabel" }) }), _jsx("div", { role: "radiogroup", "aria-label": intl.formatMessage({ id: "conversationShare.permissionLabel" }), className: cn(compact
                    ? "grid grid-cols-1 gap-1.5 @min-[640px]/share:grid-cols-3"
                    : "flex flex-col overflow-hidden rounded-lg border border-border"), children: PERMISSION_OPTIONS.map(({ value, labelId, Icon }, index) => {
                    const selected = permission === value;
                    const label = intl.formatMessage({ id: labelId });
                    return (_jsxs(Fragment, { children: [!compact && index > 0 ? (_jsx("div", { className: "px-2", "data-share-permission-divider": true, children: _jsx("div", { className: "h-px bg-border" }) })) : null, _jsxs("button", { type: "button", role: "radio", "data-conversation-share-permission": value, "aria-checked": selected, "aria-label": label, "aria-disabled": disabled, disabled: disabled, onClick: () => onChange(value), className: cn("flex w-full min-w-0 items-center text-left text-foreground outline-none transition-colors hover:bg-menu-hover focus-visible:bg-menu-hover disabled:pointer-events-none disabled:opacity-60", compact
                                    ? "min-h-11 gap-2 rounded-lg border border-input-border bg-input px-2.5 py-2 text-ui-sm"
                                    : "h-11 gap-1.5 p-3 text-ui-base", compact && selected && "border-input-border-focused bg-selected"), children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(Icon, { className: cn(compact ? "size-4" : "size-4", "text-foreground") }) }), _jsxs("span", { className: cn("min-w-0 flex-1", compact ? "grid gap-0.5" : "truncate"), children: [_jsx("span", { className: cn(compact && "whitespace-normal break-words"), children: label }), compact ? (_jsx("span", { className: "whitespace-normal break-words text-ui-xs text-foreground-subtle", children: intl.formatMessage({
                                                    id: value === "private"
                                                        ? "conversationShare.permission.privateHint"
                                                        : value === "link-viewer"
                                                            ? "conversationShare.permission.linkViewerHint"
                                                            : "conversationShare.permission.linkEditorHint",
                                                }) })) : null] }), _jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: selected ? _jsx(Check, { className: "size-4 text-foreground" }) : null })] })] }, value));
                }) }), !compact && permission !== "private" ? (_jsxs("div", { role: "note", className: "flex items-start gap-1 text-warning", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(Info, { className: "size-4", "aria-hidden": "true" }) }), _jsx("p", { className: "min-w-0 flex-1 text-ui-sm leading-4", children: intl.formatMessage({ id: "conversationShare.publicWarning" }) })] })) : null] }));
}
//# sourceMappingURL=ConversationSharePermissionPicker.js.map