import type { RemoteTarget } from "@zcode/shared";
import type { IMcpSyncService, IPluginSyncService, ISkillSyncService, IZCodeAgentService } from "@zcode/services";
export type RemoteSyncClientMode = "desktop-continuous" | "web-remote-replayable";
export declare const REMOTE_SYNC_PREFLIGHT_TIMEOUT_MS = 15000;
export declare class RemoteSyncPreflightTimeoutError extends Error {
    readonly timeoutMs: number;
    constructor(timeoutMs: number);
}
export declare function isRemoteSyncPreflightTimeoutError(error: unknown): error is RemoteSyncPreflightTimeoutError;
export declare function shouldShowRemoteSyncActions(params: {
    remoteSessionId?: string | null;
    remoteTarget?: RemoteTarget | null;
    clientMode?: RemoteSyncClientMode;
    hasLocalSourceService?: boolean;
}): boolean;
export declare function shouldStartRemoteSyncOperation(params: {
    inFlight: boolean;
    selectedCount: number;
}): boolean;
export declare function useRemoteSyncDialogIntent(params: {
    rpcReady: boolean;
    targetKey: string;
}): {
    open: boolean;
    setOpen: (open: boolean) => void;
};
export declare function runRemoteSyncPreflightWithTimeout<T>(operation: () => Promise<T>, timeoutMs?: number): Promise<T>;
export declare function RemoteSyncMenuItems({ canSyncSkills, canSyncMcp, canSyncPlugins, onOpenSkillSync, onOpenMcpSync, onOpenPluginSync, stopMouseDownPropagation, mcpDisabled, }: {
    canSyncSkills: boolean;
    canSyncMcp: boolean;
    canSyncPlugins?: boolean;
    onOpenSkillSync: () => void;
    onOpenMcpSync: () => void;
    onOpenPluginSync?: () => void;
    stopMouseDownPropagation?: boolean;
    mcpDisabled?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteSyncDropdownButton({ canSyncSkills, canSyncMcp, canSyncPlugins, mcpDisabled, onOpenSkillSync, onOpenMcpSync, onOpenPluginSync, }: {
    canSyncSkills: boolean;
    canSyncMcp: boolean;
    canSyncPlugins?: boolean;
    mcpDisabled?: boolean;
    onOpenSkillSync: () => void;
    onOpenMcpSync: () => void;
    onOpenPluginSync?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function RemoteSyncDialogs({ canSyncSkills, canSyncMcp, canSyncPlugins, skillOpen, mcpOpen, pluginOpen, onSkillOpenChange, onMcpOpenChange, onPluginOpenChange, localSkillSyncService, remoteSkillSyncService, localMcpSyncService, remoteMcpSyncService, localPluginSyncService, remotePluginSyncService, localZCodeAgentService, remoteZCodeAgentService, remoteTarget, skillWorkspacePath, mcpWorkspacePath, pluginWorkspacePath, pluginLocalWorkspacePath, mcpLocalWorkspacePath, workspaceIdentity, onSkillsSynced, onMcpSynced, onPluginsSynced, }: {
    canSyncSkills: boolean;
    canSyncMcp: boolean;
    canSyncPlugins?: boolean;
    skillOpen: boolean;
    mcpOpen: boolean;
    pluginOpen?: boolean;
    onSkillOpenChange: (open: boolean) => void;
    onMcpOpenChange: (open: boolean) => void;
    onPluginOpenChange?: (open: boolean) => void;
    localSkillSyncService?: ISkillSyncService | null;
    remoteSkillSyncService?: ISkillSyncService | null;
    localMcpSyncService?: IMcpSyncService | null;
    remoteMcpSyncService?: IMcpSyncService | null;
    localPluginSyncService?: IPluginSyncService | null;
    remotePluginSyncService?: IPluginSyncService | null;
    localZCodeAgentService?: IZCodeAgentService | null;
    remoteZCodeAgentService?: IZCodeAgentService | null;
    remoteTarget?: RemoteTarget | null;
    skillWorkspacePath: string;
    mcpWorkspacePath: string;
    pluginWorkspacePath?: string;
    pluginLocalWorkspacePath?: string;
    mcpLocalWorkspacePath?: string;
    workspaceIdentity?: string;
    onSkillsSynced: () => Promise<void> | void;
    onMcpSynced: () => Promise<void> | void;
    onPluginsSynced?: () => Promise<void> | void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RemoteSyncActions.d.ts.map