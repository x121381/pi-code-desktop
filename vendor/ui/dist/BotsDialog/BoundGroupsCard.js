import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBotBoundGroups } from "../hooks/useBotBoundGroups.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { Switch } from "../components/ui/switch.js";
import { Button } from "../components/ui/button.js";
import { SettingsGroupCard } from "../settings/SettingsPageParts.js";
export function BoundGroupsList({ rows, disabled, saving, onToggle, }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: "divide-y divide-border", "data-testid": "bot-bound-groups", children: rows.map((row) => (_jsxs("div", { className: "flex min-w-0 items-center gap-3 px-4 py-3", "data-group-id": row.chatId, children: [_jsx("span", { className: "min-w-0 flex-1 truncate text-ui-base font-medium text-foreground", title: row.name, children: row.name }), _jsx("span", { className: "shrink-0 whitespace-nowrap text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: row.topicCount === 1 ? "bots.boundGroups.countOne" : "bots.boundGroups.count" }, { count: row.topicCount }) }), _jsx(Switch, { checked: row.enabled, disabled: disabled || saving !== null, "aria-busy": saving === row.chatId, "aria-label": intl.formatMessage({ id: "bots.boundGroups.toggle" }, { name: row.name }), onCheckedChange: (enabled) => onToggle(row.chatId, enabled) })] }, row.chatId))) }));
}
export function BoundGroupsCard({ bot }) {
    const { intl } = useZCodeIntl();
    const { rows, loading, error, saving, reload, toggle, supported } = useBotBoundGroups(bot);
    return (_jsx(SettingsGroupCard, { children: _jsxs("section", { className: "min-w-0", "aria-label": intl.formatMessage({ id: "bots.boundGroups.title" }), children: [_jsx("h3", { className: "border-b border-border px-4 py-3 text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "bots.boundGroups.title" }) }), loading ? (_jsx("p", { className: "px-4 py-3 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "bots.boundGroups.loading" }) })) : rows.length ? (_jsx(BoundGroupsList, { rows: rows, disabled: !bot.enabled || !supported, saving: saving, onToggle: (chatId, enabled) => void toggle(chatId, enabled) })) : (!error && (_jsx("p", { className: "px-4 py-3 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "bots.boundGroups.empty" }) }))), !bot.enabled && (_jsx("p", { className: "px-4 py-3 text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: "bots.boundGroups.botOff" }) })), error && (_jsxs("div", { role: "alert", className: "flex items-center gap-2 px-4 py-3 text-ui-sm text-destructive", children: [_jsx("span", { children: intl.formatMessage({
                                id: error === "load" ? "bots.boundGroups.loadFailed" : "bots.boundGroups.saveFailed",
                            }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => void reload(), children: intl.formatMessage({ id: "bots.boundGroups.refresh" }) })] }))] }) }));
}
//# sourceMappingURL=BoundGroupsCard.js.map