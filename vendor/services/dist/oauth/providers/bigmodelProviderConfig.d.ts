import type { OAuthProviderRuntimeConfig } from "../runtimeConfig.js";
export declare const BIGMODEL_OAUTH_PROVIDER_CONFIG: Omit<OAuthProviderRuntimeConfig, "appSecret">;
export declare function createBigModelProviderRuntimeConfig(env: NodeJS.ProcessEnv): OAuthProviderRuntimeConfig;
export declare function resolveBigModelUserinfoUrl(env: NodeJS.ProcessEnv): string;
//# sourceMappingURL=bigmodelProviderConfig.d.ts.map