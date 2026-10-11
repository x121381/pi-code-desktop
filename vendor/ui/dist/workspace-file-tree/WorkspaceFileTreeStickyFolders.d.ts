import type { KeyboardEvent } from "react";
import type { WorkspaceFileGitStatus, WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
import type { WorkspaceFileGitStatusLabels, WorkspaceFileTreeContextMenuLabels, WorkspaceFileTreeEditorState, WorkspaceFileTreeStickyFolderItem } from "@/workspace-file-tree/types.js";
export declare function WorkspaceFileTreeStickyFolders({ items, selectedPath, gitStatusByPath, ignoredPathSet, gitStatusLabelByStatus, contextMenuLabels, editorState, workspacePath, workspaceIdentity, onSelect, onToggleDirectory, onRevealRow, onOpenPreview, onOpenBrowserUrl, onKeyDown, }: {
    items: WorkspaceFileTreeStickyFolderItem[];
    selectedPath: string | null;
    gitStatusByPath: Map<string, WorkspaceFileGitStatus>;
    ignoredPathSet: Set<string>;
    gitStatusLabelByStatus: WorkspaceFileGitStatusLabels;
    contextMenuLabels: WorkspaceFileTreeContextMenuLabels;
    editorState: WorkspaceFileTreeEditorState;
    workspacePath: string;
    workspaceIdentity?: string;
    onSelect: (path: string) => void;
    onToggleDirectory: (row: WorkspaceFileTreeRow) => void;
    onRevealRow: (item: WorkspaceFileTreeStickyFolderItem) => void;
    onOpenPreview: (row: WorkspaceFileTreeRow) => void;
    onOpenBrowserUrl?: (url: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>, row: WorkspaceFileTreeRow) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspaceFileTreeStickyFolders.d.ts.map