import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function WorkspaceArchivedTasksFlatSection({ workspaceTabs, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, sortBy, mobileActiveTaskKey, actionsContainer, onSelectTask, }: {
    workspaceTabs: WorkspaceTabState[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    sortBy: "created" | "updated";
    mobileActiveTaskKey?: string | null;
    actionsContainer?: HTMLElement | null;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceArchivedTasksFlatSection.d.ts.map