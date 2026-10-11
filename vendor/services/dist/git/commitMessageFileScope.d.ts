import type { GitFileChange } from "@zcode/shared";
export declare function filterCommitMessageFilesByCurrentSession(params: {
    files: readonly GitFileChange[];
    workspacePath: string;
    repoRoot: string;
    workspaceInRepoPath: string;
    currentSessionFilePaths?: readonly string[];
}): GitFileChange[];
//# sourceMappingURL=commitMessageFileScope.d.ts.map