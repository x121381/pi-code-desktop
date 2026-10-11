import { useMemo } from "react";
import { addDeletedGitStatusRowsToWorkspaceFileTree, flattenWorkspaceFileTreeRows, } from "../workspace-file-tree/model.js";
export function useWorkspaceFileTreeRows({ workspacePath, childrenByDirectory, expandedPaths, loadedDirectoryPaths, loadingDirectoryPaths, errorByDirectory, gitStatusByPath, }) {
    return useMemo(() => {
        const childrenWithGitOnlyRows = addDeletedGitStatusRowsToWorkspaceFileTree({
            rootPath: workspacePath,
            childrenByDirectory,
            statusByPath: gitStatusByPath,
        });
        return flattenWorkspaceFileTreeRows({
            rootPath: workspacePath,
            childrenByDirectory: childrenWithGitOnlyRows,
            expandedPaths,
            loadedDirectoryPaths,
            loadingDirectoryPaths,
            errorByDirectory,
            flattenEmptyDirectories: true,
        });
    }, [
        childrenByDirectory,
        errorByDirectory,
        expandedPaths,
        gitStatusByPath,
        loadedDirectoryPaths,
        loadingDirectoryPaths,
        workspacePath,
    ]);
}
//# sourceMappingURL=useWorkspaceFileTreeRows.js.map