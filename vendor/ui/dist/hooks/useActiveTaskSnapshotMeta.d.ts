import type { ZCodeTaskMeta } from "@zcode/shared";
export declare function resolveImmediateActiveTaskSnapshotMeta(previousSnapshotMeta: ZCodeTaskMeta | null, taskId: string | null, taskMetaFromLists?: ZCodeTaskMeta | null): ZCodeTaskMeta | null;
/**
 * 为当前激活 task 提供一层 snapshot meta 兜底。
 *
 * archived task 不在普通 taskListCache / pinnedTasks 数据源里，
 * 直接打开时 App 只靠列表元数据会拿不到标题、provider、traceId 等字段。
 * 这里在列表里找不到当前任务时，额外读取一次 snapshot.meta 作为展示兜底，
 * 只服务当前激活任务，不把 archived task 混回普通列表。
 */
export declare function useActiveTaskSnapshotMeta(workspacePath: string, taskId: string | null, preferredRemoteSessionId?: string | null, workspaceIdentity?: string, taskMetaFromLists?: ZCodeTaskMeta | null): ZCodeTaskMeta | null;
//# sourceMappingURL=useActiveTaskSnapshotMeta.d.ts.map