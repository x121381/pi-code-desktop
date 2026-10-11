import { buildPluginUiSessionKey } from "../contract.js";
/**
 * server 资源通知的路由表（renderer 内存）。
 * 键 = (会话键, 插件, 沙箱作用域, 实例代际)；投影增量里的 subscribers 携带完整运行凭证，
 * 会话与插件由投喂方（该会话的投影 store）补上。没有登记的订阅者直接丢弃——实例已销毁或已换代。
 */
const targets = new Map();
function buildKey(sessionKey, pluginId, scopeId, generation, instance) {
    return JSON.stringify([
        sessionKey,
        pluginId,
        scopeId,
        generation,
        instance.runtimeId,
        instance.appIdentity,
        instance.token,
    ]);
}
export function registerPluginUiResourceTarget(sessionKey, pluginId, scopeId, generation, target, instance) {
    const key = buildKey(sessionKey, pluginId, scopeId, generation, instance);
    targets.set(key, target);
    return () => {
        if (targets.get(key) === target)
            targets.delete(key);
    };
}
/** 返回实际投递到的实例数（单测与日志用）。 */
export function dispatchPluginUiResourceDelta(sessionKey, delta) {
    let delivered = 0;
    for (const subscriber of delta.subscribers) {
        const target = targets.get(buildKey(sessionKey, delta.serverName, subscriber.scopeId, subscriber.generation, subscriber.instance));
        if (!target)
            continue;
        delivered += 1;
        if (delta.op === "pluginUi.instanceClosed")
            target.notifyInstanceClosed?.();
        else if (delta.op === "pluginUi.resourceUpdated")
            target.notifyResourceUpdated(delta.uri);
        else if (delta.op === "pluginUi.appToolCall") {
            target.notifyAppToolCall({
                activity: delta.activity,
                cancelled: delta.cancelled,
                callId: delta.callId,
                toolName: delta.toolName,
                arguments: delta.arguments,
            });
        }
        else
            target.notifyResourceListChanged();
    }
    return delivered;
}
/** 给 controller 的登记入口：实例身份（会话 / 插件 / 作用域）固定，代际由 controller 在端口到达时给出。 */
export function createPluginUiResourceNotificationRegistrar(scope, pluginId) {
    const sessionKey = buildPluginUiSessionKey(scope);
    return {
        register: (generation, target, instance) => registerPluginUiResourceTarget(sessionKey, pluginId, instance.token, generation, target, instance),
    };
}
export function resetPluginUiResourceTargetsForTest() {
    targets.clear();
}
//# sourceMappingURL=pluginUiResourceNotificationBus.js.map