import type { AppSettings, PersistedWorkspaceSessionEntry, RemoteTarget, RemoteTargetSnapshot, RemoteWorkspaceSessionEntry } from "@zcode/shared";
import type { WindowTabState } from "@/store/tabStore.js";
interface RemoteWorkspaceSessionMutation {
    entry: RemoteWorkspaceSessionEntry;
    nextRemoteSessions: RemoteWorkspaceSessionEntry[];
    credentialsToSave: {
        key: string;
        value: string;
    }[];
    credentialKeysToDelete: string[];
}
interface RemoveRemoteWorkspaceSessionEntriesResult {
    nextRemoteSessions: RemoteWorkspaceSessionEntry[];
    credentialKeysToDelete: string[];
}
export declare function getWorkspaceDisplayLabel(workspacePath: string): string;
export declare function hasRemoteWorkspaceIdentity(entry: {
    remoteSessionId?: string;
    remoteTarget?: RemoteTarget;
    workspaceIdentity?: string;
}): boolean;
export declare function isSshRemoteWorkspaceIdentity(workspaceIdentity?: string | null): boolean;
export declare function formatRemoteWorkspaceTargetSubtitle(target: RemoteTarget | RemoteTargetSnapshot): string;
export declare function formatRemoteWorkspaceHeaderHostLabel(target: RemoteTarget | RemoteTargetSnapshot): string;
export declare function formatRemoteWorkspaceDisplayLabel(label: string, target?: RemoteTarget | RemoteTargetSnapshot): string;
export declare function buildRemoteWorkspaceIdentity(workspacePath: string, target: RemoteTarget | RemoteTargetSnapshot): string;
export declare function resolveRemoteWorkspaceSessionIdentity(entry: Pick<RemoteWorkspaceSessionEntry, "workspacePath" | "target" | "workspaceIdentity">): string;
export declare function buildWorkspaceSessionKey(entry: {
    workspacePath: string;
    workspaceIdentity?: string;
}): string;
export declare function findMatchingRemoteWorkspaceSessionEntry(sessions: RemoteWorkspaceSessionEntry[], workspacePath: string, target: RemoteTarget | RemoteTargetSnapshot): RemoteWorkspaceSessionEntry | null;
export declare function createRemoteTargetSnapshot(workspaceKey: string, target: RemoteTarget, previousSnapshot?: RemoteTargetSnapshot): RemoteTargetSnapshot;
export declare function createRemoteTargetFromSnapshot(snapshot: RemoteTargetSnapshot, credentials: {
    password: string | null;
    privateKeyPassphrase: string | null;
    token?: string | null;
}): RemoteTarget;
export declare function upsertRemoteWorkspaceSessionEntries(sessions: RemoteWorkspaceSessionEntry[], nextEntry: RemoteWorkspaceSessionEntry): RemoteWorkspaceSessionEntry[];
export declare function removeRemoteWorkspaceSessionEntries(sessions: readonly RemoteWorkspaceSessionEntry[], workspaceKeys: readonly string[]): RemoveRemoteWorkspaceSessionEntriesResult;
export declare function buildRemoteWorkspaceSessionMutation(params: {
    remoteSessions: RemoteWorkspaceSessionEntry[];
    workspacePath: string;
    localWorkspacePath?: string;
    workspaceIdentity?: string;
    target: RemoteTarget;
    lastConnectionStatus: RemoteWorkspaceSessionEntry["lastConnectionStatus"];
    lastConnectionError?: string;
    touchOpenedAt: boolean;
}): RemoteWorkspaceSessionMutation;
export declare function buildPersistedWorkspaceSessionEntries(tabs: WindowTabState[], remoteSessionsByWorkspaceKey: ReadonlyMap<string, RemoteWorkspaceSessionEntry>): PersistedWorkspaceSessionEntry[];
export declare function readPersistedWorkspaceSessionEntries(settings: Pick<AppSettings, "lastWorkspaceSession">): PersistedWorkspaceSessionEntry[];
export declare function getRemoteWorkspaceSessionEntries(settings: Pick<AppSettings, "lastWorkspaceSession">): RemoteWorkspaceSessionEntry[];
export declare function buildRemoteWorkspaceSessionEntryMap(entries: readonly RemoteWorkspaceSessionEntry[]): Map<string, RemoteWorkspaceSessionEntry>;
export {};
//# sourceMappingURL=remoteWorkspaceHistory.d.ts.map