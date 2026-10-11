import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TID_V4_TASK_OPEN_IN_SPLIT } from "@zcode/shared";
export function TaskActionMenuContent({ intl, isPinned, fileManagerLabel, taskSessionFile, activeSessionId, taskNativeSessionLogFile, providerConfigFile, disableTaskActions = false, disableTaskTargetActions = false, disablePinTaskAction = false, disabledReason, hideMobileUnsupportedActions = false, Item, Separator, onTogglePinTask, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, onOpenInSplitPane, openInSplitPaneDisabled = false, onOpenTaskFeedback, onOpenTaskPathInFileManager, onCopyWorkspacePath, onCopyTaskPath, onCopyTaskLogPath, onCopySessionId, onViewModelTrajectory, onOpenProviderConfig, }) {
    const taskTargetActionsDisabled = disableTaskActions || disableTaskTargetActions;
    return (_jsxs(_Fragment, { children: [_jsx(Item, { disabled: taskTargetActionsDisabled || disablePinTaskAction, title: taskTargetActionsDisabled ? disabledReason : undefined, onSelect: () => {
                    if (!taskTargetActionsDisabled && !disablePinTaskAction) {
                        onTogglePinTask();
                    }
                }, children: intl.formatMessage({ id: isPinned ? "taskList.unpin" : "taskList.pin" }) }), _jsx(Item, { disabled: taskTargetActionsDisabled, title: disabledReason, onSelect: () => {
                    if (!taskTargetActionsDisabled) {
                        onStartRenameTask();
                    }
                }, children: intl.formatMessage({ id: "taskList.rename" }) }), _jsx(Item, { disabled: taskTargetActionsDisabled, title: disabledReason, onSelect: () => {
                    if (!taskTargetActionsDisabled) {
                        onArchiveTask();
                    }
                }, children: intl.formatMessage({ id: "taskList.archive" }) }), _jsx(Item, { disabled: taskTargetActionsDisabled, title: disabledReason, onSelect: () => {
                    if (!taskTargetActionsDisabled) {
                        onMarkTaskAsUnread();
                    }
                }, children: intl.formatMessage({ id: "taskList.markAsUnread" }) }), onOpenInSplitPane ? (_jsx(Item, { "data-testid": TID_V4_TASK_OPEN_IN_SPLIT, disabled: taskTargetActionsDisabled || openInSplitPaneDisabled, onSelect: onOpenInSplitPane, children: intl.formatMessage({ id: "taskList.openInSplitPane" }) })) : null, _jsx(Separator, {}), !hideMobileUnsupportedActions ? (_jsx(Item, { disabled: disableTaskActions, title: disableTaskActions ? disabledReason : undefined, onSelect: () => {
                    if (!disableTaskActions) {
                        onOpenTaskPathInFileManager();
                    }
                }, children: fileManagerLabel })) : null, _jsx(Item, { disabled: disableTaskActions, title: disableTaskActions ? disabledReason : undefined, onSelect: onCopyWorkspacePath, children: intl.formatMessage({ id: "appHeader.copyPath" }) }), _jsx(Item, { disabled: taskTargetActionsDisabled ||
                    taskSessionFile.loading ||
                    !taskSessionFile.path, title: taskTargetActionsDisabled ? disabledReason : undefined, onSelect: onCopyTaskPath, children: intl.formatMessage({ id: "appHeader.copyTaskPath" }) }), _jsx(Item, { disabled: taskTargetActionsDisabled ||
                    taskNativeSessionLogFile.loading ||
                    !taskNativeSessionLogFile.path, title: taskTargetActionsDisabled ? disabledReason : undefined, onSelect: onCopyTaskLogPath, children: intl.formatMessage({ id: "appHeader.copyLogPath" }) }), onCopySessionId ? (_jsx(Item, { disabled: taskTargetActionsDisabled || !activeSessionId, title: taskTargetActionsDisabled ? disabledReason : undefined, onSelect: onCopySessionId, children: intl.formatMessage({ id: "appHeader.copySessionId" }) })) : null, !hideMobileUnsupportedActions ? (_jsx(Item, { disabled: disableTaskActions ||
                    providerConfigFile.loading ||
                    !providerConfigFile.path, title: disableTaskActions ? disabledReason : undefined, onSelect: () => {
                    if (!disableTaskActions) {
                        onOpenProviderConfig();
                    }
                }, children: _jsx("span", { className: "truncate", children: intl.formatMessage({ id: "appHeader.goToProviderConfig" }) }) })) : null, onViewModelTrajectory ? (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsx(Item, { disabled: taskTargetActionsDisabled || !activeSessionId, title: taskTargetActionsDisabled ? disabledReason : undefined, onSelect: onViewModelTrajectory, children: intl.formatMessage({ id: "taskList.viewModelTrajectory" }) })] })) : null, onOpenTaskFeedback ? (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsx(Item, { disabled: taskTargetActionsDisabled, onSelect: onOpenTaskFeedback, children: intl.formatMessage({ id: "taskList.feedback" }) })] })) : null] }));
}
//# sourceMappingURL=TaskActionMenuContent.js.map