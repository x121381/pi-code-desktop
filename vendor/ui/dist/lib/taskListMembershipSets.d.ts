import type { IZCodeTaskService } from "@zcode/services";
import type { ZCodeTaskMeta } from "@zcode/shared";
export interface TaskListMembershipScope {
    workspacePath: string;
    workspaceIdentity?: string;
}
export type TaskListMembershipService = Pick<IZCodeTaskService, "listPinnedTaskIds" | "listArchivedTasks" | "listTasks" | "listPinnedTasks"> & Partial<Pick<IZCodeTaskService, "listDeletedTaskIds">>;
export interface TaskListMembershipSets {
    /** tasks-index 三个持久分区（active/pinned/archived）的完整 task 行并集。 */
    taskIndexItems: ZCodeTaskMeta[];
    pinnedIds: Set<string>;
    archivedIds: Set<string>;
    /** tasks-index 持久删除 tombstone；优先于所有列表 kind。 */
    deletedIds: Set<string>;
    /** taskId → unreadAt（tasks-index 组织态；sessions-index 不携带，join 用）。 */
    unreadAtByTaskId: Map<string, number>;
    /** taskId → terminal status（tasks-index 历史终态；用于冷启动 stored summary 补红点）。 */
    terminalStatusByTaskId: Map<string, Extract<ZCodeTaskMeta["status"], "completed" | "error">>;
    /**
     * taskId → 旧 task-index 手动标题。
     *
     * v4 sessions-index 主列表来自 CLI session store；老数据的用户重命名只在
     * tasks-index.title/titleOverridden 中。这里在既有 membership 读取里顺手带出，不迁移表。
     */
    titleOverrideByTaskId: Map<string, string>;
    /** taskId -> cronAutomationId（tasks-index 持久化身份；sessions-index 冻结 schema 不携带）。 */
    cronAutomationIdByTaskId: Map<string, string>;
}
export interface TaskListMembershipRefreshHoldState {
    armed: boolean;
    enteredCallCount: number;
    released: boolean;
}
/**
 * E2E-only：暂停已经读取完成、但尚未返回给 renderer join 的 membership 快照。
 * TSL18 必须确定性制造“旧 running 快照在 Stop 终态之后返回”的窗口；
 * 真实 SQLite 太快，不能用 sleep 碰运气。入口只由受保护的 window.__testActions 暴露。
 */
export declare function armTaskListMembershipRefreshHoldForE2E(): void;
export declare function releaseTaskListMembershipRefreshHoldForE2E(): void;
export declare function getTaskListMembershipRefreshHoldStateForE2E(): TaskListMembershipRefreshHoldState;
/** M5 ③：remote shard 的归属在各自 endpoint 的 tasks-index，按 endpoint 分片拉取后求并。 */
export interface TaskListMembershipEndpoint {
    service: TaskListMembershipService;
    scopes: TaskListMembershipScope[];
}
/** 拉取服务端权威 task 行、pinned/archived id 集与其它持久元数据。 */
export declare function fetchTaskListMembershipSets(params: {
    service: TaskListMembershipService;
    scopes: TaskListMembershipScope[];
}): Promise<TaskListMembershipSets>;
export declare function fetchTaskListMembershipSetsForEndpointsCached(params: {
    /** 建议形态：`${membershipVersion}::${endpoints 签名}`。 */
    cacheKey: string;
    endpoints: TaskListMembershipEndpoint[];
}): Promise<TaskListMembershipSets>;
/** 测试/异常恢复用：清空 membership 缓存。 */
export declare function clearTaskListMembershipCache(): void;
/** 按 endpoint 并行拉取归属并求并集（taskId 为 sessionId，跨 endpoint 不冲突）。 */
export declare function fetchTaskListMembershipSetsForEndpoints(endpoints: TaskListMembershipEndpoint[]): Promise<TaskListMembershipSets>;
//# sourceMappingURL=taskListMembershipSets.d.ts.map