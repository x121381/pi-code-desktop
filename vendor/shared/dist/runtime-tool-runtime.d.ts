export type RuntimeToolId = "bfs" | "ripgrep" | "ugrep";
export interface RuntimeToolRuntimeDescriptor {
    binaryEnvVar: string;
    bundledResourceDir: string;
    resolveEntrySegments(platform: string): string[];
}
export interface RemoteRuntimeToolDescriptor extends RuntimeToolRuntimeDescriptor {
    versions: Readonly<Partial<Record<string, string>>>;
}
export interface ResolvedRemoteRuntimeTool {
    toolId: RuntimeToolId;
    runtime: RemoteRuntimeToolDescriptor;
    version: string;
}
export declare const RUNTIME_TOOL_RUNTIME: Record<RuntimeToolId, RuntimeToolRuntimeDescriptor>;
export declare const REMOTE_RUNTIME_TOOL_RUNTIME: {
    readonly bfs: {
        readonly versions: {
            readonly linux: "v4.1.1-2";
        };
        readonly binaryEnvVar: string;
        readonly bundledResourceDir: string;
        readonly resolveEntrySegments: (platform: string) => string[];
    };
    readonly ripgrep: {
        readonly versions: {
            readonly darwin: "v13.0.0-10";
            readonly linux: "v14.1.1-1";
        };
        readonly binaryEnvVar: string;
        readonly bundledResourceDir: string;
        readonly resolveEntrySegments: (platform: string) => string[];
    };
    readonly ugrep: {
        readonly versions: {
            readonly linux: "v7.8.4-1";
        };
        readonly binaryEnvVar: string;
        readonly bundledResourceDir: string;
        readonly resolveEntrySegments: (platform: string) => string[];
    };
};
export declare function getRemoteRuntimeToolsForPlatform(platform: string): ResolvedRemoteRuntimeTool[];
export declare function getRuntimeToolRuntime(toolId: RuntimeToolId): RuntimeToolRuntimeDescriptor;
//# sourceMappingURL=runtime-tool-runtime.d.ts.map