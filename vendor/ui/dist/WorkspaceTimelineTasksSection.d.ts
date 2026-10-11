import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function WorkspaceTimelineTasksSection({ workspaceTabs, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, taskSortBy, groupByDate, taskRowVariant, emptyMessage, mobileActiveTaskKey, onSelectTask, }: {
    workspaceTabs: WorkspaceTabState[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    taskSortBy: "created" | "updated";
    groupByDate?: boolean;
    taskRowVariant?: "default" | "timeline";
    emptyMessage?: string;
    mobileActiveTaskKey?: string | null;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string, expectedUnreadAt?: number) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceTimelineTasksSection.d.ts.map