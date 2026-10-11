import type { UsageEntitlementSubscriptionDetail, UsageQuotaLimit } from "@zcode/shared";
export declare function StartPlanBalanceCard({ isChecking, limits, expireTime, embedded, }: {
    isChecking: boolean;
    limits: UsageQuotaLimit[];
    expireTime?: string | null;
    embedded?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export interface StartPlanQuotaCardEntry {
    plan: UsageEntitlementSubscriptionDetail;
    limits: UsageQuotaLimit[];
}
export declare function resolveStartPlanQuotaCardEntries({ plans, limits, }: {
    plans: UsageEntitlementSubscriptionDetail[];
    limits: UsageQuotaLimit[];
}): StartPlanQuotaCardEntry[];
//# sourceMappingURL=StartPlanBalanceCard.d.ts.map