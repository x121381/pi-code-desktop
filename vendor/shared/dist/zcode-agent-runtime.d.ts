export type ZCodeAgentBinaryKind = "native-binary";
export interface ZCodeAgentRuntimeDescriptor {
    binaryKind: ZCodeAgentBinaryKind;
    binaryEnvVar: string;
    bundledResourceDir: string;
    version: string;
    spawnArgs: string[];
    nativeConfigDir: string;
    nativeConfigFileName: string;
    missingBinaryMessage: string;
    resolveEntrySegments(platform: string): string[];
    /**
     * 桌面端把 agent 的 JS bundle（zcode.cjs）打进 resources/glm，由 app 内置的 Electron Node runtime
     * （ELECTRON_RUN_AS_NODE）直接执行，避免再随包内置一份独立 Node 二进制。
     * 这里只放纯 JS 入口文件名，平台无关（与 resolveEntrySegments 的原生二进制路径平行）。
     */
    nodeBundleEntryFile: string;
    resolveNodeBundleSegments(): string[];
}
export declare function resolvePlatformBinaryName(binaryName: string, platform: string): string;
export declare const ZCODE_AGENT_RUNTIME: ZCodeAgentRuntimeDescriptor;
export declare function getZCodeAgentRuntime(): ZCodeAgentRuntimeDescriptor;
//# sourceMappingURL=zcode-agent-runtime.d.ts.map