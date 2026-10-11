import { type UserInfo } from "@zcode/shared";
import { BrowserOAuthCredentialRepo, type WebOAuthProviderId } from "./browserOAuthCredentialRepo.js";
import { type WebZaiOAuthConfig } from "./webZaiOAuthConfig.js";
import { ZaiWebOAuthProvider } from "./zaiWebOAuthProvider.js";
interface WebAuthServiceRuntime {
    assign(url: string): void;
    createNonce(): string;
    getCurrentHref(): string;
    getCurrentOrigin(): string;
    replace(url: string): void;
}
interface WebAuthServiceDependencies {
    config?: WebZaiOAuthConfig;
    provider?: ZaiWebOAuthProvider;
    repo?: BrowserOAuthCredentialRepo;
    runtime?: WebAuthServiceRuntime;
}
interface WebAuthLoginOptions {
    devReturnTo?: string;
    appReturnTo?: string;
    redirectUri?: string;
    /** 缺省 zai，保持 /remote 等既有入口行为不变。 */
    provider?: WebOAuthProviderId;
}
export interface WebAuthCallbackResult {
    userInfo: UserInfo;
    appReturnTo: string | null;
}
export declare class WebAuthService {
    private readonly config;
    private readonly provider;
    private readonly repo;
    private readonly runtime;
    constructor(dependencies?: WebAuthServiceDependencies);
    startLogin(options?: WebAuthLoginOptions): void;
    handleCallback(url: string): Promise<WebAuthCallbackResult | null>;
    restoreCachedSession(): Promise<UserInfo | null>;
    restoreCachedSessionState(): import("@zcode/shared").OAuthCachedSessionRestoreResult;
    getZCodeJwtToken(): string | null;
    logout(): Promise<void>;
}
export declare function createWebAuthService(): WebAuthService;
export {};
