import type { Stats } from "node:fs";
export interface WindowsCuaRuntime {
    root: string;
    entryPath: string;
    addonPath: string;
    command: string;
    commandEnv: Record<string, string>;
}
export interface WindowsCuaRuntimeFileSystem {
    stat(path: string): Promise<Pick<Stats, "isDirectory" | "isFile">>;
    lstat?(path: string): Promise<Pick<Stats, "isDirectory" | "isFile" | "isSymbolicLink">>;
    realpath?(path: string): Promise<string>;
    readFile(path: string, encoding?: "utf8"): Promise<string | Uint8Array>;
}
export interface WindowsCuaRuntimeResolveOptions {
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
    resourcesPath?: string;
    arch?: NodeJS.Architecture;
    electronVersion?: string;
    fileSystem?: WindowsCuaRuntimeFileSystem;
    hashBytes?: (bytes: string | Uint8Array) => Promise<string>;
}
export type WindowsCuaDevRuntimeResolutionReason = "unsupported-platform" | "development-root-not-absolute" | "development-root-not-found" | "invalid-package" | "missing-helper-entry" | "missing-native-addon" | "missing-resources-path" | "resources-path-not-absolute" | "invalid-runtime-manifest" | "incompatible-runtime-manifest" | "invalid-artifact-path" | "artifact-integrity-mismatch";
export declare class WindowsCuaDevRuntimeResolutionError extends Error {
    readonly reason: WindowsCuaDevRuntimeResolutionReason;
    readonly artifact?: string | undefined;
    constructor(reason: WindowsCuaDevRuntimeResolutionReason, message: string, artifact?: string | undefined);
}
/**
 * Windows 产品运行时解析边界：
 * - 显式开发目录具有最高优先级，配置错误时 fail closed，不能悄悄改用安装资源；
 * - 产品模式只读取 resources/tools/cua-helper，不搜索源码目录或 node_modules。
 */
export declare function resolveWindowsCuaRuntime(options?: WindowsCuaRuntimeResolveOptions): Promise<WindowsCuaRuntime>;
//# sourceMappingURL=windowsCuaDevRuntime.d.ts.map