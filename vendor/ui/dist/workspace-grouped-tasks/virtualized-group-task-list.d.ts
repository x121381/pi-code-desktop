import type { ZCodeTaskMeta } from "@zcode/shared";
import type { TaskGroupMenuItem } from "@/workspace-grouped-tasks/types.js";
declare const GROUPED_TASK_ROW_ESTIMATE_PX = 32;
declare const GROUPED_TASK_VIRTUALIZATION_THRESHOLD = 80;
declare function shouldVirtualizeGroupedTasks(taskCount: number): boolean;
export declare function VirtualizedGroupedTaskList({ tasks, groupId, groups, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, mobileActiveTaskKey, getTaskRemoteSessionId, getTaskWorkspaceLabel, onSelectTask, onCloseTask, onOpenFileTree, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, activeDragTaskKey, tooltipsDisabled, }: {
    tasks: ZCodeTaskMeta[];
    groupId: string;
    groups: TaskGroupMenuItem[];
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    mobileActiveTaskKey?: string | null;
    getTaskRemoteSessionId: (task: ZCodeTaskMeta) => string | undefined;
    getTaskWorkspaceLabel: (task: ZCodeTaskMeta) => string;
    onSelectTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    onCloseTask: (task: ZCodeTaskMeta) => void;
    onOpenFileTree?: (task: ZCodeTaskMeta) => void;
    onMoveTaskToGroup: (task: ZCodeTaskMeta, groupId: string | null) => void;
    onMoveTaskToTop: (task: ZCodeTaskMeta) => void;
    onStartRenameTask: (task: ZCodeTaskMeta) => void;
    onArchiveTask: (task: ZCodeTaskMeta) => void;
    onMarkTaskAsUnread: (task: ZCodeTaskMeta) => void;
    activeDragTaskKey?: string | null;
    tooltipsDisabled?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { GROUPED_TASK_ROW_ESTIMATE_PX, GROUPED_TASK_VIRTUALIZATION_THRESHOLD, shouldVirtualizeGroupedTasks, };
//# sourceMappingURL=virtualized-group-task-list.d.ts.map