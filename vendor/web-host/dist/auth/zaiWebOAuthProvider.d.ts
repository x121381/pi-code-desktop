import type { OAuthTokenSet, UserInfo } from "@zcode/shared";
import type { WebOAuthProviderId } from "./browserOAuthCredentialRepo.js";
export interface WebZaiOAuthProviderConfig {
    authorizeUrl: string;
    tokenUrl: string;
    clientId: string;
    redirectUri: string;
    /** BigModel 授权入口；参数名与 ZAI 不同（redirect/appId vs redirect_uri/client_id）。 */
    bigmodelAuthorizeUrl: string;
    bigmodelAppId: string;
}
interface WebZaiOAuthCallbackParams {
    code?: string;
    error?: string;
    state: string;
}
interface WebZaiTokenExchangeResult {
    tokenSet: OAuthTokenSet;
    userInfo: UserInfo;
    rawUserInfo: unknown;
}
export declare function toUserInfo(user: unknown): UserInfo | null;
export declare class ZaiWebOAuthProvider {
    private readonly config;
    private readonly now;
    constructor(config: WebZaiOAuthProviderConfig, now?: () => number);
    buildAuthorizeUrl(params: {
        state: string;
        redirectUri?: string;
        provider?: WebOAuthProviderId;
    }): string;
    parseCallbackParams(url: string): WebZaiOAuthCallbackParams;
    exchangeToken(params: {
        code: string;
        state: string;
        redirectUri?: string;
        provider?: WebOAuthProviderId;
    }): Promise<WebZaiTokenExchangeResult>;
}
export {};
