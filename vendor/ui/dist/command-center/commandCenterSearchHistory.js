const COMMAND_CENTER_HISTORY_LIMIT = 20;
const COMMAND_CENTER_HISTORY_KEY_PREFIX = "zcode-command-center-search-history:";
function getStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch {
        return null;
    }
}
function getHistoryKey(workspaceKey) {
    return `${COMMAND_CENTER_HISTORY_KEY_PREFIX}${workspaceKey}`;
}
function isCommandCenterSearchHistoryEntry(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    const entry = value;
    return (typeof entry.query === "string" &&
        typeof entry.updatedAt === "number" &&
        (entry.scope === "all" ||
            entry.scope === "commands" ||
            entry.scope === "conversations" ||
            entry.scope === "files"));
}
export function readCommandCenterSearchHistory(workspaceKey) {
    const storage = getStorage();
    if (!storage) {
        return [];
    }
    try {
        const parsed = JSON.parse(storage.getItem(getHistoryKey(workspaceKey)) ?? "[]");
        return Array.isArray(parsed)
            ? parsed.filter(isCommandCenterSearchHistoryEntry).slice(0, COMMAND_CENTER_HISTORY_LIMIT)
            : [];
    }
    catch {
        return [];
    }
}
export function writeCommandCenterSearchHistory(workspaceKey, entries) {
    const storage = getStorage();
    if (!storage) {
        return;
    }
    try {
        storage.setItem(getHistoryKey(workspaceKey), JSON.stringify(entries.slice(0, COMMAND_CENTER_HISTORY_LIMIT)));
    }
    catch {
        // 搜索历史只是快捷入口，localStorage 不可用时不应阻断命令中心主流程。
    }
}
export function pushCommandCenterSearchHistory(params) {
    const query = params.query.trim();
    if (!query || query === ">" || query === "#" || query === "@") {
        return readCommandCenterSearchHistory(params.workspaceKey);
    }
    const nextEntry = {
        query,
        scope: params.scope,
        updatedAt: Date.now(),
    };
    const dedupeKey = query.toLocaleLowerCase();
    const entries = [
        nextEntry,
        ...readCommandCenterSearchHistory(params.workspaceKey).filter((entry) => entry.query.toLocaleLowerCase() !== dedupeKey),
    ].slice(0, COMMAND_CENTER_HISTORY_LIMIT);
    writeCommandCenterSearchHistory(params.workspaceKey, entries);
    return entries;
}
export function clearCommandCenterSearchHistory(workspaceKey) {
    writeCommandCenterSearchHistory(workspaceKey, []);
}
//# sourceMappingURL=commandCenterSearchHistory.js.map