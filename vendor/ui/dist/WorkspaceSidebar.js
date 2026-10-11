import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 归档视图开关沿用现有 sidebar 结构，先保持同文件收口。 */
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { Archive, Blocks, CalendarClock, Clock3, Cloud, Folder, FolderOpen, Hash, ListFilter, Maximize2, MessageCircleCheck, MessageCirclePlus, Minimize2, Plus, Search, X, } from "lucide-react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { BUILTIN_MODEL_PROVIDER_IDS } from "@zcode/shared";
import { TID_CONVERSATION_NEW_TASK, TID_CONVERSATION_SECTION, TID_AUTOMATIONS_OPEN, TID_PROJECT_ADD, TID_PROJECT_SECTION, TID_SIDEBAR, TID_WORKSPACE_LIST, } from "@zcode/shared";
import { resolveWebRemoteControlWorkspaceKey } from "@zcode/shared";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Button } from "@/components/ui/button.js";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { logger } from "@/logger.js";
import { NewTaskButtonGroup } from "@/NewTaskButtonGroup.js";
import { selectWorkspaceZCodeState, useZCodeSessionStore } from "@/store/zcodeSessionStore.js";
import { useZCodeStore } from "@/store/StoreProvider.js";
import { useTabStore } from "@/store/TabStoreProvider.js";
import { isWorkspaceReadOnly, isWorkspaceTab } from "@/store/tabStore.js";
import { useWorkspaceTaskLists } from "@/hooks/useWorkspaceTaskLists.js";
import { useWebRemoteControlStatus } from "@/hooks/useWebRemoteControlStatus.js";
import { persistSidebarTaskPreferences, readSidebarTaskPreferences, } from "@/lib/sidebarTaskPreferences.js";
import { persistSidebarPurposeSectionPreferences, readSidebarPurposeSectionPreferences, reorderSidebarPurposeSections, } from "@/lib/sidebarPurposeSectionPreferences.js";
import { useShortcutCommandLabel } from "@/shortcuts/useShortcutBindings.js";
import { setPendingSettingsSectionIntent } from "@/lib/settingsNavigation.js";
import { buildTaskWorkspaceKey } from "@/lib/taskQueryCache.js";
import { increaseWorkspaceTaskVisibleLimit, resolveVisibleWorkspaceTaskKeys, retainWorkspaceTaskVisibleLimits, WORKSPACE_TASK_PAGE_SIZE, } from "@/lib/workspaceTaskPagination.js";
import { partitionWorkspaceTabsByPurpose } from "@/lib/workspacePurpose.js";
import { areAllGroupedTaskGroupsExpanded, pruneCollapsedGroupedTaskGroupIds, } from "@/workspace-grouped-tasks/shared.js";
import { persistGroupedTaskCollapsedGroupIds, readGroupedTaskCollapsedGroupIds, } from "@/lib/groupedTaskExpansionPreference.js";
import { WorkspaceFileTree } from "@/WorkspaceFileTree.js";
import { WorkspaceArchivedTasksFlatSection } from "@/WorkspaceArchivedTasksFlatSection.js";
import { WebRemoteControlTaskIndex } from "@/WebRemoteControlTaskIndex.js";
import { WorkspaceSidebarFooter } from "@/WorkspaceSidebarFooter.js";
import { SidebarBottomActivity } from "@/sidebar-activity/SidebarBottomActivity.js";
import { WorkspacePinnedTasksSection } from "@/WorkspacePinnedTasksSection.js";
import { WorkspaceTimelineTasksSection } from "@/WorkspaceTimelineTasksSection.js";
import { WorkspaceGroupedTasksSection } from "@/WorkspaceGroupedTasksSection.js";
import { StickyGroupHeaderSlot } from "@/workspace-grouped-tasks/sticky-group-header-slot.js";
import { useWebRemoteControlFeatureEnabled } from "@/WebRemoteControlFeatureProvider.js";
import { SortableWorkspaceSidebarItem, restrictVerticalDragWithinContainer, } from "./SortableWorkspaceSidebar.js";
import { resolveSidebarTaskGroupTogglePresentation, } from "@/WorkspaceSidebar/taskGroupTogglePresentation.js";
import { WorkspacePurposeSection } from "@/WorkspaceSidebar/WorkspacePurposeSection.js";
import { cn } from "@/components/lib/utils.js";
import { useCodingPlanUpgradeDialog } from "@/settings/CodingPlanUpgradeDialogProvider.js";
import { resolveWorkspaceDragGlobalIndices, resolveWorkspaceDragExpanded, workspaceVerticalListSortingStrategy, } from "@/lib/workspaceSidebarDrag.js";
import { createPortal } from "react-dom";
function WorkspaceNewTaskTooltip({ children, disabledReason, }) {
    // 正常状态下按钮已带“新建任务”文案和快捷键，再挂 tooltip 只是重复；仅禁用时才解释原因。
    if (!disabledReason)
        return children;
    return (_jsx(ControlHintTooltip, { title: disabledReason, children: _jsx("div", { children: children }) }));
}
export { applyWorkspaceTriggerSelection } from "@/WorkspaceSidebar/workspaceSidebarSelection.js";
export { WorkspaceSidebarCollapsedRail } from "@/WorkspaceSidebar/WorkspaceSidebarCollapsedRail.js";
// 流式 task 事件会让 sidebar 父级频繁刷新；缺任务分组时如果传新的 []
// 会让 memo 的 workspace 行误判 taskItems 变化，穿透到 TaskList/TaskListItem 重渲染。
const EMPTY_WORKSPACE_TASK_ITEMS = [];
// WorkspaceSidebar 是 memo 组件，默认参数里的 {} 每次调用都会创建新引用；
// 缺省远程重连日志时必须复用同一个对象，避免浅比较被默认值打穿。
const EMPTY_RECONNECTING_REMOTE_WORKSPACE_LOGS_BY_WORKSPACE_KEY = {};
function WorkspaceDragOverlay({ tab, width }) {
    const isRemote = Boolean(tab.remoteSessionId || tab.remoteTarget || tab.workspaceIdentity);
    return (_jsxs("div", { "data-testid": "workspace-drag-overlay", className: "pointer-events-none flex cursor-grabbing items-center rounded-lg border border-border bg-background text-ui-base text-foreground shadow-lg h-8 px-2.5 gap-2 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0", style: width ? { width } : undefined, children: [isRemote ? (_jsx(Cloud, { className: "size-3.5 shrink-0 text-foreground-subtle" })) : (_jsx(Folder, { className: "size-3.5 shrink-0 text-foreground-subtle" })), _jsx("span", { className: "min-w-0 flex-1 truncate px-1", children: tab.label })] }));
}
function resolveSidebarTaskViewMode(params) {
    if (params.showArchivedTasks) {
        return "archived";
    }
    if (params.taskOrganizeBy === "chronological") {
        return "timeline";
    }
    if (params.taskOrganizeBy === "grouped") {
        return "grouped";
    }
    return "workspace";
}
export const WorkspaceSidebar = memo(function WorkspaceSidebarComponent({ workspacePath, workspaceRemoteSessionId, activePreviewPath, onSelectTask, onStartDraftInWorkspace, onOpenCodeViewer, onOpenBrowserUrl, fileTreeOpenRequest, onCreateTask, onCreateConversationTask, onOpenFolderFromWorkspaceMenu, onOpenRemoteWorkspace, webRemoteControlWorkspaceSwitcher, theme, onConnectRemote: _onConnectRemote, onSelectRemoteProject: _onSelectRemoteProject, onCancelRemoteProject: _onCancelRemoteProject, onReconnectRemoteWorkspace, onLogout, onLogin, user, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, reconnectingRemoteWorkspaceLogsByWorkspaceKey = EMPTY_RECONNECTING_REMOTE_WORKSPACE_LOGS_BY_WORKSPACE_KEY, isDesktop = false, isWebRemoteControl = false, isMacDesktop: _isMacDesktop = false, isWindowsDesktop = false, isSidebarVisible: _isSidebarVisible = true, onToggleSidebar: _onToggleSidebar, toggleSidebarShortcutLabel: _toggleSidebarShortcutLabel, canGoBack: _canGoBack = false, canGoForward: _canGoForward = false, onGoBack: _onGoBack, onGoForward: _onGoForward, goBackShortcutLabel: _goBackShortcutLabel, goForwardShortcutLabel: _goForwardShortcutLabel, onOpenCommandCenter, onOpenAutomations, onOpenPluginStore, automationsActive = false, pluginStoreActive = false, onFileTreeOpenChange, onWebRemoteTaskOpen, onWebRemoteTaskSwitchingChange, }) {
    const { intl, localePreference, setLocalePreference } = useZCodeIntl();
    const handleTaskRowSelect = useCallback((targetWorkspacePath, taskId, targetWorkspaceIdentity, expectedUnreadAt) => {
        // Shell 第四个参数是远程 session 路由，任务行的 unreadAt 不能复用该位置。
        // Sidebar 行选择显式留空 remoteSessionId，再把用户看到的未读版本传给已读事务。
        onSelectTask(targetWorkspacePath, taskId, targetWorkspaceIdentity, undefined, expectedUnreadAt);
    }, [onSelectTask]);
    const { openCodingPlanUpgrade } = useCodingPlanUpgradeDialog();
    const webRemoteControlFeatureEnabled = useWebRemoteControlFeatureEnabled();
    const bumpTaskListVersion = useZCodeSessionStore((state) => state.bumpTaskListVersion);
    const workspaceIdentity = useTabStore((state) => {
        if (!state.activeTabId) {
            return undefined;
        }
        const activeTab = state.tabs.find((tab) => tab.id === state.activeTabId);
        if (!activeTab || !isWorkspaceTab(activeTab) || activeTab.workspacePath !== workspacePath) {
            return undefined;
        }
        return activeTab.workspaceIdentity;
    });
    const workspaceReadOnly = useTabStore((state) => isWorkspaceReadOnly(state, workspacePath, workspaceIdentity));
    const workspaceReadOnlyReason = workspaceReadOnly
        ? intl.formatMessage({
            id: "workspaceSidebar.unavailableLocalDirectory",
        })
        : undefined;
    const setTheme = useZCodeStore((state) => state.setTheme);
    const commandCenterShortcutLabel = useShortcutCommandLabel("openCommandCenter");
    const tabs = useTabStore((state) => state.tabs);
    const activateTab = useTabStore((state) => state.activateTab);
    const closeTab = useTabStore((state) => state.closeTab);
    const openSettingsTab = useTabStore((state) => state.openSettingsTab);
    const expandedWorkspacePaths = useTabStore((state) => state.expandedWorkspacePaths);
    const toggleWorkspaceExpanded = useTabStore((state) => state.toggleWorkspaceExpanded);
    const reorderWorkspaceTabs = useTabStore((state) => state.reorderWorkspaceTabs);
    const expandAllWorkspaceTabs = useTabStore((state) => state.expandAllWorkspaceTabs);
    const collapseAllWorkspaceTabs = useTabStore((state) => state.collapseAllWorkspaceTabs);
    const workspaceTabs = useMemo(() => tabs.filter(isWorkspaceTab), [tabs]);
    const { conversationWorkspaceTabs, projectWorkspaceTabs } = useMemo(() => partitionWorkspaceTabsByPurpose(workspaceTabs), [workspaceTabs]);
    const workspacePaths = useMemo(() => projectWorkspaceTabs.map((tab) => tab.workspacePath), [projectWorkspaceTabs]);
    const areAllWorkspaceGroupsExpanded = useMemo(() => workspacePaths.length > 0 && workspacePaths.every((path) => expandedWorkspacePaths.has(path)), [expandedWorkspacePaths, workspacePaths]);
    const [showArchivedTasks, setShowArchivedTasks] = useState(false);
    const [archivedActionsContainer, setArchivedActionsContainer] = useState(null);
    const [isFileTreeOpen, setIsFileTreeOpen] = useState(false);
    const [fileTreeTarget, setFileTreeTarget] = useState(null);
    const [groupedStickyHeader, setGroupedStickyHeader] = useState(null);
    const [taskOrganizeBy, setTaskOrganizeBy] = useState(() => readSidebarTaskPreferences().organizeBy);
    const [taskSortBy, setTaskSortBy] = useState(() => readSidebarTaskPreferences().sortBy);
    const [purposeSectionPreferences, setPurposeSectionPreferences] = useState(readSidebarPurposeSectionPreferences);
    const [workspaceTaskOrganizeBy, setWorkspaceTaskOrganizeBy] = useState(() => {
        const initialOrganizeBy = readSidebarTaskPreferences().organizeBy;
        return initialOrganizeBy === "chronological" ? "chronological" : "project";
    });
    const [workspaceTaskVisibleLimitByKey, setWorkspaceTaskVisibleLimitByKey] = useState({});
    const [activeWorkspaceDragId, setActiveWorkspaceDragId] = useState(null);
    const [activeWorkspaceDragWidth, setActiveWorkspaceDragWidth] = useState(null);
    const [webRemoteCollapsedWorkspaceKeys, setWebRemoteCollapsedWorkspaceKeys] = useState(() => new Set());
    const [webRemoteWorkspaceGroupKeys, setWebRemoteWorkspaceGroupKeys] = useState([]);
    const [webRemoteWorkspaceGroupKeysHydrated, setWebRemoteWorkspaceGroupKeysHydrated] = useState(false);
    const [lastNonEmptyWebRemoteWorkspaceGroupKeys, setLastNonEmptyWebRemoteWorkspaceGroupKeys] = useState([]);
    const [webRemoteWorkspaceGroupSnapshotHasGroups, setWebRemoteWorkspaceGroupSnapshotHasGroups] = useState(null);
    const [groupedTaskGroupIds, setGroupedTaskGroupIds] = useState([]);
    const [groupedTaskGroupIdsHydrated, setGroupedTaskGroupIdsHydrated] = useState(false);
    const [lastNonEmptyGroupedTaskGroupIds, setLastNonEmptyGroupedTaskGroupIds] = useState([]);
    const [groupedTaskGroupSnapshotHasGroups, setGroupedTaskGroupSnapshotHasGroups] = useState(null);
    const [collapsedGroupedTaskGroupIds, setCollapsedGroupedTaskGroupIds] = useState(() => readGroupedTaskCollapsedGroupIds());
    const handleProjectSectionOpenChange = useCallback((projectsExpanded) => {
        setPurposeSectionPreferences((current) => {
            if (current.projectsExpanded === projectsExpanded) {
                return current;
            }
            const next = { ...current, projectsExpanded };
            persistSidebarPurposeSectionPreferences(next);
            return next;
        });
    }, []);
    const handleConversationSectionOpenChange = useCallback((conversationsExpanded) => {
        setPurposeSectionPreferences((current) => {
            if (current.conversationsExpanded === conversationsExpanded) {
                return current;
            }
            const next = { ...current, conversationsExpanded };
            persistSidebarPurposeSectionPreferences(next);
            return next;
        });
    }, []);
    const handlePurposeSectionDragEnd = useCallback((event) => {
        if (!event.over) {
            return;
        }
        setPurposeSectionPreferences((current) => {
            const sectionOrder = reorderSidebarPurposeSections(current.sectionOrder, String(event.active.id), String(event.over?.id));
            if (sectionOrder.every((sectionId, index) => sectionId === current.sectionOrder[index])) {
                return current;
            }
            const next = { ...current, sectionOrder };
            persistSidebarPurposeSectionPreferences(next);
            return next;
        });
    }, []);
    const primaryTaskTabsListRef = useRef(null);
    const primaryTaskTabTriggerRefs = useRef({
        workspace: null,
        grouped: null,
    });
    const [primaryTaskIndicatorStyle, setPrimaryTaskIndicatorStyle] = useState({
        opacity: 0,
        transform: "translateX(0px)",
        width: 0,
    });
    const lastStableTaskGroupTogglePresentationRef = useRef(null);
    const handleCollapsedGroupedTaskGroupIdsChange = useCallback((updater) => {
        setCollapsedGroupedTaskGroupIds((currentGroupIds) => {
            const nextGroupIds = typeof updater === "function" ? updater(currentGroupIds) : updater;
            if (nextGroupIds === currentGroupIds) {
                return currentGroupIds;
            }
            // grouped 展开态是本端用户偏好，不能只保存在 React 内存里。
            // 单组点击、批量按钮、拖拽临时收起后的恢复都必须同步到 localStorage。
            persistGroupedTaskCollapsedGroupIds(nextGroupIds);
            return nextGroupIds;
        });
    }, []);
    const handleGroupedTaskGroupIdsChange = useCallback((nextGroupIds) => {
        if (nextGroupIds.length === 0 &&
            !groupedTaskGroupIdsHydrated &&
            groupedTaskGroupSnapshotHasGroups !== false &&
            (lastNonEmptyGroupedTaskGroupIds.length > 0 || collapsedGroupedTaskGroupIds.size > 0)) {
            // 从 Project 切回 Group 或重启后首进 Group 时，
            // 子列表首帧还没加载 sqlite view，会先回传空 groupIds。
            // 这个瞬时空快照不能当成“所有 group 已删除”，否则会把用户收起偏好
            // prune 成空并写回 localStorage。
            return;
        }
        setGroupedTaskGroupIdsHydrated(true);
        setGroupedTaskGroupSnapshotHasGroups(nextGroupIds.length > 0);
        if (nextGroupIds.length > 0) {
            setLastNonEmptyGroupedTaskGroupIds(nextGroupIds);
        }
        setGroupedTaskGroupIds((currentGroupIds) => currentGroupIds.length === nextGroupIds.length &&
            currentGroupIds.every((groupId, index) => groupId === nextGroupIds[index])
            ? currentGroupIds
            : nextGroupIds);
        setCollapsedGroupedTaskGroupIds((currentGroupIds) => {
            const nextCollapsedGroupIds = pruneCollapsedGroupedTaskGroupIds(currentGroupIds, nextGroupIds);
            if (nextCollapsedGroupIds.size === currentGroupIds.size &&
                [...nextCollapsedGroupIds].every((groupId) => currentGroupIds.has(groupId))) {
                return currentGroupIds;
            }
            // 刷新或重启后需要从 localStorage 恢复 grouped 展开态；
            // view 刷新时也要清掉已删除 group 的旧收起记录，避免新 group 被旧状态误命中。
            persistGroupedTaskCollapsedGroupIds(nextCollapsedGroupIds);
            return nextCollapsedGroupIds;
        });
    }, [
        groupedTaskGroupIdsHydrated,
        groupedTaskGroupSnapshotHasGroups,
        collapsedGroupedTaskGroupIds.size,
        lastNonEmptyGroupedTaskGroupIds.length,
    ]);
    const handleWebRemoteWorkspaceGroupKeysChange = useCallback((nextGroupKeys) => {
        setWebRemoteWorkspaceGroupKeysHydrated(true);
        setWebRemoteWorkspaceGroupSnapshotHasGroups(nextGroupKeys.length > 0);
        if (nextGroupKeys.length > 0) {
            setLastNonEmptyWebRemoteWorkspaceGroupKeys(nextGroupKeys);
        }
        setWebRemoteWorkspaceGroupKeys((currentGroupKeys) => currentGroupKeys.length === nextGroupKeys.length &&
            currentGroupKeys.every((groupKey, index) => groupKey === nextGroupKeys[index])
            ? currentGroupKeys
            : nextGroupKeys);
        setWebRemoteCollapsedWorkspaceKeys((currentGroupKeys) => {
            const nextGroupKeySet = new Set(nextGroupKeys);
            const nextCollapsedGroupKeys = new Set([...currentGroupKeys].filter((groupKey) => nextGroupKeySet.has(groupKey)));
            if (nextCollapsedGroupKeys.size === currentGroupKeys.size &&
                [...nextCollapsedGroupKeys].every((groupKey) => currentGroupKeys.has(groupKey))) {
                return currentGroupKeys;
            }
            return nextCollapsedGroupKeys;
        });
    }, []);
    useEffect(() => {
        if (!fileTreeOpenRequest) {
            return;
        }
        setFileTreeTarget(fileTreeOpenRequest.target);
        setIsFileTreeOpen(true);
    }, [fileTreeOpenRequest]);
    useEffect(() => {
        onFileTreeOpenChange?.(isFileTreeOpen);
    }, [isFileTreeOpen, onFileTreeOpenChange]);
    useEffect(() => {
        return () => onFileTreeOpenChange?.(false);
    }, [onFileTreeOpenChange]);
    useEffect(() => {
        persistSidebarTaskPreferences({
            organizeBy: taskOrganizeBy,
            sortBy: taskSortBy,
        });
    }, [taskOrganizeBy, taskSortBy]);
    useEffect(() => {
        if (taskOrganizeBy === "project" || taskOrganizeBy === "chronological") {
            setWorkspaceTaskOrganizeBy(taskOrganizeBy);
        }
    }, [taskOrganizeBy]);
    const isWebRemoteControlSidebar = Boolean(webRemoteControlWorkspaceSwitcher || isWebRemoteControl);
    const taskViewMode = resolveSidebarTaskViewMode({
        showArchivedTasks,
        taskOrganizeBy,
    });
    const effectiveTaskViewMode = isWebRemoteControlSidebar && taskViewMode === "grouped" ? "workspace" : taskViewMode;
    const visibleWorkspaceTaskKeys = useMemo(() => resolveVisibleWorkspaceTaskKeys({
        enabled: !isWebRemoteControlSidebar &&
            effectiveTaskViewMode === "workspace" &&
            purposeSectionPreferences.projectsExpanded,
        expandedWorkspacePaths,
        workspaces: projectWorkspaceTabs,
    }), [
        effectiveTaskViewMode,
        expandedWorkspacePaths,
        isWebRemoteControlSidebar,
        projectWorkspaceTabs,
        purposeSectionPreferences.projectsExpanded,
    ]);
    useEffect(() => {
        // 交互规则：分页进度只属于当前可见且已展开的 workspace。
        // 单组/项目区/全部收起、切换视图或移除 workspace 都通过同一可见集合清理，
        // 避免不同收起入口各自维护重置逻辑而出现遗漏。
        setWorkspaceTaskVisibleLimitByKey((current) => retainWorkspaceTaskVisibleLimits(current, visibleWorkspaceTaskKeys));
    }, [visibleWorkspaceTaskKeys]);
    useEffect(() => {
        if (taskViewMode !== "grouped") {
            setGroupedStickyHeader(null);
        }
    }, [taskViewMode]);
    useEffect(() => {
        if (!isWebRemoteControlSidebar || effectiveTaskViewMode !== "workspace") {
            return;
        }
        setWebRemoteWorkspaceGroupKeysHydrated(false);
    }, [effectiveTaskViewMode, isWebRemoteControlSidebar]);
    const [createGroupedTaskGroupAction, setCreateGroupedTaskGroupAction] = useState(null);
    const [createGroupedTaskDraftAction, setCreateGroupedTaskDraftAction] = useState(null);
    const handleCreateGroupActionChange = useCallback((action) => {
        setCreateGroupedTaskGroupAction(() => action);
    }, []);
    const handleCreateDraftTaskActionChange = useCallback((action) => {
        setCreateGroupedTaskDraftAction(() => action);
    }, []);
    const shouldShowPinnedTasks = !isWebRemoteControlSidebar &&
        (taskViewMode === "workspace" ||
            taskViewMode === "timeline" ||
            taskViewMode === "archived" ||
            // Bugfix: grouped 主体会主动过滤 pinned task；如果同页不渲染全局置顶区，
            // 从 Header 置顶当前任务后整条 row 会无处展示，看起来像 session 被删除。
            taskViewMode === "grouped");
    const workspaceScrollRef = useRef(null);
    const [showWorkspaceTopMask, setShowWorkspaceTopMask] = useState(false);
    const [showWorkspaceBottomMask, setShowWorkspaceBottomMask] = useState(false);
    const workspaceSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
    const purposeSectionSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    const localeMenuValue = localePreference === "system" ? "system" : localePreference;
    const workspaceTaskLists = useWorkspaceTaskLists({
        workspaceTabs: projectWorkspaceTabs,
        activeWorkspacePath: workspacePath,
        activeWorkspaceIdentity: workspaceIdentity,
        sortBy: taskSortBy,
        visibleLimitByWorkspaceKey: workspaceTaskVisibleLimitByKey,
        defaultVisibleLimit: WORKSPACE_TASK_PAGE_SIZE,
    });
    const webRemoteControlStatus = useWebRemoteControlStatus({
        enabled: isDesktop && webRemoteControlFeatureEnabled,
    });
    const mobileActiveTaskKey = useMemo(() => {
        const mobileViewState = webRemoteControlStatus.mobileViewState;
        if (!webRemoteControlStatus.mobileConnected ||
            !mobileViewState?.activeWorkspaceKey ||
            !mobileViewState.activeTaskId) {
            return null;
        }
        // Bugfix: main 进程已经保存手机端当前 task，但桌面 task 列表没有订阅该状态。
        // 这里用 workspaceIdentity 语义的 workspaceKey 组合 taskId，保证远程 workspace 不会按路径误匹配。
        return `${mobileViewState.activeWorkspaceKey}:${mobileViewState.activeTaskId}`;
    }, [webRemoteControlStatus.mobileConnected, webRemoteControlStatus.mobileViewState]);
    const workspaceTaskGroupByKey = useMemo(() => new Map(workspaceTaskLists.groups.map((group) => [
        buildTaskWorkspaceKey(group.workspacePath, group.workspaceIdentity),
        group,
    ])), [workspaceTaskLists.groups]);
    const handleShowMoreWorkspaceTasks = useCallback((workspaceKey) => {
        setWorkspaceTaskVisibleLimitByKey((current) => increaseWorkspaceTaskVisibleLimit(current, workspaceKey));
    }, []);
    const handleOpenWorkspaceFileTree = useCallback((target) => {
        setFileTreeTarget(target);
        setIsFileTreeOpen(true);
    }, []);
    const mobileMissingTaskRefreshRef = useRef(null);
    useEffect(() => {
        const mobileViewState = webRemoteControlStatus.mobileViewState;
        const mobileWorkspaceKey = mobileViewState?.activeWorkspaceKey?.trim() ?? "";
        const mobileTaskId = mobileViewState?.activeTaskId?.trim() ?? "";
        if (!webRemoteControlStatus.mobileConnected || !mobileWorkspaceKey || !mobileTaskId) {
            mobileMissingTaskRefreshRef.current = null;
            return;
        }
        const taskGroup = workspaceTaskGroupByKey.get(mobileWorkspaceKey);
        const hasTask = taskGroup?.items.some((task) => task.taskId === mobileTaskId) ?? false;
        if (hasTask) {
            mobileMissingTaskRefreshRef.current = null;
            return;
        }
        const dedupeKey = `${mobileWorkspaceKey}:${mobileTaskId}`;
        if (mobileMissingTaskRefreshRef.current === dedupeKey) {
            return;
        }
        mobileMissingTaskRefreshRef.current = dedupeKey;
        // Bugfix: 手机端已切到新任务但桌面列表偶发未及时收敛（例如跨端事件先后顺序抖动）时，
        // 这里按 mobileViewState 主动触发一次 workspace 列表重查，避免任务一直"手机可见、桌面缺失"。
        bumpTaskListVersion(workspacePath, workspaceIdentity);
    }, [
        bumpTaskListVersion,
        webRemoteControlStatus.mobileConnected,
        webRemoteControlStatus.mobileViewState,
        workspaceIdentity,
        workspacePath,
        workspaceTaskGroupByKey,
    ]);
    const workspaceScrollMaskStyle = useMemo(() => {
        const baseStyle = { overflowAnchor: "none" };
        if (!showWorkspaceTopMask && !showWorkspaceBottomMask) {
            return baseStyle;
        }
        const topStop = showWorkspaceTopMask ? "transparent 0px, black 32px" : "black 0px, black 32px";
        const bottomStop = showWorkspaceBottomMask
            ? "black calc(100% - 32px), transparent 100%"
            : "black calc(100% - 32px), black 100%";
        return {
            ...baseStyle,
            // 这里直接对滚动容器应用 CSS mask，而不是盖一层 overlay。
            // 这样顶部和底部的渐隐都会作用在真实内容上，并且滚到边界时能立刻消失。
            WebkitMaskImage: `linear-gradient(to bottom, ${topStop}, ${bottomStop})`,
            maskImage: `linear-gradient(to bottom, ${topStop}, ${bottomStop})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
        };
    }, [showWorkspaceBottomMask, showWorkspaceTopMask]);
    const resetWorkspaceDrag = useCallback(() => {
        setActiveWorkspaceDragId(null);
        setActiveWorkspaceDragWidth(null);
    }, []);
    const handleWorkspaceDragStart = useCallback((event) => {
        setActiveWorkspaceDragId(String(event.active.id));
        setActiveWorkspaceDragWidth(event.active.rect.current.initial?.width ?? null);
    }, []);
    const handleWorkspaceDragCancel = useCallback((_event) => {
        resetWorkspaceDrag();
    }, [resetWorkspaceDrag]);
    const handleWorkspaceDragEnd = useCallback((event) => {
        const { active, over } = event;
        resetWorkspaceDrag();
        if (!over || active.id === over.id) {
            return;
        }
        // 项目拖拽只展示 project 子序列，但 tabStore 保存的是全量 workspace 顺序。
        // 直接混用两个索引会在 conversation workspace 存在时把项目落到错误位置。
        const indices = resolveWorkspaceDragGlobalIndices({
            activeId: String(active.id),
            overId: String(over.id),
            projectTabs: projectWorkspaceTabs,
            workspaceTabs,
        });
        if (indices) {
            reorderWorkspaceTabs(indices.fromIndex, indices.toIndex);
        }
    }, [projectWorkspaceTabs, reorderWorkspaceTabs, resetWorkspaceDrag, workspaceTabs]);
    const activeWorkspaceDragTab = useMemo(() => activeWorkspaceDragId
        ? (projectWorkspaceTabs.find((tab) => tab.id === activeWorkspaceDragId) ?? null)
        : null, [activeWorkspaceDragId, projectWorkspaceTabs]);
    const handleThemeChange = useCallback((value) => {
        if (value === "light" ||
            value === "dark" ||
            value === "zai-light" ||
            value === "zai-dark" ||
            value === "system") {
            setTheme(value);
        }
    }, [setTheme]);
    const handleLocaleChange = useCallback((value) => {
        if (value === "system") {
            setLocalePreference("system");
            return;
        }
        if (value === "zh-CN" || value === "en-US") {
            setLocalePreference(value);
        }
    }, [setLocalePreference]);
    const handleOpenPluginStoreMain = useCallback(() => {
        onOpenPluginStore?.();
    }, [onOpenPluginStore]);
    const handleOpenAutomationsMain = useCallback(() => {
        onOpenAutomations?.();
    }, [onOpenAutomations]);
    const handleOpenCodingPlanUpgrade = useCallback((providerId, funnelContext) => {
        openCodingPlanUpgrade({
            providerId,
            funnelContext,
        });
    }, [openCodingPlanUpgrade]);
    const activeTaskId = useZCodeSessionStore((state) => 
    // Web 远程控制从全局 task 入口进入远端 workspace 时，会先按
    // workspaceIdentity 写入 activeTaskId；如果侧栏仍然只读 path-only 桶，
    // 当前任务高亮会丢失，也会把后续选择误判成未激活。
    selectWorkspaceZCodeState(state, workspacePath, workspaceIdentity).activeTaskId);
    useEffect(() => {
        if (!webRemoteControlWorkspaceSwitcher?.updateMobileViewState) {
            return;
        }
        if (!activeTaskId) {
            return;
        }
        const workspaceKey = resolveWebRemoteControlWorkspaceKey({
            workspacePath,
            workspaceIdentity,
        });
        // Bugfix: 聊天区内 fork/new task 会直接切换本地 activeTaskId，
        // 但之前只有"点任务列表项"才会上报 mobileViewState，导致远控侧栏继续高亮旧任务。
        // 这里在 activeTaskId 变化后补一次同步，保证移动端任务选中态与真实会话一致。
        void webRemoteControlWorkspaceSwitcher
            .updateMobileViewState(workspaceKey, activeTaskId)
            .catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            logger.warn("[WorkspaceSidebar] 同步远控 mobileViewState 失败", {
                error: message,
                workspaceKey,
                taskId: activeTaskId,
            });
        });
    }, [activeTaskId, webRemoteControlWorkspaceSwitcher, workspaceIdentity, workspacePath]);
    useEffect(() => {
        const scrollNode = workspaceScrollRef.current;
        if (!scrollNode) {
            return;
        }
        const contentNode = scrollNode.firstElementChild;
        const updateWorkspaceScrollMask = () => {
            const hasOverflow = scrollNode.scrollHeight > scrollNode.clientHeight + 1;
            const isAtTop = scrollNode.scrollTop <= 1;
            const isAtBottom = scrollNode.scrollTop + scrollNode.clientHeight >= scrollNode.scrollHeight - 1;
            setShowWorkspaceTopMask(hasOverflow && !isAtTop);
            setShowWorkspaceBottomMask(hasOverflow && !isAtBottom);
        };
        // RAF-based debounce to coalesce resize events
        let rafId = null;
        let latestCallback = updateWorkspaceScrollMask;
        const debouncedUpdate = () => {
            if (rafId !== null)
                return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                latestCallback();
            });
        };
        // workspace 列表的滚动条只在内容溢出后才出现。
        // 如果只监听 scroll，像"展开 workspace 后首次产生滚动条"这类场景不会立刻出现顶部/底部渐隐；
        // 这里同时监听容器与内容尺寸变化，让 mask 能跟随内容增减和滚动位置一起更新。
        updateWorkspaceScrollMask();
        const resizeObserver = new ResizeObserver(() => {
            latestCallback = updateWorkspaceScrollMask;
            debouncedUpdate();
        });
        resizeObserver.observe(scrollNode);
        if (contentNode instanceof HTMLElement) {
            resizeObserver.observe(contentNode);
        }
        scrollNode.addEventListener("scroll", updateWorkspaceScrollMask, {
            passive: true,
        });
        window.addEventListener("resize", debouncedUpdate);
        return () => {
            resizeObserver.disconnect();
            scrollNode.removeEventListener("scroll", updateWorkspaceScrollMask);
            window.removeEventListener("resize", debouncedUpdate);
            if (rafId !== null)
                cancelAnimationFrame(rafId);
        };
    }, [expandedWorkspacePaths, workspaceTabs.length]);
    const isWebRemoteWorkspaceTaskGroupView = isWebRemoteControlSidebar && !showArchivedTasks && effectiveTaskViewMode === "workspace";
    const toggleableWebRemoteWorkspaceGroupKeys = webRemoteWorkspaceGroupKeys.length > 0
        ? webRemoteWorkspaceGroupKeys
        : webRemoteWorkspaceGroupSnapshotHasGroups === false
            ? []
            : lastNonEmptyWebRemoteWorkspaceGroupKeys;
    const showOptimisticWebRemoteTaskGroupToggle = isWebRemoteWorkspaceTaskGroupView &&
        !webRemoteWorkspaceGroupKeysHydrated &&
        webRemoteWorkspaceGroupSnapshotHasGroups !== false;
    const showToggleAllWebRemoteTaskGroups = isWebRemoteWorkspaceTaskGroupView &&
        (webRemoteWorkspaceGroupKeys.length > 0 || showOptimisticWebRemoteTaskGroupToggle);
    const canToggleAllWebRemoteTaskGroups = isWebRemoteWorkspaceTaskGroupView && toggleableWebRemoteWorkspaceGroupKeys.length > 0;
    const areAllWebRemoteTaskGroupsExpanded = toggleableWebRemoteWorkspaceGroupKeys.length > 0 &&
        toggleableWebRemoteWorkspaceGroupKeys.every((groupKey) => !webRemoteCollapsedWorkspaceKeys.has(groupKey));
    const isGroupedTaskGroupView = !isWebRemoteControlSidebar && !showArchivedTasks && taskOrganizeBy === "grouped";
    const toggleableGroupedTaskGroupIds = groupedTaskGroupIds.length > 0
        ? groupedTaskGroupIds
        : groupedTaskGroupSnapshotHasGroups === false
            ? []
            : lastNonEmptyGroupedTaskGroupIds;
    const showOptimisticGroupedTaskGroupToggle = isGroupedTaskGroupView &&
        !groupedTaskGroupIdsHydrated &&
        groupedTaskGroupSnapshotHasGroups !== false;
    const showToggleAllGroupedTaskGroups = isGroupedTaskGroupView &&
        (groupedTaskGroupIds.length > 0 || showOptimisticGroupedTaskGroupToggle);
    const canToggleAllGroupedTaskGroups = isGroupedTaskGroupView && toggleableGroupedTaskGroupIds.length > 0;
    const areAllToggleableGroupedTaskGroupsOpen = areAllGroupedTaskGroupsExpanded(toggleableGroupedTaskGroupIds, collapsedGroupedTaskGroupIds);
    const canToggleAllProjectTaskGroups = !isWebRemoteControlSidebar &&
        !showArchivedTasks &&
        taskOrganizeBy === "project" &&
        projectWorkspaceTabs.length > 0;
    const showToggleAllTaskGroups = showToggleAllWebRemoteTaskGroups ||
        canToggleAllProjectTaskGroups ||
        showToggleAllGroupedTaskGroups;
    const canToggleAllTaskGroups = canToggleAllWebRemoteTaskGroups ||
        canToggleAllProjectTaskGroups ||
        canToggleAllGroupedTaskGroups;
    const areAllTaskGroupsExpanded = showToggleAllWebRemoteTaskGroups
        ? areAllWebRemoteTaskGroupsExpanded
        : taskOrganizeBy === "grouped"
            ? areAllToggleableGroupedTaskGroupsOpen
            : purposeSectionPreferences.projectsExpanded && areAllWorkspaceGroupsExpanded;
    const toggleAllTaskGroupsTransitionPending = showOptimisticWebRemoteTaskGroupToggle || showOptimisticGroupedTaskGroupToggle;
    const toggleAllTaskGroupsPresentation = resolveSidebarTaskGroupTogglePresentation({
        current: {
            visible: showToggleAllTaskGroups,
            canToggle: canToggleAllTaskGroups,
            areAllExpanded: areAllTaskGroupsExpanded,
            transitionPending: toggleAllTaskGroupsTransitionPending,
        },
        previous: lastStableTaskGroupTogglePresentationRef.current,
    });
    const activePrimaryTaskMode = !isWebRemoteControlSidebar && taskOrganizeBy === "grouped" ? "grouped" : "workspace";
    const workspaceTaskViewValue = taskOrganizeBy === "chronological" ? "chronological" : "project";
    const showTaskViewFilter = activePrimaryTaskMode === "workspace" || showArchivedTasks;
    const showWorkspaceViewOptions = activePrimaryTaskMode === "workspace" && !showArchivedTasks;
    const showTaskSortOptions = activePrimaryTaskMode === "workspace" || showArchivedTasks;
    const handlePrimaryTaskModeChange = useCallback((value) => {
        logger.debug("[WorkspaceSidebar] 切换任务一级视图", {
            from: taskOrganizeBy,
            to: value,
            groupedHydrated: groupedTaskGroupIdsHydrated,
            groupedCount: groupedTaskGroupIds.length,
            lastGroupedCount: lastNonEmptyGroupedTaskGroupIds.length,
        });
        if (value === "grouped") {
            setGroupedTaskGroupIdsHydrated(false);
            setTaskOrganizeBy("grouped");
            return;
        }
        if (value === "workspace") {
            setTaskOrganizeBy(workspaceTaskOrganizeBy);
        }
    }, [
        groupedTaskGroupIds.length,
        groupedTaskGroupIdsHydrated,
        lastNonEmptyGroupedTaskGroupIds.length,
        taskOrganizeBy,
        workspaceTaskOrganizeBy,
    ]);
    const handleWorkspaceTaskViewChange = useCallback((value) => {
        if (value !== "project" && value !== "chronological") {
            return;
        }
        setWorkspaceTaskOrganizeBy(value);
        setTaskOrganizeBy(value);
    }, []);
    const handleToggleAllTaskGroups = useCallback(() => {
        if (!canToggleAllTaskGroups) {
            return;
        }
        if (canToggleAllWebRemoteTaskGroups) {
            setWebRemoteCollapsedWorkspaceKeys(areAllWebRemoteTaskGroupsExpanded
                ? new Set(toggleableWebRemoteWorkspaceGroupKeys)
                : new Set());
            return;
        }
        if (taskOrganizeBy === "grouped") {
            if (toggleableGroupedTaskGroupIds.length === 0) {
                return;
            }
            handleCollapsedGroupedTaskGroupIdsChange(areAllToggleableGroupedTaskGroupsOpen ? new Set(toggleableGroupedTaskGroupIds) : new Set());
            return;
        }
        if (purposeSectionPreferences.projectsExpanded && areAllWorkspaceGroupsExpanded) {
            handleProjectSectionOpenChange(false);
            collapseAllWorkspaceTabs(workspacePaths);
            return;
        }
        handleProjectSectionOpenChange(true);
        expandAllWorkspaceTabs(workspacePaths);
    }, [
        areAllWebRemoteTaskGroupsExpanded,
        areAllWorkspaceGroupsExpanded,
        areAllToggleableGroupedTaskGroupsOpen,
        canToggleAllWebRemoteTaskGroups,
        canToggleAllTaskGroups,
        collapseAllWorkspaceTabs,
        expandAllWorkspaceTabs,
        handleCollapsedGroupedTaskGroupIdsChange,
        handleProjectSectionOpenChange,
        purposeSectionPreferences.projectsExpanded,
        taskOrganizeBy,
        toggleableGroupedTaskGroupIds,
        toggleableWebRemoteWorkspaceGroupKeys,
        workspacePaths,
    ]);
    useEffect(() => {
        // Group 视图会在切换后的下一轮子组件渲染里回传 group ids。
        // 如果切换帧直接使用未 hydrate 的模型，按钮会短暂变成 disabled/expand 图标，造成闪动。
        // 因此在待 hydrate 期间复用上一帧展示模型；真实点击能力仍由 handleToggleAllTaskGroups 的当前状态 guard。
        if (!toggleAllTaskGroupsTransitionPending) {
            lastStableTaskGroupTogglePresentationRef.current = toggleAllTaskGroupsPresentation;
        }
    }, [toggleAllTaskGroupsPresentation, toggleAllTaskGroupsTransitionPending]);
    useLayoutEffect(() => {
        if (isWebRemoteControlSidebar) {
            return;
        }
        const listNode = primaryTaskTabsListRef.current;
        if (!listNode) {
            return;
        }
        const updateIndicator = () => {
            const activeTrigger = primaryTaskTabTriggerRefs.current[activePrimaryTaskMode];
            if (!activeTrigger) {
                return;
            }
            const nextTransform = `translateX(${activeTrigger.offsetLeft}px)`;
            const nextWidth = activeTrigger.offsetWidth;
            setPrimaryTaskIndicatorStyle((current) => current.opacity === 1 && current.transform === nextTransform && current.width === nextWidth
                ? current
                : {
                    opacity: 1,
                    transform: nextTransform,
                    width: nextWidth,
                });
        };
        let animationFrameId = null;
        const scheduleUpdate = () => {
            if (animationFrameId !== null) {
                return;
            }
            animationFrameId = requestAnimationFrame(() => {
                animationFrameId = null;
                updateIndicator();
            });
        };
        updateIndicator();
        const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
        resizeObserver?.observe(listNode);
        for (const triggerNode of Object.values(primaryTaskTabTriggerRefs.current)) {
            if (triggerNode) {
                resizeObserver?.observe(triggerNode);
            }
        }
        window.addEventListener("resize", scheduleUpdate);
        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, [activePrimaryTaskMode, isWebRemoteControlSidebar]);
    const archivedTasksActionLabel = intl.formatMessage({
        // 归档视图打开后按钮图标会切换为 X，之前 tooltip 仍固定显示“归档”，
        // 图标语义与文案不一致。打开态统一改成 Close，同时同步 aria-label。
        id: showArchivedTasks ? "common.close" : "workspaceSidebar.toggleArchivedTasks",
    });
    // 性能修复：workspaceTaskToolbar 会随 chat streaming 被重复创建并传给远控任务索引。
    // 这里把 render prop 稳定在真正影响工具栏展示的状态上，避免消息流更新污染侧栏任务区。
    const workspaceTaskToolbar = useCallback(() => (_jsx("div", { className: cn("pl-2.5 pr-3", isWebRemoteControlSidebar && "-mx-4"), children: _jsxs("div", { className: "flex min-w-0 items-center justify-between gap-2", children: [_jsxs("div", { className: "flex min-w-0 shrink-0 items-center gap-1", children: [isWebRemoteControlSidebar ? (_jsx("div", { className: "inline-flex h-7 min-w-0 items-center rounded-full border border-border bg-surface px-2 text-ui-xs font-medium text-foreground", children: intl.formatMessage({
                                id: "workspaceSidebar.organizeByProject",
                            }) })) : (_jsx(Tabs, { value: activePrimaryTaskMode, onValueChange: handlePrimaryTaskModeChange, className: "w-fit shrink-0", "aria-label": intl.formatMessage({
                                id: "workspaceSidebar.organize",
                            }), children: _jsxs(TabsList, { ref: primaryTaskTabsListRef, className: "relative h-7 w-fit overflow-hidden rounded-full bg-surface p-0.5 group-data-horizontal/tabs:h-7", children: [_jsx("span", { "aria-hidden": "true", className: "pointer-events-none absolute inset-y-0.5 left-0 rounded-full bg-background transition-[opacity,transform,width] duration-200 ease-out", style: primaryTaskIndicatorStyle }), _jsxs(TabsTrigger, { ref: (node) => {
                                            primaryTaskTabTriggerRefs.current.grouped = node;
                                        }, value: "grouped", className: "relative z-10 h-6 flex-none gap-1 rounded-full border-transparent bg-transparent py-0 pl-1.5 pr-2 text-ui-sm font-medium text-foreground-subtle transition-colors data-active:border-transparent data-active:bg-transparent data-active:text-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent", children: [_jsx(Hash, { "aria-hidden": "true", className: "size-3 shrink-0" }), _jsx("span", { children: intl.formatMessage({
                                                    id: "workspaceSidebar.organizeGrouped",
                                                }) })] }), _jsxs(TabsTrigger, { ref: (node) => {
                                            primaryTaskTabTriggerRefs.current.workspace = node;
                                        }, value: "workspace", className: "relative z-10 h-6 flex-none gap-1 rounded-full border-transparent bg-transparent py-0 pl-1.5 pr-2 text-ui-sm font-medium text-foreground-subtle transition-colors data-active:border-transparent data-active:bg-transparent data-active:text-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent", children: [_jsx(Folder, { "aria-hidden": "true", className: "size-3 shrink-0" }), _jsx("span", { children: intl.formatMessage({
                                                    id: "workspaceSidebar.organizeByProject",
                                                }) })] })] }) })), toggleAllTaskGroupsPresentation ? (_jsx(ControlHintTooltip, { title: intl.formatMessage({
                                id: toggleAllTaskGroupsPresentation.messageId,
                            }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({
                                    id: toggleAllTaskGroupsPresentation.messageId,
                                }), disabled: !toggleAllTaskGroupsPresentation.canToggle, onClick: handleToggleAllTaskGroups, children: toggleAllTaskGroupsPresentation.areAllExpanded ? (_jsx(Minimize2, { className: "size-3.5" })) : (_jsx(Maximize2, { className: "size-3.5" })) }) })) : null] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [!isWebRemoteControlSidebar && taskViewMode === "grouped" ? (_jsx(ControlHintTooltip, { title: workspaceReadOnlyReason ?? intl.formatMessage({ id: "taskGroup.newGroup" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({
                                    id: "taskGroup.newGroup",
                                }), disabled: workspaceReadOnly || !createGroupedTaskGroupAction, onClick: () => {
                                    if (!workspaceReadOnly) {
                                        createGroupedTaskGroupAction?.();
                                    }
                                }, children: _jsx(Hash, { className: "size-3.5" }) }) })) : null, showTaskViewFilter ? (_jsxs(DropdownMenu, { children: [_jsx(ControlHintTooltip, { title: intl.formatMessage({
                                        id: "workspaceSidebar.taskViewOptions",
                                    }), children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({
                                                id: "workspaceSidebar.taskViewOptions",
                                            }), children: _jsx(ListFilter, { className: "size-3.5" }) }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-48 min-w-48", children: [showWorkspaceViewOptions ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuLabel, { children: intl.formatMessage({
                                                        id: "workspaceSidebar.organize",
                                                    }) }), _jsxs(DropdownMenuRadioGroup, { value: workspaceTaskViewValue, onValueChange: handleWorkspaceTaskViewChange, children: [_jsxs(DropdownMenuRadioItem, { value: "project", children: [_jsx(Folder, { className: "size-4" }), intl.formatMessage({
                                                                    id: "workspaceSidebar.viewByWorkspace",
                                                                })] }), _jsxs(DropdownMenuRadioItem, { value: "chronological", children: [_jsx(Clock3, { className: "size-4" }), intl.formatMessage({
                                                                    id: "workspaceSidebar.organizeChronologicalList",
                                                                })] })] })] })) : null, showWorkspaceViewOptions && showTaskSortOptions ? (_jsx(DropdownMenuSeparator, {})) : null, showTaskSortOptions ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuLabel, { children: intl.formatMessage({
                                                        id: "workspaceSidebar.sortBy",
                                                    }) }), _jsxs(DropdownMenuRadioGroup, { value: taskSortBy, onValueChange: (value) => {
                                                        if (value === "created" || value === "updated") {
                                                            setTaskSortBy(value);
                                                        }
                                                    }, children: [_jsxs(DropdownMenuRadioItem, { value: "updated", children: [_jsx(MessageCircleCheck, { className: "size-4" }), intl.formatMessage({
                                                                    id: "workspaceSidebar.sortByUpdated",
                                                                })] }), _jsxs(DropdownMenuRadioItem, { value: "created", children: [_jsx(MessageCirclePlus, { className: "size-4" }), intl.formatMessage({
                                                                    id: "workspaceSidebar.sortByCreated",
                                                                })] })] })] })) : null] })] })) : null, showArchivedTasks ? (_jsx("div", { ref: setArchivedActionsContainer, "data-testid": "archived-tasks-toolbar-actions", className: "flex shrink-0 items-center" })) : null, _jsx(ControlHintTooltip, { title: archivedTasksActionLabel, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground-subtle hover:text-foreground data-[state=on]:bg-hover data-[state=on]:text-foreground", "data-state": showArchivedTasks ? "on" : "off", "aria-label": archivedTasksActionLabel, onClick: () => {
                                    setShowArchivedTasks((current) => !current);
                                }, children: showArchivedTasks ? _jsx(X, { className: "size-3.5" }) : _jsx(Archive, { className: "size-3.5" }) }) })] })] }) })), [
        activePrimaryTaskMode,
        archivedTasksActionLabel,
        createGroupedTaskGroupAction,
        handlePrimaryTaskModeChange,
        handleToggleAllTaskGroups,
        handleWorkspaceTaskViewChange,
        intl,
        isWebRemoteControlSidebar,
        primaryTaskIndicatorStyle,
        showArchivedTasks,
        showTaskSortOptions,
        showTaskViewFilter,
        showWorkspaceViewOptions,
        taskSortBy,
        taskViewMode,
        toggleAllTaskGroupsPresentation,
        workspaceTaskViewValue,
    ]);
    // Bugfix：Footer 使用 memo，内联 JSX 会让无关的侧栏更新也穿透其稳定引用边界。
    const sidebarBottomActivity = useMemo(() => _jsx(SidebarBottomActivity, {}), []);
    return (_jsxs("aside", { "data-testid": TID_SIDEBAR, 
        // 这里用设计系统的结构面 token 固定侧栏层级，避免不同合成器把左侧容器混成异常灰块。
        className: "flex h-full flex-col overflow-hidden", children: [_jsx("div", { className: cn("h-12 [app-region:drag]", isWebRemoteControlSidebar && "max-md:hidden") }), _jsxs("div", { className: "relative flex-1 min-h-0 overflow-hidden", children: [_jsxs("div", { "data-web-remote-navigation-scroll": isWebRemoteControlSidebar ? "true" : undefined, className: cn("absolute inset-0 flex min-h-0 flex-col transition-transform duration-200 ease-out", isFileTreeOpen && "-translate-x-full pointer-events-none", 
                        // Bugfix: Web 远控移动端的顶部区域由"快捷操作 + 远程任务 + workspace 导航"共同组成。
                        // 之前只有 workspace 列表子容器滚动，前面的任务入口会占掉高度，底部任务看起来像被聊天区盖住。
                        // 这里只在小屏远控下把整个顶部导航流改成一个滚动容器，桌面端仍保持原来的 sidebar 内部滚动结构。
                        isWebRemoteControlSidebar && "max-md:overflow-y-auto"), "aria-hidden": isFileTreeOpen, children: [_jsxs("div", { className: cn("flex flex-col gap-1 px-2", isWindowsDesktop ? "py-2" : "py-3", isWebRemoteControlSidebar && "max-md:pt-11"), children: [_jsx(WorkspaceNewTaskTooltip, { disabledReason: workspaceReadOnlyReason, children: _jsx(NewTaskButtonGroup, { disabled: workspaceReadOnly, onCreateTask: () => {
                                                if (workspaceReadOnly) {
                                                    return;
                                                }
                                                if (taskViewMode === "grouped") {
                                                    if (createGroupedTaskDraftAction) {
                                                        createGroupedTaskDraftAction();
                                                        return;
                                                    }
                                                    onCreateTask({ groupedDraftPlacement: { type: "top" } });
                                                    return;
                                                }
                                                onCreateTask({ createSource: "project" });
                                            } }) }), _jsxs(Button, { variant: "ghost", onClick: onOpenCommandCenter, "data-icon": "inline-start", size: "lg", className: "w-full justify-start gap-2 text-foreground hover:bg-surface-hover hover:text-foreground", children: [_jsx(Search, { className: "size-4" }), _jsx("span", { className: "min-w-0 flex-1 truncate text-left", children: intl.formatMessage({ id: "commandCenter.open" }) }), _jsx("span", { className: "ml-auto shrink-0 text-ui-xs font-normal text-foreground-subtlest", children: commandCenterShortcutLabel })] }), !isWebRemoteControlSidebar ? (_jsxs(Button, { variant: "ghost", onClick: handleOpenAutomationsMain, "data-icon": "inline-start", "data-testid": TID_AUTOMATIONS_OPEN, size: "lg", "aria-pressed": automationsActive, className: cn("w-full justify-start gap-2 text-foreground hover:bg-surface-hover hover:text-foreground", automationsActive && "bg-selected text-foreground"), children: [_jsx(CalendarClock, { className: "size-4" }), intl.formatMessage({ id: "workspace.openScheduledSettings" })] })) : null, _jsxs(Button, { variant: "ghost", onClick: handleOpenPluginStoreMain, "data-icon": "inline-start", "data-testid": "plugin-store-sidebar-open", size: "lg", "aria-pressed": pluginStoreActive, className: cn("w-full justify-start gap-2 text-foreground hover:bg-surface-hover hover:text-foreground", pluginStoreActive && "bg-selected text-foreground"), children: [_jsx(Blocks, { className: "size-4" }), intl.formatMessage({ id: "workspace.openPluginsSettings" })] })] }), _jsxs("div", { className: "relative flex min-h-0 flex-1 flex-col", children: [_jsx(StickyGroupHeaderSlot, { header: groupedStickyHeader }), _jsxs("div", { ref: workspaceScrollRef, className: cn(
                                        // Bugfix: grouped task 拖拽预览会改变列表高度，禁用 scroll anchoring 避免浏览器自动锚定把 dnd-kit 测量放大成抖动。
                                        "flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto", isWebRemoteControlSidebar && "max-md:flex-none max-md:overflow-visible"), style: workspaceScrollMaskStyle, children: [!isWebRemoteControlSidebar ? workspaceTaskToolbar() : null, shouldShowPinnedTasks ? (_jsx(WorkspacePinnedTasksSection, { workspaceTabs: workspaceTabs, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, taskSortBy: taskSortBy, mobileActiveTaskKey: mobileActiveTaskKey, onSelectTask: handleTaskRowSelect, onOpenFileTree: (target) => {
                                                    setFileTreeTarget(target);
                                                    setIsFileTreeOpen(true);
                                                } })) : null, _jsx("div", { className: "flex min-h-0 flex-col gap-3 px-2", children: webRemoteControlWorkspaceSwitcher &&
                                                    (effectiveTaskViewMode === "workspace" ||
                                                        effectiveTaskViewMode === "timeline" ||
                                                        effectiveTaskViewMode === "archived") ? (_jsx(WebRemoteControlTaskIndex, { switcher: webRemoteControlWorkspaceSwitcher, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, taskSortBy: taskSortBy, taskViewMode: effectiveTaskViewMode, collapsedWorkspaceKeys: webRemoteCollapsedWorkspaceKeys, renderBeforePinnedTasks: workspaceTaskToolbar, archivedActionsContainer: archivedActionsContainer, onToggleWorkspaceCollapsed: (workspaceKey) => {
                                                        setWebRemoteCollapsedWorkspaceKeys((current) => {
                                                            const next = new Set(current);
                                                            if (next.has(workspaceKey)) {
                                                                next.delete(workspaceKey);
                                                            }
                                                            else {
                                                                next.add(workspaceKey);
                                                            }
                                                            return next;
                                                        });
                                                    }, onWorkspaceGroupKeysChange: handleWebRemoteWorkspaceGroupKeysChange, onSelectTask: onSelectTask, onTaskOpen: onWebRemoteTaskOpen, onCrossWorkspaceSwitchingChange: onWebRemoteTaskSwitchingChange })) : taskViewMode === "archived" ? (_jsx(WorkspaceArchivedTasksFlatSection, { actionsContainer: archivedActionsContainer, workspaceTabs: workspaceTabs, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, sortBy: taskSortBy, mobileActiveTaskKey: mobileActiveTaskKey, onSelectTask: onSelectTask })) : taskViewMode === "grouped" ? (_jsx(WorkspaceGroupedTasksSection, { workspaceTabs: workspaceTabs, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, mobileActiveTaskKey: mobileActiveTaskKey, onSelectTask: onSelectTask, onCreateTask: onCreateTask, onOpenFileTree: (target) => {
                                                        setFileTreeTarget(target);
                                                        setIsFileTreeOpen(true);
                                                    }, onCreateGroupActionChange: handleCreateGroupActionChange, onCreateDraftTaskActionChange: handleCreateDraftTaskActionChange, collapsedGroupIds: collapsedGroupedTaskGroupIds, onGroupedTaskGroupIdsChange: handleGroupedTaskGroupIdsChange, onCollapsedGroupIdsChange: handleCollapsedGroupedTaskGroupIdsChange, onStickyGroupHeaderChange: setGroupedStickyHeader, onOpenAutomations: handleOpenAutomationsMain })) : taskViewMode === "timeline" ? (_jsx(WorkspaceTimelineTasksSection, { workspaceTabs: workspaceTabs, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, taskSortBy: taskSortBy, mobileActiveTaskKey: mobileActiveTaskKey, onSelectTask: handleTaskRowSelect })) : (_jsx(DndContext, { sensors: purposeSectionSensors, collisionDetection: closestCenter, modifiers: [restrictVerticalDragWithinContainer], onDragEnd: handlePurposeSectionDragEnd, children: _jsx(SortableContext, { items: purposeSectionPreferences.sectionOrder, strategy: verticalListSortingStrategy, children: _jsx("div", { "data-purpose-section-list": "true", children: purposeSectionPreferences.sectionOrder.map((sectionId) => sectionId === "projects" ? (_jsx(WorkspacePurposeSection, { sortableId: sectionId, dragHandleLabel: intl.formatMessage({ id: "workspaceSidebar.reorderSection" }, {
                                                                    section: intl.formatMessage({
                                                                        id: "workspaceSidebar.projectsSection",
                                                                    }),
                                                                }), title: intl.formatMessage({
                                                                    id: "workspaceSidebar.projectsSection",
                                                                }), open: purposeSectionPreferences.projectsExpanded, onOpenChange: handleProjectSectionOpenChange, testId: TID_PROJECT_SECTION, action: _jsxs(DropdownMenu, { children: [_jsx(ControlHintTooltip, { title: intl.formatMessage({
                                                                                id: "workspaceSidebar.addProject",
                                                                            }), children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "text-foreground-subtle hover:text-foreground data-[state=open]:text-foreground", "aria-label": intl.formatMessage({
                                                                                        id: "workspaceSidebar.addProject",
                                                                                    }), "data-testid": TID_PROJECT_ADD, children: _jsx(Plus, { className: "size-3.5" }) }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "min-w-44", children: [_jsxs(DropdownMenuItem, { onSelect: onOpenFolderFromWorkspaceMenu, children: [_jsx(FolderOpen, { className: "size-4" }), intl.formatMessage({
                                                                                            id: "workspace.openFolder",
                                                                                        })] }), onOpenRemoteWorkspace ? (_jsxs(DropdownMenuItem, { onSelect: onOpenRemoteWorkspace, children: [_jsx(Cloud, { className: "size-4" }), intl.formatMessage({
                                                                                            id: "remote.trigger",
                                                                                        })] })) : null] })] }), children: projectWorkspaceTabs.length === 0 ? (_jsx("div", { className: "px-3 py-2 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                                                        id: "workspaceSidebar.noProjects",
                                                                    }) })) : (_jsxs(DndContext, { sensors: workspaceSensors, collisionDetection: closestCenter, modifiers: [restrictVerticalDragWithinContainer], onDragStart: handleWorkspaceDragStart, onDragEnd: handleWorkspaceDragEnd, onDragCancel: handleWorkspaceDragCancel, children: [_jsx(SortableContext, { items: projectWorkspaceTabs.map((tab) => tab.id), strategy: workspaceVerticalListSortingStrategy, children: _jsx("ul", { "data-testid": TID_WORKSPACE_LIST, className: "space-y-2 pb-4", children: projectWorkspaceTabs.map((tab) => {
                                                                                    const workspaceKey = buildTaskWorkspaceKey(tab.workspacePath, tab.workspaceIdentity);
                                                                                    const taskGroup = workspaceTaskGroupByKey.get(workspaceKey);
                                                                                    const taskLoading = workspaceTaskLists.loadingByWorkspaceKey[workspaceKey] ??
                                                                                        false;
                                                                                    return (_jsx(SortableWorkspaceSidebarItem, { tab: tab, isActiveWorkspace: tab.workspacePath === workspacePath, isExpanded: resolveWorkspaceDragExpanded({
                                                                                            activeDragId: activeWorkspaceDragId,
                                                                                            expanded: expandedWorkspacePaths.has(tab.workspacePath),
                                                                                            tabId: tab.id,
                                                                                        }), activateTab: activateTab, closeTab: closeTab, toggleWorkspaceExpanded: toggleWorkspaceExpanded, onSelectTask: onSelectTask, onStartDraftInWorkspace: onStartDraftInWorkspace, taskItems: taskGroup?.items ?? EMPTY_WORKSPACE_TASK_ITEMS, taskListLoading: taskLoading, taskListHasMore: taskGroup?.hasMore ?? false, taskListHasUnread: taskGroup?.hasUnread ?? false, taskListLiveWorkflowCount: taskGroup?.liveWorkflowCount ?? 0, mobileActiveTaskKey: mobileActiveTaskKey, isWebRemoteControl: isWebRemoteControlSidebar, workspaceKey: workspaceKey, onShowMoreWorkspaceTasks: handleShowMoreWorkspaceTasks, reconnectingRemoteWorkspaceKeys: reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey: remoteWorkspaceErrorByWorkspaceKey, reconnectingRemoteWorkspaceLogsByWorkspaceKey: reconnectingRemoteWorkspaceLogsByWorkspaceKey, onReconnectRemoteWorkspace: onReconnectRemoteWorkspace, onOpenFileTree: handleOpenWorkspaceFileTree }, tab.id));
                                                                                }) }) }), typeof document === "undefined"
                                                                            ? null
                                                                            : createPortal(_jsx(DragOverlay, { children: activeWorkspaceDragTab ? (_jsx(WorkspaceDragOverlay, { tab: activeWorkspaceDragTab, width: activeWorkspaceDragWidth })) : null }), document.body)] })) }, sectionId)) : (_jsx(WorkspacePurposeSection, { sortableId: sectionId, dragHandleLabel: intl.formatMessage({ id: "workspaceSidebar.reorderSection" }, {
                                                                    section: intl.formatMessage({
                                                                        id: "workspaceSidebar.conversationsSection",
                                                                    }),
                                                                }), title: intl.formatMessage({
                                                                    id: "workspaceSidebar.conversationsSection",
                                                                }), open: purposeSectionPreferences.conversationsExpanded, onOpenChange: handleConversationSectionOpenChange, testId: TID_CONVERSATION_SECTION, action: _jsx(ControlHintTooltip, { title: intl.formatMessage({
                                                                        id: "workspaceSidebar.newConversation",
                                                                    }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "text-foreground-subtle hover:text-foreground", "aria-label": intl.formatMessage({
                                                                            id: "workspaceSidebar.newConversation",
                                                                        }), "data-testid": TID_CONVERSATION_NEW_TASK, onClick: onCreateConversationTask, children: _jsx(MessageCirclePlus, { className: "size-3.5" }) }) }), children: _jsx(WorkspaceTimelineTasksSection, { workspaceTabs: conversationWorkspaceTabs, activeWorkspacePath: workspacePath, activeWorkspaceIdentity: workspaceIdentity, activeTaskId: activeTaskId, taskSortBy: taskSortBy, groupByDate: false, 
                                                                    // conversation backing workspace 只是内部执行路径；用户文案改成“任务”不改变 purpose 语义。
                                                                    taskRowVariant: "default", emptyMessage: intl.formatMessage({
                                                                        id: "workspaceSidebar.noConversations",
                                                                    }), mobileActiveTaskKey: mobileActiveTaskKey, onSelectTask: handleTaskRowSelect }) }, sectionId))) }) }) })) })] })] }), _jsx(WorkspaceSidebarFooter, { className: "pr-3", banner: sidebarBottomActivity, theme: theme, localeMenuValue: localeMenuValue, onLocaleChange: handleLocaleChange, onThemeChange: handleThemeChange, onSettingsButtonClick: openSettingsTab, onUsageClick: openSettingsTab, onUpgradeClick: handleOpenCodingPlanUpgrade, onLogin: onLogin, onLogout: onLogout, user: user, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, workspaceRemoteSessionId: workspaceRemoteSessionId, activeTaskId: activeTaskId, isDesktop: isDesktop })] }), _jsx("div", { className: cn("absolute inset-0 transition-transform duration-200 ease-out", isFileTreeOpen ? "translate-x-0" : "translate-x-full pointer-events-none"), "aria-hidden": !isFileTreeOpen, children: fileTreeTarget ? (_jsx(WorkspaceFileTree, { workspacePath: fileTreeTarget.workspacePath, workspaceName: fileTreeTarget.workspaceName, workspaceIdentity: fileTreeTarget.workspaceIdentity, workspaceRemoteSessionId: fileTreeTarget.workspaceRemoteSessionId, revealPath: fileTreeTarget.revealPath, temporaryExternalDirectory: fileTreeTarget.temporaryExternalDirectory, canOpenLocalFileManager: isDesktop, activePreviewPath: activePreviewPath, onClose: () => setIsFileTreeOpen(false), onOpenBrowserUrl: isDesktop ? onOpenBrowserUrl : undefined, onOpenPreview: (source) => {
                                // 文件树可以查看非当前 workspace 的文件。
                                // 预览 source 携带 workspace 作用域，PreviewPane 才能用正确 host 读取远程文件；
                                // 同时不切换当前 workspace，避免"Add to chat"丢给错误的 composer。
                                onOpenCodeViewer?.({
                                    ...source,
                                    workspacePath: fileTreeTarget.workspacePath,
                                    workspaceIdentity: fileTreeTarget.workspaceIdentity,
                                    workspaceRemoteSessionId: fileTreeTarget.workspaceRemoteSessionId,
                                });
                            } })) : null })] })] }));
});
//# sourceMappingURL=WorkspaceSidebar.js.map