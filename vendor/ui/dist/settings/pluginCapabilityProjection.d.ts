import { type StorePluginItem } from "@/settings/pluginStoreListing.js";
import type { SkillSummary, ZCodeCommand, ZCodeInstalledPluginSummary, ZCodePluginInfo, ZCodePluginScope } from "@zcode/shared";
export declare function needsMcpAttention(resource: {
    authorization?: {
        authorizationUrl?: string;
    };
}): boolean;
export declare function selectBuiltInPlugins(plugins: readonly ZCodePluginInfo[], installedPlugins: readonly ZCodeInstalledPluginSummary[]): ZCodePluginInfo[];
export interface PluginSettingsGroups {
    installed: ZCodePluginInfo[];
    builtIn: ZCodePluginInfo[];
}
/**
 * 设置页只展示已物化的插件；Agent 为保留目标 Host 配置而返回的 missing 投影不能
 * 进入 Installed / Built-in，否则会出现“已安装分组 + 未安装状态”的矛盾行。
 */
export declare function partitionPluginsForSettings(plugins: readonly ZCodePluginInfo[], builtInPluginIds: ReadonlySet<string>): PluginSettingsGroups;
export declare function filterPluginsByQuery(plugins: readonly ZCodePluginInfo[], query: string, itemsById?: ReadonlyMap<string, StorePluginItem>, locale?: string): ZCodePluginInfo[];
export declare function selectPluginsForScope(plugins: readonly ZCodePluginInfo[], _installedPlugins: readonly ZCodeInstalledPluginSummary[], _scope: ZCodePluginScope): ZCodePluginInfo[];
export declare function selectSkillsForScope(skills: readonly SkillSummary[], scopedPlugins: readonly Pick<ZCodePluginInfo, "id" | "name" | "enabled">[], scope: ZCodePluginScope): SkillSummary[];
export declare function selectCommandsForScope(commands: readonly ZCodeCommand[], scopedPlugins: readonly Pick<ZCodePluginInfo, "id" | "name" | "enabled">[], scope: ZCodePluginScope): ZCodeCommand[];
export interface SkillSourceGroup {
    id: string;
    label: string;
    pluginId?: string;
    skills: SkillSummary[];
    source: "direct" | "plugin";
}
export declare function groupScopedSkillsBySource(skills: readonly SkillSummary[], directLabel: string): SkillSourceGroup[];
//# sourceMappingURL=pluginCapabilityProjection.d.ts.map