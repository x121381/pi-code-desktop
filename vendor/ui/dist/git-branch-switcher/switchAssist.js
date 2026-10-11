import { buildGitBranchCommitPreviewFiles, getPrimaryGitBranchIssue, getGitBranchCommitTotals, isGitBranchCommitAssistIssue, selectGitBranchAffectedFiles, } from "../git-branch-switcher/display.js";
import { getErrorMessage } from "../lib/errorMessage.js";
import { logger } from "../logger.js";
export function formatGitBranchIssuePathList(locale, paths) {
    if (paths.length === 0) {
        return "";
    }
    return new Intl.ListFormat(locale, {
        style: "short",
        type: "conjunction",
    }).format(paths);
}
export function hasGitCommitIdentity(identity) {
    return identity === null || (Boolean(identity.userName) && Boolean(identity.userEmail));
}
export async function buildGitBranchSwitchAssistState(options) {
    const issue = getPrimaryGitBranchIssue(options.result.issues);
    if (!issue || !isGitBranchCommitAssistIssue(issue.code) || !options.result.branchName) {
        return null;
    }
    const [unstagedChangesResult, stagedChangesResult, identityResult] = await Promise.allSettled([
        options.gitService.getChanges({
            workspacePath: options.workspacePath,
            sourceId: "unstaged",
        }),
        options.gitService.getChanges({
            workspacePath: options.workspacePath,
            sourceId: "staged",
        }),
        options.gitService.getIdentity({ workspacePath: options.workspacePath }),
    ]);
    if (unstagedChangesResult.status === "rejected") {
        logger.warn("[GitBranchSwitcher] 读取 unstaged 更改失败", {
            workspacePath: options.workspacePath,
            error: getErrorMessage(unstagedChangesResult.reason),
        });
    }
    if (stagedChangesResult.status === "rejected") {
        logger.warn("[GitBranchSwitcher] 读取 staged 更改失败", {
            workspacePath: options.workspacePath,
            error: getErrorMessage(stagedChangesResult.reason),
        });
    }
    if (identityResult.status === "rejected") {
        logger.warn("[GitBranchSwitcher] 读取提交身份失败", {
            workspacePath: options.workspacePath,
            error: getErrorMessage(identityResult.reason),
        });
    }
    const unstagedChanges = unstagedChangesResult.status === "fulfilled" ? unstagedChangesResult.value : [];
    const stagedChanges = stagedChangesResult.status === "fulfilled" ? stagedChangesResult.value : [];
    const commitFiles = buildGitBranchCommitPreviewFiles([...unstagedChanges, ...stagedChanges]);
    const affectedFiles = selectGitBranchAffectedFiles({
        files: commitFiles,
        issuePaths: issue.paths,
    });
    const stagePaths = Array.from(new Set([...commitFiles.map((file) => file.stagePath), ...(issue.paths ?? [])]));
    const { fileCount, totalAdded, totalRemoved } = getGitBranchCommitTotals(commitFiles);
    return {
        targetBranchName: options.result.branchName,
        currentBranchName: options.result.summary.branchName,
        issue,
        affectedFiles,
        commitFiles,
        stagePaths,
        fileCount,
        totalAdded,
        totalRemoved,
        identity: identityResult.status === "fulfilled" ? identityResult.value : null,
    };
}
//# sourceMappingURL=switchAssist.js.map