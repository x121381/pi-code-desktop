import { buildPluginUiSessionKey, } from "../../plugin-ui/contract.js";
const actionsBySession = new Map();
export function registerPluginUiSessionActions(target, actions) {
    actionsBySession.set(buildPluginUiSessionKey(target), actions);
    return () => {
        if (actionsBySession.get(buildPluginUiSessionKey(target)) === actions)
            actionsBySession.delete(buildPluginUiSessionKey(target));
    };
}
export function getPluginUiSessionActions(target) {
    return actionsBySession.get(buildPluginUiSessionKey(target)) ?? null;
}
//# sourceMappingURL=pluginUiSessionActions.js.map