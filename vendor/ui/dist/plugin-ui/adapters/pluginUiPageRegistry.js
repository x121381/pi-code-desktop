import { sandboxPages, onSandboxPageRemoved } from "./sandboxPageOwners.js";
export const pluginUiPages = {
    get(key) {
        const page = sandboxPages.get(key);
        return page?.kind === "mcp" ? page : undefined;
    },
    add: (page) => sandboxPages.add(page),
    reserve: (page) => sandboxPages.reserve(page),
    released: (page) => sandboxPages.released(page),
    visibility: (page, visible) => sandboxPages.visibility(page, visible),
    settled: (page) => sandboxPages.settled(page),
    removeTask: (task) => sandboxPages.removeTask(task),
    clear: () => sandboxPages.clear(),
};
const pageSubscribers = new Map();
export function subscribePage(key, listener) {
    const set = pageSubscribers.get(key) ?? new Set();
    set.add(listener);
    pageSubscribers.set(key, set);
    let off;
    const connect = () => {
        off?.();
        off = pluginUiPages.get(key)?.subscribe(listener);
        listener();
    };
    set.delete(listener);
    set.add(connect);
    const offRemoved = onSandboxPageRemoved(key, connect);
    connect();
    return () => {
        off?.();
        offRemoved();
        set.delete(connect);
        if (!set.size)
            pageSubscribers.delete(key);
    };
}
export function bindPluginUiPage(key, node, sidebar) {
    let off;
    let bound;
    const connect = () => {
        const page = pluginUiPages.get(key);
        if (page === bound)
            return;
        off?.();
        bound = page;
        off = page?.bind(node, sidebar);
    };
    const unsubscribe = subscribePage(key, connect);
    return () => {
        unsubscribe();
        off?.();
    };
}
export function notifyPluginUiPageCreated(key) {
    for (const listener of pageSubscribers.get(key) ?? [])
        listener();
}
const creating = new Map();
export function acquirePluginUiPage(key, create) {
    const current = pluginUiPages.get(key);
    if (current)
        return Promise.resolve(current);
    const existing = creating.get(key);
    if (existing)
        return existing;
    const page = create();
    const pending = pluginUiPages
        .add(page)
        .then(() => {
        notifyPluginUiPageCreated(key);
        return page;
    }, (error) => {
        page.destroy();
        throw error;
    })
        .finally(() => {
        if (creating.get(key) === pending)
            creating.delete(key);
    });
    creating.set(key, pending);
    return pending;
}
//# sourceMappingURL=pluginUiPageRegistry.js.map