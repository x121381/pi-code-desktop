import { EMPTY_PLUGIN_UI_INSTANCE_DERIVATION, } from "../domain/pluginUiInstancePolicy.js";
/**
 * 每个会话最近一次由时间线推导出的逻辑 UI 裁决（renderer 内存）。时间线在 effect 里写入，
 * 工具卡片按 (sessionKey, toolCallId) 读自己的裁决（是否被替代、是否强制常驻）；不持有任何沙箱状态。
 */
const derivations = new Map();
const listeners = new Set();
export function setPluginUiInstanceDerivation(sessionKey, derivation) {
    if (derivations.get(sessionKey) === derivation)
        return;
    derivations.set(sessionKey, derivation);
    for (const listener of listeners)
        listener();
}
export function getPluginUiRowDisposition(sessionKey, toolCallId) {
    return (derivations.get(sessionKey) ?? EMPTY_PLUGIN_UI_INSTANCE_DERIVATION).byToolCallId[toolCallId];
}
export function subscribePluginUiInstances(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
/** 测试用：清空全部记录。 */
export function resetPluginUiInstancesForTest() {
    derivations.clear();
    listeners.clear();
}
//# sourceMappingURL=pluginUiInstanceStore.js.map