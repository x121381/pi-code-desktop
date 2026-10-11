import type { ZCodeTaskMeta } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
import type { GroupedDraftTaskState } from "@/store/zcodeSessionStoreTypes.js";
export interface WorkspaceOptimisticTaskOverlay {
    activeTaskId: string | null;
    tasks: ZCodeTaskMeta[];
    promotedGroupedDraftTaskByTaskId: Record<string, GroupedDraftTaskState>;
}
type WorkspaceTaskListSortBy = "created" | "updated";
export declare function mergeWorkspaceTaskListItemsWithOptimistic(params: {
    items: readonly ZCodeTaskMeta[];
    optimisticTasks: readonly ZCodeTaskMeta[];
    activeTaskId: string | null;
    sortBy: WorkspaceTaskListSortBy;
    visibleLimit: number | null;
}): ZCodeTaskMeta[];
export declare function useWorkspaceTaskOptimisticOverlayByWorkspaceKey(workspaceTabs: WorkspaceTabState[]): Map<string, WorkspaceOptimisticTaskOverlay>;
export {};
//# sourceMappingURL=workspaceTaskListOptimisticOverlay.d.ts.map