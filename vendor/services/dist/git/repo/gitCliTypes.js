export function createEmptySummary(resolution) {
    return {
        workspacePath: resolution.workspacePath,
        repoRoot: resolution.repoRoot,
        workspaceInRepoPath: resolution.workspaceInRepoPath,
        autoRefreshWatchPaths: resolution.autoRefreshWatchPaths,
        branchName: null,
        trackingBranchName: null,
        headRefType: "branch",
        ahead: 0,
        behind: 0,
        isDirty: false,
        isGitAvailable: resolution.isGitAvailable,
        isRepository: resolution.isRepository,
    };
}
//# sourceMappingURL=gitCliTypes.js.map