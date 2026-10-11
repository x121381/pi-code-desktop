import { z } from "zod";
export * from "./usage-quota.js";
import type { UsageMcpQuotaSnapshot, UsageQuotaSnapshot } from "./usage-quota.js";
import type { ZCodeAccountAccess, ZCodeProviderAccountAccess } from "./zcode-protocol/index.js";
export declare const ESTIMATED_TOKEN_CHAR_DIVISOR = 3;
export type UsageStatsRange = "all" | "7d" | "30d";
export type CodingPlanUsageRange = "today" | "7d" | "30d" | "custom";
export type CodingPlanUsageGranularity = "hour" | "day";
export type CodingPlanUsageDetailMetric = "credits" | "usage";
export type CodingPlanUsageDetailSubject = "model" | "tool";
export interface UsageStatsRequest {
    range: UsageStatsRange;
    /** 使用统计数据源。App Usage 显式使用本地 session 聚合,Coding Plan 显式使用 monitor 接口。 */
    dataSource?: "local" | "monitor";
    /** 设置页可传入用户当前选中的 Z.AI / BigModel 来源，避免两边都配置时只隐式读取第一家。 */
    preferredProviderId?: string;
    /** Registry 静态访问类别，或调用边界已解析的动态账号访问上下文。 */
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    /** 指定来源的场景必须命中 preferredProviderId,否则不允许回退到其它 provider 或本地聚合。 */
    requirePreferredProvider?: boolean;
    /** 是否允许 host 环境变量覆盖 provider key。默认允许,显式 provider 场景可关闭。 */
    allowEnvApiKey?: boolean;
    /**
     * 统计按调用端时区归桶。
     * UI 默认传入浏览器当前时区；缺省时 host 侧回退到系统时区。
     */
    timeZone?: string;
}
export interface CodingPlanUsageRequest {
    range: CodingPlanUsageRange;
    /** 自定义日期范围。仅 range=custom 时生效，按调用端自然日解释，最大 30 天。 */
    customStartDate?: string | null;
    customEndDate?: string | null;
    preferredProviderId: string;
    /** Registry 静态访问类别，或本次 Team 查询绑定的动态账号访问上下文。 */
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    timeZone?: string;
}
/** Highspeed 只读取普通 Pro/Max decode TPS，不触发完整 Coding Plan 用量聚合。 */
export interface CodingPlanRegularTpsRequest {
    preferredProviderId: string;
    /**
     * Registry 静态访问类别，或调用边界已解析的动态账号访问上下文。
     *
     * Bug 原因：此前该请求只带 organizationId/projectId，请求期鉴权靠 host 自行按 provider
     * 猜测账号。Provider 重构后 Coding Plan 授权统一由 accountAccess 解析（Team scope 也内含
     * 其中），缺失时 resolveAuthorization 必定返回 null，节省时间会静默不展示。
     */
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    timeZone?: string;
}
export interface UsageEntitlementRequest {
    /** 购买或领取完成后，使对应 Start Plan balance 短期缓存失效。 */
    invalidateBalanceCache?: boolean;
    /** 兼容旧调用方的提示；Coding Plan 权益必须查询订阅并返回摘要，不再允许仅用额度推断权益。 */
    includeSubscription?: boolean;
    /** 聊天输入区可传入当前选中的内置供应商,确保 BigModel/Z.AI 用量跟随模型选择。 */
    preferredProviderId?: string;
    /** 指定 Account Provider 的静态访问类别，或调用边界已解析的动态账号访问上下文。 */
    accountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    /** 当前模型已明确选中该内置供应商时，即使供应商列表里被隐藏也允许读取其 key。 */
    allowDisabledPreferredProvider?: boolean;
    /** 指定来源的场景必须命中 preferredProviderId,否则不允许回退到其它 provider。 */
    requirePreferredProvider?: boolean;
    /** 是否允许 host 环境变量覆盖 provider key。默认允许,显式 provider 场景可关闭。 */
    allowEnvApiKey?: boolean;
}
export interface UsageEntitlementSnapshot {
    generatedAt: number;
    /** 当前额度响应的服务端时间（毫秒）；与本地快照生成时间 generatedAt 分离。 */
    serverTime?: number;
    authenticated: boolean;
    unavailableReason?: "not_authenticated" | "not_configured" | "no_plan" | "unavailable";
    /** 无可用 Start Plan 时，保留明确过期原因用于展示。 */
    startPlanExpired?: boolean;
    /** 团队订阅明确失效的原因，仅与 no_plan 一起返回。 */
    teamPlanUnavailableReason?: "expired" | "unassigned";
    /** 当前 entitlement 查询对应的个人 / 团队上下文，用于设置页连接方式主判定。 */
    context?: UsageEntitlementContext | null;
    /** 当前用于查询 quota 的模型供应商信息。 */
    provider: UsageEntitlementProviderInfo | null;
    remaining: UsageEntitlementRemaining | null;
    subscription: UsageEntitlementSubscription | null;
    quota: UsageQuotaSnapshot | null;
    /**
     * ZCode 官方 Server MCP 的调用额度（`/api/v1/mcp/usage`）。
     * 与 quota 同一份快照下发，是为了继承 entitlement 已有的缓存 / in-flight 合并 / TTL 策略；
     * 拉取失败、未开通 Coding Plan、或该额度不属于本次查询的连接时一律为 null（可选数据面）。
     */
    mcpQuota?: UsageMcpQuotaSnapshot | null;
}
export interface UsageEntitlementContext {
    scope: "personal" | "team";
    organizationId?: string | null;
    projectId?: string | null;
    displayName?: string | null;
    productId?: string | null;
}
export type PlanIdentityStatus = "coding_plan" | "start_plan" | "no_plan" | "unknown";
export interface PlanIdentitySnapshot {
    generatedAt: number;
    planStatus: PlanIdentityStatus;
    planProductId: string;
}
export interface UsageEntitlementRemaining {
    count: number;
    isShow: boolean;
    percentage?: number;
    nextResetTime?: number | null;
}
export interface UsageEntitlementProviderInfo {
    id: string;
    name: string;
}
export interface UsageEntitlementSubscription {
    identityType: "email" | "phoneNumber" | "unknown";
    identityMasked: string | null;
    details: UsageEntitlementSubscriptionDetail[];
}
export interface UsageEntitlementSubscriptionDetail {
    productId: string;
    productName: string;
    purchaseTime: string | null;
    beginTime: string | null;
    billingCycle?: string | null;
    renewTime?: string | null;
    expireTime: string | null;
    /** Start Plan balance 套餐下的权益生效时间；其他订阅类型可不提供。 */
    entitlements?: Array<{
        entitlementId: string;
        /** 服务端 entitlement show_name，用于待生效提示。 */
        showName?: string | null;
        effectiveTime: string | null;
    }>;
}
export interface UsageStatsSnapshot {
    range: UsageStatsRange;
    generatedAt: number;
    timeZone: string;
    estimatedTokenCharDivisor: number;
    summary: UsageStatsSummary;
    /** 按日期连续补齐后的日序列，空白日期会补 0，供趋势图直接使用。 */
    daily: UsageStatsDaySummary[];
    heatmap: UsageStatsHeatmap;
    models: UsageStatsModelUsage[];
    /**
     * 数据来源标识：用于 UI 识别供应商 monitor 接口或本地 session 聚合数据。
     * App Usage 显式读取本地 session 聚合；Coding Plan 显式读取当前 provider monitor。
     */
    source?: "bigmodel-monitor" | "local";
    /** 远端用量来源供应商，用于 UI 展示 BigModel / Z.AI 等来源。 */
    sourceProvider?: UsageEntitlementProviderInfo | null;
    /** 工具调用维度（仅 BigModel tool-usage 接口可用，本地聚合不填）。 */
    tools?: UsageStatsToolUsage[];
}
export declare const APP_USAGE_RANGES: readonly ["all", "7d", "30d"];
export type AppUsageRange = (typeof APP_USAGE_RANGES)[number];
export declare const appUsageFavoriteModelSchema: z.ZodObject<{
    modelId: z.ZodNullable<z.ZodString>;
    totalTokens: z.ZodNumber;
    share: z.ZodNumber;
}, z.core.$strip>;
export declare const appUsageSummarySchema: z.ZodObject<{
    totalTokens: z.ZodNumber;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    reasoningTokens: z.ZodNumber;
    cacheCreationTokens: z.ZodNumber;
    cacheReadTokens: z.ZodNumber;
    cacheHitRate: z.ZodNumber;
    totalSessions: z.ZodNumber;
    totalTurns: z.ZodNumber;
    toolCallCount: z.ZodNumber;
    toolErrorRate: z.ZodNumber;
    modelErrorRate: z.ZodNumber;
    avgTimeToFirstTokenMs: z.ZodNullable<z.ZodNumber>;
    avgTurnDurationMs: z.ZodNullable<z.ZodNumber>;
    activeDays: z.ZodNumber;
    currentStreakDays: z.ZodNumber;
    longestSessionMs: z.ZodNumber;
    longestStreakDays: z.ZodNumber;
    peakDayTokens: z.ZodNumber;
    favoriteModel: z.ZodNullable<z.ZodObject<{
        modelId: z.ZodNullable<z.ZodString>;
        totalTokens: z.ZodNumber;
        share: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const appUsageHeatmapCellSchema: z.ZodObject<{
    date: z.ZodString;
    level: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    totalTokens: z.ZodNumber;
    turnCount: z.ZodNumber;
    toolCallCount: z.ZodNumber;
}, z.core.$strip>;
export declare const appUsageHeatmapWeekSchema: z.ZodObject<{
    weekIndex: z.ZodNumber;
    days: z.ZodArray<z.ZodNullable<z.ZodObject<{
        date: z.ZodString;
        level: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        totalTokens: z.ZodNumber;
        turnCount: z.ZodNumber;
        toolCallCount: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const appUsageHeatmapSchema: z.ZodObject<{
    startDate: z.ZodNullable<z.ZodString>;
    endDate: z.ZodNullable<z.ZodString>;
    maxTokens: z.ZodNumber;
    weeks: z.ZodArray<z.ZodObject<{
        weekIndex: z.ZodNumber;
        days: z.ZodArray<z.ZodNullable<z.ZodObject<{
            date: z.ZodString;
            level: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
            totalTokens: z.ZodNumber;
            turnCount: z.ZodNumber;
            toolCallCount: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const appUsageDailyModelItemSchema: z.ZodObject<{
    modelId: z.ZodNullable<z.ZodString>;
    totalTokens: z.ZodNumber;
}, z.core.$strip>;
export declare const appUsageDailyModelUsageSchema: z.ZodObject<{
    date: z.ZodString;
    models: z.ZodArray<z.ZodObject<{
        modelId: z.ZodNullable<z.ZodString>;
        totalTokens: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const appUsageModelUsageSchema: z.ZodObject<{
    modelId: z.ZodNullable<z.ZodString>;
    totalTokens: z.ZodNumber;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    requestCount: z.ZodNumber;
    share: z.ZodNumber;
}, z.core.$strip>;
export declare const appUsageToolUsageSchema: z.ZodObject<{
    toolName: z.ZodString;
    callCount: z.ZodNumber;
    errorCount: z.ZodNumber;
    errorRate: z.ZodNumber;
    avgDurationMs: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export declare const appUsageSnapshotSchema: z.ZodObject<{
    range: z.ZodEnum<{
        all: "all";
        "7d": "7d";
        "30d": "30d";
    }>;
    generatedAt: z.ZodNumber;
    timeZone: z.ZodString;
    source: z.ZodLiteral<"agent-db">;
    summary: z.ZodObject<{
        totalTokens: z.ZodNumber;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        reasoningTokens: z.ZodNumber;
        cacheCreationTokens: z.ZodNumber;
        cacheReadTokens: z.ZodNumber;
        cacheHitRate: z.ZodNumber;
        totalSessions: z.ZodNumber;
        totalTurns: z.ZodNumber;
        toolCallCount: z.ZodNumber;
        toolErrorRate: z.ZodNumber;
        modelErrorRate: z.ZodNumber;
        avgTimeToFirstTokenMs: z.ZodNullable<z.ZodNumber>;
        avgTurnDurationMs: z.ZodNullable<z.ZodNumber>;
        activeDays: z.ZodNumber;
        currentStreakDays: z.ZodNumber;
        longestSessionMs: z.ZodNumber;
        longestStreakDays: z.ZodNumber;
        peakDayTokens: z.ZodNumber;
        favoriteModel: z.ZodNullable<z.ZodObject<{
            modelId: z.ZodNullable<z.ZodString>;
            totalTokens: z.ZodNumber;
            share: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    heatmap: z.ZodObject<{
        startDate: z.ZodNullable<z.ZodString>;
        endDate: z.ZodNullable<z.ZodString>;
        maxTokens: z.ZodNumber;
        weeks: z.ZodArray<z.ZodObject<{
            weekIndex: z.ZodNumber;
            days: z.ZodArray<z.ZodNullable<z.ZodObject<{
                date: z.ZodString;
                level: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
                totalTokens: z.ZodNumber;
                turnCount: z.ZodNumber;
                toolCallCount: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    dailyModelUsage: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        models: z.ZodArray<z.ZodObject<{
            modelId: z.ZodNullable<z.ZodString>;
            totalTokens: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    models: z.ZodArray<z.ZodObject<{
        modelId: z.ZodNullable<z.ZodString>;
        totalTokens: z.ZodNumber;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        requestCount: z.ZodNumber;
        share: z.ZodNumber;
    }, z.core.$strip>>;
    tools: z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        callCount: z.ZodNumber;
        errorCount: z.ZodNumber;
        errorRate: z.ZodNumber;
        avgDurationMs: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AppUsageSummary = z.infer<typeof appUsageSummarySchema>;
export type AppUsageHeatmapCell = z.infer<typeof appUsageHeatmapCellSchema>;
export type AppUsageHeatmapWeek = z.infer<typeof appUsageHeatmapWeekSchema>;
export type AppUsageHeatmap = z.infer<typeof appUsageHeatmapSchema>;
export type AppUsageDailyModelItem = z.infer<typeof appUsageDailyModelItemSchema>;
export type AppUsageDailyModelUsage = z.infer<typeof appUsageDailyModelUsageSchema>;
export type AppUsageModelUsage = z.infer<typeof appUsageModelUsageSchema>;
export type AppUsageToolUsage = z.infer<typeof appUsageToolUsageSchema>;
export type AppUsageFavoriteModel = z.infer<typeof appUsageFavoriteModelSchema>;
export type AppUsageSnapshot = z.infer<typeof appUsageSnapshotSchema>;
export interface AppUsageRequest {
    range: AppUsageRange;
    timeZone?: string;
}
export interface CodingPlanUsageSnapshot {
    range: CodingPlanUsageRange;
    rangeStartDate: string;
    rangeEndDate: string;
    generatedAt: number;
    sourceProvider: UsageEntitlementProviderInfo;
    quota: UsageQuotaSnapshot | null;
    activity: CodingPlanActivitySnapshot;
    detail: CodingPlanUsageDetailSnapshot;
    modelUsage: CodingPlanModelUsageSnapshot;
    toolUsage: CodingPlanToolUsageSnapshot;
    health: CodingPlanHealthSnapshot;
}
export interface CodingPlanActivitySnapshot {
    summary: CodingPlanActivitySummary;
    heatmap: AppUsageHeatmap;
}
export interface CodingPlanActivitySummary {
    totalTokens: number;
    peakDailyTokens: number;
    peakDailyTokensDate: string | null;
    totalUsageDurationMs: number;
    currentStreakDays: number;
    longestStreakDays: number;
    favoriteModelName: string | null;
}
export interface CodingPlanUsageDetailSnapshot {
    model: CodingPlanUsageDetailSummary;
    tool: CodingPlanUsageDetailSummary;
}
export interface CodingPlanUsageDetailSummary {
    cacheHitRate: number | null;
    cacheHitRateTrend: number | null;
    totalCredits: number;
    totalCreditsTrend: number | null;
    averageDailyCredits: number;
    averageDailyCreditsTrend: number | null;
}
export interface CodingPlanModelUsageSnapshot {
    xTime: string[];
    granularity: CodingPlanUsageGranularity;
    totalModelCallCount: number;
    totalTokensUsage: number;
    modelDataList: CodingPlanModelData[];
    modelSummaryList: CodingPlanModelSummary[];
}
export interface CodingPlanModelData {
    modelName: string;
    sortOrder: number;
    tokensUsage: number[];
    creditsUsage?: number[];
    cachedInputTokensUsage?: number[];
    uncachedInputTokensUsage?: number[];
    outputTokensUsage?: number[];
    cachedInputCreditsUsage?: number[];
    uncachedInputCreditsUsage?: number[];
    outputCreditsUsage?: number[];
    totalTokens: number;
    totalCredits?: number;
}
export interface CodingPlanModelSummary {
    modelName: string;
    totalTokens: number;
    totalCredits?: number;
    sortOrder: number;
}
export interface CodingPlanToolUsageSnapshot {
    xTime: string[];
    granularity: CodingPlanUsageGranularity;
    toolDataList: CodingPlanToolData[];
    toolSummaryList: CodingPlanToolSummary[];
}
export interface CodingPlanToolData {
    toolCode: string;
    toolName: string;
    sortOrder: number;
    usageCount: number[];
    creditsUsage?: number[];
    totalUsageCount: number;
    totalCredits?: number;
}
export interface CodingPlanToolSummary {
    toolCode: string;
    toolName: string;
    totalUsageCount: number;
    totalCredits?: number;
    sortOrder: number;
}
export interface CodingPlanHealthSnapshot {
    xTime: string[];
    proMaxDecodeSpeed: number[];
    liteDecodeSpeed: number[];
}
export interface UsageStatsToolUsage {
    /** 工具内部代号：search-prime / web-reader / zread / search-mcp 等。 */
    toolCode: string;
    /** 用于展示的人类可读名称。 */
    displayName: string;
    totalCalls: number;
    /** 与 daily 同长度的按天调用次数，便于绘制趋势。 */
    dailyCalls: number[];
}
export interface UsageStatsSummary {
    totalSessions: number;
    totalMessages: number;
    totalCharacters: number;
    totalEstimatedTokens: number;
    activeDays: number;
    mostActiveDay: UsageStatsDaySummary | null;
    favoriteModel: UsageStatsFavoriteModel | null;
    longestSessionMs: number;
    longestStreakDays: number;
    currentStreakDays: number;
    firstActivityDate: string | null;
    lastActivityDate: string | null;
    peakHour: UsageStatsPeakHour | null;
}
export interface UsageStatsPeakHour {
    hour: number;
    totalEstimatedTokens: number;
    messageCount: number;
}
export interface UsageStatsFavoriteModel {
    modelId: string | null;
    totalCharacters: number;
    totalEstimatedTokens: number;
    share: number;
}
export interface UsageStatsDaySummary {
    date: string;
    label: string;
    totalCharacters: number;
    totalEstimatedTokens: number;
    sessionCount: number;
    messageCount: number;
    activityScore: number;
}
export interface UsageStatsHeatmap {
    startDate: string | null;
    endDate: string | null;
    maxActivityScore: number;
    weeks: UsageStatsHeatmapWeek[];
    monthLabels: UsageStatsHeatmapMonthLabel[];
}
export interface UsageStatsHeatmapWeek {
    weekIndex: number;
    days: Array<UsageStatsHeatmapCell | null>;
}
export interface UsageStatsHeatmapMonthLabel {
    weekIndex: number;
    date: string;
}
export interface UsageStatsHeatmapCell {
    date: string;
    level: 0 | 1 | 2 | 3 | 4;
    totalCharacters: number;
    totalEstimatedTokens: number;
    sessionCount: number;
    messageCount: number;
    activityScore: number;
}
export interface UsageStatsModelUsage {
    modelId: string | null;
    totalCharacters: number;
    totalEstimatedTokens: number;
    inputCharacters: number;
    inputEstimatedTokens: number;
    outputCharacters: number;
    outputEstimatedTokens: number;
    sessionCount: number;
    messageCount: number;
    share: number;
}
//# sourceMappingURL=usage-stats.d.ts.map