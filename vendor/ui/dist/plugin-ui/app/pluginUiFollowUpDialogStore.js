const listeners = new Set();
const queue = [];
let nextId = 1;
function notify() {
    for (const listener of listeners)
        listener();
}
export function requestPluginUiFollowUpConfirmation(input) {
    return new Promise((resolve) => {
        queue.push({ request: { requestId: nextId++, ...input }, resolve });
        notify();
    });
}
export function getCurrentPluginUiFollowUpRequest() {
    return queue[0]?.request ?? null;
}
export function resolvePluginUiFollowUpRequest(requestId, value) {
    const index = queue.findIndex((entry) => entry.request.requestId === requestId);
    if (index < 0)
        return;
    const [entry] = queue.splice(index, 1);
    entry?.resolve(value);
    notify();
}
export function subscribePluginUiFollowUpRequests(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
//# sourceMappingURL=pluginUiFollowUpDialogStore.js.map