import type { IServiceAccessor } from "@zcode/services";
import type { OAuthProviderId } from "@zcode/shared";
import { type ModelProviderFamilyConnectionSelection } from "@/lib/modelProviderFamilyConnectionSelection.js";
export declare function refreshLatestModelProviderFamilySelectionAfterLogin(params: {
    provider: OAuthProviderId;
    services: IServiceAccessor;
}): Promise<ModelProviderFamilyConnectionSelection | null>;
export declare function refreshRestoredOAuthProviderFamilyAfterStartup(params: {
    activeProvider: OAuthProviderId | null;
    services: IServiceAccessor;
    refreshAppSettings?: () => Promise<void>;
}): Promise<ModelProviderFamilyConnectionSelection | null>;
//# sourceMappingURL=oauthProviderFamilySelectionRefresh.d.ts.map