let snapshot = { status: "loading" };
let connectionGeneration = 0;
let activeReload = null;
const listeners = new Set();
export function getProviderSettingsSnapshot() {
    return snapshot;
}
export function subscribeProviderSettingsSnapshot(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
export function reloadProviderSettingsSnapshot() {
    return activeReload?.() ?? Promise.reject(new Error("Provider Settings Service 尚未连接"));
}
export function connectProviderSettingsSnapshot(service) {
    connectionGeneration += 1;
    const generation = connectionGeneration;
    snapshot = { status: "loading" };
    publish();
    const commit = (view) => {
        if (generation !== connectionGeneration)
            return;
        if (snapshot.status === "ready" && view.revision < snapshot.view.revision)
            return;
        if (snapshot.status === "ready" && snapshot.view.revision === view.revision)
            return;
        snapshot = { status: "ready", view };
        publish();
    };
    const read = async () => {
        try {
            commit(await service.getView());
        }
        catch (cause) {
            if (generation !== connectionGeneration)
                throw cause;
            const error = cause instanceof Error ? cause : new Error(String(cause));
            // 已有成功快照时保留 Last Known Good；首次失败才进入可重试 error。
            if (snapshot.status !== "ready") {
                snapshot = { status: "error", error };
                publish();
            }
            throw error;
        }
    };
    // 先订阅再读取，避免 getView 与 Registry 更新之间丢失事件。
    const subscription = service.onDidChange(commit);
    const ready = read();
    activeReload = read;
    return {
        ready,
        reload: read,
        dispose() {
            subscription.dispose();
            if (generation === connectionGeneration)
                activeReload = null;
        },
    };
}
export function resetProviderSettingsSnapshotForTest() {
    connectionGeneration += 1;
    snapshot = { status: "loading" };
    activeReload = null;
    listeners.clear();
}
function publish() {
    for (const listener of listeners)
        listener();
}
//# sourceMappingURL=providerSettingsSnapshot.js.map