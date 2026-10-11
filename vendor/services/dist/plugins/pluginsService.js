function createRetiredOverview() {
    return {
        marketplaces: [],
        availablePlugins: [],
        installedPlugins: [],
        capability: { supported: false },
    };
}
function throwRetiredPluginManagement() {
    throw new Error("Legacy plugin management has been retired in ZCode Agent mode");
}
export function createPluginsService(_options) {
    return {
        async getOverview(_params) {
            return createRetiredOverview();
        },
        async addMarketplace(_params) {
            throwRetiredPluginManagement();
        },
        async removeMarketplace(_params) {
            throwRetiredPluginManagement();
        },
        async updateMarketplace(_params) {
            throwRetiredPluginManagement();
        },
        async installPlugin(_params) {
            throwRetiredPluginManagement();
        },
        async uninstallPlugin(_params) {
            throwRetiredPluginManagement();
        },
        async setPluginEnabled(_params) {
            throwRetiredPluginManagement();
        },
    };
}
//# sourceMappingURL=pluginsService.js.map