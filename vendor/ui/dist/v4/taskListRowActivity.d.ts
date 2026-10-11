import type { ZCodeTaskMeta } from "@zcode/shared";
import type { PendingInteractionSummary, SessionSummary, SessionWorkflowActivity } from "@zcode/shared/zcode-protocol-v4";
export declare const TASK_LIST_ROW_ACTIVITY_FIELD: "__zcodeSessionActivity";
export interface TaskListRowActivity {
    phase: SessionSummary["phase"];
    lastActivityAt: number;
    hasBackgroundWork: boolean;
    pendingInteractions?: PendingInteractionSummary;
    /** 侧栏工作流运行行的数据；无 run 时缺席。 */
    workflowActivity?: SessionWorkflowActivity;
}
export type TaskListMetaWithActivity = ZCodeTaskMeta & {
    [TASK_LIST_ROW_ACTIVITY_FIELD]: TaskListRowActivity;
};
export declare function attachTaskListRowActivity<T extends ZCodeTaskMeta>(task: T, activity: TaskListRowActivity): T & TaskListMetaWithActivity;
export declare function getTaskListRowActivity(task: ZCodeTaskMeta): TaskListRowActivity | null;
/** 只采信 sessions-index 的实时 phase；tasks-index 残留 status=running 不能置顶历史任务。 */
export declare function isTaskListRowRunning(task: ZCodeTaskMeta): boolean;
/**
 * 列表运行层的成员判定：回合在跑（prewarming/running）**或**挂着后台工作（hasBackgroundWork）。
 *
 * 动态工作流 run 是后台工作——启动轮收口后父会话 phase 已回到 completedSuccess，
 * 但每条 run 进度事件仍会推进 lastActivityAt。运行层若只看 phase，两个各跑一个 run 的会话
 * 都落在按 updatedAt 排序的非运行层，随进度事件互相换位。后台 bash / 分离子代理同理。
 * 转圈图标仍只认 phase（isTaskListRowRunning），这里只决定排序层。
 */
export declare function isTaskListRowActive(task: ZCodeTaskMeta): boolean;
export declare function getTaskListAttention(task: ZCodeTaskMeta): {
    kind: "permission" | "userInput";
    count: number;
} | null;
export declare function mergeTaskListMembershipFields(activityTask: ZCodeTaskMeta, membershipTask: ZCodeTaskMeta): ZCodeTaskMeta;
//# sourceMappingURL=taskListRowActivity.d.ts.map