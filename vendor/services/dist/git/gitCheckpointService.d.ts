import type { IGitCheckpointService } from "./gitCheckpoint.js";
import { type GitCheckpointRepo } from "./repo/gitCheckpointRepo.js";
import { GitCheckpointStore } from "./repo/gitCheckpointStore.js";
export declare function createGitCheckpointService(options?: {
    store?: GitCheckpointStore;
    repo?: GitCheckpointRepo;
}): IGitCheckpointService;
//# sourceMappingURL=gitCheckpointService.d.ts.map