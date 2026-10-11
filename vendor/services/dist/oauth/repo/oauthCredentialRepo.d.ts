import type { OAuthLoginAttribution, OAuthProviderId, OAuthTokenSet, OAuthUserProfile } from "@zcode/shared";
import type { ICredentialService } from "../../credential/credential.js";
interface OAuthCredentialRepoOptions {
    providerIds?: readonly OAuthProviderId[];
    onCorruptOAuthSessionCleared?: (providerIds: readonly OAuthProviderId[]) => Promise<void>;
}
/** OAuth 凭据仓储：统一 provider 命名空间 */
export declare class OAuthCredentialRepo {
    private credentialService;
    private readonly knownProviderIds;
    constructor(credentialService: ICredentialService, options?: OAuthCredentialRepoOptions);
    private readonly onCorruptOAuthSessionCleared?;
    getActiveProvider(): Promise<OAuthProviderId | null>;
    setActiveProvider(provider: OAuthProviderId | null): Promise<void>;
    loadActiveProvider(): Promise<OAuthProviderId | null>;
    saveActiveProvider(provider: OAuthProviderId | null): Promise<void>;
    loadActiveTokenSet(): Promise<OAuthTokenSet | null>;
    saveActiveTokenSet(tokenSet: OAuthTokenSet): Promise<void>;
    loadActiveUserProfile(): Promise<OAuthUserProfile | null>;
    saveActiveUserProfile(profile: OAuthUserProfile): Promise<void>;
    saveLoginAttribution(attribution: OAuthLoginAttribution): Promise<void>;
    loadLoginAttribution(): Promise<OAuthLoginAttribution | null>;
    clearActiveSession(): Promise<void>;
    loadTokenSet(provider: OAuthProviderId): Promise<OAuthTokenSet | null>;
    saveTokenSet(provider: OAuthProviderId, tokenSet: OAuthTokenSet): Promise<void>;
    loadUserProfile(provider: OAuthProviderId): Promise<OAuthUserProfile | null>;
    private loadUserProfileFromKey;
    saveUserProfile(provider: OAuthProviderId, profile: OAuthUserProfile): Promise<void>;
    clearUserProfile(provider: OAuthProviderId): Promise<void>;
    clearProvider(provider: OAuthProviderId): Promise<void>;
    clearAll(providers: OAuthProviderId[]): Promise<void>;
    private clearCorruptOAuthSession;
}
export {};
//# sourceMappingURL=oauthCredentialRepo.d.ts.map