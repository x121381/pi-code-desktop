import type { IZCodeAgentService } from "../zcode-agent/zcodeAgent.js";
import type { IPluginManagementService } from "./pluginManagement.js";
export interface PluginManagementServiceDependencies {
    zcodeAgentService: Pick<IZCodeAgentService, "listPlugins" | "getPluginReferenceCatalog" | "resolveSuggestedPluginReference" | "onDynamicPluginOperationProgress" | "getPluginsOverview" | "addPluginMarketplace" | "removePluginMarketplace" | "updatePluginMarketplace" | "installPlugin" | "cancelPluginOperation" | "uninstallPlugin" | "updatePlugin" | "restoreBuiltinPlugin" | "configurePlugin" | "resetPluginConfig" | "validatePlugin" | "describePlugin" | "setPluginEnabled">;
}
export declare function createPluginManagementService(dependencies: PluginManagementServiceDependencies): IPluginManagementService;
//# sourceMappingURL=pluginManagementService.d.ts.map