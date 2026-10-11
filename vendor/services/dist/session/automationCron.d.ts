import type { ZCodeAutomation, ZCodeAutomationScheduleRule } from "@zcode/shared";
export { isValidCronExpr } from "#src/session/automationCronValidation.js";
/** 用于判断直接提交的 scheduleRule 是否仅更新展示字段，比较时忽略 anchorAt。 */
export declare function scheduleRuleDefinition(rule: ZCodeAutomationScheduleRule): string;
/** 一次性固定日历任务使用了刚刚过去、但已不能安全补执行的目标时间。 */
export declare class StaleOneShotAutomationScheduleError extends Error {
    constructor(targetAt: number);
}
/**
 * 纯一次性任务（非循环且至多执行一次）。相对延迟的语义是一个确定的目标时刻，
 * 不是间隔型重复规则：错过窗口后必须进入终态，不得从兼容性 scheduleRule
 * （如 delayMinutes 落成的 minute 规则）推导出新的执行承诺。
 */
export declare function isOneShotAutomation(automation: Pick<ZCodeAutomation, "recurring" | "maxRuns">): boolean;
/**
 * cron 表达式的下次触发时间计算（本地时区）。定时任务只用 croner 做「解析 + 算下次时间」，
 * 不用它做实际调度——调度循环由 scheduler 自己轮询 automation_runs / claimDue 完成。
 */
/**
 * 计算 cron 的下一个触发时间（毫秒时间戳）。
 * @param from 基准时间（毫秒）；缺省用当前时间。返回严格晚于 from 的下一次；无未来触发返回 null。
 */
export declare function computeNextRunAt(cronExpr: string, from?: number): number | null;
/**
 * 将“几分钟后”收口为以服务端真实时钟为锚点的一次性规则。cronExpr 仅用于兼容展示，
 * 实际 nextRunAt 由带秒级 anchorAt 的 scheduleRule 计算，避免五段 cron 提前或延后一整分钟。
 */
export declare function buildRelativeDelaySchedule(delayMinutes: number, from?: number): Pick<ZCodeAutomation, "cronExpr" | "scheduleRule">;
/**
 * 新建任务的首次触发时间。一次性固定月日 cron 如果刚错过目标分钟，下一次会滚到下一年；
 * 仅允许小于一分钟的工具调用跨分钟误差立即补执行，已经陈旧的目标必须拒绝并重新计算。
 */
export declare function computeInitialAutomationNextRunAt(automation: Pick<ZCodeAutomation, "cronExpr" | "recurring" | "scheduleRule">, from?: number): number | null;
/** 自定义重复规则的下一次运行；所有计算都使用本地日历时间。 */
export declare function computeScheduleRuleNextRunAt(rule: ZCodeAutomationScheduleRule, from?: number): number | null;
/** 将“每 N 分钟”的 cron 展示表达式识别为带创建时刻锚点的产品调度规则。 */
export declare function inferMinuteIntervalScheduleRule(cronExpr: string, anchorAt: number): ZCodeAutomationScheduleRule | undefined;
/**
 * 会话侧自定义重复 carrier（intervalUnit + interval）归一化为权威 scheduleRule。
 *
 * cron 各字段有步长上限（minute 59、hour 24、day-of-month 31、month 12），
 * 「每50小时」「每40天」「每13个月」无法用五段 cron 直接表达。会话侧所有“每 N 单位”均用受控 carrier
 * intervalUnit+interval 携带真实间隔，cronExpr 仅作合法兼容展示；本函数把兼容 cron 各字段
 * 解析成 scheduleRule 所需的 hour/minute/weekdays/monthDays/months，真实 interval 由 carrier
 * 传入。anchorAt 由调用方（service）传入真实创建/修改时刻，调度引擎据此推进。
 *
 * 兼容 cron 字段缺失（如 '* * * * *' 占位）时回退到安全默认值（weekday=[1]、monthDays=[1]、
 * months=锚点月份），保证调度引擎仍可计算下一轮，不静默返回 null。
 */
export declare function buildIntervalScheduleRule(intervalUnit: ZCodeAutomationScheduleRule["unit"], interval: number, cronExpr: string, anchorAt: number): ZCodeAutomationScheduleRule;
export declare function computeAutomationNextRunAt(automation: Pick<ZCodeAutomation, "cronExpr" | "scheduleRule">, from?: number): number | null;
//# sourceMappingURL=automationCron.d.ts.map