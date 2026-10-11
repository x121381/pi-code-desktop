import { BIGMODEL_PROVIDER_ID, type OAuthProviderId, ZAI_PROVIDER_ID } from "./oauth.js";
import { BUILTIN_MODEL_PROVIDER_IDS } from "./model-provider-types.js";
export type ModelProviderFamilyId = "zai" | "bigmodel";
export type ProviderFamilyDomain = ModelProviderFamilyId;
export interface ModelProviderFamilySpec {
    id: ModelProviderFamilyId;
    label: string;
    rootDomain: string;
    oauthProviderId: typeof ZAI_PROVIDER_ID | typeof BIGMODEL_PROVIDER_ID;
    startPlanProviderId: typeof BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan;
    individualCodingPlanProviderId: typeof BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan;
    teamCodingPlanProviderId: typeof BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan;
    teamCodingPlanManageUrl: string;
}
export declare const MODEL_PROVIDER_FAMILY_SPECS: readonly [{
    readonly id: "zai";
    readonly label: "Z.ai";
    readonly rootDomain: "z.ai";
    readonly oauthProviderId: "zai";
    readonly startPlanProviderId: "account:zai-start-plan";
    readonly individualCodingPlanProviderId: "account:zai-individual-coding-plan";
    readonly teamCodingPlanProviderId: "account:zai-team-coding-plan";
    readonly teamCodingPlanManageUrl: "https://z.ai/manage-apikey/subscription";
}, {
    readonly id: "bigmodel";
    readonly label: "BigModel";
    readonly rootDomain: "bigmodel.cn";
    readonly oauthProviderId: "bigmodel";
    readonly startPlanProviderId: "account:bigmodel-start-plan";
    readonly individualCodingPlanProviderId: "account:bigmodel-individual-coding-plan";
    readonly teamCodingPlanProviderId: "account:bigmodel-team-coding-plan";
    readonly teamCodingPlanManageUrl: string;
}];
export declare function getModelProviderFamilySpec(familyId: ModelProviderFamilyId): ModelProviderFamilySpec;
export declare function resolveModelProviderFamilyIdByProviderId(providerId: string): ModelProviderFamilyId | null;
export declare function resolveModelProviderFamilyIdByBaseURL(baseURL: string | null | undefined): ModelProviderFamilyId | null;
export declare function resolveModelProviderFamilySpecByProviderId(providerId: string): ModelProviderFamilySpec | null;
export declare function resolveModelProviderFamilyLabelByProviderId(providerId: string): string | null;
export declare function normalizeProviderFamilyDomain(value: string | null | undefined): ProviderFamilyDomain | null;
export declare function resolveProviderFamilyDomainFromOAuthProvider(provider: OAuthProviderId | string | null | undefined): ProviderFamilyDomain | null;
export declare function shouldShowModelProviderFamilyForDomain(params: {
    familyId: ModelProviderFamilyId;
    providerFamilyDomain: ProviderFamilyDomain | null | undefined;
}): boolean;
export declare function shouldShowModelProviderFamilyForActiveOAuth(params: {
    familyId: ModelProviderFamilyId;
    activeOAuthProvider: OAuthProviderId | null | undefined;
}): boolean;
export declare function shouldShowBuiltinModelProviderForDomain(params: {
    providerId: string;
    providerFamilyDomain: ProviderFamilyDomain | null | undefined;
}): boolean;
export declare function shouldShowBuiltinModelProviderForActiveOAuth(params: {
    providerId: string;
    activeOAuthProvider: OAuthProviderId | null | undefined;
}): boolean;
//# sourceMappingURL=model-provider-family.d.ts.map