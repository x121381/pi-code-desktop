import type { GitRepositorySummary, SystemInfo } from "@zcode/shared";
export interface GitAutoRefreshWatchPath {
    path: string;
    recursive: boolean;
}
export declare function shouldEnableGitAutoRefreshForWorkspace(params: {
    enabled: boolean;
    currentWorkspaceKey: string;
    summaryWorkspaceKey: string;
}): boolean;
export declare function buildGitAutoRefreshWatchPaths(summary: Pick<GitRepositorySummary, "workspacePath" | "repoRoot" | "isGitAvailable" | "isRepository"> & Partial<Pick<GitRepositorySummary, "autoRefreshWatchPaths">>, systemInfo?: Pick<SystemInfo, "platform"> | null): GitAutoRefreshWatchPath[];
export declare function stringifyGitAutoRefreshWatchPaths(watchPaths: readonly GitAutoRefreshWatchPath[]): string;
export declare function parseGitAutoRefreshWatchPaths(signature: string): GitAutoRefreshWatchPath[];
//# sourceMappingURL=gitAutoRefresh.d.ts.map