/** 进程内有界首次发放审计；返回 true 表示该三元组第一次出现。 */
export function createOfficialMcpIssuanceAudit(maxEntries = 256) {
    const capacity = Math.max(1, Math.trunc(maxEntries));
    const keys = new Map();
    return {
        markFirst(pluginId, mcpKey, workspaceKey) {
            const key = `${pluginId}\u0000${mcpKey}\u0000${workspaceKey}`;
            if (keys.has(key))
                return false;
            keys.set(key, true);
            while (keys.size > capacity) {
                const oldest = keys.keys().next();
                if (oldest.done)
                    break;
                keys.delete(oldest.value);
            }
            return true;
        },
    };
}
//# sourceMappingURL=officialMcpIssuanceAudit.js.map