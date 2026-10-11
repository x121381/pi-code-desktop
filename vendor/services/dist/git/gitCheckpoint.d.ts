import type { GitCheckpointDiff, GitCheckpointDiffQuery, GitCheckpointMeta, GitCheckpointRequest, GitCheckpointRestoreQuery, GitCheckpointRestoreResult, GitRepositoryRequest } from "@zcode/shared";
export interface IGitCheckpointService {
    createCheckpoint(params: GitRepositoryRequest): Promise<GitCheckpointMeta>;
    diffCheckpoints(params: GitCheckpointDiffQuery): Promise<GitCheckpointDiff>;
    restoreBetweenCheckpoints(params: GitCheckpointRestoreQuery): Promise<GitCheckpointRestoreResult>;
    deleteCheckpoint(params: GitCheckpointRequest): Promise<void>;
}
export declare const IGitCheckpointService: import("../descriptors.js").ServiceDescriptor<IGitCheckpointService>;
//# sourceMappingURL=gitCheckpoint.d.ts.map