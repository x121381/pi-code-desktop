import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- grouped row 同时承载 drag overlay 与常规交互，状态徽标需共用同一渲染语义。 */
import { memo, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { isCronTask, isOffPeakTask } from "@zcode/shared";
import { ArrowUpToLine, Clock, Cloud, Folder, ListTree, LoaderIcon, Moon, X, } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { Badge } from "@/components/ui/badge.js";
import { toast } from "@/components/ui/toast.js";
import { ContextMenu, ContextMenuTrigger, } from "@/components/ui/context-menu.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { deriveTaskLeadingIndicator, formatTaskRelativeTime, } from "@/lib/taskListItemPresentation.js";
import { getTaskChangeSummary } from "@/lib/taskChangeSummary.js";
import { buildTaskWorkspaceKey } from "@/lib/taskQueryCache.js";
import { buildTaskFeedbackDescription } from "@/lib/taskFeedbackDraft.js";
import { useTaskListItemContextActions } from "@/useTaskListItemContextActions.js";
import { useFeedbackStore } from "@/feedback/feedbackStore.js";
import { getTaskListAttention, getTaskListRowActivity } from "@/v4/taskListRowActivity.js";
import { GroupedTaskContextMenuContent } from "@/workspace-grouped-tasks/task-context-menu-content.js";
import { TaskRowActionButton } from "@/workspace-grouped-tasks/task-row-action-button.js";
import { TaskInteractionBadge } from "@/TaskInteractionBadge.js";
import { formatGroupedTaskHoverChangeParts } from "@/workspace-grouped-tasks/task-row-tooltip.js";
import { TASK_GROUP_ROW_CLASS, TASK_GROUP_ROW_LINE_CLASS, } from "@/workspace-grouped-tasks/types.js";
import { TaskWorkflowRunLines } from "@/components/workflow-run-line/TaskWorkflowRunLines.js";
import { useTaskInteractionAutoResolutionSnooze } from "@/hooks/useTaskInteractionAutoResolutionSnooze.js";
import { useOptionalTabStore } from "@/store/TabStoreProvider.js";
import { isWorkspaceReadOnly } from "@/store/tabStore.js";
import { TaskTitleOverflowText } from "@/components/TaskTitleOverflowText.js";
function GroupedTaskRowComponent({ task, currentGroupId, groups, remoteSessionId, activeWorkspacePath, activeWorkspaceIdentity, activeTaskId, mobileActiveTaskKey, workspaceLabel, onSelectTask, onCloseTask, onOpenFileTree, onMoveTaskToGroup, onMoveTaskToTop, onStartRenameTask, onArchiveTask, onMarkTaskAsUnread, dragId, dragging, dragOverlay, tooltipsDisabled, }) {
    const { intl } = useZCodeIntl();
    const workspaceActionsDisabled = useOptionalTabStore((state) => isWorkspaceReadOnly(state, task.workspacePath, task.workspaceIdentity));
    const workspaceActionsDisabledReason = workspaceActionsDisabled
        ? intl.formatMessage({ id: "workspaceSidebar.unavailableLocalDirectory" })
        : undefined;
    const snoozeInteractionAutoResolution = useTaskInteractionAutoResolutionSnooze({
        workspacePath: task.workspacePath,
        ...(task.workspaceIdentity
            ? { workspaceIdentity: task.workspaceIdentity }
            : {}),
        ...(remoteSessionId ? { remoteSessionId } : {}),
        sessionId: task.taskId,
    });
    const workspaceKey = buildTaskWorkspaceKey(task.workspacePath, task.workspaceIdentity);
    const taskActivity = getTaskListRowActivity(task);
    const taskAttention = getTaskListAttention(task);
    // 交互胶囊是当前最高优先级的右侧状态；无论来自 sessions-index 摘要还是
    // activity attention，都不应再并排显示相对时间并挤压任务标题。
    const hasPendingInteraction = Boolean(task.pendingInteraction) || taskAttention !== null;
    // Bugfix：远端 session 未就绪时打开文件树必然会被 resolver 拒绝，因此不要暴露
    // 无效 action；本地 task 不需要 remoteSessionId，仍保持入口可用。
    const canOpenFileTree = Boolean(onOpenFileTree) &&
        (!task.workspaceIdentity?.trim() || Boolean(remoteSessionId));
    const taskAttentionLabel = taskAttention
        ? intl.formatMessage({
            id: taskAttention.kind === "userInput" ? "taskList.userInputTag" : "taskList.permissionTag",
        })
        : null;
    const taskAttentionDisplay = taskAttention && taskAttentionLabel && taskAttention.count > 1
        ? intl.formatMessage({ id: "taskList.attentionCount" }, { label: taskAttentionLabel, count: String(taskAttention.count) })
        : taskAttentionLabel;
    const leadingIndicator = deriveTaskLeadingIndicator(task, taskActivity);
    const taskTitle = task.title ||
        intl.formatMessage({
            id: task.forkedFromTaskId
                ? "taskList.forkedUntitled"
                : "taskList.untitled",
        });
    const taskChangeParts = formatGroupedTaskHoverChangeParts(getTaskChangeSummary(task));
    const taskTimeLabel = formatTaskRelativeTime(task.updatedAt, intl);
    const isTaskCron = isCronTask(task);
    // 月亮身份改为持久 meta 标记判断；off-peak store 反查在任务被删除后会丢失
    // 会话溯源，且让每一行多背一个全局 store 订阅。
    const isTaskOffPeak = isOffPeakTask(task);
    const isActive = buildTaskWorkspaceKey(activeWorkspacePath, activeWorkspaceIdentity) ===
        workspaceKey && activeTaskId === task.taskId;
    const isMobileActive = mobileActiveTaskKey === `${workspaceKey}:${task.taskId}`;
    const statusDotClassName = leadingIndicator === "error"
        ? "bg-destructive"
        : leadingIndicator === "unread"
            ? // Bugfix: grouped task 未读点需要和普通 task list 共用 sky 色，避免 brand 色在不同主题下表达漂移。
                "bg-sky-500 dark:bg-sky-400"
            : null;
    const canShowHoverActions = !dragOverlay;
    // 工作流运行行：分组行同样长在标题下；
    // drag overlay 只是纯展示，不挂确认副作用与点击入口。
    const workflowRunLinesNode = taskActivity?.workflowActivity && !dragOverlay ? (_jsx(TaskWorkflowRunLines, { activity: taskActivity.workflowActivity, isActive: isActive, intl: intl, session: {
            workspacePath: task.workspacePath,
            ...(task.workspaceIdentity ? { workspaceIdentity: task.workspaceIdentity } : {}),
            sessionId: task.taskId,
        } })) : null;
    const taskRow = (_jsx("div", { role: dragOverlay ? undefined : "button", tabIndex: dragOverlay ? undefined : 0, "data-mobile-active-task": !dragOverlay && isMobileActive ? "true" : undefined, className: cn("group/task-row", TASK_GROUP_ROW_CLASS, dragOverlay
            ? "pointer-events-none cursor-grabbing border border-border bg-background shadow-lg opacity-100"
            : "cursor-pointer", isActive
            ? "bg-selected"
            : canShowHoverActions && "hover:bg-surface-hover", dragging && "opacity-0"), children: _jsxs("span", { className: TASK_GROUP_ROW_LINE_CLASS, children: [_jsx(TaskTitleOverflowText, { as: "span", className: "text-foreground", title: dragOverlay ? undefined : taskTitle, children: taskTitle }), _jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-1.5 text-ui-sm text-foreground-subtle", children: [task.pendingInteraction ? (_jsx(TaskInteractionBadge, { interaction: task.pendingInteraction, formatMessage: (id) => intl.formatMessage({ id }), onSnoozeCountdown: dragOverlay ? undefined : snoozeInteractionAutoResolution })) : taskAttentionDisplay ? (_jsx(Badge, { className: cn("h-5 border-transparent bg-success/14 px-2 text-ui-base font-medium text-success dark:bg-success/18", canShowHoverActions && "group-hover/task-row:hidden"), children: taskAttentionDisplay })) : null, _jsxs("span", { className: cn("flex shrink-0 items-center gap-1", canShowHoverActions && "group-hover/task-row:hidden"), children: [leadingIndicator === "loading" ? (_jsx(LoaderIcon, { className: "size-3.5 animate-spin text-foreground-subtle" })) : statusDotClassName ? (_jsx("span", { "aria-hidden": "true", className: "flex size-4 shrink-0 items-center justify-center", children: _jsx("span", { className: cn("size-1.5 rounded-full", statusDotClassName) }) })) : null, !hasPendingInteraction && isTaskCron ? (_jsx(Clock, { "data-cron-task-icon": "true", "aria-label": intl.formatMessage({ id: "taskList.cronTaskLabel" }), className: "size-3.5 shrink-0" })) : !hasPendingInteraction && isTaskOffPeak ? (_jsx(Moon, { "data-off-peak-task-icon": "true", "aria-label": intl.formatMessage({ id: "taskList.offPeakTaskLabel" }), className: "size-3.5 shrink-0" })) : null, !hasPendingInteraction ? (_jsx("span", { className: "mr-1", children: taskTimeLabel })) : null] })] })] }) }));
    // DragOverlay 高频渲染时只返回纯展示节点，避免隐藏 action tooltip 的 Radix ref 循环和 task 路径 RPC。
    if (dragOverlay)
        return taskRow;
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [taskRowHovered, setTaskRowHovered] = useState(false);
    const [taskRowFocusWithin, setTaskRowFocusWithin] = useState(false);
    const [isHoverNone] = useState(() => typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: none)").matches);
    const openFeedbackSubmit = useFeedbackStore((state) => state.openSubmit);
    const { taskSessionFile, taskNativeSessionLogFile, providerConfigFile, fileManagerLabel, handleCopyText, handleOpenTaskPathInFileManager, handleOpenProviderConfig, } = useTaskListItemContextActions({
        workspacePath: task.workspacePath,
        remoteSessionId,
        workspaceIdentity: task.workspaceIdentity,
        taskId: task.taskId,
        provider: task.provider,
        intl,
        loadTaskPaths: contextMenuOpen,
        loadProviderConfig: contextMenuOpen,
    });
    const handleSelect = () => {
        onSelectTask(task.workspacePath, task.taskId, task.workspaceIdentity);
    };
    const handleCloseTask = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (workspaceActionsDisabled) {
            return;
        }
        onCloseTask(task);
    };
    const handleOpenFileTree = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (workspaceActionsDisabled) {
            return;
        }
        onOpenFileTree?.(task);
    };
    const handleMoveTaskToTop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (workspaceActionsDisabled) {
            return;
        }
        onMoveTaskToTop(task);
    };
    const handleOpenTaskFeedback = async () => {
        openFeedbackSubmit({
            title: intl
                .formatMessage({ id: "feedback.submit.template.section.taskFeedbackTitle" }, { title: taskTitle })
                .slice(0, 80),
            type: "bug",
            module: "Agent任务执行失败",
            severity: "P2-中",
            includeLogs: true,
            description: buildTaskFeedbackDescription({
                taskTitle,
                taskId: task.taskId,
                workspacePath: task.workspacePath,
                taskSessionPath: taskSessionFile.path,
                taskLogPath: taskNativeSessionLogFile.path,
                formatMessage: (id, values) => intl.formatMessage({ id }, values),
            }),
            screenshots: [],
        });
        toast(intl.formatMessage({ id: "taskList.feedbackOpened" }));
    };
    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget) {
            return;
        }
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        event.preventDefault();
        handleSelect();
    };
    const dragDisabled = workspaceActionsDisabled || !dragId || contextMenuOpen || dragOverlay;
    const draggable = useDraggable({
        id: dragId ?? `disabled:${workspaceKey}:${task.taskId}`,
        disabled: dragDisabled,
        data: { type: "grouped-task", taskKey: dragId },
    });
    const droppable = useDroppable({
        id: dragId ?? `disabled-drop:${workspaceKey}:${task.taskId}`,
        disabled: workspaceActionsDisabled || !dragId || dragOverlay,
        data: { type: "grouped-task", taskKey: dragId },
    });
    const setTaskRowRef = (element) => {
        draggable.setNodeRef(element);
        droppable.setNodeRef(element);
    };
    const groupedTaskDomKey = typeof dragId === "string" ? encodeURIComponent(dragId) : undefined;
    // Bug 原因：CSS hidden → flex 会让 action trigger 在 pointer 到达时才获得布局尺寸，
    // Tooltip Portal 可能先以未定位坐标绘制。改为交互状态决定 action 是否挂载，
    // 同时保留键盘、触摸设备和手机远控 active task 的入口。
    const shouldMountHoverActions = !task.pendingInteraction &&
        (taskRowHovered || taskRowFocusWithin || isHoverNone || isMobileActive);
    // 触屏端 isHoverNone 只负责常驻 action；时间、状态点和 cron/off-peak 元信息
    // 仍应保留，仅在真实 hover / focus 交互时让位，避免手机端永久丢失任务状态。
    const shouldSuppressTaskMetadata = taskRowHovered || taskRowFocusWithin;
    const interactiveTaskRow = (_jsxs("div", { ref: setTaskRowRef, ...draggable.attributes, ...draggable.listeners, role: "button", tabIndex: 0, onClick: handleSelect, onKeyDown: handleKeyDown, onMouseEnter: () => setTaskRowHovered(true), onMouseLeave: () => setTaskRowHovered(false), onFocusCapture: () => setTaskRowFocusWithin(true), onBlurCapture: (event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                setTaskRowFocusWithin(false);
            }
        }, "data-grouped-task-key": groupedTaskDomKey, "data-mobile-active-task": isMobileActive ? "true" : undefined, className: cn("group/task-row", TASK_GROUP_ROW_CLASS, "cursor-pointer", isActive ? "bg-selected" : "hover:bg-surface-hover", dragging && "opacity-0"), children: [_jsxs("span", { className: TASK_GROUP_ROW_LINE_CLASS, children: [_jsx(TaskTitleOverflowText, { as: "span", className: "text-foreground", title: taskTitle, children: taskTitle }), _jsxs("span", { className: "ml-auto flex shrink-0 items-center gap-1.5 text-ui-sm text-foreground-subtle", children: [task.pendingInteraction ? (_jsx(TaskInteractionBadge, { interaction: task.pendingInteraction, formatMessage: (id) => intl.formatMessage({ id }), onSnoozeCountdown: snoozeInteractionAutoResolution })) : taskAttentionDisplay && !shouldSuppressTaskMetadata ? (_jsx(Badge, { className: "h-5 border-transparent bg-success/14 px-2 text-ui-base font-medium text-success dark:bg-success/18", children: taskAttentionDisplay })) : null, !shouldSuppressTaskMetadata ? (_jsxs("span", { className: "flex shrink-0 items-center gap-1", children: [leadingIndicator === "loading" ? (_jsx(LoaderIcon, { className: "size-3.5 animate-spin text-foreground-subtle" })) : statusDotClassName ? (_jsx("span", { "aria-hidden": "true", className: "flex size-4 shrink-0 items-center justify-center", children: _jsx("span", { className: cn("size-1.5 rounded-full", statusDotClassName) }) })) : null, !hasPendingInteraction && isTaskCron ? (_jsx(Clock, { "data-cron-task-icon": "true", "aria-label": intl.formatMessage({ id: "taskList.cronTaskLabel" }), className: "size-3.5 shrink-0" })) : !hasPendingInteraction && isTaskOffPeak ? (_jsx(Moon, { "data-off-peak-task-icon": "true", "aria-label": intl.formatMessage({ id: "taskList.offPeakTaskLabel" }), className: "size-3.5 shrink-0" })) : null, !hasPendingInteraction ? (_jsx("span", { className: "mr-1", children: taskTimeLabel })) : null] })) : null, shouldMountHoverActions ? (_jsxs("span", { className: "flex shrink-0 items-center gap-0.5", children: [canOpenFileTree ? (_jsx(TaskRowActionButton, { label: intl.formatMessage({ id: "git.action.showTree" }), onClick: handleOpenFileTree, showTooltip: true, disabledReason: workspaceActionsDisabledReason, children: _jsx(ListTree, { className: "size-3.5" }) })) : null, _jsx(TaskRowActionButton, { label: intl.formatMessage({ id: "taskGroup.moveToTop" }), onClick: handleMoveTaskToTop, showTooltip: true, disabledReason: workspaceActionsDisabledReason, children: _jsx(ArrowUpToLine, { className: "size-3.5" }) }), _jsx(TaskRowActionButton, { label: intl.formatMessage({ id: "common.close" }), onClick: handleCloseTask, showTooltip: true, disabledReason: workspaceActionsDisabledReason, children: _jsx(X, { className: "size-3.5" }) })] })) : null] })] }), workflowRunLinesNode] }));
    // grouped row 不能用原生 button 承载整行；行内还有菜单、关闭、文件树等 button，外层继续用 role=button，避免嵌套 button 破坏键盘和右键菜单语义。
    return (_jsxs(ContextMenu, { onOpenChange: setContextMenuOpen, children: [tooltipsDisabled ? (_jsx(ContextMenuTrigger, { asChild: true, children: interactiveTaskRow })) : (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(ContextMenuTrigger, { asChild: true, children: interactiveTaskRow }) }), _jsxs(TooltipContent, { side: "right", align: "center", sideOffset: 6, children: [remoteSessionId ? (_jsx(Cloud, { "aria-hidden": "true", className: "size-3.5 shrink-0" })) : (_jsx(Folder, { "aria-hidden": "true", className: "size-3.5 shrink-0" })), _jsx("span", { className: "min-w-0 max-w-48 truncate", children: workspaceLabel }), taskChangeParts.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-tooltip-foreground/60", children: "\u00B7" }), _jsx("span", { className: "inline-flex shrink-0 items-center gap-1", children: taskChangeParts.map((part) => (_jsx("span", { className: part.startsWith("+")
                                                    ? "text-diff-added"
                                                    : "text-diff-removed", children: part }, part))) })] })) : null] })] }) })), contextMenuOpen ? (_jsx(GroupedTaskContextMenuContent, { task: task, currentGroupId: currentGroupId, groups: groups, intl: intl, fileManagerLabel: fileManagerLabel, taskSessionFile: taskSessionFile, taskNativeSessionLogFile: taskNativeSessionLogFile, providerConfigFile: providerConfigFile, onMoveTaskToGroup: onMoveTaskToGroup, onMoveTaskToTop: onMoveTaskToTop, onStartRenameTask: onStartRenameTask, onArchiveTask: onArchiveTask, onMarkTaskAsUnread: onMarkTaskAsUnread, onOpenTaskPathInFileManager: () => void handleOpenTaskPathInFileManager(), onCopyText: (label, text) => void handleCopyText(label, text), onOpenProviderConfig: () => void handleOpenProviderConfig(), onOpenTaskFeedback: () => void handleOpenTaskFeedback(), disabledReason: workspaceActionsDisabledReason })) : null] }));
}
export const GroupedTaskRow = memo(GroupedTaskRowComponent);
//# sourceMappingURL=task-row.js.map