import { useSyncExternalStore } from "react";
let currentState = "idle";
const listeners = new Set();
function subscribe(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
function getSnapshot() {
    return currentState;
}
export function setWebRemoteControlTerminalTransportState(state) {
    if (currentState === state) {
        return;
    }
    currentState = state;
    for (const listener of listeners) {
        listener();
    }
}
export function useWebRemoteControlTerminalTransportState(serverSnapshot = currentState) {
    // Bugfix: 手机远控 transport 状态可能在 relay 抖动时快速变化。
    // 这里用轻量外部订阅只更新重连提示，避免为了 toast 反复重渲染整棵 Root/App。
    return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
//# sourceMappingURL=webRemoteControlTerminalTransportState.js.map