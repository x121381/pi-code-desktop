import type { GitRepositorySummary } from "@zcode/shared";
type GitActionMenuPrimaryActionId = "commit" | "push";
export declare function canRenderGitActionMenu(options: {
    actionAvailable: boolean;
    commitEnabled: boolean;
    pushEnabled: boolean;
}): boolean;
export declare function canUseGitActionMenu(summary: Pick<GitRepositorySummary, "isGitAvailable" | "isRepository">): boolean;
export declare function resolveGitActionMenuPrimaryAction(options: {
    actionAvailable: boolean;
    commitEnabled: boolean;
    pushEnabled: boolean;
}): GitActionMenuPrimaryActionId | null;
export declare function canPushGitBranch(summary: Pick<GitRepositorySummary, "headRefType" | "branchName" | "trackingBranchName" | "ahead">): boolean;
export {};
//# sourceMappingURL=display.d.ts.map