import type { ZCodeAvailablePluginSummary, ZCodeInstalledPluginSummary, ZCodePluginDiagnostic, ZCodePluginInfo, ZCodePluginMarketplaceSummary, ZCodePluginScope, ZCodePluginsDescribeResult } from "@zcode/shared";
import type { IPluginManagementService } from "@zcode/services";
export interface PluginDescribeEntry {
    status: "loading" | "loaded" | "error";
    data?: ZCodePluginsDescribeResult;
    error?: string;
}
export interface PluginManagementState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    configScope: ZCodePluginScope | null;
    plugins: ZCodePluginInfo[];
    marketplaces: ZCodePluginMarketplaceSummary[];
    /** 最近一次 overview 是否成功；false 表示来源存在性未知，不能推导孤立状态。 */
    marketplaceAvailabilityKnown: boolean;
    availablePlugins: ZCodeAvailablePluginSummary[];
    installedPlugins: ZCodeInstalledPluginSummary[];
    restorableBuiltins: ZCodeAvailablePluginSummary[];
    diagnostics: ZCodePluginDiagnostic[];
    loading: boolean;
    error: string | null;
    /**
     * 最近一次失败操作的归属插件：带 pluginId 的操作（如 setEnabled）失败写该
     * id；无插件目标的操作（marketplace add/update/validate、列表加载、refresh）写 null。
     * 消费方（CUA 输入框按钮等）只应把「目标是自己」的 error 当成自身错误，避免共享
     * error 字段把无关失败误映射成自己的错误态。
     */
    lastFailedPluginId: string | null;
    togglingPluginId: string | null;
    operationId: string | null;
    operationVersion: number;
    describeCache: Record<string, PluginDescribeEntry>;
    initialize: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        configScope?: ZCodePluginScope;
        pluginService: IPluginManagementService;
    }) => Promise<void>;
    refresh: (pluginService: IPluginManagementService) => Promise<void>;
    addMarketplace: (source: string, pluginService: IPluginManagementService) => Promise<boolean>;
    updateMarketplace: (marketplace: string | null, pluginService: IPluginManagementService) => Promise<boolean>;
    removeMarketplace: (marketplace: string, pluginService: IPluginManagementService) => Promise<void>;
    installPlugin: (pluginName: string, marketplace: string, pluginService: IPluginManagementService, scope?: ZCodePluginScope) => Promise<void>;
    uninstallPlugin: (pluginId: string, pluginService: IPluginManagementService, removeCache?: boolean) => Promise<void>;
    updatePlugin: (pluginId: string, pluginService: IPluginManagementService) => Promise<void>;
    restoreBuiltin: (pluginId: string, pluginService: IPluginManagementService) => Promise<void>;
    configurePlugin: (pluginId: string, options: Record<string, string | number | boolean>, pluginService: IPluginManagementService, scope?: ZCodePluginScope, clearOptionKeys?: string[]) => Promise<boolean>;
    resetPluginConfig: (pluginId: string, pluginService: IPluginManagementService, scope?: ZCodePluginScope) => Promise<boolean>;
    validateSource: (source: string, pluginService: IPluginManagementService) => Promise<void>;
    setEnabled: (pluginId: string, enabled: boolean, pluginService: IPluginManagementService, scope?: ZCodePluginScope) => Promise<boolean>;
    describePlugin: (pluginId: string, pluginName: string, marketplace: string, pluginService: IPluginManagementService, force?: boolean) => Promise<void>;
}
export declare const usePluginManagementStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PluginManagementState>>;
//# sourceMappingURL=pluginManagementStore.d.ts.map