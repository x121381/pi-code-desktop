import type { ZCodeWorkspaceTaskListChanged } from "@zcode/shared";
export interface TaskListWorkspaceEventCacheSyncResult {
    shouldRefresh: boolean;
    handledIncrementally: boolean;
    reused: boolean;
}
export declare function handleTaskListWorkspaceEventCacheSync(event: ZCodeWorkspaceTaskListChanged): TaskListWorkspaceEventCacheSyncResult;
export declare function clearTaskListWorkspaceEventCoordinatorForTest(): void;
//# sourceMappingURL=taskListWorkspaceEventCoordinator.d.ts.map