import type { GitChangeSectionId, GitChangeSourceId, GitDiffResult, GitFileChange, GitIdentity, GitRepositorySummary } from "@zcode/shared";
interface GitLiveDataRefreshInput {
    workspacePath: string;
    workspaceKey: string;
    includeExtendedData: boolean;
    refreshToken: string | number | boolean | null;
    workspaceRpcEnabled: boolean;
}
export interface GitPaneFileChange extends GitFileChange {
    diff: GitDiffResult | null;
}
export interface GitPaneSection {
    id: GitChangeSectionId;
    changes: GitPaneFileChange[];
}
export interface GitPaneDataset {
    id: GitChangeSourceId;
    readonly: boolean;
    sections: GitPaneSection[];
    comparisonLabel?: string | null;
    turnIndex?: number | null;
}
export interface GitPaneSourceOption {
    id: GitChangeSourceId;
    count: number;
    readonly: boolean;
    disabled: boolean;
    comparisonLabel?: string | null;
}
export interface GitPaneRepositoryState {
    workspaceKey: string;
    summary: GitRepositorySummary;
    identity: GitIdentity;
    placeholder: {
        enabled: boolean;
    };
    loading: boolean;
    error: string | null;
    revision: number;
    sourceOptions: GitPaneSourceOption[];
    datasets: Record<GitChangeSourceId, GitPaneDataset>;
}
export declare function shouldRefreshLiveGitData(previous: GitLiveDataRefreshInput | null, next: GitLiveDataRefreshInput): boolean;
export declare function useGitRepository(options: {
    workspacePath: string;
    activeTaskId: string | null;
    includeExtendedData?: boolean;
    refreshToken?: string | number | boolean | null;
    remoteSessionId?: string | null;
    remoteTarget?: unknown;
    workspaceIdentity?: string | null;
}): GitPaneRepositoryState;
export {};
//# sourceMappingURL=useGitRepository.d.ts.map