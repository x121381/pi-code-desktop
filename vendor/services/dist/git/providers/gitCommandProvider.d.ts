import { type GitEnvironmentProvider } from "./gitEnvironmentProvider.js";
export interface GitCommandExecutionOptions {
    cwd: string;
    args: string[];
    timeoutMs?: number;
    maxOutputBytes?: number;
    env?: NodeJS.ProcessEnv;
}
export interface GitCommandExecutionResult {
    binaryPath: string;
    cwd: string;
    args: string[];
    stdout: string;
    stderr: string;
    exitCode: number | null;
    signal: NodeJS.Signals | null;
    durationMs: number;
    timedOut: boolean;
    timeoutMs?: number;
    timeoutElapsedMs?: number;
    timeoutCloseDelayMs?: number;
    forceKillAttempted?: boolean;
    orphaned?: boolean;
    outputTruncated: boolean;
}
export interface GitCommandProvider {
    resolveGitBinary(): Promise<string | null>;
    run(options: GitCommandExecutionOptions): Promise<GitCommandExecutionResult>;
}
export declare function createGitCommandProvider(options?: {
    environmentProvider?: GitEnvironmentProvider;
    platform?: NodeJS.Platform;
    timeoutKillGraceMs?: number;
    timeoutForceKillGraceMs?: number;
}): GitCommandProvider;
//# sourceMappingURL=gitCommandProvider.d.ts.map