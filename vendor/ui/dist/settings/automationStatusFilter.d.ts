import type { ZCodeOffPeakTask } from "@zcode/shared";
import { hasAutomationFailureState, resolveAutomationStatusKind } from "@/settings/automationFormat.js";
export type AutomationStatusFilter = "all" | "inProgress" | "completed" | "failed";
export type AutomationStatusFilterKind = Exclude<AutomationStatusFilter, "all">;
/** 默认筛选：不过滤。AutomationsSection 通过该常量引用，避免源码里再出现裸 "all" 触发 All tab 回归断言。 */
export declare const DEFAULT_AUTOMATION_STATUS_FILTER: AutomationStatusFilter;
export declare const AUTOMATION_STATUS_FILTERS: readonly AutomationStatusFilter[];
/** 闲时六态 → 三组：排队/暂停/运行都还会推进，算进行中；取消与失败同为非正常结束，并入失败。 */
export declare function resolveOffPeakStatusFilterKind(task: Pick<ZCodeOffPeakTask, "status">): AutomationStatusFilterKind;
type AutomationFilterLike = Parameters<typeof resolveAutomationStatusKind>[0] & Parameters<typeof hasAutomationFailureState>[0];
/** 定时任务：先看失败徽章（含循环任务最近一次运行失败），再看 lifecycle 终态，其余进行中。 */
export declare function resolveAutomationStatusFilterKind(automation: AutomationFilterLike): AutomationStatusFilterKind;
export declare function filterOffPeakTasksByStatus<T extends Pick<ZCodeOffPeakTask, "status">>(tasks: readonly T[], filter: AutomationStatusFilter): readonly T[];
export declare function filterAutomationsByStatus<T extends AutomationFilterLike>(automations: readonly T[], filter: AutomationStatusFilter): readonly T[];
/**
 * 筛选曾按 `{ tab, filter }` 记录并在渲染时派生，切走再切回原 tab 时
 * 旧筛选会被恢复，违反「切换顶栏 tab 即回到全部」。改为 tab 与筛选同居一个状态对象，
 * 任何 tab 变更都经由本函数归约：tab 未变则保持原对象（避免无谓重渲染），tab 变了就重置筛选。
 */
export interface AutomationTabState<Tab extends string> {
    tab: Tab;
    filter: AutomationStatusFilter;
}
export declare function resolveAutomationTabState<Tab extends string>(previous: AutomationTabState<Tab>, nextTab: Tab): AutomationTabState<Tab>;
export {};
//# sourceMappingURL=automationStatusFilter.d.ts.map