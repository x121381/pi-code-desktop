import type { WorkspaceFileEntry } from "@zcode/shared";
interface WorkspaceFileSearchIndexState {
    entries: WorkspaceFileEntry[];
    loading: boolean;
    loaded: boolean;
    error: Error | null;
    refresh: () => void;
}
export declare function useWorkspaceFileSearchIndex({ workspacePath, workspaceIdentity, workspaceRemoteSessionId, enabled, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    enabled: boolean;
}): WorkspaceFileSearchIndexState;
export declare function useWorkspaceFileSearchResults({ entries, query, workspacePath, }: {
    entries: WorkspaceFileEntry[];
    query: string;
    workspacePath: string;
}): WorkspaceFileEntry[];
export {};
//# sourceMappingURL=useWorkspaceFileSearchIndex.d.ts.map