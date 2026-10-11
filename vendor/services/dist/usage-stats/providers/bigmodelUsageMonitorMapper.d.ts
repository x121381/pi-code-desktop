import type { UsageStatsRequest, UsageStatsSnapshot, CodingPlanUsageGranularity, CodingPlanUsageRequest, CodingPlanUsageSnapshot, UsageQuotaSnapshot, UsageEntitlementProviderInfo } from "@zcode/shared";
export interface BigModelUsageModelSummaryPayload {
    modelName?: string;
    totalTokens?: number;
    sortOrder?: number;
}
export interface BigModelUsageModelDataPayload {
    modelName?: string;
    totalTokens?: number;
    tokensUsage?: number[];
    sortOrder?: number;
}
export interface BigModelUsageModelUsagePayload {
    x_time?: string[];
    granularity?: string;
    modelCallCount?: number[];
    tokensUsage?: number[];
    totalUsage?: {
        totalModelCallCount?: number;
        totalTokensUsage?: number;
        modelSummaryList?: BigModelUsageModelSummaryPayload[];
    };
    modelDataList?: BigModelUsageModelDataPayload[];
    modelSummaryList?: BigModelUsageModelSummaryPayload[];
}
export interface BigModelUsageToolUsagePayload {
    x_time?: string[];
    granularity?: string;
    networkSearchCount?: number[];
    webReadMcpCount?: number[];
    zreadMcpCount?: number[];
    totalUsage?: {
        totalNetworkSearchCount?: number;
        totalWebReadMcpCount?: number;
        totalZreadMcpCount?: number;
        totalSearchMcpCount?: number;
        toolSummaryList?: BigModelUsageToolSummaryPayload[];
    };
    toolDataList?: BigModelUsageToolDataPayload[];
    toolSummaryList?: BigModelUsageToolSummaryPayload[];
}
export interface BigModelCreditUsageMetricPayload {
    value?: number | string | null;
    trend?: number | string | null;
}
export interface BigModelCreditUsageActivitySummaryPayload {
    totalTokens?: number;
    peakDailyTokens?: number;
    peakDailyTokensDate?: string;
    totalUsageDurationMs?: number;
    currentStreakDays?: number;
    longestStreakDays?: number;
}
export interface BigModelCreditUsageActivitySeriesPayload {
    date?: string;
    totalTokens?: number;
    modelCallCount?: number;
    mcpCalls?: number;
}
export interface BigModelCreditUsageActivityPayload {
    summary?: BigModelCreditUsageActivitySummaryPayload | null;
    series?: BigModelCreditUsageActivitySeriesPayload[];
}
export interface BigModelCreditUsageModelDataPayload {
    modelCode?: string;
    modelName?: string;
    sortOrder?: number;
    totalTokens?: number;
    totalCredits?: number;
    totalCreditsUsage?: BigModelUsageNumberSeries;
    cachedInputCreditsUsage?: BigModelUsageNumberSeries;
    uncachedInputCreditsUsage?: BigModelUsageNumberSeries;
    outputCreditsUsage?: BigModelUsageNumberSeries;
    tokensUsage?: BigModelUsageNumberSeries;
    totalTokensUsage?: BigModelUsageNumberSeries;
    cachedInputTokensUsage?: BigModelUsageNumberSeries;
    uncachedInputTokensUsage?: BigModelUsageNumberSeries;
    outputTokensUsage?: BigModelUsageNumberSeries;
}
export interface BigModelCreditUsageMcpDataPayload {
    mcpCode?: string;
    mcpName?: string;
    toolCode?: string;
    toolName?: string;
    sortOrder?: number;
    totalCredits?: number;
    totalUsageCount?: number;
    creditsUsage?: BigModelUsageNumberSeries;
    mcpCallCount?: BigModelUsageNumberSeries;
    usageCount?: BigModelUsageNumberSeries;
}
type BigModelUsageNumberSeries = Array<number | string | null | undefined>;
export interface BigModelCreditUsageDetailPayload {
    summary?: {
        cacheHitRate?: BigModelCreditUsageMetricPayload;
        totalCredits?: BigModelCreditUsageMetricPayload;
        averageDailyCredits?: BigModelCreditUsageMetricPayload;
    } | null;
    modelUsage?: {
        xTime?: string[];
        periodTypes?: string[];
        modelDataList?: BigModelCreditUsageModelDataPayload[];
    } | null;
    mcpUsage?: {
        xTime?: string[];
        periodTypes?: string[];
        mcpDataList?: BigModelCreditUsageMcpDataPayload[];
    } | null;
}
export interface BigModelUsageModelPerformancePayload {
    x_time?: string[];
    xTime?: string[];
    proMaxDecodeSpeed?: number[];
    liteDecodeSpeed?: number[];
}
export interface BigModelUsageToolDataPayload {
    toolCode?: string;
    toolName?: string;
    sortOrder?: number;
    usageCount?: number[];
    totalUsageCount?: number;
}
export interface BigModelUsageToolSummaryPayload {
    toolCode?: string;
    toolName?: string;
    totalUsageCount?: number;
    sortOrder?: number;
}
export interface BigModelUsageModelUsageEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelUsageModelUsagePayload | null;
}
export interface BigModelUsageToolUsageEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelUsageToolUsagePayload | null;
}
export interface BigModelCreditUsageActivityEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelCreditUsageActivityPayload | null;
}
export interface BigModelCreditUsageDetailEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelCreditUsageDetailPayload | null;
}
export interface BigModelUsageModelPerformanceEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelUsageModelPerformancePayload | null;
}
export declare function buildUsageStatsSnapshotFromMonitor(request: UsageStatsRequest, modelData: BigModelUsageModelUsagePayload, toolData: BigModelUsageToolUsagePayload): UsageStatsSnapshot;
export declare function buildCodingPlanUsageSnapshotFromMonitor(params: {
    request: CodingPlanUsageRequest;
    provider: UsageEntitlementProviderInfo;
    quota: UsageQuotaSnapshot | null;
    granularity: CodingPlanUsageGranularity;
    xTime: string[];
    activityData?: BigModelCreditUsageActivityPayload;
    modelDetailData?: BigModelCreditUsageDetailPayload;
    toolDetailData?: BigModelCreditUsageDetailPayload;
    healthData?: BigModelUsageModelPerformancePayload;
    startDateKey: string;
    endDateKey: string;
    modelData?: BigModelUsageModelUsagePayload;
    toolData?: BigModelUsageToolUsagePayload;
}): CodingPlanUsageSnapshot;
export {};
//# sourceMappingURL=bigmodelUsageMonitorMapper.d.ts.map