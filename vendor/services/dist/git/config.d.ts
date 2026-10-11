export declare const DEFAULT_GIT_DISCOVERY_TIMEOUT_MS = 3000;
export declare const DEFAULT_GIT_COMMAND_TIMEOUT_MS = 15000;
export declare const DEFAULT_GIT_PUSH_TIMEOUT_MS: number;
export declare const DEFAULT_GIT_DIFF_TIMEOUT_MS = 20000;
export declare const DEFAULT_GIT_OUTPUT_BYTES: number;
export declare const DEFAULT_GIT_PUSH_OUTPUT_BYTES: number;
export declare const DEFAULT_GIT_DIFF_BYTES: number;
export declare const GIT_UNTRACKED_STAT_MAX_BYTES: number;
export declare const GIT_UNTRACKED_STAT_CHUNK_BYTES: number;
export declare const GIT_UNTRACKED_STAT_CONCURRENCY = 4;
export declare function getGitBinaryCandidates(): string[];
export declare function getGitCommandEnv(): NodeJS.ProcessEnv;
export declare function getGitNullDevicePath(): string;
export declare function normalizeGitPath(path: string): string;
export declare function normalizeWorkspaceInRepoPath(path: string): string;
export declare function isPathInWorkspaceScope(repoRelativePath: string, workspaceInRepoPath: string): boolean;
export declare function toWorkspaceRelativeGitPath(repoRelativePath: string, workspaceInRepoPath: string): string;
//# sourceMappingURL=config.d.ts.map