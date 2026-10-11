import type { OpenInEditorRemoteTarget } from "@zcode/shared";
interface FileContextActionOptions {
    canOpenLocalFileManager?: boolean;
    isRemoteWorkspace?: boolean;
    remoteTarget?: OpenInEditorRemoteTarget;
    workspaceIdentity?: string;
    openFailedMessage?: string;
}
interface FileContextActionTarget {
    path: string;
    relativePath?: string;
    deleted?: boolean;
    kind?: "file" | "directory";
}
export declare function useFileContextActions(options?: FileContextActionOptions): {
    canRevealInFileManager: (target: FileContextActionTarget) => boolean;
    copyAbsolutePath: (target: FileContextActionTarget) => Promise<void>;
    copyPath: (target: FileContextActionTarget) => Promise<void>;
    copyRelativePath: (target: FileContextActionTarget) => Promise<void>;
    revealInFileManager: (target: FileContextActionTarget) => Promise<void>;
};
export {};
//# sourceMappingURL=useFileContextActions.d.ts.map