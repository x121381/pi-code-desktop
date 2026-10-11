import type { IPlatformService, LoadCliMcpFromUserDirectoryRequest, MigrateLegacyCommonMcpRequest, MigrateLegacyCommonMcpResult, NativeMcpServerRecord, SaveCliMcpToUserDirectoryRequest } from "@zcode/shared";
import type { IMcpSyncService } from "@zcode/services";
export type McpPlatformService = Pick<IPlatformService, "loadMcpFromUserDirectory" | "saveMcpToUserDirectory" | "migrateLegacyCommonMcp">;
export type McpDirectoryService = Pick<IMcpSyncService, "loadMcpFromUserDirectory" | "saveMcpToUserDirectory">;
export interface MigrateLegacyResult {
    totalCount: number;
    importedCount: number;
    skippedCount: number;
    sourcePath?: string;
}
export declare function persistCliMcpToUserDirectory(platform: McpPlatformService | null, payload: SaveCliMcpToUserDirectoryRequest, directoryService?: McpDirectoryService | null): Promise<boolean>;
export declare function fetchNativeMcpServers(platform: McpPlatformService | null, payload?: LoadCliMcpFromUserDirectoryRequest, directoryService?: McpDirectoryService | null): Promise<NativeMcpServerRecord[]>;
export declare function peekLegacyCommonMcpCount(platform: McpPlatformService | null): Promise<number>;
export declare function migrateLegacyCommonMcpFromDesktop(platform: McpPlatformService | null, payload?: MigrateLegacyCommonMcpRequest): Promise<MigrateLegacyCommonMcpResult>;
//# sourceMappingURL=mcpStoreDesktop.d.ts.map