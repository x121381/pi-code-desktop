import type { UsageEntitlementSnapshot } from "@zcode/shared";
export declare const USAGE_ENTITLEMENT_CACHE_TTL_MS: number;
export declare function buildUsageEntitlementCacheKey(params: {
    providerId: string;
    providerFingerprint: string;
}): string;
export declare function readCachedUsageEntitlementSnapshot(params: {
    cacheKey: string;
    now?: () => number;
    ttlMs?: number;
}): UsageEntitlementSnapshot | null;
export declare function writeCachedUsageEntitlementSnapshot(params: {
    cacheKey: string;
    snapshot: UsageEntitlementSnapshot;
    now?: () => number;
}): void;
//# sourceMappingURL=usageEntitlementCache.d.ts.map