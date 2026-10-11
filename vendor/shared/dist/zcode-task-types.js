/* oxlint-disable eslint(max-lines) -- ZCode task 投影类型当前集中在单文件维护，新增 workspace 事件先保持就近声明。 */
// ── 旧协议兼容面（过渡期）──────────────────────────────
// 剩余 29 个导出：workspace 预热/workspace 事件、turn steer 结果、session binding/import、
// trace/input/query id 工厂函数、ZCodeError、ZCodeTaskCreateResult 等。
// 消费者：services 旧栈（zcodeAgentService/zcodeTaskServiceAdapter/zcodeTaskService）、
// UI 旧 store/投影。明星承重类型（ZCodeTaskMeta/ZCodeStreamEvent/ZCodeTaskSnapshot 等）
// 已迁 zcode-task-types-core.ts（幸存面）。本文件与旧 task service 组同生命周期。
import { createUuid } from "./uuid.js";
/** 生成 traceId；保留旧函数名兼容已有调用，格式对齐 agent 的 UUID trace。 */
export function generateTraceId(_taskId) {
    return createUuid();
}
/** 创建 ZCode session 级观测 traceId；后续 prompt 只继承，不重新生成。 */
export function createSessionTraceId() {
    return createUuid();
}
export function createInputId() {
    return createUuid();
}
export function createQueryId() {
    return createUuid();
}
/** cron 定时任务生成的 session 默认归入的系统分组固定 id。 */
export const CRON_DEFAULT_GROUP_ID = "zcode-default-group-cron";
/** 闲时任务已派发会话默认归入的系统分组固定 id（与 cron 分组同构）。 */
export const OFF_PEAK_DEFAULT_GROUP_ID = "zcode-default-group-off-peak";
/** 判断一个 task/session 是否由定时任务触发产生。 */
export function isCronTask(task) {
    // 持久化 task meta 使用 cronAutomationId；但运行态派发/旧链路里字段名是 automationId。
    // UI 只看前者会让新创建或刚恢复的定时任务暂时没有 icon。
    return Boolean(task.cronAutomationId || task.automationId);
}
/** 判断一个 task/幻影行是否属于闲时任务（只看持久 meta 标记，UI 不反查 off-peak store）。 */
export function isOffPeakTask(task) {
    return Boolean(task.offPeakTaskId);
}
//# sourceMappingURL=zcode-task-types.js.map