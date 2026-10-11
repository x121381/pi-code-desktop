const listeners = new Set();
export function subscribeTaskLifecycle(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
export function notifyTaskLifecycle(event) {
    for (const listener of listeners)
        listener(event);
}
//# sourceMappingURL=taskLifecycleEvents.js.map