import { BIGMODEL_PROVIDER_ID, BUILTIN_MODEL_PROVIDER_IDS, isCodingPlanModelProviderId, isZaiCodingPlanProviderId, ZAI_PROVIDER_ID, } from "@zcode/shared";
import {} from "@/settings/model-provider-section/constants.js";
export function isCodingPlanPurchaseAuthPending(status) {
    return status === "unknown" || status === "loading";
}
export async function readCodingPlanPurchaseTokenState(credentialService) {
    const [activeProvider, zaiToken, bigmodelToken] = await Promise.all([
        credentialService.load("oauth:active_provider"),
        credentialService.load(`oauth:${ZAI_PROVIDER_ID}:access_token`),
        credentialService.load(`oauth:${BIGMODEL_PROVIDER_ID}:access_token`),
    ]);
    const active = activeProvider === ZAI_PROVIDER_ID || activeProvider === BIGMODEL_PROVIDER_ID
        ? activeProvider
        : null;
    return {
        [BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan]: active === ZAI_PROVIDER_ID && Boolean(zaiToken?.trim()),
        [BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan]: active === ZAI_PROVIDER_ID && Boolean(zaiToken?.trim()),
        [BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan]: active === BIGMODEL_PROVIDER_ID && Boolean(bigmodelToken?.trim()),
        [BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan]: active === BIGMODEL_PROVIDER_ID && Boolean(bigmodelToken?.trim()),
    };
}
export function normalizeCodingPlanProviderId(providerId) {
    const normalized = providerId?.trim();
    return normalized && isCodingPlanModelProviderId(normalized)
        ? normalized
        : null;
}
export function isCodingPlanProviderId(providerId) {
    return Boolean(providerId);
}
export function resolveCodingPlanOAuthProviderId(providerId) {
    return isZaiCodingPlanProviderId(providerId) ? ZAI_PROVIDER_ID : BIGMODEL_PROVIDER_ID;
}
//# sourceMappingURL=codingPlanPurchaseAuth.js.map