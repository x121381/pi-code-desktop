export declare function getScratchWorkspaceLocationHint(name: string): string;
export declare function getScratchWorkspaceNameErrorKind(name: string): "separator" | "required" | null;
export declare function ScratchWorkspaceDialog({ open, onOpenChange, onCreateScratchWorkspace, }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateScratchWorkspace: (name: string) => Promise<string | null>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatEmptyScratchWorkspaceDialog.d.ts.map