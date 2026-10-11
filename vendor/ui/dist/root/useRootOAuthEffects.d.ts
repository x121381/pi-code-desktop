import type { IPlatformService, OAuthProviderId, OAuthSessionCallbackResult, UserInfo } from "@zcode/shared";
import type { IServiceAccessor } from "@zcode/services";
import type { ModelProviderFamilyConnectionSelection } from "@/lib/modelProviderFamilyConnectionSelection.js";
export { refreshRestoredOAuthProviderFamilyAfterStartup } from "@/root/oauthProviderFamilySelectionRefresh.js";
export declare function handleOAuthCallbackSuccess(params: {
    result: OAuthSessionCallbackResult;
    platform: Pick<IPlatformService, "reportTelemetryEvent">;
    refreshLatestModelProviderFamilySelection?: (provider: OAuthProviderId) => Promise<ModelProviderFamilyConnectionSelection | null>;
    refreshAppSettings?: () => Promise<void>;
    refreshProviderState: () => Promise<void>;
    setProviderFamilyDomain: (provider: OAuthProviderId) => Promise<void>;
    setUser: (user: UserInfo | null) => void;
    setOAuthError: (error: string | null) => void;
}): Promise<void>;
export declare function useRootOAuthEffects({ accountIntentKey, platform, services, refreshProviderState, refreshAppSettings, setUser, setIsRestoringOAuthSession, setOAuthError, oauthPollingActive, setOAuthPollingActive, markOAuthSuccess, onReauthenticationRequired, }: {
    accountIntentKey: string;
    platform: IPlatformService;
    services: IServiceAccessor;
    refreshProviderState: () => Promise<void>;
    refreshAppSettings?: () => Promise<void>;
    setUser: (user: UserInfo | null) => void;
    setIsRestoringOAuthSession: (restoring: boolean) => void;
    setOAuthError: (error: string | null) => void;
    oauthPollingActive: boolean;
    setOAuthPollingActive: (active: boolean) => void;
    markOAuthSuccess: (provider?: OAuthProviderId) => void;
    onReauthenticationRequired: () => void;
}): void;
//# sourceMappingURL=useRootOAuthEffects.d.ts.map