import type { UsageEntitlementSnapshot, ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
import type { IUsageStatsService } from "@zcode/services";
import { type UsageEntitlementRefreshReason } from "@/lib/usageEntitlementRefreshPolicy.js";
export declare const USAGE_ENTITLEMENT_REFRESH_TIMEOUT_MS = 20000;
export interface UsageEntitlementRefreshOptions {
    silent?: boolean;
    force?: boolean;
    reason?: UsageEntitlementRefreshReason;
}
export declare function withUsageEntitlementTimeout<T>(request: Promise<T>, timeoutMs?: number): Promise<T>;
export interface UseUsageEntitlementOptions {
    enabled?: boolean;
    includeSubscription?: boolean;
    preferredProviderId?: string;
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    allowDisabledPreferredProvider?: boolean;
    requirePreferredProvider?: boolean;
    allowEnvApiKey?: boolean;
    cacheKey?: string;
    refreshOnMount?: boolean;
    mountRefreshReason?: "initial" | "access";
}
export declare function useUsageEntitlement(options?: UseUsageEntitlementOptions): {
    snapshot: UsageEntitlementSnapshot | null;
    loading: boolean;
    error: string | null;
    refresh: (refreshOptions?: UsageEntitlementRefreshOptions) => Promise<void>;
};
export declare function useUsageEntitlementWithService(usageStatsService: IUsageStatsService | undefined, options?: UseUsageEntitlementOptions): {
    snapshot: UsageEntitlementSnapshot | null;
    loading: boolean;
    error: string | null;
    refresh: (refreshOptions?: UsageEntitlementRefreshOptions) => Promise<void>;
};
//# sourceMappingURL=useUsageEntitlement.d.ts.map