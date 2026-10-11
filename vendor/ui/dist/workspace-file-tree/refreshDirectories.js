import { isWorkspaceFilePathInside } from "@/workspace-file-tree/model.js";
export function getWorkspaceFileTreeRefreshDirectoryPaths({ workspacePath, expandedPaths, loadedDirectoryPaths, }) {
    const refreshPaths = [];
    const seenPaths = new Set();
    const addRefreshPath = (path) => {
        if (!isWorkspaceFilePathInside(workspacePath, path) || seenPaths.has(path)) {
            return;
        }
        seenPaths.add(path);
        refreshPaths.push(path);
    };
    addRefreshPath(workspacePath);
    for (const path of loadedDirectoryPaths) {
        addRefreshPath(path);
    }
    for (const path of expandedPaths) {
        addRefreshPath(path);
    }
    return refreshPaths;
}
//# sourceMappingURL=refreshDirectories.js.map