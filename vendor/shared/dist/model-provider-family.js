import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID } from "./oauth.js";
import { BUILTIN_MODEL_PROVIDER_IDS } from "./model-provider-types.js";
import { ZCODE_ENV } from "./env.js";
import { buildBigModelCodingPlanTeamManageUrl } from "./zcodeEndpoint.js";
export const MODEL_PROVIDER_FAMILY_SPECS = [
    {
        id: "zai",
        label: "Z.ai",
        rootDomain: "z.ai",
        oauthProviderId: ZAI_PROVIDER_ID,
        startPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan,
        individualCodingPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan,
        teamCodingPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan,
        teamCodingPlanManageUrl: "https://z.ai/manage-apikey/subscription",
    },
    {
        id: "bigmodel",
        label: "BigModel",
        rootDomain: "bigmodel.cn",
        oauthProviderId: BIGMODEL_PROVIDER_ID,
        startPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan,
        individualCodingPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan,
        teamCodingPlanProviderId: BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan,
        teamCodingPlanManageUrl: buildBigModelCodingPlanTeamManageUrl({ ZCODE_ENV }),
    },
];
const MODEL_PROVIDER_FAMILY_SPEC_BY_ID = new Map(MODEL_PROVIDER_FAMILY_SPECS.map((spec) => [spec.id, spec]));
const MODEL_PROVIDER_FAMILY_ID_BY_PROVIDER_ID = new Map(MODEL_PROVIDER_FAMILY_SPECS.flatMap((spec) => [
    spec.startPlanProviderId,
    spec.individualCodingPlanProviderId,
    spec.teamCodingPlanProviderId,
].map((providerId) => [providerId, spec.id])));
export function getModelProviderFamilySpec(familyId) {
    return MODEL_PROVIDER_FAMILY_SPEC_BY_ID.get(familyId);
}
export function resolveModelProviderFamilyIdByProviderId(providerId) {
    return MODEL_PROVIDER_FAMILY_ID_BY_PROVIDER_ID.get(providerId) ?? null;
}
export function resolveModelProviderFamilyIdByBaseURL(baseURL) {
    const trimmed = baseURL?.trim();
    if (!trimmed) {
        return null;
    }
    let hostname;
    try {
        hostname = new URL(trimmed).hostname.toLowerCase();
    }
    catch {
        return null;
    }
    for (const spec of MODEL_PROVIDER_FAMILY_SPECS) {
        if (hostname === spec.rootDomain || hostname.endsWith(`.${spec.rootDomain}`)) {
            return spec.id;
        }
    }
    return null;
}
export function resolveModelProviderFamilySpecByProviderId(providerId) {
    const familyId = resolveModelProviderFamilyIdByProviderId(providerId);
    return familyId ? getModelProviderFamilySpec(familyId) : null;
}
export function resolveModelProviderFamilyLabelByProviderId(providerId) {
    return resolveModelProviderFamilySpecByProviderId(providerId)?.label ?? null;
}
export function normalizeProviderFamilyDomain(value) {
    return value === "zai" || value === "bigmodel" ? value : null;
}
export function resolveProviderFamilyDomainFromOAuthProvider(provider) {
    if (provider === ZAI_PROVIDER_ID) {
        return "zai";
    }
    if (provider === BIGMODEL_PROVIDER_ID) {
        return "bigmodel";
    }
    return null;
}
export function shouldShowModelProviderFamilyForDomain(params) {
    const providerFamilyDomain = normalizeProviderFamilyDomain(params.providerFamilyDomain);
    if (!providerFamilyDomain) {
        return true;
    }
    return params.familyId === providerFamilyDomain;
}
export function shouldShowModelProviderFamilyForActiveOAuth(params) {
    return shouldShowModelProviderFamilyForDomain({
        familyId: params.familyId,
        providerFamilyDomain: resolveProviderFamilyDomainFromOAuthProvider(params.activeOAuthProvider),
    });
}
export function shouldShowBuiltinModelProviderForDomain(params) {
    const familyId = resolveModelProviderFamilyIdByProviderId(params.providerId);
    if (!familyId) {
        return true;
    }
    return shouldShowModelProviderFamilyForDomain({
        familyId,
        providerFamilyDomain: params.providerFamilyDomain,
    });
}
export function shouldShowBuiltinModelProviderForActiveOAuth(params) {
    return shouldShowBuiltinModelProviderForDomain({
        providerId: params.providerId,
        providerFamilyDomain: resolveProviderFamilyDomainFromOAuthProvider(params.activeOAuthProvider),
    });
}
//# sourceMappingURL=model-provider-family.js.map