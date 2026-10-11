function resolvePlatformBinaryName(binaryName, platform) {
    return platform === "win32" ? `${binaryName}.exe` : binaryName;
}
export const RUNTIME_TOOL_RUNTIME = {
    bfs: {
        binaryEnvVar: "ZCODE_BFS_BINARY",
        bundledResourceDir: "bfs",
        resolveEntrySegments: (platform) => [resolvePlatformBinaryName("bfs", platform)],
    },
    ripgrep: {
        binaryEnvVar: "ZCODE_RG_BINARY",
        bundledResourceDir: "ripgrep",
        resolveEntrySegments: (platform) => [resolvePlatformBinaryName("rg", platform)],
    },
    ugrep: {
        binaryEnvVar: "ZCODE_UGREP_BINARY",
        bundledResourceDir: "ugrep",
        resolveEntrySegments: (platform) => [resolvePlatformBinaryName("ugrep", platform)],
    },
};
export const REMOTE_RUNTIME_TOOL_RUNTIME = {
    bfs: {
        ...RUNTIME_TOOL_RUNTIME.bfs,
        versions: {
            linux: "v4.1.1-2",
        },
    },
    ripgrep: {
        ...RUNTIME_TOOL_RUNTIME.ripgrep,
        versions: {
            darwin: "v13.0.0-10",
            linux: "v14.1.1-1",
        },
    },
    ugrep: {
        ...RUNTIME_TOOL_RUNTIME.ugrep,
        versions: {
            linux: "v7.8.4-1",
        },
    },
};
export function getRemoteRuntimeToolsForPlatform(platform) {
    // Linux remote 已切到 native-search 三工具，但 Darwin 仍依赖 legacy rg13。
    // 部署集合必须按目标平台解析，不能用一个全局版本把两条发布链互相覆盖。
    return Object.entries(REMOTE_RUNTIME_TOOL_RUNTIME).flatMap(([toolId, runtime]) => {
        const version = runtime.versions[platform];
        return version ? [{ toolId, runtime, version }] : [];
    });
}
export function getRuntimeToolRuntime(toolId) {
    return RUNTIME_TOOL_RUNTIME[toolId];
}
//# sourceMappingURL=runtime-tool-runtime.js.map