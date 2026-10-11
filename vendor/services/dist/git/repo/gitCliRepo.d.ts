import { type GitCommandProvider } from "../providers/gitCommandProvider.js";
import { type GitCliRepo } from "./gitCliTypes.js";
export type { GitBranchComparisonChange, GitBranchComparisonSnapshot, GitCliRepo, GitLineStat, GitResolvedRepository, GitStatusEntry, GitStatusSnapshot, } from "./gitCliTypes.js";
export declare function createGitCliRepo(options?: {
    commandProvider?: GitCommandProvider;
}): GitCliRepo;
//# sourceMappingURL=gitCliRepo.d.ts.map