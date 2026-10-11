import type { WebRemoteControlTaskDisplayStatus, WebRemoteControlTaskTarget, WebRemoteControlWorkspaceListResult } from "@zcode/shared";
import { type WebRemoteControlWorkspaceTaskGroup } from "@/lib/webRemoteControlTaskIndex.js";
export declare const EMPTY_WEB_REMOTE_CONTROL_WORKSPACE_LIST: WebRemoteControlWorkspaceListResult;
interface WebRemoteControlMobileTaskHomeModel {
    activeTaskId: string | null;
    activeWorkspaceKey: string;
    defaultExpandedWorkspaceKeys: Set<string>;
    pinnedTasks: WebRemoteControlTaskTarget[];
    timelineTasks: WebRemoteControlTaskTarget[];
    groups: WebRemoteControlWorkspaceTaskGroup[];
    totalTaskCount: number;
    totalWorkspaceCount: number;
}
export type WebRemoteControlMobileTaskSortBy = "created" | "updated";
export type WebRemoteControlMobileTaskOrganizeBy = "workspace" | "timeline";
export type WebRemoteControlMobileTaskHomePreferences = {
    organizeBy: WebRemoteControlMobileTaskOrganizeBy;
    sortBy: WebRemoteControlMobileTaskSortBy;
};
interface StorageLike {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
}
export declare function readWebRemoteControlMobileTaskHomePreferences(storage?: StorageLike | null): WebRemoteControlMobileTaskHomePreferences;
export declare function persistWebRemoteControlMobileTaskHomePreferences(preferences: WebRemoteControlMobileTaskHomePreferences, storage?: StorageLike | null): void;
export declare function buildWebRemoteControlMobileTaskHomeModel({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, sortBy, result, }: {
    activeTaskId: string | null;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    sortBy?: WebRemoteControlMobileTaskSortBy;
    result: WebRemoteControlWorkspaceListResult;
}): WebRemoteControlMobileTaskHomeModel;
export declare function hasWebRemoteControlMobileTaskHomeActiveTaskMatch(model: Pick<WebRemoteControlMobileTaskHomeModel, "activeTaskId" | "activeWorkspaceKey" | "groups" | "pinnedTasks">): boolean;
export declare function getWebRemoteControlTaskStatusClassName(status: WebRemoteControlTaskDisplayStatus): "border-brand/40 bg-accent text-foreground" | "border-success/40 bg-success text-success-foreground" | "border-destructive/40 bg-destructive text-destructive-foreground" | "border-border bg-surface text-foreground-subtle";
export declare function getWorkspaceLatestUpdatedAt(tasks: readonly WebRemoteControlTaskTarget[]): number | null;
export {};
//# sourceMappingURL=webRemoteControlMobileTaskHome.d.ts.map