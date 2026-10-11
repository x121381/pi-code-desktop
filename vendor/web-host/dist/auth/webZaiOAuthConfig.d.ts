import type { WebZaiOAuthProviderConfig } from "./zaiWebOAuthProvider.js";
interface WebImportMetaEnv {
    VITE_DEV_ORIGIN?: string;
    VITE_ZAI_OAUTH_CLIENT_ID?: string;
    VITE_ZAI_OAUTH_ORIGIN?: string;
    VITE_BIGMODEL_OAUTH_ORIGIN?: string;
    VITE_BIGMODEL_OAUTH_APP_ID?: string;
    VITE_ZCODE_BASE_URL?: string;
    VITE_ZCODE_ENDPOINT_ORIGIN?: string;
    VITE_WEB_REMOTE_ALLOW_DEV_RETURN_TO?: string;
}
export interface WebZaiOAuthConfig extends WebZaiOAuthProviderConfig {
    devOrigin?: string;
    shareRedirectUri: string;
    allowDevReturnToRedirect: boolean;
}
export declare function createWebZaiOAuthConfig(env?: WebImportMetaEnv): WebZaiOAuthConfig;
export declare const WEB_ZAI_OAUTH_CONFIG: WebZaiOAuthConfig;
export declare function resolveWebAuthDevReturnTo(config: WebZaiOAuthConfig, surface?: "remote" | "share"): string | undefined;
export {};
