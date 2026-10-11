import type { ZCodeTaskListItem } from "@zcode/services";
import type { ZCodeTaskMeta } from "@zcode/shared";
import { type CachedTaskListResult, type TaskListCacheDescriptor, type TaskEntityKey, type TaskListCacheKey } from "@/lib/taskQueryCache.js";
export interface TaskListMembershipState {
    pinned: boolean;
    archived: boolean;
}
interface TaskQueryCacheState {
    resultsByQueryKey: Record<TaskListCacheKey, CachedTaskListResult>;
    taskMetaByEntityKey: Record<TaskEntityKey, CachedTaskListItem>;
    /** 覆盖正在提交或等待 membership 确认的 unreadAt 字段；null 表示清除。 */
    taskUnreadOverlayByEntityKey: Record<TaskEntityKey, number | null>;
    setQueryResult: (params: {
        queryKey: TaskListCacheKey;
        descriptor: TaskListCacheDescriptor;
        items: CachedTaskListItem[];
        total: number;
        hasMore: boolean;
        unreadTaskKeys?: TaskEntityKey[];
        partial?: boolean;
        loadingShardKeys?: string[];
        failedShardKeys?: string[];
    }) => void;
    setQueryResults: (entries: Array<{
        queryKey: TaskListCacheKey;
        descriptor: TaskListCacheDescriptor;
        items: CachedTaskListItem[];
        total: number;
        hasMore: boolean;
        unreadTaskKeys?: TaskEntityKey[];
        partial?: boolean;
        loadingShardKeys?: string[];
        failedShardKeys?: string[];
        /** 该异步查询启动时观察到的 invalidationVersion；不匹配时整条结果丢弃。 */
        expectedInvalidationVersion?: number;
    }>) => void;
    upsertTaskMeta: (task: ZCodeTaskMeta) => void;
    updateTaskMetaPreservingMembership: (task: ZCodeTaskMeta) => void;
    applyTaskMutation: (params: {
        previousTask: ZCodeTaskMeta;
        nextTask: ZCodeTaskMeta;
        previousState: TaskListMembershipState;
        nextState: TaskListMembershipState;
    }) => void;
    setTaskUnreadOverlay: (task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined) => void;
    reconcileTaskUnread: (task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined) => void;
    rollbackTaskUnread: (task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined) => void;
    removeTask: (task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">) => boolean;
    markWorkspaceKeysStale: (workspaceKeys: string[]) => void;
    invalidateWorkspaceKeys: (workspaceKeys: string[]) => void;
    clearAll: () => void;
}
type CachedTaskListItem = ZCodeTaskListItem & {
    searchSnippets?: string[];
};
export declare const useTaskQueryCacheStore: import("zustand").UseBoundStore<import("zustand").StoreApi<TaskQueryCacheState>>;
export declare function selectTaskListCacheResult(queryKey: TaskListCacheKey): (state: TaskQueryCacheState) => CachedTaskListResult | null;
export declare function invalidateTaskQueryCacheByScopes(scopes: Array<{
    workspacePath: string;
    workspaceIdentity?: string;
}>): void;
export declare function markTaskQueryCacheScopesStale(scopes: Array<{
    workspacePath: string;
    workspaceIdentity?: string;
}>): void;
export declare function upsertTaskQueryCacheTaskMeta(task: ZCodeTaskMeta): void;
export declare function updateTaskQueryCacheTaskMetaPreservingMembership(task: ZCodeTaskMeta): void;
export declare function applyTaskQueryCacheMutation(params: {
    previousTask: ZCodeTaskMeta;
    nextTask: ZCodeTaskMeta;
    previousState: TaskListMembershipState;
    nextState: TaskListMembershipState;
}): void;
export declare function setTaskQueryCacheUnreadOverlay(task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined): void;
export declare function reconcileTaskQueryCacheUnread(task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined): void;
export declare function rollbackTaskQueryCacheUnread(task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">, unreadAt: number | undefined): void;
export declare function removeTaskFromTaskQueryCaches(task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">): boolean;
export {};
//# sourceMappingURL=taskQueryCacheStore.d.ts.map