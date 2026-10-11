import { type ApiClient, type OAuthCallbackParams, type OAuthProviderMeta, type OAuthTokenSet, type OAuthUserProfile } from "@zcode/shared";
import type { OAuthProviderRuntimeConfig } from "../runtimeConfig.js";
import type { OAuthProviderAdapter, OAuthProviderContext } from "./providerAdapter.js";
/** BigModel OAuth 协议适配器 */
export declare class BigModelProviderAdapter implements OAuthProviderAdapter {
    private config;
    readonly providerId: "bigmodel";
    readonly meta: OAuthProviderMeta;
    readonly redirectUri: string;
    readonly apiClient: ApiClient;
    constructor(config: OAuthProviderRuntimeConfig, apiClient: ApiClient);
    normalizePolledTokenSet(tokenSet: OAuthTokenSet): Promise<OAuthTokenSet>;
    parseCallbackParams(url: string): OAuthCallbackParams;
    buildAuthorizeUrl(context: OAuthProviderContext): string;
    exchangeToken(params: OAuthCallbackParams, _context: OAuthProviderContext): Promise<OAuthTokenSet>;
    private exchangeZcodeJwtToken;
    fetchUserInfo(tokenSet: OAuthTokenSet, _context: OAuthProviderContext): Promise<OAuthUserProfile>;
    loadLegacyTokenSet(loadCredential: (key: string) => Promise<string | null>): Promise<OAuthTokenSet | null>;
    normalizeError(error: unknown): Error;
}
//# sourceMappingURL=bigmodelProviderAdapter.d.ts.map