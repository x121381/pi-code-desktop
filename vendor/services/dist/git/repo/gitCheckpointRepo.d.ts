import type { GitCheckpointDiff, GitCheckpointMeta, GitCheckpointRestoreResult } from "@zcode/shared";
import { type GitCommandProvider } from "../providers/gitCommandProvider.js";
import { type GitCliRepo } from "./gitCliRepo.js";
interface GitCheckpointRepo {
    createCheckpoint(params: {
        workspacePath: string;
        checkpointId: string;
    }): Promise<GitCheckpointMeta>;
    diffCheckpoints(params: {
        workspacePath: string;
        from: GitCheckpointMeta;
        to: GitCheckpointMeta;
    }): Promise<GitCheckpointDiff>;
    restoreBetweenCheckpoints(params: {
        workspacePath: string;
        from: GitCheckpointMeta;
        to: GitCheckpointMeta;
        force?: boolean;
    }): Promise<GitCheckpointRestoreResult>;
    deleteCheckpoint(params: {
        workspacePath: string;
        checkpoint: GitCheckpointMeta;
    }): Promise<void>;
}
export declare function createGitCheckpointRepo(options?: {
    commandProvider?: GitCommandProvider;
    gitRepo?: Pick<GitCliRepo, "resolveRepository">;
}): GitCheckpointRepo;
export type { GitCheckpointRepo };
//# sourceMappingURL=gitCheckpointRepo.d.ts.map