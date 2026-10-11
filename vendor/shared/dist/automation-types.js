// ---- 定时任务(Automation)领域类型 ----
// automation / automation_runs 存 tasks-index.sqlite。
// 这里是跨 services / cli / desktop / ui 复用的 camelCase 领域类型；sqlite 列名为 snake_case。
/** 单个本地任务索引允许保留的定时任务定义总数；所有生命周期状态都计入。 */
export const AUTOMATION_CREATE_LIMIT = 20;
export const AUTOMATION_CREATE_LIMIT_ERROR_CODE = "AUTOMATION_CREATE_LIMIT_REACHED";
export function isAutomationCreateLimitError(error) {
    const message = typeof error === "string" ? error : error instanceof Error ? error.message : "";
    return message.includes(AUTOMATION_CREATE_LIMIT_ERROR_CODE);
}
/**
 * runId 契约（见 ZCodeAutomationRun.runId）的唯一解析入口；desktop host/scheduler 与
 * CLI telemetry 不各自按字符串猜格式。不符合两种声明格式的输入一律返回 null。
 */
export function parseAutomationRunId(runId) {
    const separatorIndex = runId.indexOf(":");
    if (separatorIndex <= 0)
        return null;
    const automationId = runId.slice(0, separatorIndex);
    const rest = runId.slice(separatorIndex + 1);
    if (rest.startsWith("manual:")) {
        return rest.length > "manual:".length ? { automationId, trigger: "manual" } : null;
    }
    const scheduledAt = Number(rest);
    if (!Number.isSafeInteger(scheduledAt) || scheduledAt <= 0)
        return null;
    return { automationId, trigger: "schedule", scheduledAt };
}
//# sourceMappingURL=automation-types.js.map