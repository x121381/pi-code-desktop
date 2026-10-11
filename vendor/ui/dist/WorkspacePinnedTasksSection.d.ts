import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function WorkspacePinnedTasksSection({ workspaceTabs, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, taskSortBy, mobileActiveTaskKey, onSelectTask, onOpenFileTree, }: {
    workspaceTabs: WorkspaceTabState[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    taskSortBy: "created" | "updated";
    mobileActiveTaskKey?: string | null;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string, expectedUnreadAt?: number) => void;
    onOpenFileTree?: (target: {
        workspacePath: string;
        workspaceName: string;
        workspaceIdentity?: string;
        workspaceRemoteSessionId?: string;
    }) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspacePinnedTasksSection.d.ts.map