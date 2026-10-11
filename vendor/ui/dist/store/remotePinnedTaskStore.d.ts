import type { ZCodeTaskMeta } from "@zcode/shared";
import type { IZCodeTaskService } from "@zcode/services";
interface RemotePinnedTaskState {
    itemsByWorkspaceKey: Record<string, ZCodeTaskMeta[]>;
    loadingByWorkspaceKey: Record<string, boolean>;
    errorByWorkspaceKey: Record<string, string>;
    refreshWorkspace: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        zcodeTaskService: Pick<IZCodeTaskService, "listPinnedTasks">;
    }) => Promise<void>;
    upsertTask: (task: ZCodeTaskMeta) => void;
    removeTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    clearWorkspace: (workspacePath: string, workspaceIdentity?: string) => void;
}
export declare const useRemotePinnedTaskStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RemotePinnedTaskState>>;
export declare function refreshRemotePinnedTasksForSession({ sessionId, workspacePath, workspaceIdentity, }: {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
}): Promise<void>;
export {};
//# sourceMappingURL=remotePinnedTaskStore.d.ts.map