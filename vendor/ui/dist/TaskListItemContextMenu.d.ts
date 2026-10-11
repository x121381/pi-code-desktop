export declare function TaskListItemContextMenu({ intl, isPinned, fileManagerLabel, taskSessionFile, activeSessionId, taskNativeSessionLogFile, providerConfigFile, onTogglePinTask, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, onOpenInSplitPane, openInSplitPaneDisabled, onOpenTaskFeedback, onOpenTaskPathInFileManager, onCopyWorkspacePath, onCopyTaskPath, onCopyTaskLogPath, onCopySessionId, onViewModelTrajectory, onOpenProviderConfig, disableTaskActions, disabledReason, }: {
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
    onTogglePinTask: () => void;
    onStartRenameTask: () => void;
    onArchiveTask: () => void;
    onMarkTaskAsUnread: () => void;
    /** 「在分屏打开」（仅桌面 shell 传入）。 */
    onOpenInSplitPane?: () => void;
    /** 叶子数达上限且该 session 未在任何 pane 时禁用。 */
    openInSplitPaneDisabled?: boolean;
    onOpenTaskFeedback: () => void;
    onOpenTaskPathInFileManager: () => void;
    onCopyWorkspacePath: () => void;
    onCopyTaskPath: () => void;
    onCopyTaskLogPath: () => void;
    onCopySessionId?: () => void;
    onViewModelTrajectory?: () => void;
    onOpenProviderConfig: () => void;
    disableTaskActions?: boolean;
    disabledReason?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TaskListItemContextMenu.d.ts.map