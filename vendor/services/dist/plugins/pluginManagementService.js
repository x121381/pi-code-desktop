export function createPluginManagementService(dependencies) {
    const agent = dependencies.zcodeAgentService;
    return {
        listPlugins: (params) => agent.listPlugins(params),
        getPluginReferenceCatalog: (params) => agent.getPluginReferenceCatalog(params),
        resolveSuggestedPluginReference: (params) => agent.resolveSuggestedPluginReference(params),
        onDynamicPluginOperationProgress: (operationId) => agent.onDynamicPluginOperationProgress(operationId),
        getPluginsOverview: (params) => agent.getPluginsOverview(params),
        addPluginMarketplace: (params) => agent.addPluginMarketplace(params),
        removePluginMarketplace: (params) => agent.removePluginMarketplace(params),
        updatePluginMarketplace: (params) => agent.updatePluginMarketplace(params),
        installPlugin: (params) => agent.installPlugin(params),
        cancelPluginOperation: (params) => agent.cancelPluginOperation(params),
        uninstallPlugin: (params) => agent.uninstallPlugin(params),
        updatePlugin: (params) => agent.updatePlugin(params),
        restoreBuiltinPlugin: (params) => agent.restoreBuiltinPlugin(params),
        configurePlugin: (params) => agent.configurePlugin(params),
        resetPluginConfig: (params) => agent.resetPluginConfig(params),
        validatePlugin: (params) => agent.validatePlugin(params),
        describePlugin: (params) => agent.describePlugin(params),
        setPluginEnabled: (params) => agent.setPluginEnabled(params),
    };
}
//# sourceMappingURL=pluginManagementService.js.map