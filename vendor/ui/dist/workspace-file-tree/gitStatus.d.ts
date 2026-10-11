import type { IGitService } from "@zcode/services";
import { type WorkspaceFileGitStatus } from "@/workspace-file-tree/model.js";
export interface WorkspaceFileTreeGitStatusState {
    available: boolean;
    statusByPath: Map<string, WorkspaceFileGitStatus>;
}
export declare function loadWorkspaceFileTreeGitStatus(params: {
    gitService: IGitService;
    workspacePath: string;
}): Promise<WorkspaceFileTreeGitStatusState>;
//# sourceMappingURL=gitStatus.d.ts.map