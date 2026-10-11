export declare function usePromptEditorDragState({ enableWorkspaceFileDrop, enableExternalFileDrop, }: {
    enableWorkspaceFileDrop: boolean;
    enableExternalFileDrop: boolean;
}): {
    externalFileDragging: boolean;
    internalDragging: boolean;
    setExternalFileDragging: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setInternalDragging: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setWorkspaceFileDragging: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    workspaceFileDragging: boolean;
};
//# sourceMappingURL=usePromptEditorDragState.d.ts.map