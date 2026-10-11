import type { ZCodeAutomationIntervalUnit, ZCodeAutomationScheduleRule, ZCodeAutomationUpdateParams } from "@zcode/shared";
/** 会话侧自定义重复 carrier 配对、范围或互斥校验失败。 */
export declare class InvalidAutomationIntervalCarrierError extends Error {
    constructor(message: string);
}
/**
 * 校验会话 Cron 工具与 UI 共用的 interval carrier。
 *
 * intervalUnit + interval 是受控输入，服务层必须再次校验，避免旧客户端或内部调用绕过
 * contract/protocol 后写入超出 UI 语义的间隔。`scheduleRule: null` 是 update 的显式清除
 * 语义，也不能与 carrier 混用，否则无法确定是新建规则还是清除规则。
 */
export declare function assertValidAutomationIntervalCarrier(input: {
    intervalUnit?: ZCodeAutomationIntervalUnit;
    interval?: number;
    scheduleRule?: ZCodeAutomationScheduleRule | null;
    relativeDelayMinutes?: number;
    recurring?: boolean;
    maxRuns?: number | null;
}): void;
/** carrier 更新必须原子切换无限循环，避免 scheduleRule 与生命周期模式脱节。 */
export declare function forceIntervalCarrierRecurring(params: ZCodeAutomationUpdateParams): ZCodeAutomationUpdateParams;
//# sourceMappingURL=automationIntervalCarrier.d.ts.map