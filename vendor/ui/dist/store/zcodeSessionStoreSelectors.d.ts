/**
 * ZCode Session Store 选择器与内部辅助函数
 *
 * 从 zcodeSessionStore.ts 拆分出来，包含 workspace 状态读取/更新辅助函数，
 * 以及所有按 task 粒度的只读访问器和独立选择器。
 */
import type { ZCodeTaskRuntimeStatus, ZCodeTaskMeta } from "@zcode/shared";
import { type ZCodeSessionStoreState, type WorkspaceInitState, type TaskRuntimeState, type WorkspaceZCodeUIState } from "./zcodeSessionStoreTypes.js";
export declare function resolveWorkspaceStateKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function getWorkspaceState(state: ZCodeSessionStoreState, workspacePath: string, workspaceIdentity?: string): WorkspaceZCodeUIState;
export declare function updateWorkspaceState(state: ZCodeSessionStoreState, workspacePath: string, updater: (current: WorkspaceZCodeUIState) => WorkspaceZCodeUIState, workspaceIdentity?: string): Pick<ZCodeSessionStoreState, "workspaces">;
export declare function getTaskRuntimeState(workspaceState: WorkspaceZCodeUIState, taskId: string): TaskRuntimeState;
interface WorkspaceDisplayedTaskState {
    taskStatus: ZCodeTaskRuntimeStatus;
    taskError: string | null;
}
export declare function getWorkspaceDisplayedTaskState(workspaceState: WorkspaceZCodeUIState): WorkspaceDisplayedTaskState;
export declare function getTaskUiState(workspaceState: WorkspaceZCodeUIState, taskId: string): import("./zcodeSessionStoreTypes.js").TaskUiState;
export declare function hasTaskPendingPermissionRequest(workspaceState: WorkspaceZCodeUIState, taskId: string): boolean;
export declare function hasTaskPendingHumanInterventionRequest(workspaceState: WorkspaceZCodeUIState, taskId: string): boolean;
export declare function getTaskMeta(workspaceState: WorkspaceZCodeUIState | Partial<Pick<WorkspaceZCodeUIState, "optimisticTaskListByTaskId" | "taskListCache">>, taskId: string): ZCodeTaskMeta | null;
export declare function getVisibleTaskMetas(workspaceState: WorkspaceZCodeUIState | Partial<Pick<WorkspaceZCodeUIState, "optimisticTaskListByTaskId" | "taskListCache">>): ZCodeTaskMeta[];
export declare function getTaskUnreadIndicator(workspaceState: WorkspaceZCodeUIState | Partial<Pick<WorkspaceZCodeUIState, "optimisticTaskListByTaskId" | "taskListCache" | "taskUnreadByTaskId">>, taskId: string, fallbackTask?: Pick<ZCodeTaskMeta, "unreadAt">): boolean;
export declare function selectWorkspaceZCodeState(state: ZCodeSessionStoreState, workspacePath: string, workspaceIdentity?: string): WorkspaceZCodeUIState;
export declare function getWorkspaceInitState(workspaceState: Pick<WorkspaceZCodeUIState, "workspaceInit">): WorkspaceInitState;
export {};
//# sourceMappingURL=zcodeSessionStoreSelectors.d.ts.map