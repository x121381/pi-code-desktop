import type { EditorInfo, OpenInEditorRemoteTarget } from "@zcode/shared";
import type { CSSProperties, KeyboardEvent } from "react";
import { type WorkspaceFileGitStatus, type WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
import type { WorkspaceFileGitStatusLabels, WorkspaceFileTreeContextMenuLabels } from "@/workspace-file-tree/types.js";
export declare function WorkspaceFileTreeRowView({ layout, row, selected, gitStatus, directoryGitStatuses, gitStatusLabelByStatus, contextMenuLabels, canOpenLocalFileManager, installedEditors, isRemoteWorkspaceFileTree, remoteTarget, workspacePath, workspaceIdentity, style, onSelect, onToggleDirectory, onOpenPreview, onOpenBrowserUrl, onKeyDown, }: {
    layout?: "absolute" | "static";
    row: WorkspaceFileTreeRow;
    selected: boolean;
    gitStatus: WorkspaceFileGitStatus | null;
    directoryGitStatuses: WorkspaceFileGitStatus[];
    gitStatusLabelByStatus: WorkspaceFileGitStatusLabels;
    contextMenuLabels: WorkspaceFileTreeContextMenuLabels;
    canOpenLocalFileManager: boolean;
    installedEditors: EditorInfo[];
    isRemoteWorkspaceFileTree: boolean;
    remoteTarget?: OpenInEditorRemoteTarget;
    workspacePath: string;
    workspaceIdentity?: string;
    style: CSSProperties;
    onSelect: (path: string) => void;
    onToggleDirectory: (row: WorkspaceFileTreeRow) => void;
    onOpenPreview: (row: WorkspaceFileTreeRow) => void;
    onOpenBrowserUrl?: (url: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>, row: WorkspaceFileTreeRow) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceFileTreeRowView.d.ts.map