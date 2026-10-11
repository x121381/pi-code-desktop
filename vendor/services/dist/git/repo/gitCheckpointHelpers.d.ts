import type { GitCheckpointDiff, GitCheckpointFileDiff } from "@zcode/shared";
interface GitCheckpointNameStatusEntry {
    kind: GitCheckpointFileDiff["kind"];
    path: string;
    originalPath: string | null;
}
interface GitTreeEntry {
    mode: string;
    type: string;
    objectId: string;
    path: string;
}
export declare function toAbsolutePath(repoRoot: string, repoRelativePath: string): string;
export declare function getWorkspacePathspec(workspaceInRepoPath: string): string;
export declare function getCheckpointRefName(workspacePath: string, checkpointId: string): string;
export declare function parseNameStatus(stdout: string): GitCheckpointNameStatusEntry[];
export declare function parseNumstat(stdout: string): Map<string, {
    added: number;
    removed: number;
}>;
export declare function parseLsTree(stdout: string): Map<string, GitTreeEntry>;
export declare function mergeCheckpointDiff(params: {
    repoRoot: string;
    workspaceInRepoPath: string;
    fromCheckpointId: string;
    toCheckpointId: string;
    nameStatusEntries: GitCheckpointNameStatusEntry[];
    numstat: Map<string, {
        added: number;
        removed: number;
    }>;
}): GitCheckpointDiff;
export declare function buildAffectedRepoPaths(files: GitCheckpointFileDiff[]): string[];
export declare function buildCheckpointEnv(tempIndexPath: string): NodeJS.ProcessEnv;
export declare function removeFileIfExists(path: string): Promise<void>;
export declare function normalizeAffectedRepoPath(repoRoot: string, path: string): string;
export {};
//# sourceMappingURL=gitCheckpointHelpers.d.ts.map