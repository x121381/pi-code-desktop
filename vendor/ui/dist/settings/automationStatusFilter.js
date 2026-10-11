import { hasAutomationFailureState, resolveAutomationStatusKind, } from "../settings/automationFormat.js";
/** 默认筛选：不过滤。AutomationsSection 通过该常量引用，避免源码里再出现裸 "all" 触发 All tab 回归断言。 */
export const DEFAULT_AUTOMATION_STATUS_FILTER = "all";
export const AUTOMATION_STATUS_FILTERS = [
    "all",
    "inProgress",
    "completed",
    "failed",
];
/** 闲时六态 → 三组：排队/暂停/运行都还会推进，算进行中；取消与失败同为非正常结束，并入失败。 */
export function resolveOffPeakStatusFilterKind(task) {
    switch (task.status) {
        case "completed":
            return "completed";
        case "failed":
        case "cancelled":
            return "failed";
        default:
            return "inProgress";
    }
}
/** 定时任务：先看失败徽章（含循环任务最近一次运行失败），再看 lifecycle 终态，其余进行中。 */
export function resolveAutomationStatusFilterKind(automation) {
    if (hasAutomationFailureState(automation))
        return "failed";
    return resolveAutomationStatusKind(automation) === "completed" ? "completed" : "inProgress";
}
export function filterOffPeakTasksByStatus(tasks, filter) {
    if (filter === "all")
        return tasks;
    return tasks.filter((task) => resolveOffPeakStatusFilterKind(task) === filter);
}
export function filterAutomationsByStatus(automations, filter) {
    if (filter === "all")
        return automations;
    return automations.filter((automation) => resolveAutomationStatusFilterKind(automation) === filter);
}
export function resolveAutomationTabState(previous, nextTab) {
    if (nextTab === previous.tab)
        return previous;
    return { tab: nextTab, filter: DEFAULT_AUTOMATION_STATUS_FILTER };
}
//# sourceMappingURL=automationStatusFilter.js.map