import type { IGitService } from "./git.js";
import type { GitCommitMessageGenerator } from "./gitCommitMessageGenerator.js";
import { type GitCliRepo } from "./repo/gitCliRepo.js";
export declare function createGitService(options?: {
    repo?: GitCliRepo;
    commitMessageGenerator?: GitCommitMessageGenerator;
}): IGitService;
//# sourceMappingURL=gitService.d.ts.map