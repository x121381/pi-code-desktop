import { type ApiClient, type OAuthCallbackParams, type OAuthProviderMeta, type OAuthTokenSet, type OAuthUserProfile } from "@zcode/shared";
import type { OAuthProviderRuntimeConfig } from "../runtimeConfig.js";
import type { OAuthProviderAdapter, OAuthProviderContext } from "./providerAdapter.js";
/** ZAI OAuth 协议适配器 */
export declare class ZaiProviderAdapter implements OAuthProviderAdapter {
    private config;
    readonly providerId: "zai";
    readonly meta: OAuthProviderMeta;
    readonly redirectUri: string;
    readonly apiClient: ApiClient;
    private readonly businessTokenResolver;
    private lastBackendUserProfile;
    constructor(config: OAuthProviderRuntimeConfig, apiClient: ApiClient);
    parseCallbackParams(url: string): OAuthCallbackParams;
    buildAuthorizeUrl(context: OAuthProviderContext): string;
    normalizePolledTokenSet(tokenSet: OAuthTokenSet): Promise<OAuthTokenSet>;
    exchangeToken(params: OAuthCallbackParams, context: OAuthProviderContext): Promise<OAuthTokenSet>;
    fetchUserInfo(tokenSet: OAuthTokenSet, _context: OAuthProviderContext): Promise<OAuthUserProfile>;
    normalizeError(error: unknown): Error;
}
//# sourceMappingURL=zaiProviderAdapter.d.ts.map