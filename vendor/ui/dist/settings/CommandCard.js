import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Terminal } from "lucide-react";
import { isPluginCommand, isUserCommand } from "@zcode/shared";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { Switch } from "../components/ui/switch.js";
import { settingsResourceRowInteraction } from "../settings/settingsResourceRowInteraction.js";
import { PluginStoreAvatar } from "../settings/PluginStoreAvatar.js";
export function isEditableUserCommand(command) {
    return isUserCommand(command) && command.location.source === "zcode";
}
export function CommandCard({ command, onEdit, onToggle, isOperating, pluginIconItem, }) {
    const { intl } = useZCodeIntl();
    const canEdit = isEditableUserCommand(command);
    const editable = canEdit && Boolean(onEdit) && !isOperating;
    return (_jsxs("div", { className: `grid cursor-default grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors ${editable ? "hover:bg-hover" : ""}`, ...settingsResourceRowInteraction(editable ? () => onEdit?.(command) : undefined), children: [isPluginCommand(command) && pluginIconItem ? (_jsx(PluginStoreAvatar, { item: pluginIconItem, className: "size-9 bg-background", fallbackIcon: _jsx(Terminal, { className: "size-4" }) })) : (_jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-foreground-subtle", "aria-hidden": "true", children: _jsx(Terminal, { className: "size-4" }) })), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: command.name }), command.argumentHint ? (_jsx("span", { className: "text-ui-base text-foreground-subtlest", children: command.argumentHint })) : null] }), _jsx("p", { className: "mt-0.5 line-clamp-2 text-ui-sm text-foreground-subtle", children: command.description || intl.formatMessage({ id: "settings.commands.noDescription" }) })] }), _jsx("div", { className: "flex shrink-0 items-center gap-2", children: isUserCommand(command) && onToggle ? (_jsx(Switch, { checked: command.enabled, onCheckedChange: (enabled) => onToggle(command, enabled), disabled: isOperating })) : null })] }));
}
//# sourceMappingURL=CommandCard.js.map