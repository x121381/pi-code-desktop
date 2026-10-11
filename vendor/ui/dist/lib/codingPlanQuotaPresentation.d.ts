import type { UsageEntitlementSnapshot, UsageQuotaLimit } from "@zcode/shared";
export type CodingPlanQuotaResetFormat = "date" | "dateTime" | "adaptive";
export declare function isSameLimitCategory(limitType: string, queryType: UsageQuotaLimit["type"]): boolean;
export declare function findCodingPlanQuotaLimit(limits: UsageQuotaLimit[] | undefined, type: UsageQuotaLimit["type"], unit: number, number?: number): UsageQuotaLimit | null;
/**
 * 官方 Server MCP 额度（服务端下发的总额度）。
 *
 * 服务端把它放在 entitlement 快照的独立字段而不是 quota.limits[]，因此不能用
 * findCodingPlanQuotaLimit 查询；这里收口成唯一取数入口，避免各展示位各写一遍 `?.` 链路。
 */
export declare function resolveMcpQuotaLimit(snapshot: UsageEntitlementSnapshot | null | undefined): UsageQuotaLimit | null;
export declare function normalizeQuotaPercentage(value: number | undefined): number;
export declare function getQuotaRemainingPercentage(limit: UsageQuotaLimit | null): number | null;
export declare function formatQuotaRemainingPercentage(locale: string, limit: UsageQuotaLimit | null): string;
/**
 * Start Plan 额度桶刷新时间的唯一格式化入口（设置页余额卡与聊天输入气泡共用）。
 *
 * 两端曾各自维护一份逐字相同的 formatStartPlanBalanceRenewTime，
 * 格式调整漏改任一处就会重新出现两端展示不一致。桶刷新时间格式与 Coding Plan
 * 对齐：当日仅 HH:mm，非当日仅日期。
 */
export declare function formatStartPlanBucketResetTime(locale: string, value: number | null | undefined): string | undefined;
export declare function formatQuotaResetTime(params: {
    locale: string;
    value: number | null | undefined;
    format: CodingPlanQuotaResetFormat;
    compactToday?: boolean;
}): string | undefined;
//# sourceMappingURL=codingPlanQuotaPresentation.d.ts.map