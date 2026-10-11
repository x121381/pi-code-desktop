import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID, type OAuthProviderId, type OAuthTokenSet, type OAuthCachedSessionRestoreResult, type UserInfo } from "@zcode/shared";
/** 本仓支持的登录 provider。private 分享的 owner 身份是 provider 特定的，两边都要能登。 */
export type WebOAuthProviderId = typeof ZAI_PROVIDER_ID | typeof BIGMODEL_PROVIDER_ID;
export declare function isWebOAuthProviderId(value: unknown): value is WebOAuthProviderId;
interface BrowserOAuthCredentialRepoStorage {
    localStorage: Storage;
    sessionStorage: Storage;
}
interface BrowserOAuthCredentialRepoOptions {
    now?: () => number;
}
interface WebZaiTokenSet {
    zcodeJwtToken: string;
    zaiAccessToken: string;
    expiresAt?: number;
}
/** 浏览器 OAuth 凭据仓储：统一收敛 localStorage/sessionStorage 读写，避免业务层散落认证状态判断。 */
export declare class BrowserOAuthCredentialRepo {
    private readonly localStorage;
    private readonly sessionStorage;
    private readonly now;
    constructor(storage?: BrowserOAuthCredentialRepoStorage, options?: BrowserOAuthCredentialRepoOptions);
    saveTokenSet(tokenSet: WebZaiTokenSet | OAuthTokenSet, provider: WebOAuthProviderId): void;
    saveUserInfo(user: unknown, provider: WebOAuthProviderId): void;
    setActiveProvider(provider: WebOAuthProviderId | null): void;
    getActiveProvider(): OAuthProviderId | null;
    loadCachedSession(): UserInfo | null;
    loadCachedSessionState(): OAuthCachedSessionRestoreResult;
    loadZCodeJwtToken(): string | null;
    private hasAnyStoredCredential;
    clearAll(): void;
    savePendingNonce(nonce: string): void;
    loadPendingNonce(): string | null;
    clearPendingNonce(): void;
    /**
     * 记住这次跳出去登录用的是哪个 provider。
     *
     * 回调页必须知道用哪个 provider 换 token（authorize 参数名、token 响应里 access_token
     * 的位置都不同）。跟 nonce 放同一个 sessionStorage：两者本来就要一起校验、一起清。
     */
    savePendingProvider(provider: WebOAuthProviderId): void;
    loadPendingProvider(): WebOAuthProviderId | null;
    clearPendingProvider(): void;
}
export {};
