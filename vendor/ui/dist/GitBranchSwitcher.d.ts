import type { GitRepositorySummary } from "@zcode/shared";
interface GitBranchSwitcherProps {
    workspacePath: string;
    gitSummary: GitRepositorySummary;
    dirtyFileCount: number;
    onRefreshGit: () => void;
    className?: string;
    triggerClassName?: string;
    popoverClassName?: string;
    branchListClassName?: string;
    markAsWorkspaceHeaderBranch?: boolean;
    compactForRemoteControl?: boolean;
    popoverSide?: "top" | "bottom" | "left" | "right";
    avoidPopoverCollisions?: boolean;
    showFooterActions?: boolean;
}
export declare function GitBranchSwitcher({ workspacePath, gitSummary, dirtyFileCount, onRefreshGit, className, triggerClassName, popoverClassName, branchListClassName, markAsWorkspaceHeaderBranch, compactForRemoteControl, popoverSide, avoidPopoverCollisions, showFooterActions, }: GitBranchSwitcherProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=GitBranchSwitcher.d.ts.map