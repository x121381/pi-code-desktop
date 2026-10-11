import type { GitRepositorySummary, ZCodeTaskChangeSummary } from "@zcode/shared";
import type { GitBranchCommitPreviewFile } from "@/git-branch-switcher/display.js";
export declare function getCurrentSessionFilePaths(summary: ZCodeTaskChangeSummary | null): string[] | undefined;
export declare function filterCommitPreviewFilesByCurrentSession(options: {
    files: readonly GitBranchCommitPreviewFile[];
    summary: ZCodeTaskChangeSummary | null;
    gitSummary: GitRepositorySummary;
    workspacePath: string;
}): GitBranchCommitPreviewFile[];
//# sourceMappingURL=currentSessionFileScope.d.ts.map