import type { EditorInfo, OpenInEditorRemoteTarget, RemoteTarget } from "@zcode/shared";
export type WorkspaceEditorSelectionKind = "preferred" | "fallback" | "empty" | "explicit";
export interface WorkspaceEditorSelectionState {
    availableEditors: EditorInfo[];
    selectedEditor: EditorInfo | null;
    selectionKind: Exclude<WorkspaceEditorSelectionKind, "explicit">;
}
export declare function resolveWorkspaceFileManagerEditor(availableEditors: EditorInfo[], remoteTarget?: RemoteTarget | OpenInEditorRemoteTarget): EditorInfo | null;
export declare function resolveWorkspaceEditorSelection({ installedEditors, selectedEditorId, remoteTarget, }: {
    installedEditors: EditorInfo[];
    selectedEditorId: string | null;
    remoteTarget?: RemoteTarget | OpenInEditorRemoteTarget;
}): WorkspaceEditorSelectionState;
export declare function shouldPersistWorkspaceEditorSelection(selectionKind: WorkspaceEditorSelectionKind): boolean;
//# sourceMappingURL=workspaceEditorSelection.d.ts.map