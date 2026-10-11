import type { IGitService } from "@zcode/services";
import type { GitBranchMutationIssue, GitBranchMutationResult, GitIdentity } from "@zcode/shared";
import { type GitBranchCommitPreviewFile } from "@/git-branch-switcher/display.js";
export type GitBranchSwitchAssistDialogStep = "blocked" | "commit";
export interface GitBranchSwitchAssistState {
    targetBranchName: string;
    currentBranchName: string | null;
    issue: GitBranchMutationIssue;
    affectedFiles: GitBranchCommitPreviewFile[];
    commitFiles: GitBranchCommitPreviewFile[];
    stagePaths: string[];
    fileCount: number;
    totalAdded: number;
    totalRemoved: number;
    identity: GitIdentity | null;
}
export declare function formatGitBranchIssuePathList(locale: string, paths: readonly string[]): string;
export declare function hasGitCommitIdentity(identity: GitIdentity | null): boolean;
export declare function buildGitBranchSwitchAssistState(options: {
    gitService: IGitService;
    workspacePath: string;
    result: GitBranchMutationResult;
}): Promise<GitBranchSwitchAssistState | null>;
//# sourceMappingURL=switchAssist.d.ts.map