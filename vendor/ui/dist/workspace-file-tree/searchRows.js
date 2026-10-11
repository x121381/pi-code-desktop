import { getWorkspaceFileAncestorDirectories, isWorkspaceFilePathInside, } from "@/workspace-file-tree/model.js";
export function createWorkspaceFileTreeRowsFromSearchEntries(entries) {
    return entries.map((entry) => ({
        path: entry.path,
        // 搜索结果来自全 workspace 索引，目录可能未在懒加载树里展开过；显示相对路径能避免多个同名 Java 类看起来无法区分。
        name: entry.relativePath,
        type: entry.type,
        depth: 0,
        expanded: false,
        loaded: false,
        loading: false,
        error: null,
    }));
}
export function getWorkspaceFileSearchDirectoryRevealPaths({ workspacePath, directoryPath, }) {
    if (!isWorkspaceFilePathInside(workspacePath, directoryPath)) {
        return [];
    }
    return [...getWorkspaceFileAncestorDirectories(workspacePath, directoryPath), directoryPath];
}
//# sourceMappingURL=searchRows.js.map