import type { GitBranchMutationIssue, GitChangeKind, GitDiffResult, GitHeadRefType } from "@zcode/shared";
import type { GitCommandExecutionResult } from "../providers/gitCommandProvider.js";
import type { GitLineStat, GitResolvedRepository, GitStatusEntry } from "./gitCliTypes.js";
export declare function toInvalidBranchNameIssue(detail?: string | null): GitBranchMutationIssue;
export declare function parseGitBranchMutationIssues(result: GitCommandExecutionResult): GitBranchMutationIssue[];
export declare function ensureGitCommandSucceeded(label: string, result: GitCommandExecutionResult, allowedExitCodes?: number[]): GitCommandExecutionResult;
export declare function isNotRepositoryResult(result: GitCommandExecutionResult): boolean;
export declare function isMissingWorkingDirectoryResult(result: GitCommandExecutionResult): boolean;
export declare function parseStatusPorcelain(stdout: string): {
    branchName: string | null;
    trackingBranchName: string | null;
    headRefType: GitHeadRefType;
    ahead: number;
    behind: number;
    entries: GitStatusEntry[];
};
export declare function inferKindFromNumstat(stat: GitLineStat): GitChangeKind;
export declare function parseNumstat(stdout: string): Map<string, GitLineStat>;
export declare function buildUntrackedStats(repoRoot: string, entries: GitStatusEntry[]): Promise<Map<string, GitLineStat>>;
export declare function fileExists(path: string): Promise<boolean>;
export declare function buildUntrackedTextDiffResult(absolutePath: string, repoRelativePath: string, maxPreviewBytes: number): Promise<GitDiffResult | null>;
export declare function toDiffResult(path: string, result: GitCommandExecutionResult, options?: {
    allowedExitCodes?: number[];
    emptySummary?: string;
    binarySummary?: string;
}): GitDiffResult;
export declare function parseGitConfigValue(result: GitCommandExecutionResult): {
    scope: string | null;
    source: string | null;
    value: string | null;
};
export declare function normalizeInputPath(resolution: GitResolvedRepository, path: string): Promise<string>;
export declare function ensureRepositoryAvailable(resolution: GitResolvedRepository, label: string): GitResolvedRepository;
//# sourceMappingURL=gitCliHelpers.d.ts.map