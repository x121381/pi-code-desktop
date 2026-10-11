import type { CSSProperties, KeyboardEvent, RefCallback } from "react";
import type { VirtualItem } from "@tanstack/react-virtual";
import { type WorkspaceFileGitStatus, type WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
import type { WorkspaceFileGitStatusLabels, WorkspaceFileTreeContextMenuLabels, WorkspaceFileTreeEditorState } from "@/workspace-file-tree/types.js";
export declare const WORKSPACE_FILE_TREE_MASK_OFFSET_PROPERTY = "--workspace-file-tree-mask-offset";
export declare function getWorkspaceFileTreeListMaskStyle({ stickyFolderCount, }: {
    stickyFolderCount: number;
}): CSSProperties | undefined;
export declare function WorkspaceFileTreeList({ rootError, showInitialLoading, rows, virtualItems, listRef, stickyFolderCount, totalSize, emptyTitle, workspaceTitle, workspacePath, workspaceIdentity, selectedPath, gitStatusByPath, ignoredPathSet, gitStatusLabelByStatus, contextMenuLabels, editorState, onSelect, onToggleDirectory, onOpenPreview, onOpenBrowserUrl, onKeyDown, }: {
    rootError: Error | null;
    showInitialLoading: boolean;
    rows: WorkspaceFileTreeRow[];
    virtualItems: VirtualItem[];
    listRef: RefCallback<HTMLDivElement>;
    stickyFolderCount: number;
    totalSize: number;
    emptyTitle: string;
    workspaceTitle: string;
    workspacePath: string;
    workspaceIdentity?: string;
    selectedPath: string | null;
    gitStatusByPath: Map<string, WorkspaceFileGitStatus>;
    ignoredPathSet: Set<string>;
    gitStatusLabelByStatus: WorkspaceFileGitStatusLabels;
    contextMenuLabels: WorkspaceFileTreeContextMenuLabels;
    editorState: WorkspaceFileTreeEditorState;
    onSelect: (path: string) => void;
    onToggleDirectory: (row: WorkspaceFileTreeRow) => void;
    onOpenPreview: (row: WorkspaceFileTreeRow) => void;
    onOpenBrowserUrl?: (url: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>, row: WorkspaceFileTreeRow) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceFileTreeList.d.ts.map