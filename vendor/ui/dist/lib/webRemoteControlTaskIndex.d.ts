import type { ZCodeTaskRuntimeStatus, ZCodeTaskMeta, WebRemoteControlTaskTarget, WebRemoteControlWorkspaceTarget } from "@zcode/shared";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export interface WebRemoteControlWorkspaceTaskGroup {
    workspaceKey: string;
    workspace: WebRemoteControlWorkspaceTarget;
    tasks: WebRemoteControlTaskTarget[];
    hasUnread: boolean;
    totalTaskCount?: number;
    collapsed?: boolean;
}
export type WebRemoteControlTaskIndexSortBy = "created" | "updated";
export type WebRemoteControlTaskIndexViewMode = "workspace" | "timeline" | "archived";
export interface WebRemoteControlTaskIndexModel {
    pinnedTasks: WebRemoteControlTaskTarget[];
    groups: WebRemoteControlWorkspaceTaskGroup[];
    timelineTasks: WebRemoteControlTaskTarget[];
    archivedTasks: WebRemoteControlTaskTarget[];
    totalTaskCount: number;
}
export interface WebRemoteControlTaskMembership {
    pinned: boolean;
    archived: boolean;
}
export declare function getWebRemoteControlTaskMutationWorkspaceTargets({ activeWorkspaceIdentity, workspaces, }: {
    activeWorkspaceIdentity?: string;
    workspaces: WebRemoteControlWorkspaceTarget[];
}): WebRemoteControlWorkspaceTarget[];
export declare function shouldRetryWebRemoteControlTaskIndexLoad({ activeTaskId, attempt, maxAttempts, taskCount, }: {
    activeTaskId: string | null;
    attempt: number;
    maxAttempts: number;
    taskCount: number;
}): boolean;
type WebRemoteControlTaskRuntimeSnapshot = Partial<Record<string, {
    status: ZCodeTaskRuntimeStatus;
} | undefined>>;
type WebRemoteControlTaskRuntimeByWorkspaceKey = Partial<Record<string, WebRemoteControlTaskRuntimeSnapshot | undefined>>;
export declare function buildWebRemoteControlTaskRuntimeByWorkspaceKey(workspaces: Record<string, {
    taskRuntimeByTaskId: WebRemoteControlTaskRuntimeSnapshot;
} | undefined>): WebRemoteControlTaskRuntimeByWorkspaceKey;
export declare function buildWebRemoteControlTaskTargets({ workspaceTabs, tasks, taskRuntimeByWorkspaceKey, pinned, archived, }: {
    workspaceTabs: WorkspaceTabState[];
    tasks: ZCodeTaskMeta[];
    taskRuntimeByWorkspaceKey?: WebRemoteControlTaskRuntimeByWorkspaceKey;
    pinned?: boolean;
    archived?: boolean;
}): WebRemoteControlTaskTarget[];
export declare function compareWebRemoteControlTasksByTime(sortBy: WebRemoteControlTaskIndexSortBy): (left: WebRemoteControlTaskTarget, right: WebRemoteControlTaskTarget) => number;
export declare function sortWebRemoteControlTasksByTime(tasks: readonly WebRemoteControlTaskTarget[], sortBy: WebRemoteControlTaskIndexSortBy): WebRemoteControlTaskTarget[];
export declare function applyWebRemoteControlTaskMembershipUpdate({ result, target, membership, }: {
    result: {
        workspaces: WebRemoteControlWorkspaceTarget[];
        tasks?: WebRemoteControlTaskTarget[];
        activeWorkspaceKey?: string;
        activeTaskId?: string;
    };
    target: WebRemoteControlTaskTarget;
    membership: WebRemoteControlTaskMembership;
}): typeof result;
export declare function groupWebRemoteControlTasksByWorkspace({ workspaces, tasks, sortBy, }: {
    workspaces: WebRemoteControlWorkspaceTarget[];
    tasks: WebRemoteControlTaskTarget[];
    sortBy?: WebRemoteControlTaskIndexSortBy;
}): WebRemoteControlWorkspaceTaskGroup[];
export declare function buildWebRemoteControlTaskIndexModel({ result, viewMode, sortBy, searchQuery, collapsedWorkspaceKeys, }: {
    result: {
        workspaces: WebRemoteControlWorkspaceTarget[];
        tasks?: WebRemoteControlTaskTarget[];
    };
    viewMode: WebRemoteControlTaskIndexViewMode;
    sortBy?: WebRemoteControlTaskIndexSortBy;
    searchQuery?: string;
    collapsedWorkspaceKeys?: ReadonlySet<string>;
}): WebRemoteControlTaskIndexModel;
export {};
//# sourceMappingURL=webRemoteControlTaskIndex.d.ts.map