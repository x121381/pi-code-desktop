import type { Event } from "@zcode/rpc";
import type { ZCodePluginOperationProgressNotification, ZCodePluginsConfigureResult, ZCodePluginsCancelOperationResult, ZCodePluginsDescribeResult, ZCodePluginsInstallResult, ZCodePluginsListResult, ZCodePluginsMarketplaceMutationResult, ZCodePluginsOverviewResult, ZCodePluginsReferenceCatalogResult, ZCodePluginsRestoreBuiltinResult, ZCodePluginsSetEnabledResult, ZCodePluginsUninstallResult, ZCodePluginsValidateResult } from "@zcode/shared";
import type { ZCodeAgentAddPluginMarketplaceParams, ZCodeAgentConfigurePluginParams, ZCodeAgentCancelPluginOperationParams, ZCodeAgentDescribePluginParams, ZCodeAgentInstallPluginParams, ZCodeAgentPluginReferenceCatalogParams, ZCodeAgentResolveSuggestedPluginReferenceParams, ZCodeAgentResetPluginConfigParams, ZCodeAgentPluginViewParams, ZCodeAgentRemovePluginMarketplaceParams, ZCodeAgentRestoreBuiltinPluginParams, ZCodeAgentSetPluginEnabledParams, ZCodeAgentUninstallPluginParams, ZCodeAgentUpdatePluginMarketplaceParams, ZCodeAgentUpdatePluginParams, ZCodeAgentValidatePluginParams } from "../zcode-agent/zcodeAgentPluginParams.js";
export interface IPluginManagementService {
    listPlugins(params: ZCodeAgentPluginViewParams): Promise<ZCodePluginsListResult>;
    /**
     * Plugin 对话引用 catalog：
     * 带 sessionId → session-owned 冻结 catalog；不带 → workspace 当前 catalog。
     * 实现路由到 workspace 级 agent client，不走插件管理独立进程。
     */
    getPluginReferenceCatalog(params: ZCodeAgentPluginReferenceCatalogParams): Promise<ZCodePluginsReferenceCatalogResult>;
    resolveSuggestedPluginReference(params: ZCodeAgentResolveSuggestedPluginReferenceParams): Promise<import("@zcode/shared").ZCodePluginsResolveSuggestedReferenceResult>;
    onDynamicPluginOperationProgress(operationId: string): Event<ZCodePluginOperationProgressNotification>;
    getPluginsOverview(params: ZCodeAgentPluginViewParams): Promise<ZCodePluginsOverviewResult>;
    addPluginMarketplace(params: ZCodeAgentAddPluginMarketplaceParams): Promise<ZCodePluginsMarketplaceMutationResult>;
    removePluginMarketplace(params: ZCodeAgentRemovePluginMarketplaceParams): Promise<ZCodePluginsMarketplaceMutationResult>;
    updatePluginMarketplace(params: ZCodeAgentUpdatePluginMarketplaceParams): Promise<ZCodePluginsMarketplaceMutationResult>;
    installPlugin(params: ZCodeAgentInstallPluginParams): Promise<ZCodePluginsInstallResult>;
    cancelPluginOperation(params: ZCodeAgentCancelPluginOperationParams): Promise<ZCodePluginsCancelOperationResult>;
    uninstallPlugin(params: ZCodeAgentUninstallPluginParams): Promise<ZCodePluginsUninstallResult>;
    updatePlugin(params: ZCodeAgentUpdatePluginParams): Promise<ZCodePluginsInstallResult>;
    restoreBuiltinPlugin(params: ZCodeAgentRestoreBuiltinPluginParams): Promise<ZCodePluginsRestoreBuiltinResult>;
    configurePlugin(params: ZCodeAgentConfigurePluginParams): Promise<ZCodePluginsConfigureResult>;
    resetPluginConfig(params: ZCodeAgentResetPluginConfigParams): Promise<ZCodePluginsConfigureResult>;
    validatePlugin(params: ZCodeAgentValidatePluginParams): Promise<ZCodePluginsValidateResult>;
    describePlugin(params: ZCodeAgentDescribePluginParams): Promise<ZCodePluginsDescribeResult>;
    setPluginEnabled(params: ZCodeAgentSetPluginEnabledParams): Promise<ZCodePluginsSetEnabledResult>;
}
export declare const IPluginManagementService: import("../descriptors.js").ServiceDescriptor<IPluginManagementService>;
//# sourceMappingURL=pluginManagement.d.ts.map