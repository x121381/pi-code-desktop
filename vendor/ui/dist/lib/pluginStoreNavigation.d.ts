export interface PluginStoreOpenTarget {
    pluginId?: string;
    intent?: "add-marketplace";
    returnScopeKey?: string;
}
/** 统一承载 Store 入口的目标插件与 Settings 返回位置。Marketplace 只允许返回 User 视图。 */
export declare function requestPluginStoreOpen(value?: string | PluginStoreOpenTarget): void;
export declare function consumePluginStoreOpenTarget(): PluginStoreOpenTarget | null;
export declare function addPluginStoreOpenListener(listener: (target: PluginStoreOpenTarget) => void): () => void;
//# sourceMappingURL=pluginStoreNavigation.d.ts.map