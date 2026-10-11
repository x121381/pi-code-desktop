import type { CodingPlanUsageGranularity, CodingPlanUsageRequest, UsageStatsRequest } from "@zcode/shared";
export declare function resolveUsageTimeRange(request: UsageStatsRequest): {
    startTime: string;
    endTime: string;
};
export declare function resolveCodingPlanUsageTimeRange(request: CodingPlanUsageRequest): {
    startTime: string;
    endTime: string;
    granularity: CodingPlanUsageGranularity;
    xTime: string[];
    startDateKey: string;
    endDateKey: string;
};
//# sourceMappingURL=bigmodelUsageMonitorRange.d.ts.map