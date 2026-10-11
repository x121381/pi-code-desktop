const pendingCreations = new Map();
const blockedChildSessionIds = new Set();
const listeners = new Set();
const openers = new Map();
export function buildSelectionSideChatKey(workspaceKey, parentSessionId) {
    return `${workspaceKey}\0${parentSessionId}`;
}
/**
 * 同一个用户手势在 command pending 期间只创建一次；完成后立即释放 parent scope，
 * 让固定入口的下一次点击可以创建新的 child，而不是退化回旧的单例绑定。
 */
export async function createSelectionSideChat(key, create) {
    const current = pendingCreations.get(key);
    if (current)
        return current;
    const pending = create().finally(() => {
        if (pendingCreations.get(key) === pending) {
            pendingCreations.delete(key);
        }
        emitChange();
    });
    pendingCreations.set(key, pending);
    return pending;
}
export function clearSelectionSideChat(childSessionId) {
    const changed = blockedChildSessionIds.delete(childSessionId);
    if (!changed)
        return;
    emitChange();
}
export function setSelectionSideChatBlocked(childSessionId, blocked) {
    const changed = blocked
        ? !blockedChildSessionIds.has(childSessionId)
        : blockedChildSessionIds.has(childSessionId);
    if (!changed)
        return;
    if (blocked)
        blockedChildSessionIds.add(childSessionId);
    else
        blockedChildSessionIds.delete(childSessionId);
    emitChange();
}
export function isSelectionSideChatBlocked(childSessionId) {
    return blockedChildSessionIds.has(childSessionId);
}
export function subscribeSelectionSideChatRuntime(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
/**
 * Side Pane 的固定入口位于会话 Provider 外，不能自己拼协议命令。
 * 由已挂载的主 SessionPane 注册创建能力，launcher 只按 workspace + parent 路由；
 * 同一父会话被多个分屏展示时优先交给 focused pane，保持命令 owner 与当前输入焦点一致。
 */
export function registerSelectionSideChatOpener(key, opener, focused, referenceBlocked = false) {
    const token = Symbol(key);
    const scoped = openers.get(key) ?? new Map();
    scoped.set(token, { focused, open: opener, referenceBlocked });
    openers.set(key, scoped);
    emitChange();
    return () => {
        const current = openers.get(key);
        current?.delete(token);
        if (current?.size === 0)
            openers.delete(key);
        emitChange();
    };
}
function getSelectionSideChatOpener(key) {
    const scoped = openers.get(key);
    if (!scoped?.size)
        return undefined;
    const candidates = Array.from(scoped.values());
    return candidates.find((candidate) => candidate.focused) ?? candidates[0];
}
export function getSelectionSideChatOpenState(key) {
    const target = getSelectionSideChatOpener(key);
    return !target ? "unavailable" : target.referenceBlocked ? "blocked" : "ready";
}
export function requestSelectionSideChatOpen(key, reference) {
    const target = getSelectionSideChatOpener(key);
    if (!target || (reference && target.referenceBlocked))
        return false;
    if (reference)
        void target.open(reference);
    else
        void target.open();
    return true;
}
function emitChange() {
    for (const listener of listeners)
        listener();
}
//# sourceMappingURL=selectionSideChatRuntime.js.map