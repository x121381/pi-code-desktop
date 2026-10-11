import { type WorkspaceFileGitStatus, type WorkspaceFileTreeNode } from "@/workspace-file-tree/model.js";
export declare function useWorkspaceFileTreeRows({ workspacePath, childrenByDirectory, expandedPaths, loadedDirectoryPaths, loadingDirectoryPaths, errorByDirectory, gitStatusByPath, }: {
    workspacePath: string;
    childrenByDirectory: Map<string, WorkspaceFileTreeNode[]>;
    expandedPaths: Set<string>;
    loadedDirectoryPaths: Set<string>;
    loadingDirectoryPaths: Set<string>;
    errorByDirectory: Map<string, Error>;
    gitStatusByPath: Map<string, WorkspaceFileGitStatus>;
}): import("@/workspace-file-tree/model.js").WorkspaceFileTreeRow[];
//# sourceMappingURL=useWorkspaceFileTreeRows.d.ts.map