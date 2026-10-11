import type { IUsageStatsService } from "@zcode/services";
/** 消费目标 Host 的原账号视图和权益 owner；不另存余额或登录状态。 */
export declare function useStartPlanEntitlement(providerId: string, service: IUsageStatsService | undefined, refreshOnAccess?: boolean): {
    snapshot: import("@zcode/shared").UsageEntitlementSnapshot | null;
    loading: boolean;
    error: string | null;
    refresh: (refreshOptions?: import("@/hooks/useUsageEntitlement.js").UsageEntitlementRefreshOptions) => Promise<void>;
};
//# sourceMappingURL=useStartPlanEntitlement.d.ts.map