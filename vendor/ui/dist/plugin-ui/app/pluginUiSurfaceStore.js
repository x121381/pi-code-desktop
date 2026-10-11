const surfaces = new Map();
const listeners = new Set();
function notify() {
    for (const listener of listeners)
        listener();
}
export function claimPluginUiSurface(key, surface) {
    const token = Symbol();
    const claims = surfaces.get(key) ?? new Map();
    const before = getPluginUiSurface(key);
    claims.set(token, surface);
    surfaces.set(key, claims);
    if (before !== getPluginUiSurface(key))
        notify();
    return () => {
        const before = getPluginUiSurface(key);
        claims.delete(token);
        if (!claims.size && surfaces.get(key) === claims)
            surfaces.delete(key);
        if (before !== getPluginUiSurface(key))
            notify();
    };
}
export function getPluginUiSurface(key) {
    const claims = surfaces.get(key);
    return claims?.size
        ? [...claims.values()].includes("side-pane")
            ? "side-pane"
            : "inline"
        : null;
}
export function subscribePluginUiSurfaces(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
/** 测试用：清空全部记录。 */
export function resetPluginUiSurfacesForTest() {
    surfaces.clear();
    listeners.clear();
}
//# sourceMappingURL=pluginUiSurfaceStore.js.map