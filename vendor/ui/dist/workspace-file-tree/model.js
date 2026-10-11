import { getPathLeaf } from "@/lib/path.js";
import { inferImageMediaType, inferMediaPreview } from "@/lib/codeViewer.js";
const WORKSPACE_FILE_GIT_STATUS_PRIORITY = {
    ignored: 0,
    modified: 1,
    renamed: 2,
    deleted: 3,
    added: 4,
    untracked: 5,
};
const WORKSPACE_FILE_GIT_DIRECTORY_STATUS_PRIORITY = {
    added: 1,
    deleted: 1,
    renamed: 1,
    untracked: 1,
    modified: 2,
    ignored: 3,
};
function normalizeForRelativePath(path) {
    return path.replace(/\\/g, "/").replace(/\/+$/, "");
}
function normalizeForGitStatusPath(path) {
    return normalizeForRelativePath(path);
}
function resolveWorkspaceFileGitStatus(change) {
    if (change.isUntracked || change.section === "untracked") {
        return "untracked";
    }
    return change.kind;
}
export function buildWorkspaceFileGitStatusByPath(changes) {
    const statusByPath = new Map();
    for (const change of changes) {
        const pathKey = normalizeForGitStatusPath(change.path);
        const nextStatus = resolveWorkspaceFileGitStatus(change);
        const existingStatus = statusByPath.get(pathKey);
        // 修复：文件树之前把 Git 改动统一压成 M/U，导致 staged added/deleted/renamed
        // 在树里丢失真实状态。这里保留优先级更高的状态，兼容同一文件同时存在 staged/unstaged 记录。
        if (existingStatus &&
            WORKSPACE_FILE_GIT_STATUS_PRIORITY[existingStatus] >=
                WORKSPACE_FILE_GIT_STATUS_PRIORITY[nextStatus]) {
            continue;
        }
        statusByPath.set(pathKey, nextStatus);
    }
    return statusByPath;
}
export function isWorkspaceFileTreeGitStatusAvailable(summary) {
    // 修复：`getChanges()` 在非 Git workspace 里也会返回空数组，不能把“读取成功”
    // 当成 Git 状态可用。文件树只在 Git 可执行且当前 workspace 属于仓库时展示变更过滤。
    return summary.isGitAvailable && summary.isRepository;
}
export function getWorkspaceFileGitStatus(statusByPath, filePath) {
    return statusByPath.get(normalizeForGitStatusPath(filePath)) ?? null;
}
export function buildWorkspaceFileIgnoredPathSet(paths) {
    return new Set(paths.map((path) => normalizeForGitStatusPath(path)));
}
export function isWorkspaceFileGitIgnored(ignoredPathSet, filePath) {
    return ignoredPathSet.has(normalizeForGitStatusPath(filePath));
}
export function isWorkspaceFileTreeDeletedFile(row, gitStatus) {
    return row.type !== "directory" && gitStatus === "deleted";
}
export function isWorkspaceFileTreeAutoFlattenableDirectory(node) {
    // 软链接目录可以展示并手动进入，但不能参与空目录链自动展开；
    // self/parent symlink 会让路径字符串去重失效，持续加载 linked-dir/linked-dir/...。
    return node?.type === "directory" && node.isSymbolicLink !== true;
}
export function getWorkspaceDirectoryGitStatuses(statusByPath, directoryPath) {
    const normalizedDirectoryPath = normalizeForGitStatusPath(directoryPath);
    const directoryPrefix = `${normalizedDirectoryPath}/`;
    const statuses = new Set();
    for (const [path, status] of statusByPath) {
        if (!normalizeForGitStatusPath(path).startsWith(directoryPrefix)) {
            continue;
        }
        statuses.add(status);
    }
    return [...statuses].sort((left, right) => 
    // 修复：目录 descendant 之前沿用了文件状态合并优先级，导致 U/A/D 会盖过 M。
    // VS Code 的 Git resource priority 是 modified 高于新增/删除/重命名/未跟踪，
    // 目录聚合只决定文件夹圆点样式，因此单独使用这套 decoration 优先级。
    WORKSPACE_FILE_GIT_DIRECTORY_STATUS_PRIORITY[right] -
        WORKSPACE_FILE_GIT_DIRECTORY_STATUS_PRIORITY[left]);
}
export function addDeletedGitStatusRowsToWorkspaceFileTree(params) {
    let nextChildrenByDirectory = null;
    for (const [path, status] of params.statusByPath) {
        if (status !== "deleted") {
            continue;
        }
        const parentDirectory = getWorkspaceFileParentDirectory(params.rootPath, path);
        if (!parentDirectory) {
            continue;
        }
        const currentChildren = (nextChildrenByDirectory ?? params.childrenByDirectory).get(parentDirectory) ?? null;
        if (!currentChildren) {
            continue;
        }
        if (currentChildren.some((child) => areWorkspaceFilePathsEqual(child.path, path))) {
            continue;
        }
        const nextChildren = [
            ...currentChildren,
            {
                path,
                name: getPathLeaf(path),
                type: "file",
                depth: getWorkspaceFileDirectoryChildDepth(params.rootPath, parentDirectory),
            },
        ].sort((left, right) => {
            if (left.type !== right.type) {
                return left.type === "directory" ? -1 : 1;
            }
            return left.name.localeCompare(right.name);
        });
        // 修复：deleted 文件已不在文件系统里，单靠 readdir 无法生成行，
        // 导致文件树只能在目录上显示聚合点，看不到具体文件的 D 状态。
        nextChildrenByDirectory ??= new Map(params.childrenByDirectory);
        nextChildrenByDirectory.set(parentDirectory, nextChildren);
    }
    return nextChildrenByDirectory ?? params.childrenByDirectory;
}
export function getWorkspaceFileRelativePath(workspacePath, filePath) {
    const normalizedWorkspacePath = normalizeForRelativePath(workspacePath);
    const normalizedFilePath = normalizeForRelativePath(filePath);
    if (normalizedWorkspacePath === normalizedFilePath) {
        return ".";
    }
    const workspacePrefix = `${normalizedWorkspacePath}/`;
    if (normalizedFilePath.startsWith(workspacePrefix)) {
        return normalizedFilePath.slice(workspacePrefix.length);
    }
    return getPathLeaf(filePath);
}
export function areWorkspaceFilePathsEqual(leftPath, rightPath) {
    return normalizeForRelativePath(leftPath) === normalizeForRelativePath(rightPath);
}
export function isWorkspaceFilePathInside(workspacePath, filePath) {
    const normalizedWorkspacePath = normalizeForRelativePath(workspacePath);
    const normalizedFilePath = normalizeForRelativePath(filePath);
    return (normalizedFilePath === normalizedWorkspacePath ||
        normalizedFilePath.startsWith(`${normalizedWorkspacePath}/`));
}
export function getWorkspaceFileAncestorDirectories(workspacePath, filePath) {
    const normalizedWorkspacePath = normalizeForRelativePath(workspacePath);
    const normalizedFilePath = normalizeForRelativePath(filePath);
    const workspacePrefix = `${normalizedWorkspacePath}/`;
    if (!isWorkspaceFilePathInside(workspacePath, filePath) ||
        normalizedFilePath === normalizedWorkspacePath) {
        return [];
    }
    const relativePath = normalizedFilePath.slice(workspacePrefix.length);
    const relativeSegments = relativePath.split("/").filter(Boolean);
    if (relativeSegments.length <= 1) {
        return [];
    }
    const separator = filePath.includes("\\") && !filePath.includes("/") ? "\\" : "/";
    const basePath = workspacePath.replace(/[\\/]+$/, "");
    const ancestorSegments = relativeSegments.slice(0, -1);
    const ancestors = [];
    let currentPath = basePath;
    for (const segment of ancestorSegments) {
        currentPath = `${currentPath}${separator}${segment}`;
        ancestors.push(currentPath);
    }
    return ancestors;
}
export function getWorkspaceFileDirectoryChildDepth(workspacePath, directoryPath) {
    const normalizedWorkspacePath = normalizeForRelativePath(workspacePath);
    const normalizedDirectoryPath = normalizeForRelativePath(directoryPath);
    if (normalizedDirectoryPath === normalizedWorkspacePath ||
        !isWorkspaceFilePathInside(workspacePath, directoryPath)) {
        return 0;
    }
    const workspacePrefix = `${normalizedWorkspacePath}/`;
    return normalizedDirectoryPath.slice(workspacePrefix.length).split("/").filter(Boolean).length;
}
export function getWorkspaceFileParentDirectory(workspacePath, directoryPath) {
    const normalizedWorkspacePath = normalizeForRelativePath(workspacePath);
    const normalizedDirectoryPath = normalizeForRelativePath(directoryPath);
    if (normalizedDirectoryPath === normalizedWorkspacePath ||
        !isWorkspaceFilePathInside(workspacePath, directoryPath)) {
        return null;
    }
    const workspacePrefix = `${normalizedWorkspacePath}/`;
    const relativeSegments = normalizedDirectoryPath
        .slice(workspacePrefix.length)
        .split("/")
        .filter(Boolean);
    const parentSegments = relativeSegments.slice(0, -1);
    if (parentSegments.length === 0) {
        return workspacePath.replace(/[\\/]+$/, "");
    }
    const separator = directoryPath.includes("\\") && !directoryPath.includes("/") ? "\\" : "/";
    return `${workspacePath.replace(/[\\/]+$/, "")}${separator}${parentSegments.join(separator)}`;
}
function normalizeWorkspaceFileTreeSearchQuery(query) {
    return query.trim().toLocaleLowerCase();
}
function isWorkspaceFileTreeRowChanged(row, statusByPath) {
    const gitStatus = getWorkspaceFileGitStatus(statusByPath, row.path);
    if (gitStatus && gitStatus !== "ignored") {
        return true;
    }
    return (row.type === "directory" && getWorkspaceDirectoryGitStatuses(statusByPath, row.path).length > 0);
}
export function filterWorkspaceFileTreeRows(params) {
    const changedFilteredRows = params.changedOnly
        ? params.rows.filter((row) => isWorkspaceFileTreeRowChanged(row, params.statusByPath))
        : params.rows;
    const normalizedSearchQuery = normalizeWorkspaceFileTreeSearchQuery(params.searchQuery);
    if (!normalizedSearchQuery) {
        return changedFilteredRows;
    }
    const matchedRows = changedFilteredRows.filter((row) => row.name.toLocaleLowerCase().includes(normalizedSearchQuery));
    if (matchedRows.length === 0) {
        return [];
    }
    const matchedPathSet = new Set(matchedRows.map((row) => row.path));
    const matchedDirectoryPaths = matchedRows
        .filter((row) => row.type === "directory")
        .map((row) => row.path);
    return changedFilteredRows.filter((row) => {
        if (matchedPathSet.has(row.path)) {
            return true;
        }
        if (row.type === "directory" &&
            matchedRows.some((matchedRow) => isWorkspaceFilePathInside(row.path, matchedRow.path))) {
            return true;
        }
        return matchedDirectoryPaths.some((directoryPath) => isWorkspaceFilePathInside(directoryPath, row.path));
    });
}
export function flattenWorkspaceFileTreeRows(params) {
    const rows = [];
    function compactDirectoryNode(node) {
        if (!params.flattenEmptyDirectories || !isWorkspaceFileTreeAutoFlattenableDirectory(node)) {
            return { node, childDepthOffset: 0 };
        }
        const compactedNodes = [node];
        let currentNode = node;
        while (params.loadedDirectoryPaths.has(currentNode.path) &&
            !params.loadingDirectoryPaths.has(currentNode.path) &&
            !params.errorByDirectory.has(currentNode.path)) {
            const children = params.childrenByDirectory.get(currentNode.path) ?? [];
            if (children.length !== 1 || !isWorkspaceFileTreeAutoFlattenableDirectory(children[0])) {
                break;
            }
            currentNode = children[0];
            compactedNodes.push(currentNode);
        }
        if (compactedNodes.length === 1) {
            return { node, childDepthOffset: 0 };
        }
        return {
            node: {
                ...currentNode,
                depth: node.depth,
                name: compactedNodes.map((compactedNode) => compactedNode.name).join("/"),
            },
            compactedPaths: compactedNodes.map((compactedNode) => compactedNode.path),
            childDepthOffset: currentNode.depth - node.depth,
        };
    }
    function visit(directoryPath, depthOffset = 0) {
        const children = params.childrenByDirectory.get(directoryPath) ?? [];
        for (const child of children) {
            const compacted = compactDirectoryNode({
                ...child,
                depth: child.depth - depthOffset,
            });
            const representedPaths = compacted.compactedPaths ?? [compacted.node.path];
            const expanded = representedPaths.some((path) => params.expandedPaths.has(path));
            rows.push({
                ...compacted.node,
                expanded,
                loaded: params.loadedDirectoryPaths.has(compacted.node.path),
                loading: params.loadingDirectoryPaths.has(compacted.node.path),
                error: params.errorByDirectory.get(compacted.node.path) ?? null,
                ...(compacted.compactedPaths ? { compactedPaths: compacted.compactedPaths } : {}),
            });
            if (compacted.node.type === "directory" && expanded) {
                visit(compacted.node.path, depthOffset + compacted.childDepthOffset);
            }
        }
    }
    visit(params.rootPath);
    return rows;
}
export function createCodeViewerSourceForWorkspaceFile(path) {
    const title = getPathLeaf(path);
    const mediaType = inferImageMediaType(path);
    if (mediaType && mediaType !== "image/svg+xml") {
        return {
            type: "image",
            title,
            path,
            mediaType,
        };
    }
    const mediaPreview = inferMediaPreview(path);
    if (mediaPreview) {
        return {
            type: "media",
            title,
            path,
            ...mediaPreview,
        };
    }
    return {
        type: "file",
        title,
        path,
    };
}
//# sourceMappingURL=model.js.map