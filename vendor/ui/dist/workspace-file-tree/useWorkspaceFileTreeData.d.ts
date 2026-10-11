import { type WorkspaceFileGitStatus } from "@/workspace-file-tree/model.js";
type WorkspaceFileTreeDirectoryLoadResult = "loaded" | "stale" | "failed";
export declare function useWorkspaceFileTreeData({ workspacePath, workspaceIdentity, workspaceRemoteSessionId, enableWorkspaceFeatures, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    enableWorkspaceFeatures?: boolean;
}): {
    rows: import("@/workspace-file-tree/model.js").WorkspaceFileTreeRow[];
    setExpandedPaths: import("react").Dispatch<import("react").SetStateAction<Set<string>>>;
    loadedDirectoryPaths: Set<string>;
    loadingDirectoryPaths: Set<string>;
    errorByDirectory: Map<string, Error>;
    gitStatusByPath: Map<string, WorkspaceFileGitStatus>;
    gitStatusAvailable: boolean;
    ignoredPathSet: Set<string>;
    refreshingLoadedDirectories: boolean;
    loadDirectory: (directoryPath: string, childDepth: number, options?: {
        force?: boolean;
        silent?: boolean;
        workspaceGeneration?: number;
    }) => Promise<WorkspaceFileTreeDirectoryLoadResult>;
    loadGitStatus: (options?: {
        workspaceGeneration?: number;
    }) => Promise<void>;
    refreshLoadedDirectories: () => Promise<void>;
    setLoadedDirectoryPaths: import("react").Dispatch<import("react").SetStateAction<Set<string>>>;
    loadedDirectoryPathsRef: import("react").RefObject<Set<string>>;
};
export {};
//# sourceMappingURL=useWorkspaceFileTreeData.d.ts.map