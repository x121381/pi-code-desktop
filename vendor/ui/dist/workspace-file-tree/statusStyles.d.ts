import type { WorkspaceFileGitStatus } from "@/workspace-file-tree/model.js";
export declare function getWorkspaceFileGitStatusIndicator(status: WorkspaceFileGitStatus): string | null;
export declare function getWorkspaceFileGitStatusTextClassName(status?: WorkspaceFileGitStatus): string | null;
export declare function getWorkspaceFileTreeRowDisplayGitStatus({ gitStatus, directoryGitStatuses, }: {
    gitStatus: WorkspaceFileGitStatus | null;
    directoryGitStatuses: WorkspaceFileGitStatus[];
}): WorkspaceFileGitStatus | undefined;
export declare function getWorkspaceFileGitStatusIndicatorClassName(status: WorkspaceFileGitStatus): string | null;
export declare function getWorkspaceFileGitStatusDotClassName(status?: WorkspaceFileGitStatus): string;
//# sourceMappingURL=statusStyles.d.ts.map