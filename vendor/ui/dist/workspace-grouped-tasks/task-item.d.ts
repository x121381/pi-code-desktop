import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ZCodeTaskMeta } from "@zcode/shared";
import type { TaskGroupMenuItem } from "@/workspace-grouped-tasks/shared.js";
export declare function EmptyGroupDropZone({ groupId, onCreateTask, }: {
    groupId: string;
    onCreateTask: () => void;
}): import("react/jsx-runtime").JSX.Element;
declare function GroupedTaskItemComponent({ task, groupId, groups, remoteSessionId, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, mobileActiveTaskKey, workspaceLabel, onSelectTask, onCloseTask, onOpenFileTree, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, dragId, dragging, dragOverlay, tooltipsDisabled, }: {
    task: ZCodeTaskMeta;
    groupId?: string;
    groups: TaskGroupMenuItem[];
    remoteSessionId?: string;
    activeWorkspacePath: string;
    activeWorkspaceIdentity?: string;
    activeTaskId: string | null;
    mobileActiveTaskKey?: string | null;
    workspaceLabel: string;
    onSelectTask: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    onCloseTask: (task: ZCodeTaskMeta) => void;
    onOpenFileTree?: (task: ZCodeTaskMeta) => void;
    onMoveTaskToGroup: (task: ZCodeTaskMeta, groupId: string | null) => void;
    onMoveTaskToTop: (task: ZCodeTaskMeta) => void;
    onStartRenameTask: (task: ZCodeTaskMeta) => void;
    onArchiveTask: (task: ZCodeTaskMeta) => void;
    onMarkTaskAsUnread: (task: ZCodeTaskMeta) => void;
    dragId?: UniqueIdentifier;
    dragging?: boolean;
    dragOverlay?: boolean;
    tooltipsDisabled?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare const GroupedTaskItem: import("react").MemoExoticComponent<typeof GroupedTaskItemComponent>;
export {};
//# sourceMappingURL=task-item.d.ts.map