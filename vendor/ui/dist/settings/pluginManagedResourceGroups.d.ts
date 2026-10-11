import type { PluginCommand, McpServerStatus, SkillSummary, UserCommand, ZCodeCommand, ZCodeMcpServer, ZCodeMcpServerStatusSnapshot, ZCodePluginInfo, ZCodePluginsDescribeResult } from "@zcode/shared";
import type { PluginComponentDisplayGroup } from "@/settings/PluginComponentGroups.js";
export interface ResourceGroups<TLocal, TPlugin> {
    local: TLocal[];
    plugin: TPlugin[];
}
/**
 * 把 plugins/describe 的按需结果映射为共享展示分组（名称+描述），并按固定顺序排序、
 * 省略空分组。数量取 items.length（describe 已是权威枚举）。
 */
export declare function describeResultToDisplayGroups(result: ZCodePluginsDescribeResult): PluginComponentDisplayGroup[];
/**
 * 把 plugins/list 下发的权威 components（名称+描述）映射为共享展示分组，逻辑与
 * describeResultToDisplayGroups 一致：按固定顺序排序、省略空分组、数量取 items.length。
 *
 * 已安装详情弹窗过去用 buildPluginComponentGroups —— 数量取协议 skillCount、名称靠
 * UI 侧 join（skillsService 结果按 pluginName 过滤）。两数据源分离导致停用插件整组消失、
 * 启用插件只有数量没有名称。现在 CLI 已对插件根目录做权威枚举并随 list 下发 components，
 * 这里直接用它，彻底去掉脆弱的 join。
 */
export declare function buildInstalledPluginDisplayGroups(plugin: ZCodePluginInfo): PluginComponentDisplayGroup[];
export interface PluginMcpServerItem {
    active: boolean;
    authorization?: ZCodeMcpServerStatusSnapshot["authorization"];
    error?: string;
    failureKind?: ZCodeMcpServerStatusSnapshot["failureKind"];
    id: string;
    hostProvided?: boolean;
    name: string;
    pluginEnabled: boolean;
    pluginId: string;
    pluginMarketplace: string;
    pluginName: string;
    runtimeServerName: string;
    serverRequestId?: string;
    status?: McpServerStatus;
    toolCount?: number;
}
export interface PluginMcpServerGroup {
    items: PluginMcpServerItem[];
    pluginId: string;
    pluginName: string;
}
export declare function groupPluginMcpServersByPlugin(items: readonly PluginMcpServerItem[]): PluginMcpServerGroup[];
export declare function groupSkillsByPlugin(skills: SkillSummary[], query: string): ResourceGroups<SkillSummary, SkillSummary>;
export declare function groupCommandsByPlugin(commands: ZCodeCommand[], query: string): ResourceGroups<UserCommand, PluginCommand>;
export declare function filterLocalMcpServers(servers: ZCodeMcpServer[], query: string): ZCodeMcpServer[];
export declare function buildPluginMcpServerItems(plugins: ZCodePluginInfo[], query: string, statusSnapshots?: Record<string, ZCodeMcpServerStatusSnapshot>): PluginMcpServerItem[];
//# sourceMappingURL=pluginManagedResourceGroups.d.ts.map