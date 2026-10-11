import type { ZCodeAgentMcpServer, McpConfig, McpServerConfig, McpServerStatus, McpSource, NativeMcpServerRecord, ZCodeMcpListMode, ZCodeMcpServerStatusSnapshot, ZCodeMcpServer } from "@zcode/shared";
import { type McpDirectoryService, type McpPlatformService, type MigrateLegacyResult } from "@/store/mcpStoreDesktop.js";
export declare function setMcpStorePlatform(platform: McpPlatformService | null): void;
export declare function setMcpStoreDirectoryService(service: McpDirectoryService | null): void;
interface UpdateServerStatusOptions {
    invalidateStatusListRequests?: boolean;
}
interface McpStoreState {
    config: McpConfig;
    nativeServers: NativeMcpServerRecord[];
    servers: ZCodeMcpServer[];
    statusSnapshots: Record<string, ZCodeMcpServerStatusSnapshot>;
    currentProjectPath: string;
    currentWorkspaceIdentity?: string;
    enabledStates: Record<string, boolean>;
    deletedPreloadMcpServers: Set<string>;
    isConfigLoaded: boolean;
    currentSessionId: string | null;
    loadConfig: () => void;
    loadMcpFromUserDirectory: (directoryService?: McpDirectoryService | null, workspaceIdentity?: string) => Promise<boolean>;
    ensureLoadedForWorkspace: (workspacePath?: string, directoryService?: McpDirectoryService | null, workspaceIdentity?: string) => Promise<boolean>;
    saveConfig: () => void;
    addMcpServer: (name: string, config: McpServerConfig) => void;
    updateMcpServer: (name: string, config: McpServerConfig) => void;
    deleteMcpServer: (name: string) => void;
    addScopedMcpServer: (source: McpSource, name: string, config: McpServerConfig, projectPath?: string) => Promise<void>;
    updateScopedMcpServer: (source: McpSource, name: string, config: McpServerConfig, projectPath?: string) => Promise<void>;
    deleteScopedMcpServer: (source: McpSource, name: string, projectPath?: string) => void;
    addZCodeAgentMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    updateZCodeAgentMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    deleteZCodeAgentMcpServer: (name: string, projectPath?: string) => void;
    addClaudeCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    updateClaudeCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    deleteClaudeCliMcpServer: (name: string, projectPath?: string) => void;
    addGeminiCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    updateGeminiCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    deleteGeminiCliMcpServer: (name: string, projectPath?: string) => void;
    addCodexCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    updateCodexCliMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    deleteCodexCliMcpServer: (name: string, projectPath?: string) => void;
    addOpenCodeMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    updateOpenCodeMcpServer: (name: string, config: McpServerConfig, projectPath?: string) => void;
    deleteOpenCodeMcpServer: (name: string, projectPath?: string) => void;
    toggleServer: (id: string, enabled: boolean) => Promise<void>;
    updateServerStatus: (id: string, status: McpServerStatus, error?: string, options?: UpdateServerStatusOptions) => void;
    beginServerStatusListRefresh: (mode?: ZCodeMcpListMode) => number;
    markServerStatusListRefreshFailed: (error: string, requestEpoch: number, mode?: ZCodeMcpListMode) => void;
    mergeServerStatusSnapshots: (statuses: Record<string, ZCodeMcpServerStatusSnapshot>, requestEpoch: number, mode?: "connect" | "status") => void;
    getServer: (id: string) => ZCodeMcpServer | undefined;
    setCurrentProjectPath: (path: string, workspaceIdentity?: string, directoryService?: McpDirectoryService | null) => void;
    getEnabledMcpServersForZCode: (provider: string) => ZCodeAgentMcpServer[];
    checkAllServerStatus: (tester: (config: McpServerConfig) => Promise<{
        success: boolean;
        error?: string;
    }>) => Promise<void>;
    mergePreloadedMcpServers: (preloaded: Record<string, McpServerConfig>) => void;
    deletePreloadedMcpServer: (source: McpSource, name: string) => void;
    setCurrentSessionId: (sessionId: string | null) => void;
    migrateLegacyCommonMcp: () => Promise<MigrateLegacyResult>;
}
export declare const useMcpStore: import("zustand").UseBoundStore<import("zustand").StoreApi<McpStoreState>>;
export {};
//# sourceMappingURL=mcpStore.d.ts.map