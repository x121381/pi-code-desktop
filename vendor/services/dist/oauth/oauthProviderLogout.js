import { BIGMODEL_PROVIDER_ID, BUILTIN_MODEL_PROVIDER_IDS, ZAI_PROVIDER_ID, } from "@zcode/shared";
import { accountProviderCredentialKey } from "../model-provider/accountProviderCredentialKey.js";
export function createOAuthProviderLogoutHandler(dependencies) {
    return async (provider, accountIdentity) => {
        const providerIds = resolveProviderIds(provider);
        if (!providerIds)
            return;
        if (accountIdentity?.trim()) {
            await dependencies.accountProviderCredentialStore.deleteApiKey(accountProviderCredentialKey({
                providerId: providerIds.codingPlan,
                planKind: "individual-coding-plan",
                accountIdentity,
            }));
        }
        await dependencies.refreshAccountProviders?.(`oauth-logout:${provider}`);
    };
}
function resolveProviderIds(provider) {
    if (provider === ZAI_PROVIDER_ID) {
        return {
            codingPlan: BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan,
        };
    }
    if (provider === BIGMODEL_PROVIDER_ID) {
        return {
            codingPlan: BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan,
        };
    }
    return null;
}
//# sourceMappingURL=oauthProviderLogout.js.map