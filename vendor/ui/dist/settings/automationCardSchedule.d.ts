import type { ZCodeAutomationScheduleRule } from "@zcode/shared";
import { type IntlLike } from "@/settings/automationFormat.js";
/** 卡片优先展示权威 scheduleRule；旧数据缺少规则时才从兼容 cron 生成摘要。 */
export declare function describeAutomationCardSchedule(automation: {
    cronExpr: string;
    scheduleRule?: ZCodeAutomationScheduleRule;
    recurring?: boolean;
    maxRuns?: number;
}, intl: IntlLike): string;
//# sourceMappingURL=automationCardSchedule.d.ts.map