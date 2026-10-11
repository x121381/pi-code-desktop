import type { McpServerConfig, NativeMcpServerRecord } from "@zcode/shared";
import { type McpPlatformService, type MigrateLegacyResult } from "@/store/mcpStoreDesktop.js";
interface CommonMcpMigrationResult extends MigrateLegacyResult {
    completed: boolean;
    changed: boolean;
}
export declare function importLegacyCommonServersToZCodeAgent(platform: McpPlatformService | null, legacyServers: Record<string, McpServerConfig>, nativeServers: NativeMcpServerRecord[], sourcePath?: string): Promise<CommonMcpMigrationResult>;
export declare function migrateStoredCommonMcpToZCodeAgent(platform: McpPlatformService | null, nativeServers: NativeMcpServerRecord[], workspacePath?: string): Promise<NativeMcpServerRecord[]>;
export {};
//# sourceMappingURL=mcpStoreMigration.d.ts.map