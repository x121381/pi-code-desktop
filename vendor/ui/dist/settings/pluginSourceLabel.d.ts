import type { ZCodePluginMarketplaceSummary } from "@zcode/shared";
/**
 * 把 marketplace id 解析为对用户友好的展示名：
 * 优先用 marketplaces 概览里的 name，缺失时回落到原始 id。
 * 纯函数，便于在目录标题栏与已安装来源标签间复用同一套命名。
 */
export declare function resolveMarketplaceDisplayName(marketplaceId: string, marketplaces: readonly ZCodePluginMarketplaceSummary[], claudeCodePluginsLabel: string): string;
/**
 * 已安装插件的来源标签，只分两类：
 * - 从市场安装 (source==="cache") → 「从 {市场名} 安装」；
 * - 其它 (official / inline 等) → 「内置」。
 */
export declare function resolvePluginSourceLabel(input: {
    source: string;
    marketplace: string;
    marketplaces: readonly ZCodePluginMarketplaceSummary[];
    builtinLabel: string;
    claudeCodePluginsLabel: string;
    formatFromMarketplace: (marketplaceName: string) => string;
}): string;
//# sourceMappingURL=pluginSourceLabel.d.ts.map