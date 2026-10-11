import { type OAuthProviderId, type OAuthTokenSet, type OAuthUserProfile } from "@zcode/shared";
import type { OAuthProviderAdapter } from "./providers/index.js";
interface RefreshLegacyBigModelCachedProfileOptions {
    adapter: OAuthProviderAdapter;
    cachedProfile: OAuthUserProfile;
    loadTokenSet: () => Promise<OAuthTokenSet | null>;
    saveProfile: (profile: OAuthUserProfile) => Promise<void>;
    now: () => number;
    runWithAdapterError: <T>(run: () => Promise<T>) => Promise<T>;
}
export declare function withProviderProfileSchema(provider: OAuthProviderId, profile: OAuthUserProfile): OAuthUserProfile;
export declare function refreshLegacyBigModelCachedProfile(options: RefreshLegacyBigModelCachedProfileOptions): Promise<OAuthUserProfile>;
export {};
//# sourceMappingURL=oauthProfileSchema.d.ts.map