import type { ZCodeEnv } from "./env.js";
export declare const DEFAULT_ZCODE_ENDPOINT_ORIGIN = "https://zcode.z.ai";
export declare const TEST_ZCODE_ENDPOINT_ORIGIN = "https://zcode.z.ai";
export declare const CODING_PLAN_LOCAL_WEBVIEW_ORIGIN = "http://localhost:3000";
export declare const DEFAULT_BIGMODEL_API_ORIGIN = "https://bigmodel.cn";
export declare const TEST_BIGMODEL_API_ORIGIN = "https://bigmodel.cn";
export declare const DEFAULT_ZAI_OAUTH_ORIGIN = "https://chat.z.ai";
export declare const TEST_ZAI_OAUTH_ORIGIN = "https://chat.z.ai";
export declare const DEFAULT_ZAI_BUSINESS_BASE_URL = "https://api.z.ai";
export declare const TEST_ZAI_BUSINESS_BASE_URL = "https://api.z.ai";
export declare const DEFAULT_ZAI_OAUTH_CLIENT_ID = "client_P8X5CMWmlaRO9gyO-KSqtg";
export declare const TEST_ZAI_OAUTH_CLIENT_ID = "client_P8X5CMWmlaRO9gyO-KSqtg";
export declare const DEFAULT_WEB_REMOTE_CONTROL_RELAY_WS_URL = "wss://zcode.z.ai/ws";
export declare const WEB_REMOTE_CONTROL_V4_MIN_APP_VERSION = "3.4.0";
export interface BuildZCodeEndpointUrlsOptions {
    appVersion?: string;
}
export interface ZCodeEndpointUrls {
    origin: string;
    apiBaseUrl: string;
    remoteUrl: string;
    webRemoteCallbackUrl: string;
    webShareCallbackUrl: string;
    relayWsUrl: string;
    zcodePlanOpenAiBaseUrl: string;
    zcodePlanAnthropicBaseUrl: string;
    zcodePlanBillingCurrentUrl: string;
    zcodePlanBillingBalanceUrl: string;
}
export interface RuntimeZCodeEndpointEnv {
    [key: string]: string | undefined;
    ZCODE_ENV?: string;
    ZCODE_BASE_URL?: string;
    ZCODE_ENDPOINT_ORIGIN?: string;
    ZCODE_TEST_BASE_URL?: string;
    ZCODE_PRODUCTION_BASE_URL?: string;
}
export interface RuntimeBigModelApiEnv {
    [key: string]: string | undefined;
    ZCODE_ENV?: string;
    BIGMODEL_API_BASE_URL?: string;
    BIGMODEL_TEST_API_BASE_URL?: string;
    BIGMODEL_PRODUCTION_API_BASE_URL?: string;
}
export interface RuntimeZaiEndpointEnv {
    [key: string]: string | undefined;
    ZCODE_ENV?: string;
    ZAI_OAUTH_ORIGIN?: string;
    ZAI_TEST_OAUTH_ORIGIN?: string;
    ZAI_PRODUCTION_OAUTH_ORIGIN?: string;
    ZAI_BUSINESS_BASE_URL?: string;
    ZAI_TEST_BUSINESS_BASE_URL?: string;
    ZAI_PRODUCTION_BUSINESS_BASE_URL?: string;
    ZAI_OAUTH_CLIENT_ID?: string;
    ZAI_TEST_OAUTH_CLIENT_ID?: string;
    ZAI_PRODUCTION_OAUTH_CLIENT_ID?: string;
    ZAI_OAUTH_APP_ID?: string;
}
export interface RuntimeProductEndpointEnv extends RuntimeZCodeEndpointEnv, RuntimeBigModelApiEnv, RuntimeZaiEndpointEnv {
}
export interface RuntimeProductEndpointConfig {
    zcodeEnv: ZCodeEnv;
    zcodeEndpointOrigin: string;
    zcodeEndpointUrls: ZCodeEndpointUrls;
    zaiOAuthOrigin: string;
    zaiBusinessBaseUrl: string;
    zaiOAuthClientId: string;
    bigModelApiOrigin: string;
}
export declare function normalizeZCodeEndpointOrigin(value: string): string;
export declare function isTrustedCodingPlanWebviewOrigin(value: string | null | undefined, options?: {
    e2eStoreBridgeEnabled?: boolean;
}): boolean;
export declare function resolveZCodeEndpointOrigin(options?: {
    env?: ZCodeEnv;
    envBaseOrigin?: string | null;
    overrideOrigin?: string | null;
}): string;
export declare function resolveRuntimeZCodeEnv(env?: RuntimeZCodeEndpointEnv): ZCodeEnv;
export declare function resolveRuntimeZCodeEndpointOrigin(env?: RuntimeZCodeEndpointEnv, options?: {
    overrideOrigin?: string | null;
}): string;
export declare function buildRuntimeZCodeEndpointUrls(env?: RuntimeZCodeEndpointEnv): ZCodeEndpointUrls;
export declare function buildRuntimeZCodeApiUrl(env: RuntimeZCodeEndpointEnv | undefined, path: string): string;
export declare function resolveWebRemoteControlRelayWsUrl(options?: {
    endpointOrigin?: string | null | undefined;
    overrideUrl?: string | null | undefined;
}): string;
export declare function resolveBigModelApiOrigin(env?: RuntimeBigModelApiEnv): string;
export declare function buildBigModelApiUrl(env: RuntimeBigModelApiEnv | undefined, path: string): string;
export declare function buildBigModelCodingPlanPersonalManageUrl(env?: RuntimeBigModelApiEnv): string;
export declare function buildBigModelCodingPlanTeamManageUrl(env?: RuntimeBigModelApiEnv): string;
export declare function resolveZaiOAuthOrigin(env?: RuntimeZaiEndpointEnv): string;
export declare function resolveZaiBusinessBaseUrl(env?: RuntimeZaiEndpointEnv): string;
export declare function resolveZaiOAuthClientId(env?: RuntimeZaiEndpointEnv): string;
export declare function buildZaiOAuthUrl(origin: string, path: string): string;
export declare function buildRuntimeZaiOAuthUrl(env: RuntimeZaiEndpointEnv | undefined, path: string): string;
export declare function buildRuntimeZaiBusinessUrl(env: RuntimeZaiEndpointEnv | undefined, path: string): string;
export declare function resolveRuntimeProductEndpointConfig(env?: RuntimeProductEndpointEnv): RuntimeProductEndpointConfig;
export declare function buildZCodeEndpointUrls(origin: string, options?: BuildZCodeEndpointUrlsOptions): ZCodeEndpointUrls;
export declare function rewriteZCodeEndpointUrl(input: string | URL, endpointOrigin: string): string | URL;
//# sourceMappingURL=zcodeEndpoint.d.ts.map