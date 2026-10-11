import { BIGMODEL_PROVIDER_ID, buildBigModelApiUrl, buildBigModelCodingPlanPersonalManageUrl, BUILTIN_MODEL_PROVIDER_IDS, createUuid, ZCODE_ENV, ZAI_PROVIDER_ID, } from "@zcode/shared";
import { getProviderFormLabel } from "../../lib/providerSettingsFormTypes.js";
export function generateId() {
    return createUuid();
}
export const PRESET_SUBSCRIPTION_TIMEOUT_MS = 2 * 60 * 1000;
export const BIGMODEL_REGISTRATION_URL = buildBigModelApiUrl({ ZCODE_ENV }, "/login");
export const BIGMODEL_CODING_PLAN_PERSONAL_MANAGE_URL = buildBigModelCodingPlanPersonalManageUrl({
    ZCODE_ENV,
});
export const PRESET_PROVIDER_SPECS = [
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan,
        displayName: "Z.ai",
        oauthProviderId: ZAI_PROVIDER_ID,
    },
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan,
        displayName: "BigModel",
        oauthProviderId: BIGMODEL_PROVIDER_ID,
    },
];
export const PRESET_PROVIDER_SPEC_BY_ID = new Map(PRESET_PROVIDER_SPECS.map((item) => [item.id, item]));
export const CODING_PLAN_PROVIDER_SPECS = [
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan,
        oauthProviderId: ZAI_PROVIDER_ID,
        label: "Z.ai - Coding Plan",
        providerName: "Z.ai",
        purchaseUrl: "https://z.ai/manage-apikey/subscription",
    },
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan,
        oauthProviderId: ZAI_PROVIDER_ID,
        label: "Z.ai - Coding Plan",
        providerName: "Z.ai",
        purchaseUrl: "https://z.ai/manage-apikey/subscription",
    },
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan,
        oauthProviderId: BIGMODEL_PROVIDER_ID,
        label: "BigModel - Coding Plan",
        providerName: "BigModel",
        purchaseUrl: BIGMODEL_CODING_PLAN_PERSONAL_MANAGE_URL,
    },
    {
        id: BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan,
        oauthProviderId: BIGMODEL_PROVIDER_ID,
        label: "BigModel- Coding Plan",
        providerName: "BigModel",
        purchaseUrl: BIGMODEL_CODING_PLAN_PERSONAL_MANAGE_URL,
    },
];
export function resolveModelProviderDisplayName(provider) {
    if (provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan ||
        provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan) {
        return "Z.ai - Coding Plan";
    }
    if (provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan) {
        return "Start Plan";
    }
    if (provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan) {
        return "Start Plan";
    }
    return getProviderFormLabel(provider);
}
//# sourceMappingURL=constants.js.map