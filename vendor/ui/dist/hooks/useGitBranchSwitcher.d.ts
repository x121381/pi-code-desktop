import type { GitLocalBranchListResult, GitRepositorySummary } from "@zcode/shared";
import { type GitBranchSwitchAssistDialogStep, type GitBranchSwitchAssistState } from "@/git-branch-switcher/switchAssist.js";
interface UseGitBranchSwitcherOptions {
    workspacePath: string;
    currentBranchName: string | null;
    headRefType: GitRepositorySummary["headRefType"];
    onRefreshGit: () => void;
}
export declare function useGitBranchSwitcher({ workspacePath, currentBranchName, headRefType, onRefreshGit, }: UseGitBranchSwitcherOptions): {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    createDialogOpen: boolean;
    setCreateDialogOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    createBranchName: string;
    setCreateBranchName: import("react").Dispatch<import("react").SetStateAction<string>>;
    commitMessage: string;
    setCommitMessage: import("react").Dispatch<import("react").SetStateAction<string>>;
    commitError: string | null;
    switchAssistStep: GitBranchSwitchAssistDialogStep | null;
    switchAssistState: GitBranchSwitchAssistState | null;
    branchesResult: GitLocalBranchListResult | null;
    loadingBranches: boolean;
    mutationPending: boolean;
    switchBranch: (targetBranchName: string) => Promise<void>;
    createBranchAndSwitch: () => Promise<void>;
    openSwitchCommitDialog: () => void;
    closeSwitchAssistDialog: () => void;
    commitAndSwitchBranch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useGitBranchSwitcher.d.ts.map