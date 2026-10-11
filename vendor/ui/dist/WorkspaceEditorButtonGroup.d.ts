import { type EditorInfo, type RemoteTarget } from "@zcode/shared";
export declare function WorkspaceEditorButtonGroup({ disabledReason, workspaceAbsPath, workspaceIdentity, remoteTarget, onSelectedEditorChange, }: {
    disabledReason?: string;
    workspaceAbsPath: string;
    workspaceIdentity?: string;
    remoteTarget?: RemoteTarget;
    onSelectedEditorChange?: (editor: EditorInfo | null) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspaceEditorButtonGroup.d.ts.map