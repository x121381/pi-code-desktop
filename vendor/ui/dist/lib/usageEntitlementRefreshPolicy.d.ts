import type { IUsageStatsService } from "@zcode/services";
import type { UsageEntitlementSnapshot, ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
export interface UsageEntitlementRequestOptions {
    invalidateBalanceCache?: boolean;
    includeSubscription: boolean;
    preferredProviderId?: string;
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    allowDisabledPreferredProvider: boolean;
    requirePreferredProvider: boolean;
    allowEnvApiKey?: boolean;
}
export type UsageEntitlementRefreshReason = "initial" | "access" | "manual" | "purchase" | "auth";
export type UsageEntitlementScheduleState = "unknown" | "active" | "none" | "unavailable";
export declare const USAGE_ENTITLEMENT_ACCESS_REFRESH_MS = 60000;
export declare function beginSharedEntitlementRequest(params: {
    usageStatsService: IUsageStatsService;
    freshnessKey: string;
    invalidate: boolean;
}): {
    requestKey: string;
    isCurrent: () => boolean;
};
export declare function shouldDeferSharedEntitlementAccess(params: {
    freshnessKey: string;
    now: number;
    usageStatsService: IUsageStatsService;
}): boolean;
export declare function recordSharedEntitlementAccess(params: {
    freshnessKey: string;
    now: number;
    usageStatsService: IUsageStatsService;
}): void;
export declare function buildEntitlementRequestKey(options: UsageEntitlementRequestOptions): string;
export declare function buildEntitlementFreshnessKey(params: {
    cacheKey: string;
    options: UsageEntitlementRequestOptions;
}): string;
export declare function readSharedEntitlementSnapshot(params: {
    usageStatsService: IUsageStatsService;
    freshnessKey: string;
}): UsageEntitlementSnapshot | null;
export declare function publishSharedEntitlementSnapshot(params: {
    usageStatsService: IUsageStatsService;
    freshnessKey: string;
    snapshot: UsageEntitlementSnapshot;
}): void;
export declare function recordSharedEntitlementFailure(params: {
    usageStatsService: IUsageStatsService;
    freshnessKey: string;
}): void;
export declare function subscribeSharedEntitlementSnapshot(params: {
    usageStatsService: IUsageStatsService;
    freshnessKey: string;
    listener: (snapshot: UsageEntitlementSnapshot | null, error?: string) => void;
}): () => void;
export declare function shouldUseSharedEntitlementSnapshot(params: {
    freshnessKey: string;
    intervalMs: number;
    now: number;
    usageStatsService: IUsageStatsService;
}): UsageEntitlementSnapshot | null;
export declare function hasSharedEntitlementFailure(params: {
    freshnessKey: string;
    usageStatsService: IUsageStatsService;
}): boolean;
export declare function shouldDeferSharedEntitlementRefresh(params: {
    freshnessKey: string;
    now: number;
    usageStatsService: IUsageStatsService;
}): boolean;
export declare function getUsageEntitlementScheduleState(snapshot: UsageEntitlementSnapshot | null): UsageEntitlementScheduleState;
//# sourceMappingURL=usageEntitlementRefreshPolicy.d.ts.map