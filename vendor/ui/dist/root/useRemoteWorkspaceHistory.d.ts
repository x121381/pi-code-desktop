import type { Dispatch, SetStateAction } from "react";
import type { AppSettings, BotRemoteWorkspaceReconnectedEvent, IPlatformService, RemoteWorkspaceSessionEntry } from "@zcode/shared";
import type { IServiceAccessor } from "@zcode/services";
import { type RemoteWorkspaceSession } from "@/store/remoteWorkspaceSessionStore.js";
import { buildRemoteWorkspaceSessionMutation } from "@/lib/remoteWorkspaceHistory.js";
import { logger } from "@/logger.js";
import { type TabStoreState, type WindowTabState } from "@/store/tabStore.js";
import { reconnectRemoteWorkspaceHistoryEntry, type BindRemoteWorkspaceSessionContextFn, type ReconnectRemoteWorkspaceOptions } from "@/root/reconnectRemoteWorkspaceHistoryEntry.js";
export { reconnectRemoteWorkspaceHistoryEntry };
export declare function bindRemoteWorkspaceContextAndGetSession(params: {
    platform: Pick<IPlatformService, "bindRemoteWorkspaceSessionContext">;
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
}): Promise<RemoteWorkspaceSession>;
export declare function resolveBotRemoteWorkspaceReconnectedIdentity(params: {
    event: Pick<BotRemoteWorkspaceReconnectedEvent, "workspaceIdentity">;
    resolvedWorkspacePath: string;
    target: BotRemoteWorkspaceReconnectedEvent["target"];
}): string;
export declare function shouldPersistRemoteWorkspaceFailure(params: {
    pendingReconnectRequestIds: ReadonlyMap<string, string>;
    sessionEntry: RemoteWorkspaceSessionEntry;
    workspaceKey: string;
}): boolean;
interface RemoteWorkspaceTabStoreReader {
    getState(): {
        tabs: WindowTabState[];
    };
}
interface OpenRemoteWorkspaceFromHistoryParams {
    workspaceKey: string;
    tabStoreApi: RemoteWorkspaceTabStoreReader;
    getRemoteSessions: () => RemoteWorkspaceSessionEntry[];
    inflightReconnectWorkspaceKeys: Set<string>;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    setReconnectingRemoteWorkspaceKeys: Dispatch<SetStateAction<string[]>>;
    loadCredential: IServiceAccessor["credentialService"]["load"];
    connectRemoteWorkspaceTarget: (target: Parameters<IPlatformService["connectRemote"]>[0], requestId?: string) => Promise<string>;
    resolveRemoteWorkspaceCanonicalPath: (sessionId: string, workspacePath: string) => Promise<string>;
    disposeRemoteWorkspaceSession: (sessionId: string) => Promise<void>;
    bindRemoteWorkspaceSessionContext: BindRemoteWorkspaceSessionContextFn;
    addTab: (workspacePath: string, options?: {
        remoteSessionId?: string;
        remoteTarget?: Parameters<IPlatformService["connectRemote"]>[0];
        workspaceIdentity?: string;
        localWorkspacePath?: string;
    }) => void;
    commitRemoteWorkspaceSessionMutation: (mutation: ReturnType<typeof buildRemoteWorkspaceSessionMutation>) => Promise<RemoteWorkspaceSessionEntry>;
    resetLogsForWorkspaceKey: (workspaceKey: string) => void;
    onWorkspaceActivated?: (target: {
        workspacePath: string;
        workspaceIdentity: string;
    }) => void;
    createReconnectRequestId?: () => string;
    pendingReconnectRequestIds?: Map<string, string>;
    reconnectImpl?: typeof reconnectRemoteWorkspaceHistoryEntry;
}
interface ReconnectRemoteWorkspaceByKeyParams {
    workspaceKey: string;
    canUseRemoteWorkspace: boolean;
    getRemoteSessions: () => RemoteWorkspaceSessionEntry[];
    runReconnectRemoteWorkspace: (sessionEntry: RemoteWorkspaceSessionEntry, options?: ReconnectRemoteWorkspaceOptions) => Promise<void>;
    options?: ReconnectRemoteWorkspaceOptions;
}
export declare function reconnectRemoteWorkspaceByKey({ workspaceKey, canUseRemoteWorkspace, getRemoteSessions, runReconnectRemoteWorkspace, options, }: ReconnectRemoteWorkspaceByKeyParams): Promise<boolean>;
export declare function collectSshReconnectGroup(params: {
    selected: RemoteWorkspaceSessionEntry;
    sessions: RemoteWorkspaceSessionEntry[];
    tabs: WindowTabState[];
}): RemoteWorkspaceSessionEntry[];
export declare function reconnectRemoteWorkspaceGroup(params: {
    selected: RemoteWorkspaceSessionEntry;
    reconnectGroup: RemoteWorkspaceSessionEntry[];
    reconnectEntry: (entry: RemoteWorkspaceSessionEntry, options?: ReconnectRemoteWorkspaceOptions) => Promise<boolean>;
    options?: ReconnectRemoteWorkspaceOptions;
}): Promise<void>;
export declare function cancelPendingRemoteReconnectsForWorkspaceKeys(params: {
    workspaceKeys: string[];
    pendingRequestIds: Map<string, string>;
    cancelPendingRemoteConnection?: (requestId?: string) => Promise<void>;
    logger: Pick<typeof logger, "warn">;
}): Promise<void>;
export declare function openRemoteWorkspaceFromHistoryEntry({ workspaceKey, tabStoreApi, getRemoteSessions, inflightReconnectWorkspaceKeys, activateTabByPath, setReconnectingRemoteWorkspaceKeys, loadCredential, connectRemoteWorkspaceTarget, resolveRemoteWorkspaceCanonicalPath, disposeRemoteWorkspaceSession, bindRemoteWorkspaceSessionContext, addTab, commitRemoteWorkspaceSessionMutation, resetLogsForWorkspaceKey, createReconnectRequestId, pendingReconnectRequestIds, reconnectImpl, onWorkspaceActivated, }: OpenRemoteWorkspaceFromHistoryParams): Promise<void>;
export declare function selectRemoteWorkspaceProjectFromDialog({ canUseRemoteWorkspace, sessionId, path, localWorkspacePath, loadingMessage, getRemoteWorkspaceSession, connectionTarget, getWorkspaceTabs, resolveRemoteWorkspaceCanonicalPath, activateTabByPath, handleCancelRemoteProject, bindRemoteWorkspaceSessionContext, commitRemoteWorkspaceSessionMutation, getRemoteSessions, bindRemoteWorkspacePath, bindRemoteWorkspaceIdentity, addTab, onWorkspaceActivated, refreshPinnedTasks, refreshTimelineTasks, }: {
    canUseRemoteWorkspace: boolean;
    sessionId: string;
    path: string;
    localWorkspacePath?: string;
    loadingMessage: string;
    getRemoteWorkspaceSession: (sessionId: string) => RemoteWorkspaceSession | null;
    connectionTarget?: Parameters<IPlatformService["connectRemote"]>[0];
    getWorkspaceTabs: () => WindowTabState[];
    resolveRemoteWorkspaceCanonicalPath: (sessionId: string, workspacePath: string) => Promise<string>;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    handleCancelRemoteProject: (sessionId: string) => Promise<void>;
    bindRemoteWorkspaceSessionContext: BindRemoteWorkspaceSessionContextFn;
    commitRemoteWorkspaceSessionMutation: (mutation: ReturnType<typeof buildRemoteWorkspaceSessionMutation>) => Promise<RemoteWorkspaceSessionEntry>;
    getRemoteSessions: () => RemoteWorkspaceSessionEntry[];
    bindRemoteWorkspacePath: (workspacePath: string, sessionId: string) => void;
    bindRemoteWorkspaceIdentity: (workspaceIdentity: string, sessionId: string) => void;
    addTab: (workspacePath: string, options?: {
        remoteSessionId?: string;
        remoteTarget?: Parameters<IPlatformService["connectRemote"]>[0];
        workspaceIdentity?: string;
        localWorkspacePath?: string;
    }) => void;
    onWorkspaceActivated?: (target: {
        workspacePath: string;
        workspaceIdentity: string;
    }) => void;
    refreshPinnedTasks: (params: {
        sessionId: string;
        workspacePath: string;
        workspaceIdentity?: string;
    }) => Promise<void>;
    refreshTimelineTasks: (params: {
        sessionId: string;
        workspacePath: string;
        workspaceIdentity?: string;
    }) => Promise<void>;
}): Promise<void>;
export declare function useRemoteWorkspaceHistory({ intl, services, platform, supportsSettings, allowRemoteWorkspace, ensureConversationWorkspaceOnRestore, deferInactiveWorkspaceRestore, unavailableWorkspacePath, tabStoreApi, activateTabByPath, addTab, onWorkspaceActivated, }: {
    intl: ReturnType<typeof import("@/i18n/IntlProvider.js").useZCodeIntl>["intl"];
    services: IServiceAccessor;
    platform: IPlatformService;
    supportsSettings: boolean;
    allowRemoteWorkspace?: boolean;
    ensureConversationWorkspaceOnRestore?: boolean;
    /** 仅 Desktop 主窗口：输入可用后再把 inactive workspace 加入 sidebar/task 数据源。 */
    deferInactiveWorkspaceRestore?: boolean;
    unavailableWorkspacePath?: string;
    tabStoreApi: ReturnType<typeof import("@/store/TabStoreProvider.js").useTabStoreApi>;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    addTab: (workspacePath: string, options?: {
        remoteSessionId?: string;
        remoteTarget?: Parameters<IPlatformService["connectRemote"]>[0];
        workspaceIdentity?: string;
        localWorkspacePath?: string;
    }) => void;
    onWorkspaceActivated?: (target: {
        workspacePath: string;
        workspaceIdentity: string;
    }) => void;
}): {
    remoteWorkspaceSessions: RemoteWorkspaceSessionEntry[];
    reconnectingRemoteWorkspaceKeys: string[];
    remoteWorkspaceErrorByWorkspaceKey: {
        [k: string]: string;
    };
    reconnectingRemoteWorkspaceLogsByWorkspaceKey: Record<string, import("../hooks/useRemoteConnectionLogs.js").RemoteConnectionLogEntry[]>;
    buildPersistedTabPatch: (state: TabStoreState) => Partial<AppSettings>;
    restorePersistedSession: (settings: AppSettings) => Promise<{
        deferredRestore?: (() => void) | undefined;
        excludedRecentProjectPaths?: string[] | undefined;
    }>;
    handleCancelRemoteProject: (sessionId: string) => Promise<void>;
    handleSelectRemoteProject: (sessionId: string, path: string, localWorkspacePath?: string) => Promise<void>;
    handleConnectRemote: (options: Parameters<IPlatformService["connectRemote"]>[0], requestId?: string, context?: Parameters<IPlatformService["connectRemote"]>[2]) => Promise<string>;
    handleReconnectRemoteWorkspace: (workspaceKey: string, options?: ReconnectRemoteWorkspaceOptions) => Promise<void>;
    handleOpenRemoteWorkspaceFromHistory: (workspaceKey: string) => Promise<void>;
    handleRemoteWorkspaceTabsClosed: (workspaceKeys: string[]) => void;
};
//# sourceMappingURL=useRemoteWorkspaceHistory.d.ts.map