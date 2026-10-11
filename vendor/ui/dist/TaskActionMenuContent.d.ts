interface TaskActionMenuItemProps {
    children: React.ReactNode;
    "data-testid"?: string;
    disabled?: boolean;
    onSelect?: () => void;
    title?: string;
}
interface TaskActionMenuSeparatorProps {
    key?: string;
}
export declare function TaskActionMenuContent({ intl, isPinned, fileManagerLabel, taskSessionFile, activeSessionId, taskNativeSessionLogFile, providerConfigFile, disableTaskActions, disableTaskTargetActions, disablePinTaskAction, disabledReason, hideMobileUnsupportedActions, Item, Separator, onTogglePinTask, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, onOpenInSplitPane, openInSplitPaneDisabled, onOpenTaskFeedback, onOpenTaskPathInFileManager, onCopyWorkspacePath, onCopyTaskPath, onCopyTaskLogPath, onCopySessionId, onViewModelTrajectory, onOpenProviderConfig, }: {
    intl: {
        formatMessage: (desc: {
            id: string;
        }, values?: Record<string, string>) => string;
    };
    isPinned: boolean;
    fileManagerLabel: string;
    taskSessionFile: {
        loading: boolean;
        path: string | null;
        exists: boolean;
    };
    activeSessionId?: string | null;
    taskNativeSessionLogFile: {
        loading: boolean;
        path: string | null;
        exists: boolean;
    };
    providerConfigFile: {
        loading: boolean;
        path: string | null;
        exists: boolean;
    };
    disableTaskActions?: boolean;
    disableTaskTargetActions?: boolean;
    disablePinTaskAction?: boolean;
    disabledReason?: string;
    hideMobileUnsupportedActions?: boolean;
    Item: React.ComponentType<TaskActionMenuItemProps>;
    Separator: React.ComponentType<TaskActionMenuSeparatorProps>;
    onTogglePinTask: () => void;
    onStartRenameTask: () => void;
    onArchiveTask: () => void;
    onMarkTaskAsUnread: () => void;
    /** 「在分屏打开」（仅桌面 shell 传入；手机远控不显示该入口）。 */
    onOpenInSplitPane?: () => void;
    /** 当前 session 或 pane 数达上限且目标无已有归属时禁用（保留布局与层级）。 */
    openInSplitPaneDisabled?: boolean;
    onOpenTaskFeedback?: () => void;
    onOpenTaskPathInFileManager: () => void;
    onCopyWorkspacePath: () => void;
    onCopyTaskPath: () => void;
    onCopyTaskLogPath: () => void;
    onCopySessionId?: () => void;
    onViewModelTrajectory?: () => void;
    onOpenProviderConfig: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TaskActionMenuContent.d.ts.map