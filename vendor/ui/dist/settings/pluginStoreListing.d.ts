import type { PluginStoreModeOrder, ZCodeAvailablePluginSummary, ZCodeInstalledPluginSummary, ZCodePluginInfo, ZCodePluginMarketplaceSummary, ZCodePluginStoreListing } from "@zcode/shared";
import { isPublicStoreMarketplaceId } from "@zcode/shared";
export { formatCanonicalPluginName, resolveLocalizedText, resolvePluginDisplayName, } from "@zcode/shared";
export { isPublicStoreMarketplaceId };
export { isTrustedImageUrl } from "@/lib/trustedImageUrl.js";
/**
 * 仅在名称唯一时允许从目录条目回退解析 listing。
 * 能力协议的旧 payload 可能没有 pluginId；同名插件并存时继续按裸名称 join
 * 会把第三方条目的品牌和图标误挂到另一个 marketplace，安全降级为 slug 更可靠。
 */
export declare function resolveUniquePluginListingByName(plugins: readonly Pick<ZCodeAvailablePluginSummary, "name" | "listing">[], name: string): ZCodePluginStoreListing | undefined;
/**
 * 商店条目：把 overview 的目录条目（listing/安装态）、运行时插件信息（启用态/组件）与
 * 已安装记录（更新徽标/安装时间）按 id join 成 UI 单一视图模型。
 */
export interface StorePluginItem {
    id: string;
    name: string;
    marketplace: string;
    installed: boolean;
    /** 已卸载的内置插件（可恢复）：安装按钮走 restoreBuiltin。 */
    restorable: boolean;
    /** 已安装但原 marketplace 已移除；仍可运行和管理，但不能更新。 */
    orphaned: boolean;
    listing?: ZCodePluginStoreListing;
    summary?: ZCodeAvailablePluginSummary;
    /** 运行时信息（仅已发现的已安装插件有）：启用态、组件、manifest 回退字段。 */
    info?: ZCodePluginInfo;
    installedMeta?: ZCodeInstalledPluginSummary;
}
export type PluginUpdateStatus = NonNullable<ZCodeInstalledPluginSummary["updateStatus"]>;
export declare function isPluginUpdatePending(updateStatus: PluginUpdateStatus | undefined): updateStatus is Exclude<PluginUpdateStatus, "none">;
/**
 * 孤立插件可能保留删除来源前的 updateStatus；若各入口只判断该缓存状态，
 * 详情页会在菜单已禁用更新时仍显示更新按钮。更新能力必须同时满足“来源存在”和“有更新”。
 */
export declare function canUpdatePluginItem(item: Pick<StorePluginItem, "installedMeta" | "orphaned"> | null | undefined): boolean;
export declare function resolveLocalizedList(locale: string, base: string[] | undefined, i18n: Record<string, string[]> | undefined): string[] | undefined;
export declare function formatCanonicalMarketplaceName(name: string, locale: string): string;
export declare function resolveItemDisplayName(item: StorePluginItem, locale: string): string;
export declare function resolveItemDescription(item: StorePluginItem, locale: string): string | undefined;
/** 管理列表与商店复用完整 ID 关联的展示信息，避免英文 manifest 绕过本地化。 */
export declare function resolveManagedPluginDisplay(plugin: ZCodePluginInfo, item: StorePluginItem | undefined, locale: string): {
    name: string;
    description: string | undefined;
};
/** 已知分类的 i18n 映射；未知分类原样展示。无分类 → "other" 区块（排最后）。 */
export declare const KNOWN_CATEGORY_LABEL_IDS: Record<string, string>;
export { resolvePluginStoreCategory as resolveStoreCategory, FALLBACK_PLUGIN_STORE_CATEGORY as FALLBACK_CATEGORY, PLUGIN_STORE_CATEGORY_ORDER as KNOWN_CATEGORY_ORDER, } from "@zcode/shared";
export interface StoreCategoryGroup {
    category: string;
    items: StorePluginItem[];
}
/** 个人分段的市场分组：marketplace 是排序键，title 是展示名。 */
export interface PersonalMarketplaceGroup {
    marketplace: string;
    title: string;
    items: StorePluginItem[];
}
/**
 * 市场源管理排序：官方源固定置顶；自定义源按最近刷新时间倒序，未刷新过的沉底。
 * 同一时间使用本地化名称稳定兜底，避免市场源顺序随持久化数组历史漂移。
 */
export declare function sortMarketplaceSources(marketplaces: readonly ZCodePluginMarketplaceSummary[], locale: string): ZCodePluginMarketplaceSummary[];
/**
 * 个人分段市场分组排序：按 lastUpdated 倒序——最近刷新/添加的市场在最上，
 * 用户添加成功跳转过来第一眼就能看到；无 lastUpdated（官方 seed 未刷新过）的沉底，
 * 同刻或都缺失时按显示名字母序稳定兜底。ISO 时间串的字典序即时间序。
 */
export declare function sortPersonalMarketplaceGroups(groups: PersonalMarketplaceGroup[], marketplaces: readonly ZCodePluginMarketplaceSummary[], locale: string): PersonalMarketplaceGroup[];
/**
 * 把 overview 数据 join 成商店条目集合。
 * 条目宇宙 = availablePlugins ∪ restorableBuiltins ∪ 实际发现的插件包（覆盖 inline/孤儿插件）。
 */
export declare function buildStoreItems(input: {
    marketplaces: ZCodePluginMarketplaceSummary[];
    marketplaceAvailabilityKnown: boolean;
    availablePlugins: ZCodeAvailablePluginSummary[];
    installedPlugins: ZCodeInstalledPluginSummary[];
    plugins: ZCodePluginInfo[];
    restorableBuiltins: ZCodeAvailablePluginSummary[];
}): StorePluginItem[];
/** 公开分段：Featured（CDN featured 名单按序）+ 分类聚合（无分类归 other，排最后）。 */
export declare function selectFeaturedItems(publicItems: StorePluginItem[], marketplaces: ZCodePluginMarketplaceSummary[]): StorePluginItem[];
export declare function groupItemsByCategory(items: StorePluginItem[], locale: string, order?: PluginStoreModeOrder): StoreCategoryGroup[];
export declare function storeItemMatches(item: StorePluginItem, keyword: string, locale: string): boolean;
/**
 * 已安装图标条排序：官方文档插件优先，其余内置/inline 按名称稳定排序；
 * 市场安装插件随后按安装时间倒序，同一时间再按名称排序。
 */
export declare function sortInstalledStripItems(items: StorePluginItem[], locale: string): StorePluginItem[];
//# sourceMappingURL=pluginStoreListing.d.ts.map