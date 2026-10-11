import { PluginUiPageManager } from "../app/pluginUiPageManager.js";
const listeners = new Map();
export const sandboxPages = new PluginUiPageManager((run, ms) => {
    const timer = setTimeout(run, ms);
    return () => clearTimeout(timer);
}, () => { }, (key) => {
    for (const listener of listeners.get(key) ?? [])
        listener();
});
export function onSandboxPageRemoved(key, listener) {
    const set = listeners.get(key) ?? new Set();
    listeners.set(key, set);
    set.add(listener);
    return () => {
        set.delete(listener);
        if (!set.size)
            listeners.delete(key);
    };
}
if (typeof window !== "undefined")
    window.addEventListener("beforeunload", () => sandboxPages.clear());
//# sourceMappingURL=sandboxPageOwners.js.map