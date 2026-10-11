import type { CodingPlanResetStatusSnapshot, CodingPlanResetType, UsageQuotaLimit } from "@zcode/shared";
export declare const CODING_PLAN_QUOTA_RESET_PROGRESS_DURATION_MS = 500;
export declare const CODING_PLAN_QUOTA_RESET_DONE_DISPLAY_MS = 2600;
export declare const CODING_PLAN_QUOTA_RESET_AUTOMATIC_PROCESSING_MS = 1000;
export declare function resolveCodingPlanQuotaResetDurationMs(resetType: CodingPlanResetType): number;
export type CodingPlanQuotaResetUiStatus = "available" | "processing" | "completed";
export interface CodingPlanQuotaResetUiEntry {
    status: CodingPlanQuotaResetUiStatus;
    /** 剩余重置机会次数；completed 携带同一 status 快照余下的有效机会，processing 保留点击前快照。 */
    opportunityCount: number;
    /** 最早的重置机会到期时刻；无余下机会时为 null。 */
    opportunityExpiresAt: number | null;
    /** 本地手动核销开始时刻；自动/运营重置为 null。 */
    startedAt: number | null;
    /** 服务端 latest_{five_hour,week}_reset_history.used_at。 */
    completedAt: number | null;
    /** 客户端首次观察到当前 completedAt 的时间，仅用于短提示和动效。 */
    observedAt: number | null;
    /** entitlement 刷新成功前允许临时把额度覆盖为 100%。 */
    quotaOverridePending: boolean;
    nextResetAt: number | null;
    /** 同一次失败重试必须复用的幂等键；成功对账后清空。 */
    idempotencyKey: string | null;
    error: string | null;
}
export interface CodingPlanQuotaResetCelebrationState {
    sourceKey: string | null;
    /** 已从触发器为该 used_at 撒过花；同一次完成在重复渲染/轮询时不得重播。 */
    celebratedCompletedAt: number | null;
}
/** 同一 source 下五小时与周额度各自独立的重置状态。 */
export interface CodingPlanQuotaResetUiEntries {
    fiveHour: CodingPlanQuotaResetUiEntry | null;
    week: CodingPlanQuotaResetUiEntry | null;
}
/** 五小时/周共用同一份重置状态机，只在读取机会/历史字段时按类型区分。 */
export declare const CODING_PLAN_QUOTA_RESET_TYPES: readonly ["FIVE_HOUR", "WEEK"];
export declare function advanceCodingPlanQuotaResetCelebration(previous: CodingPlanQuotaResetCelebrationState | null, input: {
    sourceKey: string | null;
    completedAt: number | null;
    /** 自动/运营完成（startedAt 为空）的短提示窗口；手动重置由按钮自身撒花，触发器不参与。 */
    automaticCompletion: boolean;
}): {
    state: CodingPlanQuotaResetCelebrationState;
    shouldCelebrate: boolean;
};
/**
 * 把服务端 status 应用到窗口内共享 UI 状态。
 *
 * 旧历史且 has_unread_history=false 不能在首次挂载时进入 completed，
 * 否则客户端会把几小时前的历史重置错误覆盖成当前 100% 剩余额度。
 *
 * resetType 决定读取五小时还是周额度的机会/历史。has_unread_history 是两种重置
 * 类型共享的单一游标，因此只有 used_at 最新的那一类“拥有”这个未读标记：否则一次
 * 周重置就会把过期的五小时历史误判为刚完成，反之亦然。
 */
export declare function applyCodingPlanQuotaResetStatus(previous: CodingPlanQuotaResetUiEntry | null, status: CodingPlanResetStatusSnapshot, now: number, manualStartedAt?: number | null, resetType?: CodingPlanResetType): CodingPlanQuotaResetUiEntry | null;
/**
 * 「是否仍可核销」的唯一判定：非 processing、张数 > 0 且最早机会晚于 now 到期。
 * available 与携带余下机会的 completed 同样适用；徽标、标题旁「重置」、弹框行与
 * reset() 放行都以此为准，不再各自按 status === "available" 判断。
 */
export declare function hasUsableCodingPlanQuotaResetOpportunity(entry: CodingPlanQuotaResetUiEntry | null, now: number): boolean;
/**
 * 额度标题旁操作的完成时刻：仍有可核销机会时返回 null（展示可点击「重置」打开弹框），
 * 否则返回 completedAt（completed 展示「已重置」）。
 * Bugfix：completed 携带余下机会后，若仍直接传 entry.completedAt，同类型还有卡时标题
 * 也会显示「已重置」，用户无法从标题再次打开弹框核销余下的卡。
 */
export declare function resolveCodingPlanQuotaResetActionCompletedAt(controller: {
    entry: CodingPlanQuotaResetUiEntry | null;
    opportunityVisible: boolean;
}): number | null;
export declare function startCodingPlanQuotaResetManualUse(entry: CodingPlanQuotaResetUiEntry | null, idempotencyKey: string, now: number): CodingPlanQuotaResetUiEntry | null;
export declare function failCodingPlanQuotaResetManualUse(entry: CodingPlanQuotaResetUiEntry | null, error: string): CodingPlanQuotaResetUiEntry | null;
export declare function resolveCodingPlanQuotaResetRemainingPercentage(remainingPercentage: number | null, entry: CodingPlanQuotaResetUiEntry | null): number | null;
/**
 * 合并五小时与周额度的机会徽标展示：一个礼物徽标、次数累加，
 * 倒计时取可见机会中最早到期的一档；某档到期/隐藏后自动回落到剩余档。
 * 仅影响徽标展示，重置按钮仍按类型各自独立。
 */
export declare function mergeCodingPlanQuotaResetOpportunityBadges(items: ReadonlyArray<{
    count: number;
    expiresAt: number | null;
    visible: boolean;
}>): {
    count: number;
    expiresAt: number | null;
    visible: boolean;
};
export declare function completeCodingPlanQuotaResetEntitlementRefresh(entry: CodingPlanQuotaResetUiEntry | null, completedAt: number): CodingPlanQuotaResetUiEntry | null;
export declare function resolveCodingPlanQuotaResetLimit(limit: UsageQuotaLimit | null | undefined, entry: CodingPlanQuotaResetUiEntry | null): UsageQuotaLimit | null;
export declare function resolveCodingPlanQuotaResetStatusVisible(entry: CodingPlanQuotaResetUiEntry | null, now: number, doneDisplayMs?: number): boolean;
export type CodingPlanQuotaResetAutomaticPhase = "processing" | "completed";
export declare function resolveCodingPlanQuotaResetAutomaticPhase(entry: CodingPlanQuotaResetUiEntry | null, now: number, dismissed: boolean, processingMs?: number): CodingPlanQuotaResetAutomaticPhase | null;
/**
 * 清除已失效的补播撒花 arm：armed 的 used_at 不再是当前生效的自动完成
 * （被跨窗口抑制置空 observedAt，或被更新的 used_at 取代）时必须清 arm，
 * 否则其他窗口 hover 面板时仍会从「已重置」位置撒花，违背“多窗口只播一次”。
 */
export declare function pruneCodingPlanQuotaResetConfettiArms(arms: Record<CodingPlanResetType, number | null>, automaticCompletedAtByType: Record<CodingPlanResetType, number | null>): Record<CodingPlanResetType, number | null>;
//# sourceMappingURL=codingPlanQuotaResetUi.d.ts.map