import type { ZCodeTaskMeta } from "@zcode/shared";
import type { TaskGroupMenuItem } from "@/workspace-grouped-tasks/types.js";
export declare function GroupedTaskContextMenuContent({ task, currentGroupId, groups, intl, fileManagerLabel, taskSessionFile, taskNativeSessionLogFile, providerConfigFile, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, onOpenTaskPathInFileManager, onCopyText, onOpenProviderConfig, onOpenTaskFeedback, disabledReason, }: {
    task: ZCodeTaskMeta;
    currentGroupId?: string;
    groups: TaskGroupMenuItem[];
    intl: {
        formatMessage: (desc: {
            id: string;
        }) => string;
    };
    fileManagerLabel: string;
    taskSessionFile: {
        loading: boolean;
        path: string | null;
    };
    taskNativeSessionLogFile: {
        loading: boolean;
        path: string | null;
    };
    providerConfigFile: {
        loading: boolean;
        path: string | null;
    };
    onMoveTaskToGroup: (task: ZCodeTaskMeta, groupId: string | null) => void;
    onMoveTaskToTop: (task: ZCodeTaskMeta) => void;
    onStartRenameTask: (task: ZCodeTaskMeta) => void;
    onArchiveTask: (task: ZCodeTaskMeta) => void;
    onMarkTaskAsUnread: (task: ZCodeTaskMeta) => void;
    onOpenTaskPathInFileManager: () => void;
    onCopyText: (label: string, text: string | null) => void;
    onOpenProviderConfig: () => void;
    onOpenTaskFeedback: () => void;
    disabledReason?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=task-context-menu-content.d.ts.map