import type { AppUsageRequest, AppUsageSnapshot, CodingPlanUsageRequest, CodingPlanUsageSnapshot, CodingPlanRegularTpsRequest, CodingPlanResetOpportunityRequest, CodingPlanResetOpportunityResult, CodingPlanResetScopeRequest, CodingPlanResetStatusSnapshot, CodingPlanResetUseRequest, CodingPlanResetUseResult, UsageEntitlementRequest, UsageEntitlementSnapshot, UsageStatsRequest, UsageStatsSnapshot } from "@zcode/shared";
export interface IUsageStatsService {
    getAppUsageSnapshot(request: AppUsageRequest): Promise<AppUsageSnapshot>;
    getCodingPlanUsageSnapshot(request: CodingPlanUsageRequest): Promise<CodingPlanUsageSnapshot>;
    getCodingPlanRegularTps?(request: CodingPlanRegularTpsRequest): Promise<number | undefined>;
    getCodingPlanResetStatus(request: CodingPlanResetScopeRequest): Promise<CodingPlanResetStatusSnapshot>;
    requestCodingPlanResetOpportunity(request: CodingPlanResetOpportunityRequest): Promise<CodingPlanResetOpportunityResult>;
    useCodingPlanReset(request: CodingPlanResetUseRequest): Promise<CodingPlanResetUseResult>;
    markCodingPlanResetHistoryRead(request: CodingPlanResetScopeRequest): Promise<void>;
    getSnapshot(request: UsageStatsRequest): Promise<UsageStatsSnapshot>;
    getEntitlementSnapshot(request?: UsageEntitlementRequest): Promise<UsageEntitlementSnapshot>;
}
export declare const IUsageStatsService: import("../descriptors.js").ServiceDescriptor<IUsageStatsService>;
//# sourceMappingURL=usageStats.d.ts.map