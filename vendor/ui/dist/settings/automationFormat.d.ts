export interface IntlLike {
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, string>) => string;
}
export type AutomationStatusKind = "active" | "paused" | "completed" | "failed";
interface AutomationStatusLike {
    lifecycleStatus: AutomationStatusKind;
    enabled: boolean;
}
interface AutomationFailureLike {
    lifecycleStatus: AutomationStatusKind;
    dispatchStatus?: "idle" | "claimed" | "dispatched" | "failed_to_dispatch";
    dispatchAttempts?: number;
    retryAt?: number;
    lastError?: string;
}
/** 最近一次真实运行/派发失败时展示失败态；循环任务本身仍保持 active 并继续调度。 */
export declare function hasAutomationFailureState(automation: AutomationFailureLike): boolean;
/** 派发失败进入退避队列时，失败态旁展示真实的重试排队信息。 */
export declare function hasAutomationRetryQueueState(automation: AutomationFailureLike): boolean;
/** 定时任务生命周期展示状态：终态优先，其次 paused/enabled，最后 active。 */
export declare function resolveAutomationStatusKind(automation: AutomationStatusLike): AutomationStatusKind;
/** cron builder 支持的频率类型（覆盖 Feishu 自定义重复里最常用的几种）。 */
export type CronFrequency = "hourly" | "daily" | "weekdays" | "weekly" | "monthly" | "custom";
export type CustomRepeatUnit = "minute" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
export type CustomMonthlyMode = "date" | "weekday";
export interface CronBuilderState {
    frequency: CronFrequency;
    /** daily/weekly/monthly 用：0-23 */
    hour: number;
    /** daily/weekly/monthly 用：0-59 */
    minute: number;
    /** weekly 用：0(周日)-6(周六) 的集合 */
    weekdays: number[];
    /** monthly 用：1-31 */
    dayOfMonth: number;
    /** custom 用：原始 5 段 cron */
    rawExpr: string;
    customInterval: number;
    customUnit: CustomRepeatUnit;
    customWeekdays: number[];
    customMonthDays: number[];
    /** yearly 用：1-12 人类月份（日期复用 customMonthDays[0]）。 */
    customMonth: number;
    customMonthlyMode: CustomMonthlyMode;
}
export declare const WEEKDAY_ORDER: readonly [1, 2, 3, 4, 5, 6, 0];
export declare function isSessionCreatedAutomation(automation: {
    targetTaskId?: string;
} | null | undefined): boolean;
export declare function buildAutomationEditCronExpr(state: CronBuilderState, automation: {
    cronExpr: string;
    targetTaskId?: string;
} | null | undefined): string;
/** 组装 cron builder 状态 → 5 段 cron 表达式（分 时 日 月 周）。 */
export declare function buildCronExpr(state: CronBuilderState): string;
/** 尽力把已有 cron 反解析回 builder 状态；不认识的落到 custom。 */
export declare function parseCronToBuilder(expr: string): CronBuilderState;
/** builder → 可读调度摘要；编辑态直接使用，避免自定义规则经过 cron 反解析后丢失 UI 语义。 */
export declare function describeCronBuilder(state: CronBuilderState, intl: IntlLike): string;
/** cron → 可读调度摘要（如 “每天 09:00”“每周一、三 18:30”）；无法识别回退原始表达式。 */
export declare function describeCron(expr: string, intl: IntlLike): string;
/** UI 调度 builder 是否能无损回显 cron；固定月日和未知表达式必须走“自定义”替换流程。 */
export declare function canVisualizeCronInAutomationEditor(expr: string): boolean;
/** 本地时区偏移 → GMT 文案；支持 GMT+8 与 GMT+5:30 这类半小时时区。 */
export declare function formatGmtOffset(offsetMinutes?: number): string;
/** 毫秒时间戳 → 本地日期时间（YYYY-MM-DD HH:MM）。 */
export declare function formatDateTime(ts: number | undefined): string;
/** 相对时间（如 “in 2h”“3d ago”），用于“下次运行 / 上次运行”。 */
export declare function formatRelativeToNow(ts: number | undefined, now: number, intl: IntlLike): string;
/** 定时任务卡片下次运行时间：过期不展示；一个月内相对时间，更远的未来绝对时间。 */
export declare function formatAutomationCardNextRun(ts: number | undefined, now: number, intl: IntlLike): string | null;
/** 运行时长（毫秒）→ 可读文本（如 “1m 20s”“3s”）。 */
export declare function formatDuration(startTs: number | undefined, endTs: number | undefined): string;
export {};
//# sourceMappingURL=automationFormat.d.ts.map