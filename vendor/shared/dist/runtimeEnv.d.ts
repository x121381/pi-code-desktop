export declare const ZCODE_RUNTIME_ENV_KEY = "ZCODE_RUNTIME_ENV";
export declare const ZCODE_HTTP_PROXY_ENV_KEY = "ZCODE_HTTP_PROXY";
export declare const ZCODE_NO_PROXY_ENV_KEY = "ZCODE_NO_PROXY";
/** Desktop Host 只向 desktop-attached remote server 传递一次的网络配置。 */
export declare const ZCODE_REMOTE_RUNTIME_NETWORK_AUTHORITY_ENV_KEY = "ZCODE_REMOTE_RUNTIME_NETWORK_AUTHORITY";
export declare const ZCODE_REMOTE_HTTP_PROXY_ENV_KEY = "ZCODE_REMOTE_HTTP_PROXY";
export declare const ZCODE_REMOTE_NO_PROXY_ENV_KEY = "ZCODE_REMOTE_NO_PROXY";
export declare const ZCODE_AGENT_CA_CERT_ENV_KEY = "ZCODE_AGENT_CA_CERT";
export declare const ZCODE_TOOL_ENV_PASSTHROUGH_ENV_KEY = "ZCODE_TOOL_ENV_PASSTHROUGH_JSON";
/** Desktop Main 将服务端裁决的单功能灰度结果传给 Local/Remote Host。 */
export declare const ZCODE_DESKTOP_CONTEXT_PROMPT_ENABLED_ENV = "ZCODE_DESKTOP_CONTEXT_PROMPT_ENABLED";
export declare const ZCODE_CUA_PRODUCT_HELPER_ENV_KEY = "ZCODE_CUA_PRODUCT_HELPER";
export declare const ZCODE_CUA_BROKER_SOCKET_ENV_KEY = "ZCODE_CUA_PERMISSION_BROKER_SOCKET";
/** Shared node_repl host marker; unlike the broker bearer values it is not a secret. */
export declare const ZCODE_CUA_NODE_REPL_HOST_ENV_KEY = "ZCODE_CUA_NODE_REPL_HOST";
export declare const ZCODE_CUA_DEV_MODE_ENV_KEY = "ZCODE_CUA_DEV_MODE";
export type ZCodeRuntimeEnv = "development" | "production" | "test";
type EnvRecord = Record<string, string | undefined>;
export declare function isCuaDevModeRequested(env?: EnvRecord): boolean;
export declare function isZCodeCuaInternalFeatureEnabled(env?: EnvRecord): boolean;
export declare function normalizeZCodeRuntimeEnv(value: string | undefined): ZCodeRuntimeEnv | undefined;
export declare function resolveZCodeRuntimeEnv(env: Record<string, string | undefined>, fallback?: ZCodeRuntimeEnv): ZCodeRuntimeEnv;
export declare const ZCODE_CUA_PLUGIN_AUTHORITY_ENV_KEY = "ZCODE_CUA_PLUGIN_AUTHORITY";
/**
 * 只提取供 Agent telemetry bootstrap 使用的配置。宿主可在经过通用 env 清洗后，
 * 将这组值定向传给 host/Agent；不得把它并入 Bash/MCP 的 tool env。
 */
export declare function readZCodeAgentTelemetryEnv(env: Record<string, string | undefined>): Record<string, string>;
export declare function getCapturedZCodeAgentTelemetryEnv(): Record<string, string>;
export declare function getCapturedZCodeCuaBrokerCredentials(): {
    socket: string | undefined;
    pluginAuthority: string | undefined;
    refreshMarker?: string;
};
export declare function resetCapturedZCodeCuaBrokerCredentialsForTest(): void;
export declare function resetCapturedZCodeAgentTelemetryEnvForTest(): void;
export declare function sanitizeZCodeRuntimeEnv<T extends Record<string, string | undefined>>(env: T): Record<string, string>;
export declare function buildZCodeToolEnvPassthroughEnv(env: EnvRecord): Record<string, string>;
export declare function readZCodeToolEnvPassthroughEnv(env: EnvRecord): Record<string, string>;
export declare function sanitizeZCodeRuntimeEnvInPlace(env: Record<string, string | undefined>): void;
export declare function shouldSanitizeZCodeRuntimeEnvKey(key: string): boolean;
export declare function shouldCaptureZCodeToolEnvPassthroughKey(key: string): boolean;
export {};
//# sourceMappingURL=runtimeEnv.d.ts.map