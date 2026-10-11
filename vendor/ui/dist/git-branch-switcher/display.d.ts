import type { GitBranchMutationIssueCode, GitBranchMutationIssue, GitBranchMutationResult, GitFileChange, GitHeadRefType } from "@zcode/shared";
interface GitDirtySectionLike {
    changes: Array<{
        path: string;
    }>;
}
interface GitDirtyDatasetsLike {
    staged: {
        sections: GitDirtySectionLike[];
    };
    unstaged: {
        sections: GitDirtySectionLike[];
    };
}
export interface GitBranchCommitPreviewFile {
    stagePath: string;
    repoRelativePath: string;
    workspaceRelativePath: string;
    kind: GitFileChange["kind"];
    added: number;
    removed: number;
}
export declare function getGitDirtyFileCount(datasets: GitDirtyDatasetsLike): number;
export declare function resolveGitBranchTriggerLabel(options: {
    headRefType: GitHeadRefType;
    currentBranchName: string | null;
    detachedLabel: string;
    fallbackLabel: string;
}): string;
export declare function matchesGitBranchSearch(branchName: string, searchText: string): boolean;
export declare function getPrimaryGitBranchIssue(issues: readonly GitBranchMutationIssue[]): GitBranchMutationIssue | null;
export declare function isGitBranchCommitAssistIssue(code: GitBranchMutationIssueCode | undefined): boolean;
export declare function resolveGitBranchIssueMessageId(issue: GitBranchMutationIssue | null): string | null;
export declare function resolveGitBranchSuccessMessageId(result: Pick<GitBranchMutationResult, "action" | "created" | "didChange">): string | null;
export declare function summarizeGitBranchIssuePaths(paths: readonly string[] | undefined, limit?: number): {
    visiblePaths: string[];
    remainingCount: number;
};
export declare function buildGitBranchCommitPreviewFiles(changes: readonly GitFileChange[]): GitBranchCommitPreviewFile[];
export declare function getGitBranchCommitTotals(files: readonly GitBranchCommitPreviewFile[]): {
    fileCount: number;
    totalAdded: number;
    totalRemoved: number;
};
export declare function selectGitBranchAffectedFiles(options: {
    files: readonly GitBranchCommitPreviewFile[];
    issuePaths: readonly string[] | undefined;
}): GitBranchCommitPreviewFile[];
export declare function buildGitBranchAutoCommitMessage(targetBranchName: string): string;
export {};
//# sourceMappingURL=display.d.ts.map