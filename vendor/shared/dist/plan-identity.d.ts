import type { ProviderFamilyDomain } from "./model-provider-family.js";
import type { PlanIdentitySnapshot, UsageEntitlementSnapshot } from "./usage-stats.js";
export declare function resolvePlanIdentitySnapshot(input: {
    providerFamilyDomain: ProviderFamilyDomain | null | undefined;
    codingPlanEntitlement: UsageEntitlementSnapshot | null | undefined;
    startPlanEntitlement: UsageEntitlementSnapshot | null | undefined;
    now: number;
    entitlementCacheTtlMs: number;
}): PlanIdentitySnapshot;
//# sourceMappingURL=plan-identity.d.ts.map