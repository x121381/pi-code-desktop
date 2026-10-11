import type { ZCodeTaskMeta } from "@zcode/shared";
export { deriveTaskLeadingIndicator } from "@/lib/taskListItemPresentation.js";
export declare const TaskList: import("react").MemoExoticComponent<({ workspacePath, remoteSessionId, workspaceIdentity, tasks, pinnedTasks, activeTaskId, sortBy, isWorkspaceActive, onSelectTask, showCreateButton, showFooter, showEmptyState, loading: inputLoading, hasMore, onShowMore, onRenameTask, onSetTaskPinned, onArchiveTask, onSetTaskUnread, mobileActiveTaskKey, readOnlyReason, }: {
    workspacePath: string;
    remoteSessionId?: string;
    workspaceIdentity?: string;
    tasks: ZCodeTaskMeta[];
    pinnedTasks?: ZCodeTaskMeta[];
    activeTaskId: string | null;
    sortBy?: "manual" | "created" | "updated";
    isWorkspaceActive?: boolean;
    onSelectTask: (taskId: string) => void;
    showCreateButton?: boolean;
    showFooter?: boolean;
    showEmptyState?: boolean;
    loading?: boolean;
    hasMore?: boolean;
    onShowMore?: () => void;
    onRenameTask: (taskId: string, title: string) => Promise<ZCodeTaskMeta | null>;
    onSetTaskPinned: (taskId: string, pinned: boolean) => Promise<ZCodeTaskMeta | null>;
    onArchiveTask: (taskId: string) => Promise<ZCodeTaskMeta | null>;
    onSetTaskUnread: (taskId: string, unread: boolean) => Promise<ZCodeTaskMeta | null>;
    mobileActiveTaskKey?: string | null;
    readOnlyReason?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=TaskList.d.ts.map