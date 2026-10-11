import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, } from "@/components/ui/context-menu.js";
import { TaskGroupColorDot } from "@/workspace-grouped-tasks/colors.js";
export function GroupedTaskContextMenuContent({ task, currentGroupId, groups, intl, fileManagerLabel, taskSessionFile, taskNativeSessionLogFile, providerConfigFile, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, onOpenTaskPathInFileManager, onCopyText, onOpenProviderConfig, onOpenTaskFeedback, disabledReason, }) {
    return (_jsxs(ContextMenuContent, { className: "w-56", children: [_jsxs(ContextMenuSub, { children: [_jsx(ContextMenuSubTrigger, { disabled: Boolean(disabledReason), title: disabledReason, children: intl.formatMessage({ id: "taskGroup.moveToGroup" }) }), _jsxs(ContextMenuSubContent, { className: "w-52", children: [_jsx(ContextMenuItem, { disabled: Boolean(disabledReason) || !currentGroupId, title: disabledReason, onSelect: () => {
                                    if (!disabledReason) {
                                        onMoveTaskToGroup(task, null);
                                    }
                                }, children: intl.formatMessage({ id: "taskGroup.removeFromGroup" }) }), _jsx(ContextMenuSeparator, {}), groups.map((group) => (_jsxs(ContextMenuItem, { disabled: Boolean(disabledReason) || group.id === currentGroupId, title: disabledReason, onSelect: () => {
                                    if (!disabledReason) {
                                        onMoveTaskToGroup(task, group.id);
                                    }
                                }, children: [_jsx(TaskGroupColorDot, { color: group.color }), _jsx("span", { className: "truncate", children: group.title })] }, group.id)))] })] }), _jsx(ContextMenuItem, { disabled: Boolean(disabledReason), title: disabledReason, onSelect: () => {
                    if (!disabledReason) {
                        onMoveTaskToTop(task);
                    }
                }, children: intl.formatMessage({ id: "taskGroup.moveToTop" }) }), _jsx(ContextMenuSeparator, {}), _jsx(ContextMenuItem, { disabled: Boolean(disabledReason), title: disabledReason, onSelect: () => {
                    if (!disabledReason) {
                        onStartRenameTask(task);
                    }
                }, children: intl.formatMessage({ id: "taskList.rename" }) }), _jsx(ContextMenuItem, { disabled: Boolean(disabledReason), title: disabledReason, onSelect: () => {
                    if (!disabledReason) {
                        onArchiveTask(task);
                    }
                }, children: intl.formatMessage({ id: "taskList.archive" }) }), _jsx(ContextMenuItem, { disabled: Boolean(disabledReason), title: disabledReason, onSelect: () => {
                    if (!disabledReason) {
                        onMarkTaskAsUnread(task);
                    }
                }, children: intl.formatMessage({ id: "taskList.markAsUnread" }) }), _jsx(ContextMenuSeparator, {}), _jsx(ContextMenuItem, { disabled: Boolean(disabledReason), title: disabledReason, onSelect: () => {
                    if (!disabledReason) {
                        onOpenTaskPathInFileManager();
                    }
                }, children: fileManagerLabel }), _jsx(ContextMenuItem, { onSelect: () => onCopyText(intl.formatMessage({ id: "appHeader.copyPath" }), task.workspacePath), children: intl.formatMessage({ id: "appHeader.copyPath" }) }), _jsx(ContextMenuItem, { disabled: taskSessionFile.loading || !taskSessionFile.path, onSelect: () => onCopyText(intl.formatMessage({ id: "appHeader.copyTaskPath" }), taskSessionFile.path), children: intl.formatMessage({ id: "appHeader.copyTaskPath" }) }), _jsx(ContextMenuItem, { disabled: taskNativeSessionLogFile.loading || !taskNativeSessionLogFile.path, onSelect: () => onCopyText(intl.formatMessage({ id: "appHeader.copyLogPath" }), taskNativeSessionLogFile.path), children: intl.formatMessage({ id: "appHeader.copyLogPath" }) }), _jsx(ContextMenuItem, { onSelect: () => onCopyText(intl.formatMessage({ id: "appHeader.copySessionId" }), task.taskId), children: intl.formatMessage({ id: "appHeader.copySessionId" }) }), _jsx(ContextMenuItem, { disabled: providerConfigFile.loading || !providerConfigFile.path, onSelect: onOpenProviderConfig, children: _jsx("span", { className: "truncate", children: intl.formatMessage({ id: "appHeader.goToProviderConfig" }) }) }), _jsx(ContextMenuSeparator, {}), _jsx(ContextMenuItem, { onSelect: onOpenTaskFeedback, children: intl.formatMessage({ id: "taskList.feedback" }) })] }));
}
//# sourceMappingURL=task-context-menu-content.js.map