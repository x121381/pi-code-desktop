import type { IPluginUiAppToolsService, PluginUiAppToolAcceptedResult, PluginUiAppToolCallParams, PluginUiAppToolInstanceParams, PluginUiRegisterAppToolsParams, PluginUiRegisterAppToolsResult, PluginUiResolveAppToolCallParams } from "./appToolsContract.js";
/** 四条 agent 调用都是透传；缺省（web / 远程）时登记与认领抛 unavailable，注销静默。 */
export interface PluginUiAppToolsServiceDependencies {
    registerAppToolsForUi?: (params: PluginUiRegisterAppToolsParams) => Promise<PluginUiRegisterAppToolsResult>;
    unregisterAppToolsForUi?: (params: PluginUiAppToolInstanceParams) => Promise<{
        removed: number;
    }>;
    claimAppToolCallForUi?: (params: PluginUiAppToolCallParams) => Promise<PluginUiAppToolAcceptedResult>;
    resolveAppToolCallForUi?: (params: PluginUiResolveAppToolCallParams) => Promise<PluginUiAppToolAcceptedResult>;
}
export declare function createPluginUiAppToolsService(dependencies?: PluginUiAppToolsServiceDependencies): IPluginUiAppToolsService;
//# sourceMappingURL=pluginUiAppToolsService.d.ts.map