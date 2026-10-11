/** 返回 provider + workspace 在应用内的专属配置目录路径 */
export declare function resolveProviderConfigDir(_legacyProvider: string, _workspacePath: string, _workspaceIdentity?: string): string;
/** 构建干净的 Node.js 环境，去掉 Electron/GPU 相关变量 */
export declare function buildCleanEnv(provider: string, _configDir: string, extra?: Record<string, string>): Record<string, string>;
export declare function findZCodeAgentRuntimeBinary(): string | null;
/**
 * 查找 agent 的 JS bundle（resources/glm/zcode.cjs）。
 * 桌面打包态用 app 内置的 Electron Node runtime 直接执行这个 bundle，不再随包内置独立 Node 二进制。
 * 候选目录与 findZCodeAgentRuntimeBinary 完全平行，只是入口换成平台无关的 nodeBundleEntryFile。
 * 不查 GLM_BINARY_PATH——那个 env 指向原生二进制，语义不同。
 */
export declare function findZCodeAgentRuntimeNodeBundle(): string | null;
/** 根据 provider 查找对应 binary 路径 */
export declare function findBinary(provider: string): string | null;
//# sourceMappingURL=providerRuntimeResolver.d.ts.map