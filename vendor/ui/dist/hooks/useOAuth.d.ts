import type { OAuthProviderId, OAuthProviderMeta } from "@zcode/shared";
import type { LoginEntryPurpose } from "@/store/index.js";
type OAuthStatus = "idle" | "waiting" | "error";
export declare function useOAuth(): {
    startLogin: (provider: OAuthProviderId, options?: {
        purpose?: LoginEntryPurpose;
    }) => Promise<void>;
    cancel: (provider?: OAuthProviderId) => Promise<void>;
    reset: () => void;
    status: OAuthStatus;
    error: string | null;
    providers: OAuthProviderMeta[];
    activeProvider: OAuthProviderId | null;
    loadingProviders: boolean;
    pendingProvider: OAuthProviderId | null;
    refreshProviders: () => Promise<void>;
    setOAuthError: (message: string) => void;
    setOAuthSuccess: () => Promise<void>;
};
export {};
//# sourceMappingURL=useOAuth.d.ts.map