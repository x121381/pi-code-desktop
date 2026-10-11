import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Archive, ArchiveX, CloudDownload, LoaderIcon, Pin, Trash2, } from "lucide-react";
import { TID_TASK_ARCHIVE, TID_TASK_ITEM, resolveWebRemoteControlWorkspaceKey, testId, } from "@zcode/shared";
import { useCallback, useState, } from "react";
import { cn } from "./components/lib/utils.js";
import { Button } from "./components/ui/button.js";
import { ControlHintTooltip } from "./ControlHintTooltip.js";
import { formatTaskRelativeTime } from "./lib/taskListItemPresentation.js";
import { buildWebRemoteControlTaskRowKey } from "./hooks/useWebRemoteControlTaskOpen.js";
import { TaskWorkflowRunLines } from "./components/workflow-run-line/TaskWorkflowRunLines.js";
export function WebRemoteControlTaskIndexRow({ activeTaskId, activeWorkspaceKey, canMutateTask, intl, mutatingTaskKey, onArchiveTask, onDeleteArchivedTask, onOpenTask, onToggleTaskPin, onUnarchiveTask, pendingArchiveTaskKey, showWorkspaceLabel = false, switchingTaskKey, task, taskSortBy, }) {
    const [hoverActionsVisible, setHoverActionsVisible] = useState(false);
    const rowKey = buildWebRemoteControlTaskRowKey(task);
    const taskWorkspaceKey = resolveWebRemoteControlWorkspaceKey(task);
    const isActive = taskWorkspaceKey === activeWorkspaceKey && task.taskId === activeTaskId;
    const isSwitching = switchingTaskKey === rowKey;
    const isMutating = mutatingTaskKey === rowKey;
    const isArchiveConfirming = pendingArchiveTaskKey === rowKey;
    const canPinTask = canMutateTask && !task.archived;
    const canArchiveTask = canMutateTask && !task.archived;
    const canUnarchiveTask = canMutateTask && Boolean(task.archived);
    const canDeleteArchivedTask = canMutateTask && Boolean(task.archived);
    const showPinnedState = Boolean(task.pinned && !task.archived);
    const rowDisabled = Boolean(switchingTaskKey);
    // Bugfix: 宽屏 Web 远控任务行的打开按钮覆盖整行主体，纯 CSS group-hover
    // 会让左侧 pin 操作被主按钮压住且不可命中；这里和桌面 TaskListItem 一样用行级 hover state 挂载动作。
    const showPinAction = canPinTask && hoverActionsVisible;
    const showArchiveAction = canArchiveTask && (hoverActionsVisible || isArchiveConfirming);
    const showArchivedActions = (canUnarchiveTask || canDeleteArchivedTask) && hoverActionsVisible;
    const taskTitle = task.title || intl.formatMessage({ id: "taskList.untitled" });
    const timeLabel = formatTaskRelativeTime(taskSortBy === "created" ? task.createdAt : task.updatedAt, intl);
    const pinLabel = intl.formatMessage({
        id: task.pinned ? "taskList.unpin" : "taskList.pin",
    });
    const archiveLabel = intl.formatMessage({
        id: isArchiveConfirming ? "common.confirm" : "taskList.archive",
    });
    const unarchiveLabel = intl.formatMessage({ id: "taskList.unarchive" });
    const deleteLabel = intl.formatMessage({ id: "taskList.delete" });
    const isRemoteTask = Boolean(task.workspaceIdentity?.trim() || task.workspaceKind === "remote");
    const handleMouseEnter = useCallback(() => {
        setHoverActionsVisible(true);
    }, []);
    const handleMouseLeave = useCallback(() => {
        setHoverActionsVisible(false);
    }, []);
    return (_jsxs("li", { "data-web-remote-task-row": rowKey, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: cn("group/task-item relative flex w-full cursor-pointer items-center gap-2 rounded-lg text-left transition-[background-color,border-color,box-shadow]", rowDisabled && "cursor-wait opacity-80", isActive ? "bg-selected" : "hover:bg-surface-hover"), children: [_jsxs("button", { type: "button", "aria-label": intl.formatMessage({ id: "webRemoteControl.openTask" }, { title: taskTitle }), "data-testid": testId(TID_TASK_ITEM, task.taskId), disabled: rowDisabled, onClick: () => onOpenTask(task), className: "flex min-w-0 flex-1 items-center gap-2 rounded-lg py-1 pl-2.5 pr-1 text-left disabled:cursor-wait disabled:opacity-80", children: [_jsx("span", { className: "relative flex size-4 shrink-0 items-center justify-center", children: _jsx("span", { "aria-hidden": "true", className: cn("flex size-4 items-center justify-center transition-opacity", showPinAction && "hidden"), children: isSwitching || isMutating ? (_jsx(LoaderIcon, { className: "size-4 animate-spin text-foreground-subtle" })) : task.unreadAt ? (_jsx("span", { "data-unread-indicator": "true", className: "h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" })) : showPinnedState ? (_jsx(Pin, { className: "size-4 text-foreground-subtle" })) : null }) }), _jsxs("span", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("span", { className: "min-w-0 flex h-6 flex-wrap items-center gap-1.5", children: [_jsx("span", { className: "min-w-0 flex-1 truncate text-ui-base text-foreground", title: taskTitle, children: taskTitle }), showWorkspaceLabel ? (_jsx("span", { className: "max-w-28 shrink truncate text-ui-base text-foreground-subtlest", title: task.workspaceLabel, children: task.workspaceLabel })) : null] }), task.workflowActivity ? (_jsx(TaskWorkflowRunLines, { activity: task.workflowActivity, isActive: isActive, intl: intl, density: "compact" })) : null] }), _jsx("span", { className: cn("mr-0.5 shrink-0 text-ui-base text-foreground-subtle", showArchiveAction && "hidden"), children: timeLabel })] }), showPinAction ? (_jsx(ControlHintTooltip, { title: pinLabel, side: "right", align: "center", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", disabled: rowDisabled || isMutating, onMouseDown: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }, onClick: (event) => onToggleTaskPin(event, task), className: cn("absolute left-2.5 top-1/2 z-10 inline-flex size-4 min-w-0 -translate-y-1/2 rounded-sm !bg-transparent p-0 text-foreground-subtle hover:text-foreground"), "aria-label": pinLabel, children: _jsx(Pin, { className: "size-4" }) }) })) : null, showArchiveAction ? (_jsx(ControlHintTooltip, { title: archiveLabel, side: "right", align: "center", children: _jsx(Button, { type: "button", variant: isArchiveConfirming ? "destructive" : "ghost", size: isArchiveConfirming ? "sm" : "icon-sm", disabled: rowDisabled || isMutating, onMouseDown: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }, onClick: (event) => onArchiveTask(event, task), "data-testid": testId(TID_TASK_ARCHIVE, task.taskId), className: cn("shrink-0", isArchiveConfirming ? "flex border-destructive/20 px-2" : "flex"), "aria-label": archiveLabel, children: isArchiveConfirming ? (_jsx("span", { children: intl.formatMessage({ id: "common.confirm" }) })) : (_jsx(Archive, { className: "size-3.5" })) }) })) : null, showArchivedActions ? (_jsxs(_Fragment, { children: [canUnarchiveTask ? (_jsx(ControlHintTooltip, { title: unarchiveLabel, side: "right", align: "center", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", disabled: rowDisabled || isMutating, onMouseDown: (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }, onClick: (event) => onUnarchiveTask(event, task), className: "shrink-0 text-foreground-subtle hover:text-foreground", "aria-label": unarchiveLabel, children: isRemoteTask ? (_jsx(CloudDownload, { className: "size-3.5" })) : (_jsx(ArchiveX, { className: "size-3.5" })) }) })) : null, canDeleteArchivedTask ? (_jsx(ControlHintTooltip, { title: deleteLabel, side: "right", align: "center", children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", disabled: rowDisabled || isMutating, onMouseDown: (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }, onClick: (event) => onDeleteArchivedTask(event, task), className: "shrink-0 text-destructive hover:text-destructive", "aria-label": deleteLabel, children: _jsx(Trash2, { className: "size-3.5" }) }) })) : null] })) : null] }));
}
//# sourceMappingURL=WebRemoteControlTaskIndexRow.js.map