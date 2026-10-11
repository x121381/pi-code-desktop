import type { InputId, ZCodeProvider, ZCodeTaskMeta } from "@zcode/shared";
import { type TaskListMembershipState } from "@/store/taskQueryCacheStore.js";
export declare function syncTaskMetaToTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    task: ZCodeTaskMeta;
    membership?: TaskListMembershipState;
    forceInsertMembership?: boolean;
    ensureInWorkspaceTaskCache?: boolean;
    preserveListMembership?: boolean;
    applyQueryCacheMutation?: boolean;
}): void;
export declare function syncTaskMembershipEventToTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    task: ZCodeTaskMeta;
    reason: "task_archived" | "task_unarchived" | "task_pinned" | "task_unpinned";
}): void;
export declare function removeTaskFromTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
}): boolean;
export declare function patchTaskMetaInTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
    patch: (task: ZCodeTaskMeta) => Partial<ZCodeTaskMeta>;
}): ZCodeTaskMeta | null;
export declare function insertTaskIntoTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    task: ZCodeTaskMeta;
    membership: TaskListMembershipState;
}): void;
export declare function initializeBackgroundTaskInTaskCaches(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    task: ZCodeTaskMeta;
    provider: ZCodeProvider;
    activeInputId: InputId;
}): void;
//# sourceMappingURL=taskListMetaSync.d.ts.map