import { buildWorkspaceFileGitStatusByPath, isWorkspaceFileTreeGitStatusAvailable, } from "@/workspace-file-tree/model.js";
export async function loadWorkspaceFileTreeGitStatus(params) {
    const gitRefresh = await params.gitService.refresh({
        workspacePath: params.workspacePath,
    });
    const available = isWorkspaceFileTreeGitStatusAvailable(gitRefresh.summary);
    return {
        available,
        statusByPath: available
            ? buildWorkspaceFileGitStatusByPath([
                ...gitRefresh.unstagedChanges,
                ...gitRefresh.stagedChanges,
            ])
            : new Map(),
    };
}
//# sourceMappingURL=gitStatus.js.map