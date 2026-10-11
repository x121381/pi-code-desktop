import type { IZCodeTaskService } from "@zcode/services";
import type { ZCodeWorkspaceTaskListChanged } from "@zcode/shared";
type TaskUnreadService = Pick<IZCodeTaskService, "setTaskUnread">;
export declare function shouldMarkStatusEventTaskUnread(params: {
    activeTaskId: string | null;
    activeWorkspace: {
        workspacePath: string;
        workspaceIdentity?: string;
    };
    event: ZCodeWorkspaceTaskListChanged;
}): boolean;
export declare function syncTaskUnreadFromStatusWorkspaceEvent(params: {
    activeWorkspace: {
        workspacePath: string;
        workspaceIdentity?: string;
    };
    event: ZCodeWorkspaceTaskListChanged;
    service: TaskUnreadService;
}): void;
export declare function resetTaskStatusUnreadSyncForTest(): void;
export {};
//# sourceMappingURL=taskStatusUnreadSync.d.ts.map