import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIsOfficeMode } from "../hooks/useInterfaceMode.js";
/* eslint-disable max-lines -- 商店列表页把标题/搜索/已安装条/公开-个人分段/Featured/分类折叠聚合成一个连贯浏览面，拆散反而难以维持 1:1 布局。 */
import { useMemo, useState } from "react";
import { Download, Loader2, Settings2 } from "lucide-react";
import { ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID } from "@zcode/shared";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { PluginStoreAvatar } from "../settings/PluginStoreAvatar.js";
import { PluginStoreCard } from "../settings/PluginStoreCard.js";
import { SettingsSearchInput } from "../settings/SettingsSearchInput.js";
import { FALLBACK_CATEGORY, KNOWN_CATEGORY_LABEL_IDS, canUpdatePluginItem, groupItemsByCategory, isPublicStoreMarketplaceId, resolveItemDisplayName, selectFeaturedItems, sortInstalledStripItems, sortPersonalMarketplaceGroups, storeItemMatches, } from "../settings/pluginStoreListing.js";
import { resolveMarketplaceDisplayName } from "../settings/pluginSourceLabel.js";
// 分类/市场分组手动收起后的展示数量；默认完整展示，避免较少的插件又被自动隐藏。
const CATEGORY_VISIBLE_LIMIT = 6;
const RETIRED_STORE_PLUGIN_ID = `restore-legacy-sessions@${ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID}`;
export function PluginStoreListView({ items: allItems, order, marketplaces, actions, loading, query, onQueryChange, segment, onSegmentChange, onOpenManage, }) {
    const { intl, locale } = useZCodeIntl();
    const isOfficeMode = useIsOfficeMode();
    const modeOrder = isOfficeMode ? order?.work : order?.code;
    const keyword = query.trim().toLowerCase();
    const [expandedGroups, setExpandedGroups] = useState({});
    // 旧版会话恢复入口退出市场；统一过滤所有浏览投影，旧缓存/精选也不能重新露出。
    // 完整 ID 只命中官方插件，插件管理页继续使用原始条目管理已有安装。
    const items = useMemo(() => allItems.filter((item) => item.id !== RETIRED_STORE_PLUGIN_ID), [allItems]);
    const installedItems = useMemo(() => sortInstalledStripItems(items.filter((item) => item.installed), locale), [items, locale]);
    const publicItems = useMemo(() => items.filter((item) => isPublicStoreMarketplaceId(item.marketplace)), [items]);
    const personalItems = useMemo(() => items.filter((item) => !isPublicStoreMarketplaceId(item.marketplace)), [items]);
    const resolveCategoryLabel = useMemo(() => {
        return (category) => {
            const labelId = KNOWN_CATEGORY_LABEL_IDS[category];
            return labelId ? intl.formatMessage({ id: labelId }) : category;
        };
    }, [intl]);
    const featuredItems = useMemo(() => selectFeaturedItems(publicItems, marketplaces), [marketplaces, publicItems]);
    const categoryGroups = useMemo(() => groupItemsByCategory(publicItems, locale, modeOrder), [locale, publicItems, modeOrder]);
    // 个人分段：按市场分组，最近刷新的市场排最前（见 sortPersonalMarketplaceGroups）。
    const personalGroups = useMemo(() => {
        const claudeCodePlugins = intl.formatMessage({
            id: "settings.plugins.marketplace.claudeCodePlugins",
        });
        const groups = new Map();
        for (const item of personalItems) {
            const group = groups.get(item.marketplace) ?? [];
            group.push(item);
            groups.set(item.marketplace, group);
        }
        const titled = [...groups.entries()].map(([marketplace, groupItems]) => ({
            marketplace,
            title: resolveMarketplaceDisplayName(marketplace, marketplaces, claudeCodePlugins),
            items: groupItems.toSorted((left, right) => resolveItemDisplayName(left, locale).localeCompare(resolveItemDisplayName(right, locale), locale)),
        }));
        return sortPersonalMarketplaceGroups(titled, marketplaces, locale);
    }, [intl, locale, marketplaces, personalItems]);
    const searchResults = useMemo(() => {
        if (!keyword)
            return [];
        return items
            .filter((item) => storeItemMatches(item, keyword, locale))
            .toSorted((left, right) => resolveItemDisplayName(left, locale).localeCompare(resolveItemDisplayName(right, locale), locale));
    }, [items, keyword, locale]);
    const toggleGroup = (key) => {
        setExpandedGroups((current) => ({ ...current, [key]: !(current[key] ?? true) }));
    };
    return (_jsxs("div", { className: "space-y-8", "data-testid": "plugin-store-list", children: [_jsx(SettingsSearchInput, { "data-testid": "plugin-store-search", value: query, onChange: (event) => onQueryChange(event.target.value), placeholder: intl.formatMessage({
                    id: "settings.plugins.store.searchPlaceholder",
                }) }), installedItems.length > 0 ? (_jsxs("section", { "data-testid": "plugin-store-installed-strip", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2", children: [_jsx("h2", { className: "text-ui-lg font-semibold text-foreground", children: intl.formatMessage({
                                    id: "settings.plugins.store.installedStrip",
                                }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({
                                    id: "settings.plugins.store.manageInstalled",
                                }), children: _jsx(Button, { type: "button", "data-testid": "plugin-store-manage-open", variant: "outline", size: "icon-lg", "aria-label": intl.formatMessage({
                                        id: "settings.plugins.store.manageInstalled",
                                    }), onClick: onOpenManage, children: _jsx(Settings2, { className: "size-4", "aria-hidden": "true" }) }) })] }), _jsx("div", { className: "mt-1 flex items-center gap-3 overflow-x-auto px-2 pt-2 pb-1 sm:-mx-2", children: installedItems.map((item) => {
                            const displayName = resolveItemDisplayName(item, locale);
                            const updating = actions.operationId === `plugin:update:${item.id}`;
                            return (_jsx(ControlHintTooltip, { title: displayName, side: "top", sideOffset: 8, children: _jsxs("div", { className: "relative shrink-0", children: [_jsx("button", { type: "button", "data-testid": "plugin-store-installed-item", "data-plugin-id": item.id, "aria-label": displayName, className: "shrink-0 rounded-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => actions.onOpenDetail(item.id), children: _jsx(PluginStoreAvatar, { item: item, className: "size-10" }) }), canUpdatePluginItem(item) ? (_jsx("button", { type: "button", "data-testid": "plugin-store-installed-item-update", "data-plugin-id": item.id, "aria-label": intl.formatMessage({ id: "settings.plugins.detail.update" }), className: "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused disabled:opacity-60", disabled: actions.operationId !== null, onClick: (event) => {
                                                event.stopPropagation();
                                                actions.onUpdate(item.id);
                                            }, children: updating ? (_jsx(Loader2, { className: "size-2.5 animate-spin", "aria-hidden": "true" })) : (_jsx(Download, { className: "size-2.5", "aria-hidden": "true" })) })) : null] }) }, item.id));
                        }) })] })) : null, _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(SegmentPill, { active: segment === "public", testId: "plugin-store-segment-public", label: intl.formatMessage({
                            id: "settings.plugins.store.segment.public",
                        }), onClick: () => onSegmentChange("public") }), _jsx(SegmentPill, { active: segment === "personal", testId: "plugin-store-segment-personal", label: intl.formatMessage({
                            id: "settings.plugins.store.segment.personal",
                        }), onClick: () => onSegmentChange("personal") })] }), keyword ? (_jsx(StoreSection, { title: intl.formatMessage({ id: "settings.plugins.store.searchResults" }, { count: String(searchResults.length) }), children: searchResults.length === 0 ? (_jsx("p", { className: "rounded-xl border border-dashed border-border px-4 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.store.searchEmpty" }) })) : (_jsx(CardGrid, { items: searchResults, actions: actions, locale: locale })) }, "search")) : segment === "public" ? (_jsx(PublicSegment, { actions: actions, categoryGroups: categoryGroups, expandedGroups: expandedGroups, featuredItems: featuredItems, loading: loading, locale: locale, resolveCategoryLabel: resolveCategoryLabel, onToggleGroup: toggleGroup })) : (_jsx(PersonalSegment, { actions: actions, expandedGroups: expandedGroups, groups: personalGroups, locale: locale, onToggleGroup: toggleGroup }))] }));
}
export function SegmentPill({ active, label, onClick, testId, }) {
    return (_jsx("button", { type: "button", "data-testid": testId, "aria-pressed": active, className: cn("rounded-full px-3 py-1 text-ui-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", active
            ? "bg-selected text-foreground"
            : "text-foreground-subtle hover:bg-hover hover:text-foreground"), onClick: onClick, children: label }));
}
function StoreSection({ title, children, className, }) {
    return (_jsxs("section", { className: className, children: [_jsx("div", { className: "pb-2", children: _jsx("h2", { className: "text-ui-lg font-semibold text-foreground", children: title }) }), _jsx("div", { "aria-hidden": "true", className: "h-px bg-surface" }), _jsx("div", { className: "mt-2", children: children })] }));
}
function CardGrid({ items, actions, locale, }) {
    return (_jsx("div", { className: "grid gap-x-6 gap-y-1 sm:grid-cols-2", children: items.map((item) => (_jsx(PluginStoreCard, { item: item, actions: actions, locale: locale }, item.id))) }));
}
/** 分类/市场分组：默认全部展开，手动收起后展示前 6 个和展开入口。 */
function CollapsibleCardGroup({ groupKey, items, expanded, onToggle, actions, locale, }) {
    const { intl } = useZCodeIntl();
    const visible = expanded ? items : items.slice(0, CATEGORY_VISIBLE_LIMIT);
    const hidden = expanded ? [] : items.slice(CATEGORY_VISIBLE_LIMIT);
    const hiddenNames = hidden.slice(0, 2).map((item) => resolveItemDisplayName(item, locale));
    return (_jsxs("div", { children: [_jsx(CardGrid, { items: visible, actions: actions, locale: locale }), hidden.length > 0 ? (_jsxs("button", { type: "button", "data-testid": "plugin-store-group-toggle", "data-group-key": groupKey, className: "mt-2 flex w-full min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-left text-ui-base text-foreground-subtle transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => onToggle(groupKey), children: [_jsx("span", { className: "flex shrink-0 items-center gap-1.5", "aria-hidden": "true", children: hidden.slice(0, 3).map((item) => (_jsx(PluginStoreAvatar, { item: item, className: "size-5 rounded-md", iconClassName: "size-2.5" }, item.id))) }), _jsx("span", { className: "min-w-0 truncate", children: hidden.length > hiddenNames.length
                            ? intl.formatMessage({ id: "settings.plugins.store.viewMore" }, {
                                names: hiddenNames.join(intl.formatMessage({ id: "common.listSeparator" })),
                                count: String(hidden.length - hiddenNames.length),
                            })
                            : intl.formatMessage({ id: "settings.plugins.store.viewMoreFew" }, {
                                names: hiddenNames.join(intl.formatMessage({ id: "common.listSeparator" })),
                            }) })] })) : expanded && items.length > CATEGORY_VISIBLE_LIMIT ? (_jsx("button", { type: "button", "data-testid": "plugin-store-group-toggle", "data-group-key": groupKey, className: "mt-2 rounded-xl px-2 py-2 text-ui-base text-foreground-subtle transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", onClick: () => onToggle(groupKey), children: intl.formatMessage({ id: "settings.plugins.store.showLess" }) })) : null] }));
}
function PublicSegment({ actions, categoryGroups, expandedGroups, featuredItems, loading, locale, resolveCategoryLabel, onToggleGroup, }) {
    const { intl } = useZCodeIntl();
    const isEmpty = featuredItems.length === 0 && categoryGroups.length === 0;
    if (isEmpty) {
        return (_jsx("p", { className: "rounded-xl border border-dashed border-border px-4 py-3 text-ui-base text-foreground-subtle", children: loading
                ? intl.formatMessage({
                    id: "settings.plugins.marketplace.catalogLoading",
                })
                : intl.formatMessage({
                    id: "settings.plugins.marketplacePlugins.empty",
                }) }));
    }
    return (_jsxs("div", { children: [featuredItems.length > 0 ? (_jsx(StoreSection, { title: intl.formatMessage({ id: "settings.plugins.store.featured" }), className: "py-4 first:pt-0 last:pb-0", children: _jsx(CardGrid, { items: featuredItems, actions: actions, locale: locale }) })) : null, categoryGroups.map((group) => (_jsx(StoreSection, { className: "py-4 first:pt-0 last:pb-0", title: group.category === FALLBACK_CATEGORY
                    ? intl.formatMessage({
                        id: "settings.plugins.store.category.other",
                    })
                    : resolveCategoryLabel(group.category), children: _jsx(CollapsibleCardGroup, { groupKey: `category:${group.category}`, items: group.items, expanded: expandedGroups[`category:${group.category}`] ?? true, onToggle: onToggleGroup, actions: actions, locale: locale }) }, group.category)))] }));
}
function PersonalSegment({ actions, expandedGroups, groups, locale, onToggleGroup, }) {
    const { intl } = useZCodeIntl();
    if (groups.length === 0) {
        return (_jsx("p", { className: "rounded-xl border border-dashed border-border px-4 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.plugins.store.personalEmpty" }) }));
    }
    return (_jsx("div", { children: groups.map((group) => (_jsx(StoreSection, { title: group.title, className: "py-4 first:pt-0 last:pb-0", children: _jsx(CollapsibleCardGroup, { groupKey: `marketplace:${group.marketplace}`, items: group.items, expanded: expandedGroups[`marketplace:${group.marketplace}`] ?? true, onToggle: onToggleGroup, actions: actions, locale: locale }) }, group.marketplace))) }));
}
//# sourceMappingURL=PluginStoreListView.js.map