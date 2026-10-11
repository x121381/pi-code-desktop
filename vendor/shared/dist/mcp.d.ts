/**
 * MCP (Model Context Protocol) types for ZCode
 * Based on the original Tauri implementation
 */
import type { SettingsDirectoryLocation } from "./settings-source.js";
import type { McpServerFailureKind } from "./zcode-protocol/index.js";
export declare const ZCODE_CUA_OFFICIAL_PLUGIN_ID = "computer-use@zcode-plugins-official";
export declare const ZCODE_CUA_OFFICIAL_MCP_NAMESPACE_NAME = "plugin:computer-use:computer-use";
export declare const ZCODE_PLUGIN_ID_ENV_KEY = "ZCODE_PLUGIN_ID";
export type McpSource = "mcp" | "zcodeagentmcp" | "claudeclimcp" | "geminiclimcp" | "codexclimcp" | "opencodemcp";
export type CliMcpSource = Exclude<McpSource, "mcp">;
export type McpScope = "common" | "user" | "workspace";
export type McpFileFormat = "json" | "toml";
export interface McpServerConfig {
    type?: string;
    url?: string;
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    headers?: Record<string, string>;
    http_headers?: Record<string, string>;
    oauth?: McpOAuthConfig;
    apiKey?: string;
    projectId?: string;
    issueType?: string;
    personalAccessToken?: string;
    fileId?: string;
    nodeId?: string;
    organizationName?: string;
    projectName?: string;
    dsn?: string;
    apiEndpoint?: string;
    [key: string]: any;
}
export type McpServerStatus = "connected" | "disconnected" | "error" | "connecting" | "unknown";
export interface CliMcpConfig {
    mcpServers: Record<string, McpServerConfig>;
    projects: Record<string, Record<string, McpServerConfig>>;
}
export interface SaveCliMcpToUserDirectoryRequest {
    action: "upsert" | "delete" | "set-enabled";
    source: CliMcpSource;
    name: string;
    config?: McpServerConfig;
    enabled?: boolean;
    projectPath?: string;
    location?: SettingsDirectoryLocation;
}
export interface NativeMcpFileReference {
    format: McpFileFormat;
    filePath: string;
}
export interface NativeMcpServerRecord {
    source: McpSource;
    scope: McpScope;
    name: string;
    config: McpServerConfig;
    enabled?: boolean;
    projectPath?: string;
    location?: SettingsDirectoryLocation;
    file?: NativeMcpFileReference;
}
export interface LoadCliMcpFromUserDirectoryRequest {
    workspacePath?: string;
}
export interface LoadCliMcpFromUserDirectoryResult {
    servers: NativeMcpServerRecord[];
}
export interface MigrateLegacyCommonMcpRequest {
    legacyStorageDir?: string;
}
export interface MigrateLegacyCommonMcpResult {
    servers: Record<string, McpServerConfig>;
    sourcePath?: string;
    /** 旧数据中发现的 MCP 配置总数 */
    totalCount: number;
    /** 成功导入的数量 */
    importedCount: number;
    /** 因已存在而跳过的数量 */
    skippedCount: number;
}
export interface McpConfig {
    mcp: {
        mcpServers: Record<string, McpServerConfig>;
    };
    zcodeagentmcp: CliMcpConfig;
    claudeclimcp: CliMcpConfig;
    geminiclimcp: CliMcpConfig;
    codexclimcp: CliMcpConfig;
    opencodemcp: CliMcpConfig;
}
export interface ZCodeMcpServer {
    id: string;
    name: string;
    config: McpServerConfig;
    enabled: boolean;
    changed?: boolean;
    status?: McpServerStatus;
    lastConnected?: Date;
    error?: string;
    failureKind?: McpServerFailureKind;
    serverRequestId?: string;
    toolCount?: number;
    authorization?: {
        type: "oauth_authorization_code";
        authorizationUrl: string;
        startedAt: string;
    };
    source: McpSource;
    projectPath?: string;
    scope: McpScope;
    location?: SettingsDirectoryLocation;
    file?: NativeMcpFileReference;
}
export interface McpServerListItem {
    id: string;
    name: string;
    enabled: boolean;
    status: McpServerStatus;
    hasConfig: boolean;
    error?: string;
    toolCount?: number;
    source: McpSource;
    projectPath?: string;
    scope: McpScope;
    file?: NativeMcpFileReference;
}
export interface McpTestResult {
    success: boolean;
    error?: string;
    tools?: Array<{
        name: string;
        description?: string;
        input_schema?: any;
    }>;
    serverInfo?: {
        name: string;
        version: string;
    };
    response_time?: number;
}
export type ZCodeAgentMcpServer = {
    name: string;
    command: string;
    args: string[];
    env: Array<{
        name: string;
        value: string;
    }>;
    isolation?: "session" | "workspace";
    protocolVersion?: "legacy" | "auto" | "2026-07-28";
    timeoutMs?: number;
} | {
    name: string;
    type: "http" | "sse";
    url: string;
    isolation?: "session" | "workspace";
    protocolVersion?: "legacy" | "auto" | "2026-07-28";
    headers: Array<{
        name: string;
        value: string;
    }>;
    oauth?: McpOAuthConfig;
    timeoutMs?: number;
};
export interface McpClientCredentialsOAuthConfig {
    type: "client_credentials";
    clientId: string;
    clientSecret: string;
    clientName?: string;
    scope?: string;
}
export interface McpAuthorizationCodeOAuthConfig {
    type: "authorization_code";
    clientId?: string;
    clientSecret?: string;
    clientName?: string;
    redirectPath?: string;
    scope?: string;
}
export type McpOAuthConfig = McpAuthorizationCodeOAuthConfig | McpClientCredentialsOAuthConfig;
export declare function getMcpServerRequestHeaders(config: McpServerConfig): Record<string, string> | undefined;
/**
 * MCP server 的 command 是否指向 zcode-cua。用与 args 相同的包规格判定（并比对路径叶子），
 * 覆盖 `command: "zcode-cua"`、`/opt/bin/zcode-cua`，以及把包规格直接当 command 的写法
 * （`zcode-cua@1.2.3` 等）。对 fail-closed 边界宁可过判也不漏判。
 */
export declare function isZCodeCuaMcpCommand(command: string): boolean;
/**
 * 单个 arg 是否为 zcode-cua 的包规格。覆盖 `zcode-cua`、`zcode-cua[macos]`、`zcode-cua@1.2.3`、
 * `zcode-cua==1.2.3`、`zcode_cua`，以及 git / 本地路径形态（`.../zcode-cua`、`zcode-cua.git`、
 * `git+https://.../zcode-cua.git@v1`）。同时比对原始值与路径叶子，覆盖 `--from <path>`、`--from <git-url>`。
 */
export declare function isZCodeCuaMcpPackageArg(value: string): boolean;
export declare function convertToZCodeAgentMcpServer(name: string, config: McpServerConfig): ZCodeAgentMcpServer | null;
//# sourceMappingURL=mcp.d.ts.map