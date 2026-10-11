import type { GitRepositorySummary } from "@zcode/shared";
export declare function useGitAutoRefresh({ workspacePath, workspaceIdentity, remoteSessionId, gitSummary, gitSummaryWorkspaceKey, enabled, onRefreshGit, }: {
    workspacePath: string;
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
    gitSummary: GitRepositorySummary;
    gitSummaryWorkspaceKey: string;
    enabled: boolean;
    onRefreshGit: () => void;
}): void;
//# sourceMappingURL=useGitAutoRefresh.d.ts.map