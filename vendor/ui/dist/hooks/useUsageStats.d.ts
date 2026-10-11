import type { AppUsageRange, AppUsageSnapshot, CodingPlanUsageRange, CodingPlanUsageSnapshot, UsageStatsRange, UsageStatsSnapshot, ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
export declare function shouldRefreshCodingPlanUsageOnAccess(params: {
    lastUpdatedAt: number | null;
    now: number;
}): boolean;
export declare function useUsageStats(range: UsageStatsRange, options?: {
    dataSource?: "local" | "monitor";
    enabled?: boolean;
    preferredProviderId?: string;
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    requirePreferredProvider?: boolean;
    allowEnvApiKey?: boolean;
}): {
    snapshot: UsageStatsSnapshot | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};
export declare function useAppUsageStats(range: AppUsageRange): {
    refresh: () => Promise<void>;
    snapshot: AppUsageSnapshot | null;
    loading: boolean;
    error: string | null;
};
export declare function useCodingPlanUsageStats(range: CodingPlanUsageRange, options: {
    enabled?: boolean;
    preferredProviderId?: string;
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    customStartDate?: string | null;
    customEndDate?: string | null;
}): {
    refresh: (refreshOptions?: {
        force?: boolean;
    }) => Promise<void>;
    snapshot: CodingPlanUsageSnapshot | null;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useUsageStats.d.ts.map