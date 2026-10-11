import { type ApiClient } from "@zcode/shared";
import type { OAuthRuntimeConfig } from "../runtimeConfig.js";
import type { OAuthProviderAdapter } from "./providerAdapter.js";
/** 根据运行时配置创建可用 provider adapter */
export declare function createOAuthProviderAdapters(config: OAuthRuntimeConfig, options?: {
    apiClient?: ApiClient;
}): OAuthProviderAdapter[];
export type { OAuthProviderAdapter, OAuthProviderContext } from "./providerAdapter.js";
//# sourceMappingURL=index.d.ts.map