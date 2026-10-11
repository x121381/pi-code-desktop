interface LoginShellExecutionOptions {
    encoding: "utf8";
    windowsHide: boolean;
    timeout: number;
    maxBuffer: number;
    env: NodeJS.ProcessEnv;
    signal?: AbortSignal;
}
export type LoginShellExecutor = (shellPath: string, shellArgs: string[], options: LoginShellExecutionOptions) => Promise<string>;
export declare function buildShellBootstrapPath(currentPath: string | undefined): string;
export declare function captureLoginShellEnvSnapshot(options?: {
    baseEnv?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    shellPath?: string | null;
    executeShell?: LoginShellExecutor;
    timeoutMs?: number;
}): Promise<Record<string, string> | null>;
export declare function captureLoginShellEnvSnapshotSync(baseEnv: NodeJS.ProcessEnv): Record<string, string> | null;
export {};
//# sourceMappingURL=runtimeLoginShellEnvCapture.d.ts.map