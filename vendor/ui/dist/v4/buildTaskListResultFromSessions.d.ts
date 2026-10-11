import type { ZCodeTaskMeta } from "@zcode/shared";
export type TaskListKind = "pinned" | "archived" | "timeline" | "active";
export type TaskListSortBy = "created" | "updated";
export interface BuildTaskListParams {
    /** tasks-index active/pinned/archived 三个持久分区的 task 行并集。 */
    taskIndexItems: ZCodeTaskMeta[];
    /** sessions-index 派生的会话 activity/detail；只覆盖命中的持久行。 */
    sessions: ZCodeTaskMeta[];
    kind: TaskListKind;
    /** 服务端权威 pin/archive id 集（tasks-index.sqlite 持久化）。 */
    pinnedIds: ReadonlySet<string>;
    archivedIds: ReadonlySet<string>;
    /** tasks-index 持久删除 tombstone；命中后不属于任何列表 kind。 */
    deletedIds?: ReadonlySet<string>;
    search?: string;
    sortBy: TaskListSortBy;
    /** 折叠上限；undefined = 全量（expanded）。 */
    limit?: number;
    /**
     * taskId → unreadAt（tasks-index 组织态，与 pin/archive 同源平行拉取）。
     * sessions-index schema 冻结不携带 unread，这里在列表构建时 join 进 meta。
     */
    unreadAtByTaskId?: ReadonlyMap<string, number>;
    /** taskId → terminal status（tasks-index 历史终态；只补冷启动 stored summary）。 */
    terminalStatusByTaskId?: ReadonlyMap<string, Extract<ZCodeTaskMeta["status"], "completed" | "error">>;
    /** taskId → 旧 task-index 手动标题；只覆盖 titleOverridden!==true 的 session meta。 */
    titleOverrideByTaskId?: ReadonlyMap<string, string>;
    /** taskId -> cronAutomationId（tasks-index 元数据；SessionSummary 不携带）。 */
    cronAutomationIdByTaskId?: ReadonlyMap<string, string>;
}
export interface BuildTaskListResult {
    items: ZCodeTaskMeta[];
    total: number;
}
/**
 * 以 tasks-index 行为左表做字段级 join。summary 缺失时保留原 task 引用；session-only 冷摘要
 * 不会进入持久列表，新建短窗口由既有 optimistic/live overlay 负责。
 */
export declare function mergeTaskIndexRowsWithSessions(params: {
    taskIndexItems: ZCodeTaskMeta[];
    sessions: ZCodeTaskMeta[];
}): ZCodeTaskMeta[];
/** unreadAt join：map 已加载时以 tasks-index 为准，未加载时不动原 meta，避免首帧闪烁。 */
export declare function joinTaskListUnreadAt(tasks: ZCodeTaskMeta[], unreadAtByTaskId: ReadonlyMap<string, number> | undefined): ZCodeTaskMeta[];
export declare function joinTaskListMembershipMeta(tasks: ZCodeTaskMeta[], params: {
    unreadAtByTaskId?: ReadonlyMap<string, number>;
    terminalStatusByTaskId?: ReadonlyMap<string, Extract<ZCodeTaskMeta["status"], "completed" | "error">>;
    titleOverrideByTaskId?: ReadonlyMap<string, string>;
    cronAutomationIdByTaskId?: ReadonlyMap<string, string>;
}): ZCodeTaskMeta[];
/** 客户端过滤/排序/分页，产出与旧 listTaskList 同形的 { items, total }。 */
export declare function buildTaskListResult(params: BuildTaskListParams): BuildTaskListResult;
//# sourceMappingURL=buildTaskListResultFromSessions.d.ts.map