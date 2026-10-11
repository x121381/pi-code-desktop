import { jsx as _jsx } from "react/jsx-runtime";
import { areWorkspaceFilePathsEqual, getWorkspaceDirectoryGitStatuses, getWorkspaceFileGitStatus, isWorkspaceFileGitIgnored, } from "../workspace-file-tree/model.js";
import { WorkspaceFileTreeRowView } from "../workspace-file-tree/WorkspaceFileTreeRowView.js";
export function WorkspaceFileTreeStickyFolders({ items, selectedPath, gitStatusByPath, ignoredPathSet, gitStatusLabelByStatus, contextMenuLabels, editorState, workspacePath, workspaceIdentity, onSelect, onToggleDirectory, onRevealRow, onOpenPreview, onOpenBrowserUrl, onKeyDown, }) {
    if (items.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "pointer-events-none sticky top-0 z-10 h-0 overflow-visible px-1", children: _jsx("div", { className: "pointer-events-auto overflow-hidden rounded-lg", children: items.map((item) => {
                const row = item.row;
                const handleToggle = (nextRow) => {
                    onToggleDirectory(nextRow);
                    if (nextRow.expanded) {
                        requestAnimationFrame(() => onRevealRow(item));
                    }
                };
                return (_jsx(WorkspaceFileTreeRowView, { layout: "static", row: row, selected: selectedPath !== null && areWorkspaceFilePathsEqual(selectedPath, row.path), gitStatus: getWorkspaceFileGitStatus(gitStatusByPath, row.path) ??
                        (isWorkspaceFileGitIgnored(ignoredPathSet, row.path) ? "ignored" : null), directoryGitStatuses: getWorkspaceDirectoryGitStatuses(gitStatusByPath, row.path), gitStatusLabelByStatus: gitStatusLabelByStatus, contextMenuLabels: contextMenuLabels, canOpenLocalFileManager: editorState.canOpenLocalFileManager, installedEditors: editorState.installedEditors, isRemoteWorkspaceFileTree: editorState.isRemoteWorkspaceFileTree, remoteTarget: editorState.remoteTarget, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, style: {}, onSelect: onSelect, onToggleDirectory: handleToggle, onOpenPreview: onOpenPreview, onOpenBrowserUrl: onOpenBrowserUrl, onKeyDown: onKeyDown }, row.path));
            }) }) }));
}
//# sourceMappingURL=WorkspaceFileTreeStickyFolders.js.map