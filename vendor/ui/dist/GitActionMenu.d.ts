import type { GitCommitMessageConversationContext, GitRepositorySummary, ZCodeTaskChangeSummary } from "@zcode/shared";
interface GitActionMenuProps {
    workspacePath: string;
    workspaceIdentity?: string;
    gitSummary: GitRepositorySummary;
    activeTaskChangeSummary?: ZCodeTaskChangeSummary | null;
    commitMessageConversationContext?: GitCommitMessageConversationContext | null;
    onRefreshGit: () => void;
    className?: string;
    triggerIconOnly?: boolean;
    triggerLayout?: "header" | "status-row";
}
export declare function GitActionMenu({ workspacePath, workspaceIdentity, gitSummary, activeTaskChangeSummary, commitMessageConversationContext, onRefreshGit, className, triggerIconOnly, triggerLayout, }: GitActionMenuProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GitActionMenu.d.ts.map