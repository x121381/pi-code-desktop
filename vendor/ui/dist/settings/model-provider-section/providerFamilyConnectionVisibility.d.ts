import type { ProviderFamilyDomain, ProviderFamilyConnectionSelection, ProviderFamilyConnectionSelectionSettings, UsageEntitlementSubscriptionDetail, UsageQuotaLimit } from "@zcode/shared";
import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import { type EnterpriseCodingPlanProductDisplay } from "@/settings/model-provider-section/enterpriseCodingPlanProducts.js";
import { type CodingPlanEntitlementState, type CodingPlanStatus, type ModelProviderNavGroup } from "@/settings/model-provider-section/constants.js";
export interface ResolvedCodingPlanEntitlementState {
    statusLabelId?: string;
    status: CodingPlanStatus;
    planLevel: string | null;
    currentProductId: string | null;
    subscriptionBillingCycle: string | null;
    subscriptionRenewTime: string | null;
    subscriptionExpireTime: string | null;
    subscriptionDetails?: UsageEntitlementSubscriptionDetail[];
    quotaLimits: UsageQuotaLimit[];
    /**
     * 官方 Server MCP 额度（服务端下发的总额度）。它不在 quota.limits[] 里，只在有套餐快照的分支填充；
     * 其余分支保持缺省（等价于不展示），避免十余处早退分支都要跟着改。
     */
    mcpQuotaLimit?: UsageQuotaLimit | null;
}
export declare function resolveCodingPlanEntitlementState({ providerId, accountEntitled, accountAvailability, accountUnavailableReason, entitlement, modelProvidersLoading, }: {
    providerId: string;
    /** 当前账号是否明确拥有该 Provider 对应的产品权益。 */
    accountEntitled: boolean;
    accountAvailability?: import("@zcode/provider").AccountProviderState["availability"];
    accountUnavailableReason?: import("@zcode/provider").AccountProviderState["unavailableReason"];
    entitlement?: CodingPlanEntitlementState;
    modelProvidersLoading: boolean;
}): ResolvedCodingPlanEntitlementState;
export declare function buildVisibleFamilyConnectionItems({ items, codingPlanEntitlements, subscribedTeamProducts, connectionSelections, teamPlanSelections, showPurchasedTeamPlanFallback, }: {
    items: Array<Extract<ModelProviderNavGroup["items"][number], {
        type: "codingPlan";
    }>>;
    codingPlanEntitlements?: Partial<Record<string, CodingPlanEntitlementState>>;
    subscribedTeamProducts: EnterpriseCodingPlanProductDisplay[];
    showPurchasedTeamPlanFallback: boolean;
    connectionSelections?: ProviderFamilyConnectionSelectionSettings;
    teamPlanSelections?: Partial<Record<ProviderFamilyDomain, Extract<ProviderFamilyConnectionSelection, {
        kind: "team-coding-plan";
    }>>>;
}): ModelProviderNavGroup["items"];
export declare function buildVisibleFamilyConnectionKeys({ items, subscribedTeamProducts, showPurchasedTeamPlanFallback, modelProviders, }: {
    items: Array<Extract<ModelProviderNavGroup["items"][number], {
        type: "codingPlan";
    }>>;
    subscribedTeamProducts: EnterpriseCodingPlanProductDisplay[];
    showPurchasedTeamPlanFallback: boolean;
    modelProviders: readonly ProviderSettingsFormProvider[];
}): Set<string>;
//# sourceMappingURL=providerFamilyConnectionVisibility.d.ts.map