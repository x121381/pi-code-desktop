import type { PluginStoreModeOrder } from "./pluginStoreOrder.js";
export declare const FALLBACK_PLUGIN_STORE_CATEGORY = "other";
export declare const PLUGIN_STORE_CATEGORY_ORDER: readonly string[];
export declare function compareDocumentPluginPriority(leftId: string, rightId: string): number;
/** 分类归并只影响展示，市场与引用 Picker 必须使用同一个排序键。 */
export declare function resolvePluginStoreCategory(category: string | undefined): string | undefined;
interface PluginStoreSortEntry {
    id: string;
    category?: string;
    displayName: string;
}
/** 纯展示排序：配置优先，剩余分类按产品默认顺序，类内文档插件优先，再按本地化名称稳定兜底。 */
export declare function sortPluginStoreEntries<T>(items: readonly T[], project: (item: T) => PluginStoreSortEntry, locale: string, order?: PluginStoreModeOrder): T[];
export {};
//# sourceMappingURL=pluginStoreOrdering.d.ts.map