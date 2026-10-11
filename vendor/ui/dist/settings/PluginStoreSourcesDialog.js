import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { CLAUDE_OFFICIAL_PLUGIN_MARKETPLACE_ID } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { resolveMarketplaceDisplayName } from "@/settings/pluginSourceLabel.js";
import { isPublicStoreMarketplaceId, sortMarketplaceSources, } from "@/settings/pluginStoreListing.js";
import { DEFAULT_MARKETPLACE_ID } from "@/settings/recommendedPlugins.js";
// 官方市场不可移除：移除后启动时会被重新补种，只会造成「删了又回来」的困惑。
function isRemovableMarketplace(marketplace) {
    if (isPublicStoreMarketplaceId(marketplace.id))
        return false;
    if (marketplace.id === DEFAULT_MARKETPLACE_ID)
        return false;
    return true;
}
export function PluginStoreSourceRefreshFailure({ failure, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "mt-1 flex min-w-0 items-start gap-1 text-ui-base text-destructive", "data-testid": "plugin-store-source-refresh-failure", children: [_jsx(AlertTriangle, { className: "mt-0.5 size-3.5 shrink-0", "aria-hidden": "true" }), _jsxs("span", { className: "min-w-0 break-words", children: [intl.formatMessage({ id: "settings.plugins.store.sources.refreshFailed" }, { time: formatSourceTime(failure.failedAt) }), `: ${failure.message}`] })] }));
}
/** 顶栏齿轮 → 市场源管理：列出已登记市场，支持刷新与移除（新增走 New 按钮）。 */
export function PluginStoreSourcesDialog({ open, onOpenChange, marketplaces, onUpdateMarketplace, onRemoveMarketplace, operationId, }) {
    const { intl, locale } = useZCodeIntl();
    const claudeCodePlugins = intl.formatMessage({
        id: "settings.plugins.marketplace.claudeCodePlugins",
    });
    const sortedMarketplaces = sortMarketplaceSources(marketplaces, locale);
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "w-[min(480px,calc(100vw-2rem))] max-w-none", "data-testid": "plugin-store-sources-dialog", children: [_jsx(DialogTitle, { className: "text-ui-lg font-medium text-foreground", children: intl.formatMessage({ id: "settings.plugins.store.sources.title" }) }), _jsx("div", { className: "max-h-[min(420px,60vh)] space-y-1 overflow-y-auto", children: sortedMarketplaces.length === 0 ? (_jsx("p", { className: "px-1 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.store.sources.empty" }) })) : (sortedMarketplaces.map((marketplace) => {
                        const updating = operationId === `marketplace:update:${marketplace.id}`;
                        const removing = operationId === `marketplace:remove:${marketplace.id}`;
                        return (_jsxs("div", { "data-testid": "plugin-store-source-row", "data-marketplace-id": marketplace.id, className: "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-hover", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "flex min-w-0 items-center gap-1.5", children: _jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: resolveMarketplaceDisplayName(marketplace.id, [marketplace], claudeCodePlugins) }) }), _jsxs("div", { className: "mt-0.5 truncate text-ui-base text-foreground-subtle", children: [intl.formatMessage({ id: "settings.plugins.store.sources.pluginCount" }, { count: String(marketplace.pluginCount) }), marketplace.lastUpdated
                                                    ? ` · ${intl.formatMessage({ id: "settings.plugins.store.sources.lastUpdated" }, { time: formatSourceTime(marketplace.lastUpdated) })}`
                                                    : ""] }), marketplace.refreshFailure &&
                                            // claude-plugins-official 的刷新失败不提示（同 pluginManagementStore.updateMarketplace）。
                                            marketplace.id !== CLAUDE_OFFICIAL_PLUGIN_MARKETPLACE_ID ? (_jsx(PluginStoreSourceRefreshFailure, { failure: marketplace.refreshFailure })) : null] }), _jsx(Button, { type: "button", "data-testid": "plugin-store-source-update", "data-marketplace-id": marketplace.id, variant: "ghost", size: "icon-lg", "aria-label": intl.formatMessage({
                                        id: "settings.plugins.store.sources.update",
                                    }), disabled: updating, onClick: () => onUpdateMarketplace(marketplace.id), children: _jsx(RefreshCw, { className: updating ? "size-3.5 animate-spin" : "size-3.5", "aria-hidden": "true" }) }), isRemovableMarketplace(marketplace) ? (_jsx(Button, { type: "button", "data-testid": "plugin-store-source-remove", "data-marketplace-id": marketplace.id, variant: "ghost", size: "icon-lg", className: "text-destructive hover:bg-destructive/10 hover:text-destructive", "aria-label": intl.formatMessage({
                                        id: "settings.plugins.store.sources.remove",
                                    }), disabled: removing, onClick: () => onRemoveMarketplace(marketplace.id), children: removing ? (_jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" })) : (_jsx(Trash2, { className: "size-3.5", "aria-hidden": "true" })) })) : null] }, marketplace.id));
                    })) })] }) }));
}
function formatSourceTime(value) {
    const time = new Date(value);
    if (Number.isNaN(time.getTime()))
        return value;
    return time.toLocaleString();
}
//# sourceMappingURL=PluginStoreSourcesDialog.js.map