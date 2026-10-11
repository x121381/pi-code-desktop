import { PluginUiBridgeError } from "./pluginUiBridgeService.js";
const unavailable = () => new PluginUiBridgeError("unavailable", "Plugin UI app tools are unavailable in this runtime");
export function createPluginUiAppToolsService(dependencies = {}) {
    return {
        async registerAppTools(params) {
            if (!dependencies.registerAppToolsForUi)
                throw unavailable();
            return dependencies.registerAppToolsForUi(params);
        },
        async unregisterAppTools(params) {
            if (!dependencies.unregisterAppToolsForUi)
                return { removed: 0 };
            return dependencies.unregisterAppToolsForUi(params);
        },
        async claimAppToolCall(params) {
            if (!dependencies.claimAppToolCallForUi)
                throw unavailable();
            return dependencies.claimAppToolCallForUi(params);
        },
        async resolveAppToolCall(params) {
            if (!dependencies.resolveAppToolCallForUi)
                throw unavailable();
            return dependencies.resolveAppToolCallForUi(params);
        },
    };
}
//# sourceMappingURL=pluginUiAppToolsService.js.map