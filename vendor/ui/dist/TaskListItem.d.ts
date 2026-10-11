import { type ZCodeTaskMeta } from "@zcode/shared";
type TaskListItemIntl = {
    formatMessage: (desc: {
        id: string;
    }, values?: Record<string, string>) => string;
};
interface TaskListItemProps {
    workspacePath: string;
    remoteSessionId?: string;
    task: ZCodeTaskMeta;
    isPinned: boolean;
    isActive: boolean;
    isMobileActive?: boolean;
    onSelectTask: (taskId: string) => void;
    onArchiveTaskInline: (e: React.MouseEvent, taskId: string) => void;
    onCancelArchiveConfirm: () => void;
    isArchiveConfirming: boolean;
    onTogglePinTask: (taskId: string, pinned: boolean) => void;
    onStartRenameTask: (taskId: string, currentTitle: string) => void;
    onArchiveTask: (taskId: string) => void;
    onMarkTaskAsUnread: (taskId: string) => void;
    onOpenTaskContextMenu?: (taskId: string) => void;
    onOpenFileTree?: (task: ZCodeTaskMeta) => void;
    variant?: "default" | "timeline";
    showPinAction?: boolean;
    intl: TaskListItemIntl;
    actionsDisabled?: boolean;
    actionsDisabledReason?: string;
}
export declare const MemoTaskItem: import("react").MemoExoticComponent<({ workspacePath, remoteSessionId, task, isPinned, isActive, isMobileActive, onSelectTask, onArchiveTaskInline, onCancelArchiveConfirm, isArchiveConfirming, onTogglePinTask, onOpenTaskContextMenu, onOpenFileTree, variant, showPinAction, intl, actionsDisabled, actionsDisabledReason, }: TaskListItemProps) => import("react/jsx-runtime").JSX.Element>;
export declare function TaskListItemContextMenuContent({ workspacePath, remoteSessionId, task, isPinned, intl, onTogglePinTask, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, disableTaskActions, disabledReason, }: {
    workspacePath: string;
    remoteSessionId?: string;
    task: ZCodeTaskMeta;
    isPinned: boolean;
    intl: TaskListItemIntl;
    onTogglePinTask: (taskId: string, pinned: boolean) => void;
    onStartRenameTask: (taskId: string, currentTitle: string) => void;
    onArchiveTask: (taskId: string) => void;
    onMarkTaskAsUnread: (taskId: string) => void;
    disableTaskActions?: boolean;
    disabledReason?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TaskListItem.d.ts.map