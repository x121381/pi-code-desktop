export function resolvePlatformBinaryName(binaryName, platform) {
    return platform === "win32" ? `${binaryName}.exe` : binaryName;
}
export const ZCODE_AGENT_RUNTIME = {
    binaryKind: "native-binary",
    binaryEnvVar: "GLM_BINARY_PATH",
    bundledResourceDir: "glm",
    version: "0.13.3",
    spawnArgs: ["app-server", "--stdio"],
    nativeConfigDir: ".zcode/cli",
    nativeConfigFileName: "config.json",
    missingBinaryMessage: "[ZCode Agent] glm binary 未找到，请设置 ZCODE_AGENT_WORKDIR、GLM_BINARY_PATH 或先准备 GLM 运行时资源",
    resolveEntrySegments: (platform) => [resolvePlatformBinaryName("zcode-agent", platform)],
    nodeBundleEntryFile: "zcode.cjs",
    resolveNodeBundleSegments() {
        return [this.nodeBundleEntryFile];
    },
};
export function getZCodeAgentRuntime() {
    return ZCODE_AGENT_RUNTIME;
}
//# sourceMappingURL=zcode-agent-runtime.js.map