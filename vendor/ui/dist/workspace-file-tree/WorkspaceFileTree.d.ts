import type { WorkspaceFileTreeProps } from "@/workspace-file-tree/types.js";
export declare function getWorkspaceFileTreeDirectoryLoadDepth(workspacePath: string, directoryPath: string): number;
export declare function WorkspaceFileTree({ workspacePath, workspaceName, workspaceIdentity, workspaceRemoteSessionId, revealPath, temporaryExternalDirectory, canOpenLocalFileManager, activePreviewPath, onClose, onOpenBrowserUrl, onOpenPreview, }: WorkspaceFileTreeProps): import("react/jsx-runtime").JSX.Element;
export declare function getWorkspaceFileTreeBlockingRootError({ rootLoaded, rootError, }: {
    rootLoaded: boolean;
    rootError: Error | null;
}): Error | null;
//# sourceMappingURL=WorkspaceFileTree.d.ts.map