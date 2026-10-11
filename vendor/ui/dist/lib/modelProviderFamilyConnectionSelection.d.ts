import type { EnterpriseCodingPlanPricingProduct, ProviderFamilyConnectionSelection, ProviderFamilyDomain, UsageEntitlementSnapshot } from "@zcode/shared";
export type ModelProviderFamilyConnectionSelection = ProviderFamilyConnectionSelection;
/** 把当前 Family 连接意图映射为对应的 Built-in Account Provider 身份。 */
export declare function resolveModelProviderFamilyConnectionProviderId(params: {
    providerFamilyDomain: ProviderFamilyDomain;
    selection: ProviderFamilyConnectionSelection;
}): string;
export declare function resolveFirstSubscribedTeamPlanConnectionWithContext(params: {
    teamProducts: readonly EnterpriseCodingPlanPricingProduct[];
}): Extract<ProviderFamilyConnectionSelection, {
    kind: "team-coding-plan";
}> | null;
export declare function resolveAutomaticModelProviderFamilyConnectionSelection(params: {
    providerFamilyDomain: ProviderFamilyDomain;
    codingPlanEntitlement: UsageEntitlementSnapshot | null;
    startPlanEntitlement: UsageEntitlementSnapshot | null;
    teamProducts?: readonly EnterpriseCodingPlanPricingProduct[];
    /** 首次登录可落到购买入口；修复已有连接时只能选确认可用的套餐。 */
    allowPurchaseEntry?: boolean;
    /** 当前 Account View 的统一判定优先于旧余额快照，尤其区分待生效与可用。 */
    codingPlanAvailable?: boolean;
    startPlanAvailable?: boolean;
}): ModelProviderFamilyConnectionSelection | null;
//# sourceMappingURL=modelProviderFamilyConnectionSelection.d.ts.map