import type { FileEntry, GitFileChange, GitRepositorySummary } from "@zcode/shared";
import { type CodeViewerSource } from "@/lib/codeViewer.js";
export interface WorkspaceFileTreeNode {
    path: string;
    name: string;
    type: FileEntry["type"];
    depth: number;
    isSymbolicLink?: boolean;
}
export interface WorkspaceFileTreeRow extends WorkspaceFileTreeNode {
    expanded: boolean;
    loaded: boolean;
    loading: boolean;
    error: Error | null;
    compactedPaths?: string[];
}
export type WorkspaceFileGitStatus = "modified" | "added" | "deleted" | "renamed" | "untracked" | "ignored";
export declare function buildWorkspaceFileGitStatusByPath(changes: readonly Pick<GitFileChange, "path" | "isUntracked" | "kind" | "section">[]): Map<string, WorkspaceFileGitStatus>;
export declare function isWorkspaceFileTreeGitStatusAvailable(summary: Pick<GitRepositorySummary, "isGitAvailable" | "isRepository">): boolean;
export declare function getWorkspaceFileGitStatus(statusByPath: ReadonlyMap<string, WorkspaceFileGitStatus>, filePath: string): WorkspaceFileGitStatus | null;
export declare function buildWorkspaceFileIgnoredPathSet(paths: readonly string[]): Set<string>;
export declare function isWorkspaceFileGitIgnored(ignoredPathSet: ReadonlySet<string>, filePath: string): boolean;
export declare function isWorkspaceFileTreeDeletedFile(row: Pick<WorkspaceFileTreeRow, "type">, gitStatus: WorkspaceFileGitStatus | null | undefined): boolean;
export declare function isWorkspaceFileTreeAutoFlattenableDirectory(node: Pick<WorkspaceFileTreeNode, "type" | "isSymbolicLink"> | undefined): node is WorkspaceFileTreeNode;
export declare function getWorkspaceDirectoryGitStatuses(statusByPath: ReadonlyMap<string, WorkspaceFileGitStatus>, directoryPath: string): WorkspaceFileGitStatus[];
export declare function addDeletedGitStatusRowsToWorkspaceFileTree(params: {
    rootPath: string;
    childrenByDirectory: Map<string, WorkspaceFileTreeNode[]>;
    statusByPath: ReadonlyMap<string, WorkspaceFileGitStatus>;
}): Map<string, WorkspaceFileTreeNode[]>;
export declare function getWorkspaceFileRelativePath(workspacePath: string, filePath: string): string;
export declare function areWorkspaceFilePathsEqual(leftPath: string, rightPath: string): boolean;
export declare function isWorkspaceFilePathInside(workspacePath: string, filePath: string): boolean;
export declare function getWorkspaceFileAncestorDirectories(workspacePath: string, filePath: string): string[];
export declare function getWorkspaceFileDirectoryChildDepth(workspacePath: string, directoryPath: string): number;
export declare function getWorkspaceFileParentDirectory(workspacePath: string, directoryPath: string): string | null;
export declare function filterWorkspaceFileTreeRows(params: {
    rows: WorkspaceFileTreeRow[];
    searchQuery: string;
    changedOnly: boolean;
    statusByPath: ReadonlyMap<string, WorkspaceFileGitStatus>;
}): WorkspaceFileTreeRow[];
export declare function flattenWorkspaceFileTreeRows(params: {
    rootPath: string;
    childrenByDirectory: Map<string, WorkspaceFileTreeNode[]>;
    expandedPaths: Set<string>;
    loadedDirectoryPaths: Set<string>;
    loadingDirectoryPaths: Set<string>;
    errorByDirectory: Map<string, Error>;
    flattenEmptyDirectories?: boolean;
}): WorkspaceFileTreeRow[];
export declare function createCodeViewerSourceForWorkspaceFile(path: string): CodeViewerSource;
//# sourceMappingURL=model.d.ts.map