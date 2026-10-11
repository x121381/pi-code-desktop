import { type GitBranchSwitchAssistDialogStep, type GitBranchSwitchAssistState } from "@/git-branch-switcher/switchAssist.js";
interface GitBranchCreateDialogProps {
    open: boolean;
    branchName: string;
    mutationPending: boolean;
    onOpenChange: (nextOpen: boolean) => void;
    onBranchNameChange: (nextValue: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
}
export declare function GitBranchCreateDialog({ open, branchName, mutationPending, onOpenChange, onBranchNameChange, onCancel, onSubmit, }: GitBranchCreateDialogProps): import("react/jsx-runtime").JSX.Element;
interface GitBranchSwitchAssistDialogProps {
    step: GitBranchSwitchAssistDialogStep | null;
    state: GitBranchSwitchAssistState | null;
    currentBranchLabel: string;
    commitMessage: string;
    commitError: string | null;
    mutationPending: boolean;
    onClose: () => void;
    onOpenCommit: () => void;
    onCommitMessageChange: (nextValue: string) => void;
    onSubmit: () => void;
}
export declare function GitBranchSwitchAssistDialog({ step, state, currentBranchLabel, commitMessage, commitError, mutationPending, onClose, onOpenCommit, onCommitMessageChange, onSubmit, }: GitBranchSwitchAssistDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GitBranchDialogs.d.ts.map