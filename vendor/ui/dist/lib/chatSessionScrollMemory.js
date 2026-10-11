export const CHAT_SESSION_SCROLL_MEMORY_MAX_ENTRIES = 200;
const chatSessionScrollMemory = new Map();
function normalizeKeyPart(value) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}
function touchChatSessionScrollMemoryEntry(key, state) {
    chatSessionScrollMemory.delete(key);
    chatSessionScrollMemory.set(key, state);
    return state;
}
function pruneChatSessionScrollMemory() {
    while (chatSessionScrollMemory.size > CHAT_SESSION_SCROLL_MEMORY_MAX_ENTRIES) {
        const oldestKey = chatSessionScrollMemory.keys().next().value;
        if (!oldestKey) {
            return;
        }
        chatSessionScrollMemory.delete(oldestKey);
    }
}
export function buildChatSessionScrollMemoryKey({ workspacePath, workspaceIdentity, paneId, sessionId, taskId, }) {
    const workspaceKey = normalizeKeyPart(workspaceIdentity) ?? normalizeKeyPart(workspacePath);
    const paneScope = normalizeKeyPart(paneId);
    const sessionScope = normalizeKeyPart(sessionId);
    const taskScope = normalizeKeyPart(taskId);
    if (!workspaceKey) {
        return null;
    }
    const rendererScope = paneScope ? `${workspaceKey}::pane:${paneScope}` : workspaceKey;
    if (sessionScope) {
        return `${rendererScope}::session:${sessionScope}`;
    }
    return taskScope ? `${rendererScope}::task:${taskScope}` : null;
}
export function migrateTaskScrollMemoryToSession({ workspacePath, workspaceIdentity, paneId, sessionId, taskId, }) {
    const sessionKey = buildChatSessionScrollMemoryKey({
        workspacePath,
        workspaceIdentity,
        paneId,
        sessionId,
        taskId: null,
    });
    const fallbackTaskKey = buildChatSessionScrollMemoryKey({
        workspacePath,
        workspaceIdentity,
        paneId,
        sessionId: null,
        taskId,
    });
    if (!sessionKey || !fallbackTaskKey || sessionKey === fallbackTaskKey) {
        return sessionKey ?? fallbackTaskKey;
    }
    if (!chatSessionScrollMemory.has(sessionKey)) {
        const fallbackState = chatSessionScrollMemory.get(fallbackTaskKey);
        if (fallbackState) {
            // sessionId 可能晚于 taskId 回填。这里把临时 task 桶迁移到真实 session 桶，
            // 避免同一会话在元数据补齐前后丢失滚动位置。
            touchChatSessionScrollMemoryEntry(sessionKey, {
                ...fallbackState,
                updatedAt: Date.now(),
            });
        }
    }
    chatSessionScrollMemory.delete(fallbackTaskKey);
    return sessionKey;
}
export function readChatSessionScrollMemoryState(key) {
    if (!key) {
        return null;
    }
    const state = chatSessionScrollMemory.get(key);
    return state ? touchChatSessionScrollMemoryEntry(key, state) : null;
}
export function saveChatSessionScrollMemoryState(key, state) {
    if (!key) {
        return;
    }
    touchChatSessionScrollMemoryEntry(key, state);
    pruneChatSessionScrollMemory();
}
export function resolveChatSessionScrollRestoreTop(state, metrics) {
    const maxScrollTop = Math.max(metrics.scrollHeight - metrics.clientHeight, 0);
    return Math.min(Math.max(state.scrollTop, 0), maxScrollTop);
}
export function clearChatSessionScrollMemoryForTest() {
    chatSessionScrollMemory.clear();
}
//# sourceMappingURL=chatSessionScrollMemory.js.map