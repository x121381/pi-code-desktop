export { captureLoginShellEnvSnapshot, type LoginShellExecutor, } from "./runtimeLoginShellEnvCapture.js";
export declare function buildLoginShellEnvPatch(snapshot: Record<string, string | undefined>): Record<string, string>;
export declare function normalizeRuntimeProcessEnv(baseEnv: NodeJS.ProcessEnv, platform?: NodeJS.Platform): NodeJS.ProcessEnv;
export declare function buildRuntimeProcessEnvPatch(baseEnv?: NodeJS.ProcessEnv, loginShellSnapshot?: Record<string, string> | null, options?: {
    platform?: NodeJS.Platform;
    windowsNodePaths?: readonly string[];
}): Record<string, string>;
export declare function prepareRuntimeProcessEnvPatch(baseEnv?: NodeJS.ProcessEnv, options?: {
    captureSnapshot?: () => Promise<Record<string, string> | null>;
    platform?: NodeJS.Platform;
    captureTimeoutMs?: number;
}): Promise<Record<string, string>>;
export declare function initializeRuntimeProcessEnv(preparedRuntimeProcessEnvPatch?: Record<string, string>): void;
//# sourceMappingURL=runtimeCommandEnv.d.ts.map