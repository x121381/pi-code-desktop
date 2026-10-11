import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 手机远控首页集中编排 workspace card、task row、加载态和交互态，后续筛选/搜索落地时再按子组件边界拆分。 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, ChevronsUp, Clock3, Cloud, FolderOpen, LoaderIcon, MessageCircleCheck, MessageCirclePlus, Pin, Plus, RefreshCw, Settings2, } from "lucide-react";
import { TID_TASK_ITEM, resolveWebRemoteControlWorkspaceKey, testId, } from "@zcode/shared";
import { cn } from "./components/lib/utils.js";
import { Button } from "./components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu.js";
import { buildWebRemoteControlTaskRowKey, useWebRemoteControlTaskOpen, } from "./hooks/useWebRemoteControlTaskOpen.js";
import { getErrorMessage } from "./hooks/chatActionHelpers.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { formatTaskRelativeTime } from "./lib/taskListItemPresentation.js";
import { TaskWorkflowRunLines } from "./components/workflow-run-line/TaskWorkflowRunLines.js";
import { getTaskTimelineGroupMessage, groupTaskTimelineItems, } from "./lib/taskTimelineGroups.js";
import { EMPTY_WEB_REMOTE_CONTROL_WORKSPACE_LIST, buildWebRemoteControlMobileTaskHomeModel, getWebRemoteControlTaskStatusClassName, getWorkspaceLatestUpdatedAt, hasWebRemoteControlMobileTaskHomeActiveTaskMatch, } from "./lib/webRemoteControlMobileTaskHome.js";
import { logger } from "./logger.js";
import { WebRemoteControlThemeMenu } from "./WebRemoteControlThemeMenu.js";
export { buildWebRemoteControlMobileTaskHomeModel } from "./lib/webRemoteControlMobileTaskHome.js";
export { persistWebRemoteControlMobileTaskHomePreferences, readWebRemoteControlMobileTaskHomePreferences, } from "./lib/webRemoteControlMobileTaskHome.js";
function getStatusIcon(status) {
    if (status === "running") {
        return _jsx(LoaderIcon, { className: "size-3 animate-spin" });
    }
    if (status === "completed") {
        return _jsx(CheckCircle2, { className: "size-3" });
    }
    if (status === "error") {
        return _jsx(AlertCircle, { className: "size-3" });
    }
    return null;
}
function noopSelectTask() { }
export function WebRemoteControlMobileTaskHome({ activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, initialResult, onNavigateHome, onNavigateToChat, onOpenTask, preferences, onPreferencesChange, onSelectTask = noopSelectTask, onStartDraftInWorkspace, refreshKey, onCrossWorkspaceSwitchingChange, switcher, }) {
    const { intl, locale } = useZCodeIntl();
    const [result, setResult] = useState(initialResult ?? EMPTY_WEB_REMOTE_CONTROL_WORKSPACE_LIST);
    const [loading, setLoading] = useState(!initialResult);
    const [loadError, setLoadError] = useState(null);
    const taskOrganizeBy = preferences.organizeBy;
    const taskSortBy = preferences.sortBy;
    const initialExpansionModel = useMemo(() => buildWebRemoteControlMobileTaskHomeModel({
        activeTaskId,
        activeWorkspaceIdentity,
        activeWorkspacePath,
        sortBy: taskSortBy,
        result: initialResult ?? EMPTY_WEB_REMOTE_CONTROL_WORKSPACE_LIST,
    }), [activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, initialResult, taskSortBy]);
    const [expandedWorkspaceKeys, setExpandedWorkspaceKeys] = useState(() => new Set(initialExpansionModel.defaultExpandedWorkspaceKeys));
    const didInitializeLoadedExpansionRef = useRef(Boolean(initialResult));
    const model = useMemo(() => buildWebRemoteControlMobileTaskHomeModel({
        activeTaskId,
        activeWorkspaceIdentity,
        activeWorkspacePath,
        sortBy: taskSortBy,
        result,
    }), [activeTaskId, activeWorkspaceIdentity, activeWorkspacePath, result, taskSortBy]);
    const defaultExpandedWorkspaceKeySignature = useMemo(() => [...model.defaultExpandedWorkspaceKeys].join("\0"), [model.defaultExpandedWorkspaceKeys]);
    const workspaceByKey = useMemo(() => new Map(model.groups.map((group) => [group.workspaceKey, group.workspace])), [model.groups]);
    const timelineGroups = useMemo(() => 
    // Bugfix: 手机时间线之前只平铺已排序 task，缺少桌面端“今天/上月”等分组文案。
    // 这里复用桌面时间线分组工具，保证排序字段、locale 周起始日和文案 key 都保持一致。
    groupTaskTimelineItems(model.timelineTasks, {
        sortBy: taskSortBy,
        now: Date.now(),
        locale,
    }), [locale, model.timelineTasks, taskSortBy]);
    const { error: taskOpenError, openTask, switchingTaskKey, } = useWebRemoteControlTaskOpen({
        activeTaskId: model.activeTaskId,
        activeWorkspaceIdentity,
        activeWorkspacePath,
        markTaskReadOnOpen: true,
        mobileNavigationIntent: "chat",
        onNavigateHome,
        onNavigateToChat,
        onSelectTask,
        onSwitchingChange: onCrossWorkspaceSwitchingChange,
        switcher,
    });
    const error = loadError ?? taskOpenError;
    const loadWorkspaces = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            setResult(await switcher.listWorkspaces());
        }
        catch (err) {
            // Bugfix: 远控请求失败时可能抛普通对象，直接 String 会把真实原因吞成 [object Object]。
            const message = getErrorMessage(err);
            logger.error("[WebRemoteControlMobileTaskHome] 加载远控首页失败", {
                error: message,
            });
            setLoadError(message);
        }
        finally {
            setLoading(false);
        }
    }, [switcher]);
    useEffect(() => {
        if (initialResult) {
            return;
        }
        // Bugfix: 手机端任务首页之前每 3 秒轮询 listWorkspaces，导致 relay 持续产生任务列表请求。
        // 这里只保留首次无 initialResult 时加载；从聊天页返回首页由 WebRemoteControlMobileShell 显式 refreshKey 触发一次刷新。
        void loadWorkspaces();
    }, [initialResult, loadWorkspaces]);
    useEffect(() => {
        if (!refreshKey) {
            return;
        }
        // Bugfix: 取消 3 秒轮询后，用户从 task 页返回任务列表时仍需要看到刚发送消息后的最新状态。
        // 这里把“返回列表”作为一次明确刷新事件，避免持续请求，同时保证 loading / 选中态及时更新。
        void loadWorkspaces();
    }, [loadWorkspaces, refreshKey]);
    useEffect(() => {
        return switcher.onWorkspaceListUpdated?.((nextResult) => {
            // Bugfix: 桌面端或宽屏远控变更 task membership 后，手机首页需要采用推送的最新索引。
            // 继续只在明确事件上刷新，避免恢复到旧的定时轮询。
            setResult(nextResult);
            setLoadError(null);
            setLoading(false);
        });
    }, [switcher]);
    useEffect(() => {
        if (didInitializeLoadedExpansionRef.current || loading) {
            return;
        }
        didInitializeLoadedExpansionRef.current = true;
        setExpandedWorkspaceKeys(new Set(model.defaultExpandedWorkspaceKeys));
    }, [defaultExpandedWorkspaceKeySignature, loading, model.defaultExpandedWorkspaceKeys]);
    useEffect(() => {
        if (loading || result.workspaces.length === 0) {
            return;
        }
        const activeGroup = model.groups.find((group) => group.workspaceKey === model.activeWorkspaceKey);
        if (!activeGroup) {
            logger.warn("[WebRemoteControlMobileTaskHome] 初始 workspace 未匹配", {
                workspaceKey: model.activeWorkspaceKey,
            });
            return;
        }
        if (!hasWebRemoteControlMobileTaskHomeActiveTaskMatch(model)) {
            logger.warn("[WebRemoteControlMobileTaskHome] 初始 task 未匹配", {
                taskId: model.activeTaskId,
                workspaceKey: model.activeWorkspaceKey,
            });
        }
    }, [
        loading,
        model.activeTaskId,
        model.activeWorkspaceKey,
        model.groups,
        result.workspaces.length,
    ]);
    const toggleWorkspace = useCallback((workspaceKey) => {
        setExpandedWorkspaceKeys((current) => {
            const next = new Set(current);
            if (next.has(workspaceKey)) {
                next.delete(workspaceKey);
            }
            else {
                next.add(workspaceKey);
            }
            return next;
        });
    }, []);
    const collapseAllWorkspaces = useCallback(() => {
        setExpandedWorkspaceKeys(new Set());
    }, []);
    const handleOpenTask = useCallback((task) => {
        if (onOpenTask) {
            onOpenTask(task);
            return;
        }
        openTask(task);
    }, [onOpenTask, openTask]);
    const [creatingWorkspaceKey, setCreatingWorkspaceKey] = useState(null);
    const [reconnectingWorkspaceKey, setReconnectingWorkspaceKey] = useState(null);
    const handleReconnectWorkspace = useCallback(async (workspace) => {
        const workspaceKey = resolveWebRemoteControlWorkspaceKey(workspace);
        if (!switcher.reconnectWorkspace) {
            return;
        }
        setLoadError(null);
        setReconnectingWorkspaceKey(workspaceKey);
        try {
            // Bugfix: 手机端列表现在会展示已断开的 SSH 工作区，不能再误走 bridge。
            // 重连请求必须交回桌面 renderer 复用原有 SSH 恢复流程，再刷新列表拿最新连接态。
            await switcher.reconnectWorkspace(workspaceKey);
            await loadWorkspaces();
        }
        catch (err) {
            const message = getErrorMessage(err);
            logger.error("[WebRemoteControlMobileTaskHome] 手机端重连远程工作区失败", {
                error: message,
                workspaceKey,
            });
            setLoadError(message);
        }
        finally {
            setReconnectingWorkspaceKey(null);
        }
    }, [loadWorkspaces, switcher]);
    const handleStartDraft = useCallback(async (workspace) => {
        const workspaceKey = resolveWebRemoteControlWorkspaceKey(workspace);
        const isCrossWorkspace = workspaceKey !== model.activeWorkspaceKey;
        setLoadError(null);
        setCreatingWorkspaceKey(workspaceKey);
        onCrossWorkspaceSwitchingChange?.(true);
        try {
            // Bugfix: 手机端“新建任务”如果只切 workspace 不清空 activeTask，
            // 远控会继续带着旧 taskId 进入聊天页，看起来像按钮无效。
            // 这里统一走 startDraft（可选）或 switchWorkspace(不带 taskId)，确保进入草稿态。
            if (switcher.startDraft) {
                await switcher.startDraft(workspaceKey, { mobileNavigationIntent: "chat" });
            }
            else {
                await switcher.switchWorkspace(workspaceKey, { mobileNavigationIntent: "chat" });
                await switcher.updateMobileViewState?.(workspaceKey);
            }
            if (!isCrossWorkspace) {
                onStartDraftInWorkspace?.(workspace.workspacePath, workspace.workspaceIdentity);
                onNavigateToChat?.();
            }
        }
        catch (err) {
            const message = getErrorMessage(err);
            logger.error("[WebRemoteControlMobileTaskHome] 手机端新建任务失败", {
                error: message,
                workspaceKey,
            });
            setLoadError(message);
        }
        finally {
            setCreatingWorkspaceKey(null);
            onCrossWorkspaceSwitchingChange?.(false);
        }
    }, [
        model.activeWorkspaceKey,
        onCrossWorkspaceSwitchingChange,
        onNavigateToChat,
        onStartDraftInWorkspace,
        switcher,
    ]);
    return (_jsxs("section", { className: "flex h-full min-h-0 flex-col bg-background text-foreground", children: [_jsx("header", { className: "shrink-0 border-b border-border bg-header px-4 py-3", children: _jsxs("div", { className: "flex min-w-0 items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-ui-lg font-medium", children: intl.formatMessage({ id: "webRemoteControl.mobileHome.title" }) }), _jsx("div", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                        id: "webRemoteControl.mobileHome.connected",
                                    }) })] }), _jsx("div", { className: "flex shrink-0 items-center gap-1", children: _jsx(WebRemoteControlThemeMenu, {}) })] }) }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 py-3", children: [_jsx("div", { className: "rounded-lg border border-card-border bg-card p-3 text-ui-base/relaxed text-foreground-subtle", children: intl.formatMessage({ id: "webRemoteControl.mobileHome.notice" }) }), _jsxs("div", { className: "mt-4 flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-ui-base font-medium", children: intl.formatMessage({
                                            id: "webRemoteControl.mobileHome.sectionTitle",
                                        }) }), _jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "webRemoteControl.mobileHome.summary" }, {
                                            taskCount: String(model.totalTaskCount),
                                            workspaceCount: String(model.totalWorkspaceCount),
                                        }) })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [taskOrganizeBy === "workspace" ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                            id: "webRemoteControl.mobileHome.collapseAll",
                                        }), onClick: collapseAllWorkspaces, children: _jsx(ChevronsUp, { className: "size-3.5" }) })) : null, _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                                        id: "webRemoteControl.mobileHome.organize",
                                                    }), children: _jsx(Settings2, { className: "size-3.5" }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-52 min-w-52", children: [_jsx(DropdownMenuLabel, { children: intl.formatMessage({
                                                            id: "webRemoteControl.mobileHome.organize",
                                                        }) }), _jsxs(DropdownMenuRadioGroup, { value: taskOrganizeBy, onValueChange: (value) => {
                                                            if (value === "workspace" || value === "timeline") {
                                                                // Bugfix: 手机远控首页会在进入 task 后卸载，排序/分组偏好不能留在本组件本地 state。
                                                                // 这里把用户选择回写到 shell 级状态，返回任务列表时继续沿用上一次设置。
                                                                onPreferencesChange({ ...preferences, organizeBy: value });
                                                            }
                                                        }, children: [_jsxs(DropdownMenuRadioItem, { value: "workspace", children: [_jsx(FolderOpen, { className: "size-4" }), intl.formatMessage({
                                                                        id: "webRemoteControl.mobileHome.organizeByWorkspace",
                                                                    })] }), _jsxs(DropdownMenuRadioItem, { value: "timeline", children: [_jsx(Clock3, { className: "size-4" }), intl.formatMessage({
                                                                        id: "webRemoteControl.mobileHome.organizeByTimeline",
                                                                    })] })] }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuLabel, { children: intl.formatMessage({
                                                            id: "webRemoteControl.mobileHome.sortBy",
                                                        }) }), _jsxs(DropdownMenuRadioGroup, { value: taskSortBy, onValueChange: (value) => {
                                                            if (value === "created" || value === "updated") {
                                                                onPreferencesChange({ ...preferences, sortBy: value });
                                                            }
                                                        }, children: [_jsxs(DropdownMenuRadioItem, { value: "created", children: [_jsx(MessageCirclePlus, { className: "size-4" }), intl.formatMessage({
                                                                        id: "webRemoteControl.mobileHome.sortByCreated",
                                                                    })] }), _jsxs(DropdownMenuRadioItem, { value: "updated", children: [_jsx(MessageCircleCheck, { className: "size-4" }), intl.formatMessage({
                                                                        id: "webRemoteControl.mobileHome.sortByUpdated",
                                                                    })] })] })] })] }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({
                                            id: "webRemoteControl.mobileHome.refresh",
                                        }), onClick: () => {
                                            void loadWorkspaces();
                                        }, children: _jsx(RefreshCw, { className: cn("size-3.5", loading && "animate-spin") }) })] })] }), error ? (_jsx("div", { className: "mt-3 rounded-lg border border-destructive/40 bg-card px-3 py-2 text-ui-base text-destructive", children: error })) : null, loading && model.totalWorkspaceCount === 0 ? (_jsxs("div", { className: "mt-3 flex items-center gap-2 px-1 py-2 text-ui-base text-foreground-subtle", children: [_jsx(LoaderIcon, { className: "size-3.5 animate-spin" }), intl.formatMessage({ id: "common.loading" })] })) : null, !loading && !error && model.totalWorkspaceCount === 0 ? (_jsx("div", { className: "mt-3 px-1 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "webRemoteControl.noTasks" }) })) : null, model.pinnedTasks.length > 0 ? (_jsxs("section", { className: "mt-3", children: [_jsx("h2", { className: "px-1 py-1 text-ui-base font-medium text-foreground-subtlest", children: intl.formatMessage({ id: "taskList.pinnedSection" }) }), _jsx("ul", { className: "space-y-1", children: model.pinnedTasks.map((task) => {
                                    const rowKey = buildWebRemoteControlTaskRowKey(task);
                                    const taskWorkspaceKey = resolveWebRemoteControlWorkspaceKey(task);
                                    const taskWorkspace = workspaceByKey.get(taskWorkspaceKey);
                                    const isDisconnectedRemoteWorkspace = taskWorkspace?.kind === "remote" &&
                                        (taskWorkspace.connectionState === "disconnected" ||
                                            !taskWorkspace.remoteSessionId);
                                    const selected = taskWorkspaceKey === model.activeWorkspaceKey &&
                                        task.taskId === model.activeTaskId;
                                    const switching = switchingTaskKey === rowKey;
                                    const taskTitle = task.title || intl.formatMessage({ id: "taskList.untitled" });
                                    const displayStatus = task.displayStatus ?? "idle";
                                    return (_jsx("li", { children: _jsxs("button", { type: "button", "data-testid": testId(TID_TASK_ITEM, task.taskId), "data-state": selected ? "selected" : "idle", className: cn("flex min-h-12 w-full min-w-0 items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-2 text-left transition-colors disabled:cursor-wait disabled:opacity-70", selected ? "bg-selected text-foreground" : "hover:bg-surface-hover"), disabled: Boolean(switchingTaskKey) || isDisconnectedRemoteWorkspace, onClick: () => {
                                                if (!isDisconnectedRemoteWorkspace) {
                                                    handleOpenTask(task);
                                                }
                                            }, "aria-label": intl.formatMessage({ id: "webRemoteControl.openTask" }, { title: taskTitle }), children: [_jsxs("span", { className: "relative flex size-4 shrink-0 items-center justify-center text-foreground-subtle", children: [switching ? (_jsx(LoaderIcon, { className: "size-4 animate-spin" })) : (_jsx(Pin, { className: "size-4" })), !switching && task.unreadAt ? (_jsx("span", { className: "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" })) : null] }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-ui-base text-foreground", children: taskTitle }), _jsxs("span", { className: "mt-1 flex min-w-0 items-center gap-1.5 text-ui-base text-foreground-subtle", children: [_jsx("span", { className: "truncate", children: taskWorkspace?.workspacePurpose === "conversation"
                                                                        ? intl.formatMessage({
                                                                            id: "workspaceSidebar.conversationsSection",
                                                                        })
                                                                        : task.workspaceLabel || taskWorkspace?.label || task.workspacePath }), _jsx("span", { className: "shrink-0", children: "\u00B7" }), _jsx("span", { className: "truncate", children: formatTaskRelativeTime(taskSortBy === "created" ? task.createdAt : task.updatedAt, intl) })] }), task.workflowActivity ? (_jsx(TaskWorkflowRunLines, { activity: task.workflowActivity, isActive: selected, intl: intl, density: "compact" })) : null] }), _jsxs("span", { className: cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-ui-xs leading-none", getWebRemoteControlTaskStatusClassName(displayStatus)), children: [getStatusIcon(displayStatus), intl.formatMessage({
                                                            id: `webRemoteControl.taskStatus.${displayStatus}`,
                                                        })] })] }) }, rowKey));
                                }) })] })) : null, taskOrganizeBy === "timeline" ? (_jsxs("ul", { className: "mt-3 space-y-2", children: [model.totalTaskCount === 0 && model.totalWorkspaceCount > 0 ? (_jsx("li", { className: "px-1 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "webRemoteControl.noTasks" }) })) : null, timelineGroups.map((group) => {
                                const labelMessage = getTaskTimelineGroupMessage(group.label);
                                return (_jsxs("li", { className: "space-y-1", children: [_jsx("div", { className: "px-1 py-1 text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: labelMessage.id }, labelMessage.values) }), _jsx("ul", { className: "space-y-1", children: group.items.map((task) => {
                                                const rowKey = buildWebRemoteControlTaskRowKey(task);
                                                const taskWorkspaceKey = resolveWebRemoteControlWorkspaceKey(task);
                                                const taskWorkspace = workspaceByKey.get(taskWorkspaceKey);
                                                const isDisconnectedRemoteWorkspace = taskWorkspace?.kind === "remote" &&
                                                    (taskWorkspace.connectionState === "disconnected" ||
                                                        !taskWorkspace.remoteSessionId);
                                                const selected = taskWorkspaceKey === model.activeWorkspaceKey &&
                                                    task.taskId === model.activeTaskId;
                                                const switching = switchingTaskKey === rowKey;
                                                const taskTitle = task.title || intl.formatMessage({ id: "taskList.untitled" });
                                                const displayStatus = task.displayStatus ?? "idle";
                                                return (_jsx("li", { children: _jsxs("button", { type: "button", "data-testid": testId(TID_TASK_ITEM, task.taskId), "data-state": selected ? "selected" : "idle", className: cn("flex min-h-14 w-full min-w-0 items-center gap-2 rounded-lg border border-card-border bg-card px-3 py-2 text-left transition-colors disabled:cursor-wait disabled:opacity-70", selected ? "bg-selected text-foreground" : "hover:bg-surface-hover"), disabled: Boolean(switchingTaskKey) || isDisconnectedRemoteWorkspace, onClick: () => {
                                                            if (!isDisconnectedRemoteWorkspace) {
                                                                handleOpenTask(task);
                                                            }
                                                        }, children: [_jsx("span", { className: "relative flex size-4 shrink-0 items-center justify-center", children: switching ? (_jsx(LoaderIcon, { className: "size-4 animate-spin text-foreground-subtle" })) : task.unreadAt ? (_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" })) : null }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-ui-base text-foreground", children: taskTitle }), _jsxs("span", { className: "mt-1 flex min-w-0 items-center gap-1.5 text-ui-base text-foreground-subtle", children: [_jsx("span", { className: "truncate", children: taskWorkspace?.workspacePurpose === "conversation"
                                                                                    ? intl.formatMessage({
                                                                                        id: "workspaceSidebar.conversationsSection",
                                                                                    })
                                                                                    : task.workspaceLabel ||
                                                                                        taskWorkspace?.label ||
                                                                                        task.workspacePath }), _jsx("span", { className: "shrink-0", children: "\u00B7" }), _jsx("span", { className: "truncate", children: formatTaskRelativeTime(taskSortBy === "created" ? task.createdAt : task.updatedAt, intl) })] }), task.workflowActivity ? (_jsx(TaskWorkflowRunLines, { activity: task.workflowActivity, isActive: selected, intl: intl, density: "compact" })) : null] }), _jsxs("span", { className: cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-ui-xs leading-none", getWebRemoteControlTaskStatusClassName(displayStatus)), children: [getStatusIcon(displayStatus), intl.formatMessage({
                                                                        id: `webRemoteControl.taskStatus.${displayStatus}`,
                                                                    })] })] }) }, rowKey));
                                            }) })] }, group.key));
                            })] })) : (_jsx("ul", { className: "mt-3 space-y-2", children: model.groups.map((group) => {
                            const expanded = expandedWorkspaceKeys.has(group.workspaceKey);
                            const latestUpdatedAt = getWorkspaceLatestUpdatedAt(group.tasks);
                            const isDisconnectedRemoteWorkspace = group.workspace.kind === "remote" &&
                                (group.workspace.connectionState === "disconnected" ||
                                    !group.workspace.remoteSessionId);
                            const reconnecting = reconnectingWorkspaceKey === group.workspaceKey;
                            return (_jsxs("li", { className: "rounded-lg border border-card-border bg-card", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2 px-3 py-3", children: [_jsxs("button", { type: "button", className: "flex min-w-0 flex-1 items-center gap-2 text-left", "aria-expanded": expanded, onClick: () => toggleWorkspace(group.workspaceKey), children: [_jsx("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground-subtle", children: group.workspace.workspacePurpose === "conversation" ? (_jsx(MessageCirclePlus, { className: "size-4" })) : group.workspace.kind === "remote" ? (_jsx(Cloud, { className: "size-4" })) : (_jsx(FolderOpen, { className: "size-4" })) }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: group.workspace.workspacePurpose === "conversation"
                                                                            ? intl.formatMessage({
                                                                                id: "workspaceSidebar.conversationsSection",
                                                                            })
                                                                            : group.workspace.label }), _jsx("span", { className: "shrink-0 rounded-full border border-border bg-surface px-1.5 py-0.5 text-ui-xs leading-none text-foreground-subtle", children: intl.formatMessage({
                                                                            id: group.workspace.workspacePurpose === "conversation"
                                                                                ? "webRemoteControl.mobileHome.workspaceKind.conversation"
                                                                                : group.workspace.kind === "remote"
                                                                                    ? "webRemoteControl.mobileHome.workspaceKind.remote"
                                                                                    : "webRemoteControl.mobileHome.workspaceKind.local",
                                                                        }) }), isDisconnectedRemoteWorkspace ? (_jsx("span", { className: "shrink-0 rounded-full border border-destructive/40 bg-card px-1.5 py-0.5 text-ui-xs leading-none text-destructive", children: intl.formatMessage({
                                                                            id: "webRemoteControl.mobileHome.disconnected",
                                                                        }) })) : null] }), _jsx("span", { className: "mt-1 block truncate font-mono text-ui-base text-foreground-subtlest", children: group.workspace.workspacePath }), group.workspace.lastConnectionError ? (_jsx("span", { className: "mt-1 block truncate text-ui-base text-destructive", children: group.workspace.lastConnectionError })) : null, latestUpdatedAt ? (_jsx("span", { className: "mt-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "webRemoteControl.mobileHome.updatedAt" }, {
                                                                    time: formatTaskRelativeTime(latestUpdatedAt, intl),
                                                                }) })) : null] }), _jsxs("span", { className: "flex shrink-0 items-center gap-2 text-ui-base text-foreground-subtle", children: [!expanded && group.hasUnread ? (_jsx("span", { "aria-hidden": "true", "data-workspace-unread-indicator": "true", className: "h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" })) : null, intl.formatMessage({ id: "webRemoteControl.mobileHome.taskCount" }, { count: String(group.tasks.length) }), expanded ? (_jsx(ChevronDown, { className: "size-4" })) : (_jsx(ChevronRight, { className: "size-4" }))] })] }), isDisconnectedRemoteWorkspace ? (_jsxs(Button, { type: "button", size: "sm", variant: "outline", disabled: !switcher.reconnectWorkspace ||
                                                    Boolean(switchingTaskKey) ||
                                                    Boolean(creatingWorkspaceKey) ||
                                                    Boolean(reconnectingWorkspaceKey), onClick: () => {
                                                    void handleReconnectWorkspace(group.workspace);
                                                }, children: [reconnecting ? (_jsx(LoaderIcon, { className: "size-3.5 animate-spin" })) : (_jsx(RefreshCw, { className: "size-3.5" })), _jsx("span", { className: "sr-only", children: intl.formatMessage({
                                                            id: reconnecting
                                                                ? "webRemoteControl.mobileHome.reconnecting"
                                                                : "webRemoteControl.mobileHome.reconnect",
                                                        }) })] })) : (_jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: Boolean(switchingTaskKey) ||
                                                    Boolean(creatingWorkspaceKey) ||
                                                    Boolean(reconnectingWorkspaceKey), onClick: () => {
                                                    void handleStartDraft(group.workspace);
                                                }, children: creatingWorkspaceKey === group.workspaceKey ? (_jsx(LoaderIcon, { className: "size-3.5 animate-spin" })) : (_jsx(Plus, { className: "size-3.5" })) }))] }), expanded ? (_jsxs("ul", { className: "border-t border-card-border px-2 py-2", children: [group.tasks.length === 0 ? (_jsx("li", { className: "px-2 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                                    id: "webRemoteControl.mobileHome.workspaceEmpty",
                                                }) })) : null, group.tasks.map((task) => {
                                                const rowKey = buildWebRemoteControlTaskRowKey(task);
                                                const taskWorkspaceKey = resolveWebRemoteControlWorkspaceKey(task);
                                                const selected = taskWorkspaceKey === model.activeWorkspaceKey &&
                                                    task.taskId === model.activeTaskId;
                                                const switching = switchingTaskKey === rowKey;
                                                const taskTitle = task.title || intl.formatMessage({ id: "taskList.untitled" });
                                                const displayStatus = task.displayStatus ?? "idle";
                                                return (_jsx("li", { children: _jsxs("button", { type: "button", "data-testid": testId(TID_TASK_ITEM, task.taskId), "data-state": selected ? "selected" : "idle", className: cn("flex min-h-12 w-full min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors disabled:cursor-wait disabled:opacity-70", selected ? "bg-selected text-foreground" : "hover:bg-surface-hover"), disabled: Boolean(switchingTaskKey) || isDisconnectedRemoteWorkspace, onClick: () => {
                                                            if (!isDisconnectedRemoteWorkspace) {
                                                                handleOpenTask(task);
                                                            }
                                                        }, children: [_jsx("span", { className: "relative flex size-4 shrink-0 items-center justify-center", children: switching ? (_jsx(LoaderIcon, { className: "size-4 animate-spin text-foreground-subtle" })) : task.unreadAt ? (_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" })) : null }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-ui-base text-foreground", children: taskTitle }), _jsx("span", { className: "mt-1 flex min-w-0 items-center gap-1.5 text-ui-base text-foreground-subtle", children: _jsx("span", { className: "truncate", children: formatTaskRelativeTime(task.updatedAt, intl) }) }), task.workflowActivity ? (_jsx(TaskWorkflowRunLines, { activity: task.workflowActivity, isActive: selected, intl: intl, density: "compact" })) : null] }), _jsxs("span", { className: cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-ui-xs leading-none", getWebRemoteControlTaskStatusClassName(displayStatus)), children: [getStatusIcon(displayStatus), intl.formatMessage({
                                                                        id: `webRemoteControl.taskStatus.${displayStatus}`,
                                                                    })] })] }) }, rowKey));
                                            })] })) : null] }, group.workspaceKey));
                        }) }))] })] }));
}
//# sourceMappingURL=WebRemoteControlMobileTaskHome.js.map