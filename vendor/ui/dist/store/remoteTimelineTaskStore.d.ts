import type { ZCodeTaskMeta } from "@zcode/shared";
import type { ZCodeTaskListSortBy, IZCodeTaskService } from "@zcode/services";
interface RemoteTimelineTaskState {
    itemsByWorkspaceKey: Record<string, ZCodeTaskMeta[]>;
    totalByWorkspaceKey: Record<string, number>;
    hasMoreByWorkspaceKey: Record<string, boolean>;
    loadingByWorkspaceKey: Record<string, boolean>;
    errorByWorkspaceKey: Record<string, string>;
    refreshWorkspace: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        zcodeTaskService: Pick<IZCodeTaskService, "listTaskList">;
        sortBy: ZCodeTaskListSortBy;
        limit?: number;
    }) => Promise<void>;
    upsertTask: (task: ZCodeTaskMeta, sortBy?: ZCodeTaskListSortBy) => void;
    removeTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    clearWorkspace: (workspacePath: string, workspaceIdentity?: string) => void;
}
export declare const useRemoteTimelineTaskStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RemoteTimelineTaskState>>;
export declare function refreshRemoteTimelineTasksForSession({ sessionId, workspacePath, workspaceIdentity, sortBy, limit, }: {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    sortBy?: ZCodeTaskListSortBy;
    limit?: number;
}): Promise<void>;
export {};
//# sourceMappingURL=remoteTimelineTaskStore.d.ts.map