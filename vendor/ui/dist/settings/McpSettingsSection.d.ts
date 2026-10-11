import type { RemoteTarget, ZCodeAgentMcpServer, ZCodeMcpListMode, ZCodeMcpServer, ZCodeMcpServerStatusSnapshot, ZCodePluginInfo } from "@zcode/shared";
import { type IMcpSyncService } from "@zcode/services";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function createMcpOAuthAuthorizationStatusRefreshDeadline(now?: () => number): number;
export declare function isMcpOAuthAuthorizationStatusRefreshExpired(deadline: number, now?: () => number): boolean;
export type McpServerStatusListRefreshOutcome = "refreshed" | "stale-workspace" | "status-mode-unsupported";
export declare function refreshMcpServerStatusList({ beginServerStatusListRefresh, markServerStatusListRefreshFailed, mergeServerStatusSnapshots, getCurrentWorkspaceKey, mode, mcpServers, requestedWorkspaceKey, workspaceIdentity, workspacePath, mcpSyncService, }: {
    beginServerStatusListRefresh: (mode?: ZCodeMcpListMode) => number;
    markServerStatusListRefreshFailed?: (error: string, requestEpoch: number, mode?: ZCodeMcpListMode) => void;
    mergeServerStatusSnapshots: (statuses: Record<string, ZCodeMcpServerStatusSnapshot>, requestEpoch: number, mode?: ZCodeMcpListMode) => void;
    getCurrentWorkspaceKey: () => string;
    mode?: ZCodeMcpListMode;
    mcpServers?: ZCodeAgentMcpServer[];
    requestedWorkspaceKey: string;
    workspaceIdentity?: string;
    workspacePath: string;
    mcpSyncService: Pick<IMcpSyncService, "listWorkspaceMcpServerStatuses">;
}): Promise<McpServerStatusListRefreshOutcome>;
export interface McpOAuthAuthorizationPendingRefresh {
    mcpServers: ZCodeAgentMcpServer[];
    pendingKey: string;
    workspaceKey: string;
}
export declare function transitionMcpAutoStatusListRefreshKey(previousKey: string, nextKey: string): {
    lastRefreshKey: string;
    shouldRefresh: boolean;
};
export interface McpOAuthAuthorizationFollowupRefresh {
    mcpServers: ZCodeAgentMcpServer[];
    refreshKey: string;
    workspaceKey: string;
}
export declare function transitionMcpOAuthAuthorizationPendingRefresh({ activeWorkspaceKey, existingFollowup, mcpServers, now, pendingKey, previous, }: {
    activeWorkspaceKey: string;
    existingFollowup?: McpOAuthAuthorizationFollowupRefresh | null;
    mcpServers: ZCodeAgentMcpServer[];
    now?: () => number;
    pendingKey: string;
    previous: McpOAuthAuthorizationPendingRefresh | null;
}): {
    followup: McpOAuthAuthorizationFollowupRefresh | null;
    pending: McpOAuthAuthorizationPendingRefresh | null;
};
interface McpStatusListRefreshQueue {
    request: (runLatest: () => Promise<void>) => Promise<void>;
}
/** 刷新来源：manual 是用户点了刷新按钮，auto 是列表/配置变化驱动的自动刷新。 */
export type McpStatusListRefreshTrigger = "auto" | "manual";
export interface McpStatusListRefreshInput {
    activeWorkspaceKey: string;
    activeWorkspacePath?: string;
    configReadyWorkspaceKey: string;
    isConfigLoaded: boolean;
    serverStatusListKey: string;
    storeWorkspaceKey: string;
}
export declare function resolveMcpStatusListRefreshSkipReason({ input, requestedWorkspaceKey, trigger, }: {
    input: McpStatusListRefreshInput;
    requestedWorkspaceKey: string;
    trigger: McpStatusListRefreshTrigger;
}): string | undefined;
export declare function createMcpStatusListRefreshQueue(): McpStatusListRefreshQueue;
export declare function buildMcpOAuthAuthorizationStatusRefreshServers(servers: ZCodeMcpServer[], statusSnapshots?: Record<string, ZCodeMcpServerStatusSnapshot>): ZCodeAgentMcpServer[];
export declare function buildMcpOAuthAuthorizationStatusRefreshOptions(mcpServers: ZCodeAgentMcpServer[]): {
    mode: "status";
    mcpServers: ZCodeAgentMcpServer[];
};
export declare function buildMcpServerStatusListKey(servers: ZCodeMcpServer[]): string;
export declare function buildPluginMcpServerStatusListKey(plugins: ZCodePluginInfo[]): string;
export declare function shouldShowPluginMcpServersInMcpSettings(isRemoteSyncContext: boolean): boolean;
export declare function buildPendingMcpOAuthAuthorizationRefreshKey(servers: ZCodeMcpServer[], statusSnapshots?: Record<string, ZCodeMcpServerStatusSnapshot>): string;
interface McpSettingsSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    localWorkspacePath?: string;
    isWebRemoteControl?: boolean;
    scopeFilter: "user" | "workspace";
    parentScopeKey: string;
    workspaceTabs: WorkspaceTabState[];
    searchQuery: string;
    onVisibleCountChange?: (count: number) => void;
    onEditorOpenChange?: (open: boolean) => void;
    onFormScopeKeyChange?: (scopeKey: string | null) => void;
    onOpenPluginStore?: () => void;
    showMarketplaceBreadcrumb?: boolean;
}
export declare function McpSettingsSection({ workspacePath, workspaceIdentity, remoteSessionId, remoteTarget, localWorkspacePath, isWebRemoteControl, scopeFilter, parentScopeKey, workspaceTabs, searchQuery, onVisibleCountChange, onEditorOpenChange, onFormScopeKeyChange, onOpenPluginStore, showMarketplaceBreadcrumb, }: McpSettingsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=McpSettingsSection.d.ts.map