import type { AppSettings, RemoteWorkspaceSessionEntry } from "@zcode/shared";
import { type TabStore, type TabStoreState } from "@/store/tabStore.js";
export declare function buildRemoteWorkspacePersistPatch(state: TabStoreState, remoteSessions: readonly RemoteWorkspaceSessionEntry[]): Partial<AppSettings>;
export declare function restorePersistedRemoteWorkspaceSessions({ settings, tabStoreApi, allowRemoteWorkspaceRestore, unavailableWorkspacePath, conversationWorkspacePath, restoreMode, }: {
    settings: AppSettings;
    tabStoreApi: TabStore;
    allowRemoteWorkspaceRestore?: boolean;
    unavailableWorkspacePath?: string;
    conversationWorkspacePath?: string;
    restoreMode?: "all" | "active-first";
}): {
    deferredRestore?: () => void;
} | undefined;
//# sourceMappingURL=remoteWorkspaceSessionPersistence.d.ts.map