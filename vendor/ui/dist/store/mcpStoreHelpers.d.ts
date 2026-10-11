import type { McpConfig, McpServerConfig, McpSource, NativeMcpServerRecord, ZCodeMcpServer } from "@zcode/shared";
export declare const MCP_CONFIG_KEY = "zcode-mcp-config";
export declare const MCP_ENABLED_STATES_KEY = "zcode-mcp-enabled-states";
export declare const MCP_DELETED_PRELOAD_KEY = "zcode-mcp-deleted-preload";
export declare const DEFAULT_MCP_CONFIG: McpConfig;
export declare function safeReadJson<T>(key: string, fallback: T): T;
export declare function safeWriteJson(key: string, value: unknown): void;
export declare function loadPersistedConfig(): McpConfig;
export declare function readLegacyCommonMcpServers(): Record<string, McpServerConfig>;
export declare function clearLegacyCommonMcpServers(): void;
export declare function makeServerId(source: McpSource, name: string, projectPath?: string, directorySource?: NonNullable<NativeMcpServerRecord["location"]>["source"]): string;
export declare function buildServerList(_config: McpConfig, nativeServers: NativeMcpServerRecord[], enabledStates: Record<string, boolean>, deletedPreload: Set<string>, existingServers: ZCodeMcpServer[]): ZCodeMcpServer[];
export declare function getServerPriority(server: ZCodeMcpServer): number;
//# sourceMappingURL=mcpStoreHelpers.d.ts.map