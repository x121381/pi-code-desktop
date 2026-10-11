export interface DefaultPluginMarketplace {
    id: string;
    source: string;
    name: string;
    description: string;
    pluginCount: number;
    lastUpdated?: string;
}
export declare const ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID = "zcode-plugins-official";
/**
 * Claude Code 官方市场（GitHub git 源）。它不是 ZCode 的强依赖：GitHub 不可达时刷新必然失败，
 * 该失败不应作为错误提示打扰用户，UI 侧按此 id 静默处理其刷新失败（任何原因）。
 */
export declare const CLAUDE_OFFICIAL_PLUGIN_MARKETPLACE_ID = "claude-plugins-official";
/** Settings 三类资源发现共用；Bootstrap 单测与官方 definition 的 defaultEnabled 机械对照。 */
export declare const DEFAULT_ENABLED_OFFICIAL_PLUGIN_IDS: ReadonlySet<string>;
export declare const DEFAULT_PLUGIN_MARKETPLACES: DefaultPluginMarketplace[];
export declare const PUBLIC_STORE_MARKETPLACE_IDS: readonly ["zcode-plugins-official"];
export declare function isPublicStoreMarketplaceId(id: string): boolean;
//# sourceMappingURL=plugin-marketplaces.d.ts.map