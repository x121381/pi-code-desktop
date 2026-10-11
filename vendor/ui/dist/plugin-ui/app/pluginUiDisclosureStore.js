/**
 * 用户对插件卡片的手动固定 / 收起（renderer 视图态，不持久化）。
 * 键为 sessionKey + toolCallId；true = 固定常驻（不进折叠区），false = 收起（进折叠区），未记录按默认规则
 * （强制常驻 / 最近三回合自动展开）。资源级 `showInline` 在句柄到达时也写成 true（只在没有手动记录时）。
 */
const pins = new Map();
const listeners = new Set();
let version = 0;
const keyOf = (sessionKey, toolCallId) => `${sessionKey}\u0000${toolCallId}`;
export function getPluginUiManualPin(sessionKey, toolCallId) {
    return pins.get(keyOf(sessionKey, toolCallId));
}
export function setPluginUiManualPin(sessionKey, toolCallId, pinned) {
    const key = keyOf(sessionKey, toolCallId);
    if (pins.get(key) === pinned)
        return;
    if (pinned === undefined)
        pins.delete(key);
    else
        pins.set(key, pinned);
    version += 1;
    for (const listener of listeners)
        listener();
}
/** 订阅快照：任一记录变化即递增，时间线据此重建折叠边界。 */
export function getPluginUiDisclosureVersion() {
    return version;
}
export function subscribePluginUiDisclosure(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
/** 测试用：清空全部记录。 */
export function resetPluginUiDisclosureForTest() {
    pins.clear();
    listeners.clear();
    version = 0;
}
//# sourceMappingURL=pluginUiDisclosureStore.js.map