import type { UniqueIdentifier } from "@dnd-kit/core";
import { type ZCodeTaskMeta } from "@zcode/shared";
import { type TaskGroupMenuItem } from "@/workspace-grouped-tasks/types.js";
declare function GroupedTaskRowComponent({ task, currentGroupId, groups, remoteSessionId, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, mobileActiveTaskKey, workspaceLabel, onSelectTask, onCloseTask, onOpenFileTree, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, dragId, dragging, dragOverlay, tooltipsDisabled, }: {
    task: ZCodeTaskMeta;
    currentGroupId?: string;
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
export declare const GroupedTaskRow: import("react").MemoExoticComponent<typeof GroupedTaskRowComponent>;
export {};
//# sourceMappingURL=task-row.d.ts.map