import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Crown, Download, Loader2, MoreHorizontal, Power, TriangleAlert, Trash2, } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { Switch } from "@/components/ui/switch.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { PluginStoreAvatar } from "@/settings/PluginStoreAvatar.js";
import { canUpdatePluginItem, resolveItemDescription, resolveItemDisplayName, } from "@/settings/pluginStoreListing.js";
import { runUserAction } from "@/lib/userActionTelemetry.js";
export function isItemBusy(item, actions) {
    return (actions.operationId === `plugin:install:${item.name}@${item.marketplace}` ||
        actions.operationId === `plugin:restore:${item.id}` ||
        actions.operationId === `plugin:uninstall:${item.id}` ||
        actions.operationId === `plugin:update:${item.id}` ||
        actions.operationId === `plugin:reset-config:${item.id}` ||
        actions.togglingPluginId === item.id);
}
/**
 * 付费套餐提示：目录条目声明 `listing.requiresPaidPlan` 时，在标题右侧展示渐变徽标。
 * 表达的是「需要付费套餐才好用」这个使用条件，不是「插件是收费商品」——不做安装门禁。
 * 商店卡片与详情页标题共用同一渐变徽标。
 * 徽标使用短文案，完整条件由 Tooltip 和 aria-label 表达；缺字段时整个标记不渲染。
 * hover 提示走 ControlHintTooltip（Root Provider 的 delayDuration=0，即时弹出），
 * 不用原生 title——后者有约 1s 系统延迟。
 */
export function PluginStorePaidPlanBadge({ item, }) {
    const { intl } = useZCodeIntl();
    if (!item.listing?.requiresPaidPlan)
        return null;
    const label = intl.formatMessage({ id: "settings.plugins.store.requiresPaidPlan" });
    const badgeLabel = intl.formatMessage({ id: "settings.plugins.store.paidPlanBadge" });
    return (_jsx(ControlHintTooltip, { title: label, children: _jsxs("span", { "data-testid": "plugin-store-paid-plan-badge", "data-plugin-id": item.id, className: "inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-plugin-paid-plan-badge)] px-1.5 py-0.5 text-ui-sm leading-none whitespace-nowrap text-[var(--color-plugin-paid-plan-badge-foreground)]", "aria-label": label, children: [_jsx(Crown, { className: "size-3", "aria-hidden": "true" }), badgeLabel] }) }));
}
/** 详情页与管理视图的插件级启停开关；紧凑商店卡片只保留「…」菜单。 */
export function PluginStoreEnabledSwitch({ item, actions, }) {
    const { intl } = useZCodeIntl();
    if (!item.info || !actions.onSetEnabled)
        return null;
    const enabled = item.info.enabled;
    return (_jsx(Switch, { "data-testid": "plugin-store-enabled-switch", "data-plugin-id": item.id, checked: enabled, disabled: actions.togglingPluginId === item.id, "aria-label": enabled
            ? intl.formatMessage({ id: "settings.plugins.store.menu.disable" })
            : intl.formatMessage({ id: "settings.plugins.store.menu.enable" }), onClick: (event) => event.stopPropagation(), onCheckedChange: (checked) => actions.onSetEnabled?.(item.id, checked) }));
}
/** 已安装条目的「…」菜单：启用/禁用、更新（有更新时）、卸载。卡片与详情页共用。 */
export function PluginStoreItemMenu({ item, actions, triggerClassName, triggerVariant = "ghost", triggerSize = "icon-md", }) {
    const { intl } = useZCodeIntl();
    const enabled = item.info?.enabled ?? false;
    const updatePending = canUpdatePluginItem(item);
    const busy = isItemBusy(item, actions);
    const canToggleEnabled = Boolean(item.info && actions.onSetEnabled);
    // 分隔线不应跟随 item.installed 无条件渲染；启停/更新/恢复配置都不出现时，
    // 菜单只剩「卸载」一项，上方却留下一条孤立横线。分隔线只在卸载前确有其他操作项时才有意义。
    const hasActionsBeforeUninstall = canToggleEnabled || updatePending || Boolean(actions.onResetConfig);
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", "data-testid": "plugin-store-item-menu", "data-plugin-id": item.id, variant: triggerVariant, size: triggerSize, className: triggerClassName, "aria-label": intl.formatMessage({ id: "settings.plugins.store.menu.label" }), onClick: (event) => event.stopPropagation(), children: busy ? (_jsx(Loader2, { className: "size-4 animate-spin", "aria-hidden": "true" })) : (_jsx(MoreHorizontal, { className: "size-4", "aria-hidden": "true" })) }) }), _jsxs(DropdownMenuContent, { align: "end", onClick: (event) => event.stopPropagation(), children: [canToggleEnabled ? (_jsxs(DropdownMenuItem, { "data-testid": "plugin-store-menu-enabled", "data-plugin-id": item.id, disabled: busy, onSelect: () => actions.onSetEnabled?.(item.id, !enabled), children: [_jsx(Power, { className: "size-4", "aria-hidden": "true" }), enabled
                                ? intl.formatMessage({ id: "settings.plugins.store.menu.disable" })
                                : intl.formatMessage({ id: "settings.plugins.store.menu.enable" })] })) : null, updatePending ? (_jsxs(DropdownMenuItem, { "data-testid": "plugin-store-menu-update", "data-plugin-id": item.id, disabled: busy, onSelect: () => actions.onUpdate(item.id), children: [_jsx(Download, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.detail.update" })] })) : null, actions.onResetConfig ? (_jsx(DropdownMenuItem, { "data-testid": "plugin-store-menu-reset-config", "data-plugin-id": item.id, disabled: busy, onSelect: () => actions.onResetConfig?.(item.id), children: intl.formatMessage({ id: "settings.plugins.store.menu.resetConfig" }) })) : null, item.installed ? (_jsxs(_Fragment, { children: [hasActionsBeforeUninstall ? _jsx(DropdownMenuSeparator, {}) : null, _jsxs(DropdownMenuItem, { "data-testid": "plugin-store-menu-uninstall", "data-plugin-id": item.id, variant: "destructive", disabled: busy, onSelect: () => actions.onUninstall(item.id), children: [_jsx(Trash2, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.plugins.detail.uninstall" })] })] })) : null] })] }));
}
/** 安装/恢复胶囊按钮（未安装条目的卡片与详情页主按钮共用）。 */
export function PluginStoreInstallButton({ item, actions, size = "sm", }) {
    const { intl } = useZCodeIntl();
    const installing = actions.operationId === `plugin:install:${item.name}@${item.marketplace}` ||
        actions.operationId === `plugin:restore:${item.id}`;
    return (_jsxs(Button, { type: "button", "data-testid": "plugin-store-install", "data-plugin-id": item.id, variant: "secondary", size: size, className: "rounded-full", disabled: installing, onClick: (event) => {
            event.stopPropagation();
            runUserAction({
                input: { featureId: "extension.plugin", action: "install", trigger: "button" },
                operation: () => actions.onInstall(item),
                completed: { resultSource: "optimistic_projection" },
                failureStage: "plugin_install",
            });
        }, children: [installing ? _jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }) : null, installing
                ? intl.formatMessage({ id: "settings.plugins.marketplace.installing" })
                : intl.formatMessage({ id: "settings.plugins.store.install" })] }));
}
/** 已安装条目的「可更新」角标：列表/卡片标题行直接标出哪个插件有更新，与详情页入口共用判定。 */
export function PluginStoreUpdateBadge({ item, }) {
    const { intl } = useZCodeIntl();
    if (!canUpdatePluginItem(item))
        return null;
    const label = intl.formatMessage({ id: "settings.plugins.list.updateAvailable" });
    return (_jsxs("span", { "data-testid": "plugin-store-update-badge", "data-plugin-id": item?.id, className: "inline-flex shrink-0 items-center gap-1 rounded-full bg-success/14 px-1.5 py-0.5 text-ui-sm leading-none whitespace-nowrap text-success dark:bg-success/18", "aria-label": label, children: [_jsx(Download, { className: "size-3", "aria-hidden": "true" }), label] }));
}
/** 行内「更新」胶囊：已安装且可更新的条目原地触发更新，不必进详情页。 */
export function PluginStoreUpdateButton({ item, actions, size = "sm", }) {
    const { intl } = useZCodeIntl();
    if (!item || !canUpdatePluginItem(item))
        return null;
    const updating = actions.operationId === `plugin:update:${item.id}`;
    return (_jsxs(Button, { type: "button", "data-testid": "plugin-store-card-update", "data-plugin-id": item.id, variant: "secondary", size: size, className: "rounded-full", disabled: actions.operationId !== null, onClick: (event) => {
            event.stopPropagation();
            actions.onUpdate(item.id);
        }, children: [updating ? (_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" })) : (_jsx(Download, { className: "size-3.5", "aria-hidden": "true" })), intl.formatMessage({ id: "settings.plugins.detail.update" })] }));
}
/**
 * 商店卡片（双列网格单元）：40px 头像 + 显示名 + 单行截断描述；
 * 尾部动作：已安装 → 「…」菜单，未安装 → 「安装」胶囊。点击主体进入详情页。
 */
export function PluginStoreCard({ item, actions, locale, }) {
    const { intl } = useZCodeIntl();
    const displayName = resolveItemDisplayName(item, locale);
    const description = resolveItemDescription(item, locale);
    return (_jsxs("div", { role: "button", tabIndex: 0, "data-testid": "plugin-store-card", "data-plugin-id": item.id, className: "group/card flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => actions.onOpenDetail(item.id), onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                actions.onOpenDetail(item.id);
            }
        }, children: [_jsx(PluginStoreAvatar, { item: item, className: "size-10" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx("span", { className: "min-w-0 truncate text-ui-base font-semibold text-foreground", children: displayName }), _jsx(PluginStorePaidPlanBadge, { item: item }), _jsx(PluginStoreUpdateBadge, { item: item })] }), item.orphaned ? (_jsxs("div", { "data-testid": "plugin-store-source-degraded", "data-plugin-id": item.id, className: "mt-0.5 flex items-center gap-1 truncate text-ui-sm text-warning", children: [_jsx(TriangleAlert, { className: "size-3 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "truncate", children: intl.formatMessage({ id: "settings.plugins.store.sourceMissing" }) })] })) : null, description ? (_jsx("div", { className: "mt-0.5 truncate text-ui-sm text-foreground-subtle", children: description })) : null] }), _jsx("div", { className: "flex shrink-0 items-center gap-1.5", children: item.installed ? (_jsxs(_Fragment, { children: [_jsx(PluginStoreUpdateButton, { item: item, actions: actions }), _jsx(PluginStoreItemMenu, { item: item, actions: actions })] })) : (_jsx(PluginStoreInstallButton, { item: item, actions: actions })) })] }));
}
//# sourceMappingURL=PluginStoreCard.js.map