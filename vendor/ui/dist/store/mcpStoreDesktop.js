import { logger } from "../logger.js";
export async function persistCliMcpToUserDirectory(platform, payload, directoryService) {
    if (directoryService) {
        await directoryService.saveMcpToUserDirectory(payload);
        return true;
    }
    if (!platform?.saveMcpToUserDirectory) {
        logger.warn("[mcpStore] platform MCP save unavailable, skip persisting CLI MCP to user directory");
        return false;
    }
    const result = await platform.saveMcpToUserDirectory(payload);
    if (!result?.success) {
        throw new Error(result?.error ?? "Failed to persist MCP config");
    }
    return true;
}
async function fetchLegacyCommonMcp(platform, payload) {
    if (!platform?.migrateLegacyCommonMcp) {
        return { servers: {}, totalCount: 0, importedCount: 0, skippedCount: 0 };
    }
    return platform.migrateLegacyCommonMcp(payload ?? {});
}
export async function fetchNativeMcpServers(platform, payload, directoryService) {
    if (directoryService) {
        const result = await directoryService.loadMcpFromUserDirectory(payload);
        return result.servers ?? [];
    }
    if (!platform?.loadMcpFromUserDirectory) {
        return [];
    }
    const result = await platform.loadMcpFromUserDirectory(payload);
    return result.servers ?? [];
}
export async function peekLegacyCommonMcpCount(platform) {
    try {
        const result = await fetchLegacyCommonMcp(platform);
        const count = result.totalCount || Object.keys(result.servers ?? {}).length;
        return count;
    }
    catch {
        return 0;
    }
}
export async function migrateLegacyCommonMcpFromDesktop(platform, payload) {
    return fetchLegacyCommonMcp(platform, payload);
}
//# sourceMappingURL=mcpStoreDesktop.js.map