import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- V4WorkspaceChatArea 是分屏 workbench 宿主，集中管理 pane layout/focus/session binding；拆散会让 store action 和 shell binding 链路跨文件跳转。 */
import { useCallback, useMemo, useRef } from "react";
import { logger } from "../logger.js";
import { effectiveFocusedPaneId, MAX_WORKBENCH_PANES, paneWorkspaceKey, PRIMARY_LEAF, usePaneLayoutStore, V4_PRIMARY_PANE_ID, } from "../v4/paneLayoutStore.js";
import { collectWorkbenchLayout, dividerStyle, SPLIT_VAR_PREFIX } from "../v4/workbenchLayout.js";
import { WorkbenchLeafPane } from "../v4/WorkbenchPane.js";
import { WorkbenchSplitDivider } from "../v4/WorkbenchSplitDivider.js";
import { closeWorkbenchGroupPane, selectWorkbenchGroupActiveBinding, selectWorkbenchGroupPaneBinding, useWorkbenchGroupStore, } from "../v4/workbenchGroupStore.js";
import { canPlaceWorkbenchSessionInSplit, placeWorkbenchSessionInSplit, } from "../v4/workbenchSessionPlacement.js";
function dragPayloadSessionTarget(payload) {
    return {
        workspacePath: payload.workspacePath,
        ...(payload.workspaceIdentity?.trim() ? { workspaceIdentity: payload.workspaceIdentity } : {}),
        ...(payload.remoteSessionId ? { remoteSessionId: payload.remoteSessionId } : {}),
        sessionId: payload.sessionId,
    };
}
/**
 * 分屏 workspace 主聊天区：多 pane 跨 workspace 工作台
 *
 * - 布局：paneLayoutStore 的二叉分割树 → 绝对定位 rect（CSS 变量驱动占比）；
 *   叶子扁平渲染（key = paneId），拆分/关闭不重挂任何存活 pane。
 * - 数据面：每个 pane 一个 V4PaneConversationProvider——连接经
 *   workspaceConnectionRegistry 按 endpoint+workspaceKey 引用计数复用
 *   （同 workspace 的 pane 共享一条 transport + SessionDataLayer）。
 * - primary pane 绑定沿用 activeTaskId（shell props，随 workspace tab 切换）；
 *   其余 pane 绑定归 paneLayoutStore，自带 workspaceScope、跨 tab 常驻。
 * - Focus 层：快捷键（Esc stop）/add-to-chat 只路由到 focused pane。
 * - 恢复守卫：restoredUnvalidated pane 各自经其 scope 的 sessions-index 验证。
 */
export function V4WorkspaceChatArea({ workspacePath, workspaceIdentity, isDesktop = false, readOnly = false, foregroundEnabled = true, remoteSessionId, compactForRemoteControl = false, sessionId, activeSelectionSideChatSessionId = null, provider, onSessionCreated, onSessionDeleted, draftComposerHeader, onPrimaryDraftDropTargetControllerChange, gitSummary, gitDirtyFileCount, gitWorktreeReviewSourceId, gitWorktreeChangeSummary, activeTaskChangeSummary, summaryPanelVariantOverride, onSummaryPanelVariantOverrideChange, onRefreshGit, onOpenGitReview, onPaneActiveSessionChange, onOpenBrowserUrl, onOpenAutomationsMain, onOpenCodeViewer, onAutoOpenAssistantPptx, onOpenFileLink, onOpenSubagentSession, onOpenBackgroundBash, onOpenSubagentDirectory, onSyncSubagentSessionTabs, onOpenSelectionSideChat, onOpenPlanDetail, onOpenWorkflowRun, onOpenWorkflowArtifact, onOpenWorkflowRunDirectory, onOpenWorkflowActorSession, onOpenWorkflowWorkspace, conversationFindQuery = "", conversationFindActiveIndex = -1, conversationFindNavigationRequestId = 0, onConversationFindMatchStateChange, searchResultHighlightRequest, onSearchResultHighlightDone, }) {
    const shellWorkspaceKey = workspaceIdentity?.trim() || workspacePath;
    // selector 返回 store 内既有引用/派生原语，未变化不触发重渲染。
    const paneRoot = usePaneLayoutStore((state) => state.root);
    const paneBindings = usePaneLayoutStore((state) => state.panes);
    const paneFocusedPaneId = usePaneLayoutStore((state) => effectiveFocusedPaneId(state));
    // zustand action 引用稳定。
    const splitPaneAction = usePaneLayoutStore((state) => state.splitPane);
    const closePaneAction = usePaneLayoutStore((state) => state.closePane);
    const confirmRestoredPaneSessionAction = usePaneLayoutStore((state) => state.confirmRestoredPaneSession);
    const focusPaneAction = usePaneLayoutStore((state) => state.focusPane);
    const bindPaneSessionAction = usePaneLayoutStore((state) => state.bindPaneSession);
    const setSplitRatioAction = usePaneLayoutStore((state) => state.setSplitRatio);
    const resetPaneLayoutAction = usePaneLayoutStore((state) => state.resetToPrimaryPane);
    const activeGroup = useWorkbenchGroupStore((state) => compactForRemoteControl || !state.activeGroupId
        ? null
        : (state.groups[state.activeGroupId] ?? null));
    const focusGroupPaneAction = useWorkbenchGroupStore((state) => state.focusPane);
    const closeGroupPaneAction = useWorkbenchGroupStore((state) => state.closePane);
    const confirmRestoredGroupPaneSessionAction = useWorkbenchGroupStore((state) => state.confirmRestoredPaneSession);
    const bindGroupPaneSessionAction = useWorkbenchGroupStore((state) => state.bindPaneSession);
    const setGroupSplitRatioAction = useWorkbenchGroupStore((state) => state.setSplitRatio);
    const promotePaneLayoutToGroupAction = useWorkbenchGroupStore((state) => state.promotePaneLayoutToGroup);
    const containerRef = useRef(null);
    const root = compactForRemoteControl ? PRIMARY_LEAF : (activeGroup?.root ?? paneRoot);
    const panes = compactForRemoteControl ? {} : (activeGroup?.panes ?? paneBindings);
    const focusedPaneId = compactForRemoteControl
        ? V4_PRIMARY_PANE_ID
        : (activeGroup?.focusedPaneId ?? paneFocusedPaneId);
    const layout = useMemo(() => collectWorkbenchLayout(root), [root]);
    const shellSessionOwnedBySplitPane = useMemo(() => {
        if (compactForRemoteControl || activeGroup || !sessionId) {
            return false;
        }
        return Object.values(paneBindings).some((binding) => binding.sessionId === sessionId &&
            paneWorkspaceKey(binding.workspaceScope) === shellWorkspaceKey);
    }, [activeGroup, compactForRemoteControl, paneBindings, sessionId, shellWorkspaceKey]);
    // 修复原因：primary draft 没有自己的 sessionId；拖入 session 时 shell active
    // 可能已经切到右侧 pane 的 session，不能再把这个 sessionId 下发给 primary。
    const primaryPaneSessionId = shellSessionOwnedBySplitPane ? null : sessionId;
    // 占比接线：store 值只在提交（pointerup/恢复）时变化；拖动中由分隔条直写 CSS 变量。
    const containerStyle = useMemo(() => {
        const style = {};
        for (const divider of layout.dividers) {
            style[`${SPLIT_VAR_PREFIX}${divider.splitId}`] = String(divider.ratio);
        }
        return style;
    }, [layout]);
    const paneCount = layout.leaves.length;
    const showFocusIndicator = paneCount > 1;
    const canSplit = paneCount < MAX_WORKBENCH_PANES;
    const shellScope = useMemo(() => ({
        workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        ...(remoteSessionId ? { remoteSessionId } : {}),
    }), [remoteSessionId, workspacePath, workspaceIdentity]);
    const placementShellBinding = useMemo(() => primaryPaneSessionId ? { workspaceScope: shellScope, sessionId: primaryPaneSessionId } : null, [primaryPaneSessionId, shellScope]);
    const shell = useMemo(() => ({
        workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        ...(remoteSessionId ? { remoteSessionId } : {}),
        isDesktop,
        compactForRemoteControl,
        readOnly,
        sessionId: primaryPaneSessionId,
        // primaryPaneSessionId 在 active task 被 split pane 接管时会刻意置空，
        // 辅助对话划词路由仍需保留 shell 真正的 active task id。
        activeSessionId: sessionId,
        activeSelectionSideChatSessionId,
        provider,
        onSessionCreated,
        onSessionDeleted,
        draftComposerHeader,
        onPrimaryDraftDropTargetControllerChange,
        gitSummary,
        gitDirtyFileCount,
        gitWorktreeReviewSourceId,
        gitWorktreeChangeSummary,
        activeTaskChangeSummary: primaryPaneSessionId ? activeTaskChangeSummary : null,
        summaryPanelVariantOverride,
        onSummaryPanelVariantOverrideChange,
        onRefreshGit,
        onOpenGitReview,
        onOpenBrowserUrl,
        onOpenAutomationsMain,
        onOpenCodeViewer,
        onAutoOpenAssistantPptx,
        onOpenFileLink,
        onOpenSubagentSession,
        onOpenBackgroundBash,
        onOpenSubagentDirectory,
        onSyncSubagentSessionTabs,
        onOpenSelectionSideChat,
        onOpenPlanDetail,
        onOpenWorkflowRun,
        onOpenWorkflowArtifact,
        onOpenWorkflowRunDirectory,
        onOpenWorkflowActorSession,
        onOpenWorkflowWorkspace,
        conversationFindQuery,
        conversationFindActiveIndex,
        conversationFindNavigationRequestId,
        onConversationFindMatchStateChange,
        searchResultHighlightRequest,
        onSearchResultHighlightDone,
    }), [
        workspacePath,
        workspaceIdentity,
        remoteSessionId,
        isDesktop,
        compactForRemoteControl,
        readOnly,
        primaryPaneSessionId,
        activeSelectionSideChatSessionId,
        provider,
        onSessionCreated,
        onSessionDeleted,
        draftComposerHeader,
        onPrimaryDraftDropTargetControllerChange,
        gitSummary,
        gitDirtyFileCount,
        gitWorktreeReviewSourceId,
        gitWorktreeChangeSummary,
        activeTaskChangeSummary,
        summaryPanelVariantOverride,
        onSummaryPanelVariantOverrideChange,
        onRefreshGit,
        onOpenGitReview,
        onOpenBrowserUrl,
        onOpenAutomationsMain,
        onOpenCodeViewer,
        onAutoOpenAssistantPptx,
        onOpenFileLink,
        onOpenSubagentSession,
        onOpenBackgroundBash,
        onOpenSubagentDirectory,
        onSyncSubagentSessionTabs,
        onOpenSelectionSideChat,
        onOpenPlanDetail,
        onOpenWorkflowRun,
        onOpenWorkflowArtifact,
        onOpenWorkflowRunDirectory,
        onOpenWorkflowActorSession,
        onOpenWorkflowWorkspace,
        conversationFindQuery,
        conversationFindActiveIndex,
        conversationFindNavigationRequestId,
        onConversationFindMatchStateChange,
        searchResultHighlightRequest,
        onSearchResultHighlightDone,
    ]);
    const resolvePaneSessionBinding = useMemo(() => (paneId) => {
        if (activeGroup) {
            return selectWorkbenchGroupPaneBinding(activeGroup, paneId);
        }
        if (paneId === V4_PRIMARY_PANE_ID) {
            return primaryPaneSessionId
                ? { workspaceScope: shellScope, sessionId: primaryPaneSessionId }
                : null;
        }
        const binding = paneBindings[paneId];
        return binding?.sessionId
            ? {
                workspaceScope: binding.workspaceScope,
                sessionId: binding.sessionId,
                ...(binding.readOnly ? { readOnly: true } : {}),
            }
            : null;
    }, [activeGroup, paneBindings, primaryPaneSessionId, shellScope]);
    const syncShellActiveSession = useCallback((binding) => {
        if (!binding || binding.readOnly) {
            return;
        }
        // readOnly subagent pane 只是 workbench 内观察视图，不是左侧
        // task 导航目标；反写 shell activeTaskId 会让左侧高亮/乐观 task 误切到 child。
        onPaneActiveSessionChange?.(binding.workspaceScope, binding.sessionId);
    }, [onPaneActiveSessionChange]);
    const handleFocusRequest = useMemo(() => (paneId) => {
        if (activeGroup) {
            focusGroupPaneAction(activeGroup.id, paneId);
        }
        else {
            focusPaneAction(paneId);
        }
        syncShellActiveSession(resolvePaneSessionBinding(paneId));
    }, [
        activeGroup,
        focusGroupPaneAction,
        focusPaneAction,
        resolvePaneSessionBinding,
        syncShellActiveSession,
    ]);
    const handleClosePane = useMemo(() => (paneId) => {
        if (activeGroup) {
            const nextGroup = closeWorkbenchGroupPane(activeGroup, paneId);
            const nextActiveBinding = activeGroup.focusedPaneId === paneId
                ? nextGroup
                    ? selectWorkbenchGroupActiveBinding(nextGroup)
                    : paneId === V4_PRIMARY_PANE_ID
                        ? null
                        : activeGroup.primaryBinding
                : null;
            closeGroupPaneAction(activeGroup.id, paneId);
            // close store 只负责布局塌缩；若被关 pane 正是 focused pane，
            // shell activeTaskId 必须回到关闭后的可导航 session，不能继续停在已关闭 session。
            syncShellActiveSession(nextActiveBinding);
        }
        else {
            const nextActiveBinding = focusedPaneId === paneId && primaryPaneSessionId
                ? { workspaceScope: shellScope, sessionId: primaryPaneSessionId }
                : null;
            closePaneAction(paneId);
            syncShellActiveSession(nextActiveBinding);
        }
    }, [
        activeGroup,
        closeGroupPaneAction,
        closePaneAction,
        focusedPaneId,
        primaryPaneSessionId,
        shellScope,
        syncShellActiveSession,
    ]);
    const handleConfirmRestoredSession = useMemo(() => (paneId) => {
        if (activeGroup) {
            confirmRestoredGroupPaneSessionAction(activeGroup.id, paneId);
        }
        else {
            confirmRestoredPaneSessionAction(paneId);
        }
    }, [activeGroup, confirmRestoredGroupPaneSessionAction, confirmRestoredPaneSessionAction]);
    const handleCommitSplitRatio = useMemo(() => (splitId, ratio) => {
        if (activeGroup) {
            setGroupSplitRatioAction(activeGroup.id, splitId, ratio);
        }
        else {
            setSplitRatioAction(splitId, ratio);
        }
    }, [activeGroup, setGroupSplitRatioAction, setSplitRatioAction]);
    const handleBindSession = useMemo(() => (paneId, createdSessionId) => {
        if (activeGroup) {
            bindGroupPaneSessionAction(activeGroup.id, paneId, createdSessionId);
            return true;
        }
        if (paneId === V4_PRIMARY_PANE_ID) {
            const sourceLayout = usePaneLayoutStore.getState();
            if (Object.keys(sourceLayout.panes).length > 0) {
                // draft primary 本身不在 paneLayout.panes 中。首发 accepted 后若只让
                // shell 记住新 session，focus 已绑定的 secondary 会覆盖 shell activeTaskId，
                // primary 随即丢失身份并回到 draft。这里先以新 session 作为 primaryBinding
                // 原子提升可见布局，再由上层同步 shell active，两个 pane 都有稳定 owner。
                const promoted = promotePaneLayoutToGroupAction({ workspaceScope: shellScope, sessionId: createdSessionId }, sourceLayout);
                if (promoted) {
                    resetPaneLayoutAction();
                    logger.info("[v4-workbench] primary draft promoted to session group", {
                        createdSessionId,
                        workspaceKey: paneWorkspaceKey(shellScope),
                    });
                }
            }
            return true;
        }
        bindPaneSessionAction(paneId, createdSessionId);
        if (!sessionId) {
            return false;
        }
        // 非 primary draft 首发会先产生新 session；若此时直接
        // 反写 shell activeTaskId，primary pane 仍由 shell.sessionId 驱动，
        // 会跟着显示右侧新 session。先把当前 paneLayout 提升为 group，
        // 用 primaryBinding 固定原 session，再允许 shell active 跟随新 pane。
        const promoted = promotePaneLayoutToGroupAction({ workspaceScope: shellScope, sessionId }, usePaneLayoutStore.getState());
        if (promoted) {
            // promotion 是布局 owner 转移，不是复制后双写。group 已持有完整
            // workspace scope/binding 后立即消费 source，避免刷新或 group GC 时旧 split 复活。
            resetPaneLayoutAction();
        }
        return promoted;
    }, [
        activeGroup,
        bindGroupPaneSessionAction,
        bindPaneSessionAction,
        promotePaneLayoutToGroupAction,
        resetPaneLayoutAction,
        sessionId,
        shellScope,
    ]);
    const canDropSession = useCallback((payload) => {
        return canPlaceWorkbenchSessionInSplit(placementShellBinding, dragPayloadSessionTarget(payload), { mode: "drag", side: "right" });
    }, [placementShellBinding]);
    const handleDropSession = useCallback((paneId, side, payload) => {
        placeWorkbenchSessionInSplit(placementShellBinding, dragPayloadSessionTarget(payload), {
            anchorPaneId: paneId,
            mode: "drag",
            side,
        });
    }, [placementShellBinding]);
    return (_jsxs("div", { ref: containerRef, style: containerStyle, className: "relative h-full min-h-0 w-full", children: [layout.leaves.map((leaf) => (_jsx(WorkbenchLeafPane, { paneId: leaf.paneId, rect: leaf.rect, 
                // Settings 只把 workspace 设为 inert，Pane 之前仍保留 focused=true，
                // 会在隐藏状态提前消费 Plugin 试用的一次性预填。可见性并入 focus 后，
                // 请求只会由返回 workspace 后真正可交互的 Composer 消费。
                focused: foregroundEnabled && focusedPaneId === leaf.paneId, showFocusIndicator: showFocusIndicator, canSplit: canSplit, shellWorkspaceKey: shellWorkspaceKey, binding: leaf.paneId === V4_PRIMARY_PANE_ID ? null : (panes[leaf.paneId] ?? null), primaryBinding: leaf.paneId === V4_PRIMARY_PANE_ID ? (activeGroup?.primaryBinding ?? null) : null, shell: shell, onFocusRequest: handleFocusRequest, onSplit: compactForRemoteControl || activeGroup ? undefined : splitPaneAction, onClosePane: handleClosePane, onConfirmRestoredSession: handleConfirmRestoredSession, onBindSession: handleBindSession, onPaneActiveSessionChange: onPaneActiveSessionChange, canDropSession: compactForRemoteControl ? undefined : canDropSession, onDropSession: compactForRemoteControl ? undefined : handleDropSession }, leaf.paneId))), layout.dividers.map((divider) => (_jsx(WorkbenchSplitDivider, { containerRef: containerRef, splitId: divider.splitId, direction: divider.direction, ratio: divider.ratio, regionFraction: divider.regionFraction, style: dividerStyle(divider), onCommitRatio: handleCommitSplitRatio }, divider.splitId)))] }));
}
//# sourceMappingURL=V4WorkspaceChatArea.js.map