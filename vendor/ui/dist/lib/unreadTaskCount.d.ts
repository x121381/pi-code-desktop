import type { WorkspaceZCodeUIState } from "@/store/zcodeSessionStoreTypes.js";
type WorkspaceUnreadState = Pick<WorkspaceZCodeUIState, "optimisticTaskListByTaskId" | "taskListCache"> & Partial<Pick<WorkspaceZCodeUIState, "taskUnreadByTaskId">>;
export declare function countWorkspaceUnreadTasks(workspace: WorkspaceUnreadState): number;
export declare function countAllUnreadTasks(workspaces: Record<string, WorkspaceUnreadState>): number;
export {};
//# sourceMappingURL=unreadTaskCount.d.ts.map