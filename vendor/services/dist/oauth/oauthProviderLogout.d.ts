import { type OAuthProviderId } from "@zcode/shared";
import type { AccountProviderCredentialStore } from "../model-provider/accountProviderCredentialStore.js";
interface OAuthProviderLogoutDependencies {
    readonly accountProviderCredentialStore: Pick<AccountProviderCredentialStore, "deleteApiKey">;
    readonly refreshAccountProviders?: (reason: string) => Promise<unknown>;
}
export declare function createOAuthProviderLogoutHandler(dependencies: OAuthProviderLogoutDependencies): (provider: OAuthProviderId, accountIdentity?: string | null) => Promise<void>;
export {};
//# sourceMappingURL=oauthProviderLogout.d.ts.map