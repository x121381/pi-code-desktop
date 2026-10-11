import type { ZCodeTaskListKind, ZCodeTaskListSortBy, ZCodeTaskListWorkspaceScope } from "@zcode/services";
import type { ZCodeTaskMeta } from "@zcode/shared";
export type TaskEntityKey = string;
export type TaskListCacheKey = string;
export type TaskListQueryKind = ZCodeTaskListKind | "workspace";
export interface TaskListCacheDescriptor {
    kind: TaskListQueryKind;
    sortBy: ZCodeTaskListSortBy;
    search: string;
    expanded: boolean;
    visibleLimit: number | null;
    workspaceKeys: string[];
}
export interface CachedTaskListResult {
    taskKeys: TaskEntityKey[];
    /** workspace 分页前的完整未读成员；其它列表查询可省略。 */
    unreadTaskKeys?: TaskEntityKey[];
    searchSnippetsByTaskKey?: Record<TaskEntityKey, string>;
    searchSnippetListsByTaskKey?: Record<TaskEntityKey, string[]>;
    total: number;
    hasMore: boolean;
    fetchedAt: number;
    /** 每次 query scope 失效都递增；旧异步结果只能提交到它启动时观察到的代次。 */
    invalidationVersion: number;
    stale: boolean;
    partial: boolean;
    loadingShardKeys: string[];
    failedShardKeys: string[];
    descriptor: TaskListCacheDescriptor;
}
export declare function buildTaskWorkspaceKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function buildTaskEntityKey(task: Pick<ZCodeTaskMeta, "taskId" | "workspacePath" | "workspaceIdentity">): TaskEntityKey;
export declare function normalizeTaskListWorkspaceScopes(scopes: ZCodeTaskListWorkspaceScope[]): ZCodeTaskListWorkspaceScope[];
export declare function buildTaskListCacheDescriptor(params: {
    kind: TaskListQueryKind;
    workspaceScopes: ZCodeTaskListWorkspaceScope[];
    sortBy: ZCodeTaskListSortBy;
    search?: string;
    expanded: boolean;
    visibleLimit?: number | null;
}): TaskListCacheDescriptor;
export declare function buildTaskListCacheKeyFromDescriptor(descriptor: TaskListCacheDescriptor): TaskListCacheKey;
//# sourceMappingURL=taskQueryCache.d.ts.map