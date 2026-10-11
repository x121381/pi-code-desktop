import { type ApiClient, type OAuthCallbackResult, type OAuthCachedSessionRestoreResult, type OAuthProviderId, type OAuthProviderMeta, type OAuthStartResponse, type UserInfo } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import type { IOAuthService } from "./oauth.js";
import { type OAuthProviderAdapter } from "./providers/index.js";
interface OAuthServiceDependencies {
    adapters?: OAuthProviderAdapter[];
    apiClient?: ApiClient;
    now?: () => number;
    env?: NodeJS.ProcessEnv;
    onProviderLogout?: (provider: OAuthProviderId, accountIdentity?: string | null) => Promise<void>;
}
/**
 * OAuth 认证服务实现
 *
 * 在 host process 中运行，管理 OAuth 流程的完整生命周期。
 */
export declare class OAuthService implements IOAuthService {
    private readonly credentialService;
    private readonly repo;
    private readonly adapters;
    private readonly now;
    private readonly onProviderLogout?;
    private readonly apiClient?;
    private readonly env;
    private pendingState;
    private oauthFlowStartGeneration;
    private oauthFlowStartProvider;
    private oauthSessionGeneration;
    private sessionMutationQueue;
    private recentlyCompletedPollingState;
    constructor(credentialService: ICredentialService, dependencies?: OAuthServiceDependencies);
    getProviders(): Promise<OAuthProviderMeta[]>;
    getActiveProvider(): Promise<OAuthProviderId | null>;
    restoreCachedSession(): Promise<UserInfo | null>;
    restoreCachedSessionState(): Promise<OAuthCachedSessionRestoreResult>;
    private invalidateExpiredCachedSession;
    private loadBigModelCachedProfileMigrationTokenSet;
    private saveBigModelCachedProfileMigration;
    private runSessionMutation;
    private persistOAuthSession;
    private runPendingSessionCompletion;
    restoreSession(): Promise<UserInfo | null>;
    startOAuth(provider: OAuthProviderId): Promise<OAuthStartResponse>;
    startOAuthWithPolling(provider: OAuthProviderId): Promise<OAuthStartResponse>;
    pollPendingOAuth(): Promise<OAuthCallbackResult | null>;
    private startOAuthInternal;
    handleCallback(url: string): Promise<OAuthCallbackResult | null>;
    refreshToken(provider?: OAuthProviderId): Promise<void>;
    /** Host 本地 401 提交入口，不扩展 IOAuthService 的跨端契约。 */
    logoutIfCurrentCredentialRequest(input: string | URL, headers: Headers): Promise<boolean>;
    private logoutActiveSession;
    logout(provider?: OAuthProviderId): Promise<void>;
    logoutAll(): Promise<void>;
    cancelPending(provider?: OAuthProviderId): Promise<void>;
    private clearPendingState;
    private notifyProviderLogout;
    private notifyProvidersLogout;
    private getAdapter;
    private getEnabledAdapter;
    private resolveProvider;
    private runWithAdapterError;
    private isUnauthorizedError;
}
/**
 * 工厂函数：创建 OAuthService 实例
 */
export declare function createOAuthService(credentialService: ICredentialService, dependencies?: Omit<OAuthServiceDependencies, "adapters">): OAuthService;
export {};
//# sourceMappingURL=oauthService.d.ts.map