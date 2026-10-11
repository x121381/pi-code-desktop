import type { ZCodeWorkspaceTaskListChanged } from "@zcode/shared";
export type TaskListMembershipWorkspaceEventReason = "task_archived" | "task_unarchived" | "task_pinned" | "task_unpinned";
export type TaskMetaWorkspaceEventSyncMode = "insert-active" | "preserve-membership";
export declare function isTaskListMembershipWorkspaceEvent<T extends Pick<ZCodeWorkspaceTaskListChanged, "reason">>(event: T): event is T & {
    reason: TaskListMembershipWorkspaceEventReason;
};
export declare function isTaskListDeletionWorkspaceEvent(event: Pick<ZCodeWorkspaceTaskListChanged, "reason">): boolean;
/**
 * 侧栏以 tasks-index 行和 pin/archive/unread 归属为准，sessions-index 只补 detail，
 * 由 membershipVersion 驱动重拉。unread（setTaskUnread）与 rename 等走 task_meta_changed，
 * sessions-index 不携带 unread，故 task_meta_changed 也纳入归属重拉信号（低频）。
 * task_created 会增加 tasks-index 的正向行集合，必须在 task row/grouped order 提交后换代读取；
 * 不能只依赖 sessions-index detail 或旧的 query-cache 增量插入。
 * task_model_changed（切模型）与归属无关，显式排除——之前它混在 task_meta_changed
 * 里，切一次模型会全局 bump membershipVersion，所有列表实例连带重拉归属。
 */
export declare function shouldRefetchTaskListMembershipForWorkspaceEvent(event: Pick<ZCodeWorkspaceTaskListChanged, "reason">): boolean;
export declare function shouldRefreshTaskListForWorkspaceEvent(event: Pick<ZCodeWorkspaceTaskListChanged, "reason" | "taskId" | "taskMeta">): boolean;
export declare function getTaskMetaWorkspaceEventSyncMode(event: Pick<ZCodeWorkspaceTaskListChanged, "reason" | "taskMeta">): TaskMetaWorkspaceEventSyncMode | null;
export declare function shouldApplyTaskMetaFromWorkspaceEvent(event: Pick<ZCodeWorkspaceTaskListChanged, "reason" | "taskMeta">): event is Pick<ZCodeWorkspaceTaskListChanged, "reason"> & {
    taskMeta: NonNullable<ZCodeWorkspaceTaskListChanged["taskMeta"]>;
};
//# sourceMappingURL=taskListRefreshPolicy.d.ts.map