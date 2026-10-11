import type { OAuthProviderRuntimeConfig } from "../runtimeConfig.js";
export declare const ZAI_OAUTH_PROVIDER_CONFIG: Omit<OAuthProviderRuntimeConfig, "appSecret">;
export declare function createZaiProviderRuntimeConfig(env: NodeJS.ProcessEnv): OAuthProviderRuntimeConfig;
export declare function resolveZaiUserinfoUrl(env: NodeJS.ProcessEnv): string;
//# sourceMappingURL=zaiProviderConfig.d.ts.map