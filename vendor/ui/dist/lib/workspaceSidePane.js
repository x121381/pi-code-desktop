/* eslint-disable max-lines -- Side pane tab 状态集中维护 Browser/Git/CodeViewer/Treemapping/Whiteboard 的打开、复用、关闭和排序规则；拆分需要同步迁移现有内存恢复逻辑。 */
import { createUuid, } from "@zcode/shared";
import { inferMediaPreview, isPptxPreviewPath } from "../lib/codeViewer.js";
import { normalizeCodeViewerSource } from "../lib/codeViewerSource.js";
export const BROWSER_USE_OPERATION_INDICATOR_DURATION_MS = 5_000;
/**
 * Browser/browser-use 的页面与 CDP 生命周期依赖 `<webview>` 持续连接 DOM。
 * 面板折叠或切到其它对话时仍必须后台挂载，只有显式关闭 tab 才能销毁页面状态。
 */
export function shouldMountSidePaneContent(isVisible, tabs) {
    return (isVisible ||
        tabs.some((tab) => tab.type === "browser" || tab.type === "browser-use" || tab.type === "bash-output"));
}
export function shouldMountBrowserTabGuest(tab) {
    return tab.residency !== "suspended" && tab.residency !== "suspend-pending";
}
export function normalizeWorkspaceSidePaneState(current) {
    if (!current) {
        return null;
    }
    // Treemapping 当前需要从侧边栏隐藏。旧版本可能已经把 treemapping tab
    // 写进了 workspace 级 side pane 记忆，这里在状态边界统一过滤，避免恢复后入口继续出现。
    const filteredTabs = current.tabs.filter((tab) => tab.type !== "treemapping");
    if (filteredTabs.length === 0) {
        return null;
    }
    // 多开引入 `ordinal` 之前创建的辅助对话 tab（HMR/同窗口旧内存状态）没有该
    // 字段，直接参与 getNextSelectionSideChatOrdinal 会得到 NaN/undefined 并造成标题
    // 编号冲突。这里在状态边界按 parent 分组回填最小可用编号，保持既有编号不变。
    let migratedOrdinal = false;
    const tabs = filteredTabs.map((tab, index, allTabs) => {
        if (tab.type !== "selection-side-chat" || Number.isInteger(tab.ordinal)) {
            return tab;
        }
        // allTabs 中本轮迭代已回填的 tab 被原位替换，天然带整数 ordinal 参与占用判定。
        const used = new Set(allTabs.flatMap((candidate) => candidate.type === "selection-side-chat" &&
            candidate.workspaceKey === tab.workspaceKey &&
            candidate.parentSessionId === tab.parentSessionId &&
            Number.isInteger(candidate.ordinal)
            ? [candidate.ordinal]
            : []));
        let ordinal = 1;
        while (used.has(ordinal))
            ordinal += 1;
        migratedOrdinal = true;
        const migrated = { ...tab, ordinal };
        allTabs[index] = migrated;
        return migrated;
    });
    const activeTabId = current.activeTabId === "" || tabs.some((tab) => tab.id === current.activeTabId)
        ? current.activeTabId
        : tabs[tabs.length - 1].id;
    if (!migratedOrdinal &&
        tabs.length === current.tabs.length &&
        activeTabId === current.activeTabId) {
        return current;
    }
    return {
        tabs,
        activeTabId,
    };
}
function createBrowserSidePaneTab(options) {
    return {
        id: options?.tabId ?? `browser:${createUuid()}`,
        type: "browser",
        ...(options?.ownerTaskId !== undefined ? { ownerTaskId: options.ownerTaskId } : {}),
        ...(options?.workspaceKey !== undefined ? { workspaceKey: options.workspaceKey } : {}),
        // human tab 过去从不写 remoteSessionId，而 stampSidePaneTabsOwnership 只补
        // ownerTaskId 未定义的 tab —— 凡是创建时就带 ownerTaskId 的（打开链接/终端 URL/popup/share）
        // 远程下该字段永久缺失。attach 侧 renderer 会用 workspaceRemoteSessionId 兜底冻结 main 的
        // owner，close 侧却按 tab 上的空值比对，scope 判失配后 tab 就再也关不掉。创建即冻结。
        ...(options?.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        faviconUrl: null,
        initialUrl: options?.initialUrl ?? null,
        ...(options?.agentOpened ? { agentOpened: true } : {}),
        openedAt: Date.now(),
        title: null,
    };
}
function createGitSidePaneTab() {
    return { id: "git", type: "git", openedAt: Date.now() };
}
function createTreemappingSidePaneTab(source = { kind: "current" }) {
    return {
        id: "treemapping",
        type: "treemapping",
        openedAt: Date.now(),
        source,
    };
}
function createModelTrajectorySidePaneTab(options) {
    return {
        // 同一个 task 复用同一个 tab，避免重复打开多份相同轨迹。
        id: `model-trajectory:${options.taskId}`,
        type: "model-trajectory",
        openedAt: Date.now(),
        taskId: options.taskId,
        title: options.title ?? null,
    };
}
function createDeveloperToolsSidePaneTab() {
    return {
        id: "developer-tools",
        type: "developer-tools",
        openedAt: Date.now(),
    };
}
function createTerminalSidePaneTab(options) {
    return {
        id: `terminal:${createUuid()}`,
        type: "terminal",
        openedAt: Date.now(),
        title: options.title,
        ...(options.cwd ? { cwd: options.cwd } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
    };
}
export function encodeSidePaneTabIdPart(value) {
    return encodeURIComponent(value);
}
export function createSubagentSessionSidePaneTab(options) {
    const rootSessionId = options.rootSessionId ?? options.parentSessionId;
    return {
        id: [
            "subagent-session",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(rootSessionId),
            encodeSidePaneTabIdPart(options.childSessionId),
        ].join(":"),
        type: "subagent-session",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        rootSessionId,
        parentSessionId: options.parentSessionId,
        childSessionId: options.childSessionId,
        subagentType: options.subagentType,
        title: options.title.trim(),
    };
}
export function createSubagentDirectorySidePaneTab(options) {
    const rootSessionId = options.rootSessionId ?? options.parentSessionId;
    return {
        id: [
            "subagent-directory",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(rootSessionId),
            encodeSidePaneTabIdPart(options.parentSessionId),
        ].join(":"),
        type: "subagent-directory",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        rootSessionId,
        parentSessionId: options.parentSessionId,
    };
}
export function createSelectionSideChatPaneTab(options) {
    return {
        id: [
            "selection-side-chat",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.childSessionId),
        ].join(":"),
        type: "selection-side-chat",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        childSessionId: options.childSessionId,
        ordinal: options.ordinal,
    };
}
export function createPlanDetailSidePaneTab(options) {
    return {
        id: [
            "plan-detail",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.toolCallId),
        ].join(":"),
        type: "plan-detail",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        toolCallId: options.toolCallId,
        markdown: options.markdown,
        ...(options.planFilePath ? { planFilePath: options.planFilePath } : {}),
    };
}
function createWorkflowRunSidePaneTab(options) {
    return {
        // 结构化 id：同一个 run 在同一个 workspace + 会话下永远是同一个 tab，重复点击幂等。
        id: [
            "workflow-run",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.runId),
        ].join(":"),
        type: "workflow-run",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        toolCallId: options.toolCallId,
        runId: options.runId,
        ...(options.workflowName ? { workflowName: options.workflowName } : {}),
        ...(options.phaseId ? { focusPhaseId: options.phaseId } : {}),
    };
}
function createWorkflowRunDirectorySidePaneTab(options) {
    return {
        // 结构化 id：一条对话只有一份 run 目录，所以页脚行重复点击幂等地聚焦同一个 tab。
        id: [
            "workflow-directory",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
        ].join(":"),
        type: "workflow-directory",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
    };
}
function createWorkflowActorSessionSidePaneTab(options) {
    return {
        // 结构化 id：同一个槽位在同一个 workspace + 对话下永远是同一个 tab，重复点击幂等。
        // 身份是 (runId, siteId@ordinal) 而不是会话 id：tab 可以在会话存在之前就开（未启动的
        // 药丸），先后从无会话与有会话两端打开必须落到同一个 tab；runId 在 id 里，两个 run 的
        // 同名实例仍不撞。
        id: [
            "workflow-actor-session",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.runId),
            encodeSidePaneTabIdPart(`${options.siteId}@${options.ordinal}`),
        ].join(":"),
        type: "workflow-actor-session",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        runId: options.runId,
        ...(options.actorSessionId ? { actorSessionId: options.actorSessionId } : {}),
        siteId: options.siteId,
        ordinal: options.ordinal,
        ...(options.actorName ? { actorName: options.actorName } : {}),
    };
}
function createWorkflowWorkspaceSidePaneTab(options) {
    return {
        // 结构化 id：(workspace, 父会话, run)。阶段**不在** id 里——一个 run 一份脚本 transcript，
        // 从 plan 站点开还是从 verify 站点开都是同一个 tab，只是落点不同。
        id: [
            "workflow-workspace",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.runId),
        ].join(":"),
        type: "workflow-workspace",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        toolCallId: options.toolCallId,
        runId: options.runId,
        ...(options.workflowName ? { workflowName: options.workflowName } : {}),
        ...(options.phaseId ? { focusPhaseId: options.phaseId } : {}),
    };
}
function createWorkflowArtifactSidePaneTab(options) {
    return {
        // 结构化 id：**不含版本**。同一个产物的 v1 与 v2 是同一件东西的两个时刻，再次点击
        // （通知 chip / 中枢 chip / 侧板卡片）只该聚焦同一个 tab 并翻到新版，不该并排开两个。
        id: [
            "workflow-artifact",
            encodeSidePaneTabIdPart(options.workspaceKey),
            encodeSidePaneTabIdPart(options.parentSessionId),
            encodeSidePaneTabIdPart(options.runId),
            encodeSidePaneTabIdPart(options.artifactId),
        ].join(":"),
        type: "workflow-artifact",
        openedAt: Date.now(),
        workspaceKey: options.workspaceKey,
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
        parentSessionId: options.parentSessionId,
        runId: options.runId,
        artifactId: options.artifactId,
        ...(options.version === undefined ? {} : { version: options.version }),
        ...(options.title ? { title: options.title } : {}),
    };
}
function createWhiteboardSidePaneTab(options) {
    return {
        id: `whiteboard:${options.boardId}`,
        type: "whiteboard",
        boardId: options.boardId,
        openedAt: Date.now(),
        title: options.title,
    };
}
function getCodeViewerTabSourceKey(source) {
    const workspaceScope = source.workspaceIdentity?.trim()
        ? source.workspaceIdentity.trim()
        : (source.workspacePath ?? "");
    const scopedKeyPrefix = workspaceScope ? `${workspaceScope}:` : "";
    // 文件树把 PPTX 表示为通用 `file` source，引用反向打开则使用带导航意图的
    // `pptx` source。旧 key 直接包含 source.type，导致同一 workspace 路径被拆成两个 tab。
    // source type 只是入口表示，不是文件身份；这里只归一 PPTX，避免扩大其它预览类型的语义。
    const resourceType = source.type === "pptx" || (source.type === "file" && isPptxPreviewPath(source.path))
        ? "pptx"
        : source.type === "media" || (source.type === "file" && inferMediaPreview(source.path))
            ? "media"
            : source.type;
    if (source.type === "file" ||
        source.type === "code-review" ||
        source.type === "image" ||
        source.type === "media" ||
        source.type === "pdf" ||
        source.type === "pptx") {
        return `${scopedKeyPrefix}${resourceType}:${source.path}`;
    }
    if (source.type === "text" && source.path) {
        return `${scopedKeyPrefix}${source.type}:${source.path}`;
    }
    if (source.type === "patch") {
        // file diff 之前只按 path 复用 tab，导致同一个文件在不同轮次产生的不同 patch
        // 会互相覆盖，看起来像“diff 面板只能打开一个 tab”。这里把 patch 内容摘要纳入 key，
        // 让不同 diff 可以并排保留，同时同一份 diff 重复点击仍然复用已有 tab。
        return `${scopedKeyPrefix}patch:${source.path ?? source.title}:${hashCodeViewerContent(source.patch)}`;
    }
    if (source.type === "multi-file-diff") {
        return `${scopedKeyPrefix}multi-file-diff:${source.path ?? source.title}:${hashCodeViewerContent(`${source.beforeContent}\0${source.afterContent}`)}`;
    }
    return null;
}
function hashCodeViewerContent(content) {
    let hash = 0;
    for (let index = 0; index < content.length; index += 1) {
        hash = (hash * 31 + content.charCodeAt(index)) | 0;
    }
    return Math.abs(hash).toString(36);
}
function createCodeViewerSidePaneTab(source) {
    const normalizedSource = normalizeCodeViewerSource(source);
    const sourceKey = getCodeViewerTabSourceKey(normalizedSource);
    return {
        id: sourceKey ? `code-viewer:${sourceKey}` : `code-viewer:${createUuid()}`,
        type: "code-viewer",
        openedAt: Date.now(),
        source: normalizedSource,
        sourceKey,
    };
}
function findTabIndexById(tabs, tabId) {
    return tabs.findIndex((tab) => tab.id === tabId);
}
export function activateSidePaneTab(current, tab) {
    if (!current) {
        return {
            tabs: [tab],
            activeTabId: tab.id,
        };
    }
    const existingIndex = findTabIndexById(current.tabs, tab.id);
    if (existingIndex >= 0) {
        const nextTabs = [...current.tabs];
        nextTabs[existingIndex] = tab;
        return {
            tabs: nextTabs,
            activeTabId: tab.id,
        };
    }
    return {
        tabs: [...current.tabs, tab],
        activeTabId: tab.id,
    };
}
export function getActiveSidePaneTab(current) {
    if (!current) {
        return null;
    }
    return current.tabs.find((tab) => tab.id === current.activeTabId) ?? null;
}
/** 把草稿态的 null/undefined 归一，供侧栏按对话隔离。 */
export function sidePaneOwnerKey(taskId) {
    return taskId ?? "__draft__";
}
const WORKSPACE_GLOBAL_SIDE_PANE_TAB_TYPES = new Set([
    "git",
    "developer-tools",
    "treemapping",
]);
export function isWorkspaceGlobalSidePaneTab(tab) {
    return WORKSPACE_GLOBAL_SIDE_PANE_TAB_TYPES.has(tab.type);
}
function sidePaneTabMatchesWorkspace(tab, activeWorkspaceKey) {
    return tab.workspaceKey == null || tab.workspaceKey === activeWorkspaceKey;
}
/**
 * 新建 tab 在提交到共享侧栏状态时统一冻结工作区与对话归属。
 * browser-use 自带事件来源归属，因此已打标的 tab 绝不能被当前 UI scope 覆盖。
 */
export function stampSidePaneTabsOwnership(state, ownership) {
    if (!state)
        return state;
    let changed = false;
    const tabs = state.tabs.map((tab) => {
        if (tab.ownerTaskId !== undefined)
            return tab;
        changed = true;
        return {
            ...tab,
            ownerTaskId: ownership.ownerTaskId,
            workspaceKey: tab.workspaceKey ?? ownership.workspaceKey,
            ...((tab.type === "browser" || tab.type === "browser-use") && ownership.remoteSessionId
                ? { remoteSessionId: ownership.remoteSessionId }
                : {}),
        };
    });
    return changed ? { ...state, tabs } : state;
}
function getVisibleSidePaneTabsByScope(tabs, scope) {
    const ownerKey = sidePaneOwnerKey(scope.ownerTaskId);
    return tabs.filter((tab) => {
        if (!sidePaneTabMatchesWorkspace(tab, scope.workspaceKey))
            return false;
        if (isWorkspaceGlobalSidePaneTab(tab))
            return true;
        if (tab.type === "browser-use")
            return tab.sessionId === scope.ownerTaskId;
        if (tab.type === "subagent-session" ||
            tab.type === "subagent-directory" ||
            tab.type === "bash-output") {
            return tab.rootSessionId === scope.ownerTaskId;
        }
        if (tab.type === "selection-side-chat" ||
            tab.type === "plan-detail" ||
            tab.type === "plugin-ui" ||
            tab.type === "workflow-run" ||
            tab.type === "workflow-actor-session" ||
            tab.type === "workflow-workspace" ||
            tab.type === "workflow-artifact") {
            return tab.parentSessionId === scope.ownerTaskId;
        }
        return sidePaneOwnerKey(tab.ownerTaskId) === ownerKey;
    });
}
export function resolveActiveTabForOwner(state, scope, preferredTabId) {
    if (!state)
        return null;
    const visibleTabs = getVisibleSidePaneTabsByScope(state.tabs, scope);
    if (visibleTabs.length === 0)
        return null;
    if (preferredTabId && visibleTabs.some((tab) => tab.id === preferredTabId)) {
        return preferredTabId;
    }
    if (visibleTabs.some((tab) => tab.id === state.activeTabId)) {
        return state.activeTabId;
    }
    return visibleTabs.at(-1)?.id ?? null;
}
/**
 * 对话 scope 切换时同时解析 active tab 与折叠态。
 *
 * 目标对话没有 preferredTabId 时不能沿用上一个对话的 collapsed 状态，也不能简单地
 * 用“有可见 tab 就展开”覆盖状态。否则用户在 A 主动收起后切到 B 再切回 A，仍会被 A 的可见 tab
 * 自动展开。现在由调用方传入当前对话的主动偏好；没有偏好时才沿用默认的“有 tab 展开、无 tab 收起”。
 */
export function resolveSidePaneScopeState(state, scope, preferredTabId, collapsedPreference) {
    const activeTabId = resolveActiveTabForOwner(state, scope, preferredTabId);
    return {
        sidePaneState: state && state.activeTabId !== (activeTabId ?? "")
            ? { ...state, activeTabId: activeTabId ?? "" }
            : state,
        isSidePaneCollapsed: activeTabId === null ? true : (collapsedPreference ?? false),
    };
}
export function restoreSidePaneTab(current, tab) {
    return activateSidePaneTab(current, {
        ...tab,
        openedAt: tab.openedAt ?? Date.now(),
    });
}
export function activateBrowserSidePane(current, options) {
    if (!options?.forceNew && !options?.tabId && !options?.initialUrl) {
        const ownerKey = sidePaneOwnerKey(options?.ownerTaskId);
        const existingBrowserTab = current?.tabs.find((tab) => tab.type === "browser" && sidePaneOwnerKey(tab.ownerTaskId) === ownerKey);
        if (existingBrowserTab) {
            return activateSidePaneTab(current, existingBrowserTab);
        }
    }
    return activateSidePaneTab(current, createBrowserSidePaneTab(options));
}
/** 打开/复用站点权限设置标签：同站点 + 同工作区 + 同对话只保留一个标签。 */
export function openBrowserPermissionsSidePane(current, options) {
    const existing = current?.tabs.find((tab) => tab.type === "browser-permissions" &&
        tab.origin === options.origin &&
        tab.workspaceKey === options.workspaceKey &&
        sidePaneOwnerKey(tab.ownerTaskId) === sidePaneOwnerKey(options.ownerTaskId));
    return activateSidePaneTab(current, existing ?? {
        ...options,
        id: `browser-permissions:${createUuid()}`,
        type: "browser-permissions",
        openedAt: Date.now(),
    });
}
export function openBrowserSidePane(current, options) {
    const next = activateBrowserSidePane(current, {
        ...options,
        forceNew: true,
    });
    if (options?.activate !== false)
        return next;
    return { ...next, activeTabId: current?.activeTabId ?? "" };
}
/**
 * 同一 workspace/owner 下认领同一个 URL 的 browser tab。
 *
 * 调用方（`useAppPanels`）需要**先**知道落点 tab 的 id 才能对它发导航请求，所以查找与打开
 * 拆成两步：这里定位，`openOrActivateBrowserSidePaneByUrl` 用同一个判据落点。两处共用它，
 * 不会出现「查的是 A、开的是 B」。
 */
export function findBrowserSidePaneTabByUrl(current, options) {
    const ownerKey = sidePaneOwnerKey(options.ownerTaskId);
    return current?.tabs.find((tab) => tab.type === "browser" &&
        tab.initialUrl === options.initialUrl &&
        sidePaneOwnerKey(tab.ownerTaskId) === ownerKey &&
        sidePaneTabMatchesWorkspace(tab, options.workspaceKey ?? null));
}
/**
 * URL 键复用：同一 workspace/session 的同一个 URL 只激活已有 tab。
 *
 * 两个用户：share handover 的分享链接，与 html 产物的直开。两者是同一句话——「带我去这个
 * 地址」，而不是「再开一个浏览器」。复用时**不**改 tab 的任何字段（`initialUrl` 就是键），
 * 要让 webview 重新取字节由调用方另发一次导航请求。
 */
export function openOrActivateBrowserSidePaneByUrl(current, options) {
    const existing = findBrowserSidePaneTabByUrl(current, options);
    if (existing)
        return activateSidePaneTab(current, existing);
    return activateBrowserSidePane(current, {
        initialUrl: options.initialUrl,
        ...(options.tabId ? { tabId: options.tabId } : {}),
        ownerTaskId: options.ownerTaskId,
        workspaceKey: options.workspaceKey,
        ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
    });
}
/** 打开或更新一个受控 browser-use tab；ready 重放按 tabId 幂等。 */
export function openBrowserUseSidePane(current, options) {
    const id = `browser-use:${options.tabId}`;
    const existing = current?.tabs.find((tab) => tab.type === "browser-use" && tab.id === id);
    const remoteSessionId = options.remoteSessionId ?? existing?.remoteSessionId;
    const tab = {
        id,
        type: "browser-use",
        ownerTaskId: options.sessionId,
        workspaceKey: options.workspaceKey,
        ...(remoteSessionId ? { remoteSessionId } : {}),
        sessionId: options.sessionId,
        tabId: options.tabId,
        ...(options.browserId ? { browserId: options.browserId } : {}),
        ...(options.browserGeneration !== undefined
            ? { browserGeneration: options.browserGeneration }
            : {}),
        openedAt: existing?.openedAt ?? Date.now(),
        ...((options.title ?? existing?.title)
            ? { title: options.title ?? existing?.title ?? null }
            : {}),
        ...(existing?.faviconUrl !== undefined ? { faviconUrl: existing.faviconUrl } : {}),
        ...(existing?.residency !== undefined ? { residency: existing.residency } : {}),
        ...(existing?.residencyGeneration !== undefined
            ? { residencyGeneration: existing.residencyGeneration }
            : {}),
        ...(existing?.browserUseOperationUntil !== undefined
            ? { browserUseOperationUntil: existing.browserUseOperationUntil }
            : {}),
        ...(existing?.browserUseResizeBaselineVersion !== undefined
            ? {
                browserUseResizeBaselineVersion: existing.browserUseResizeBaselineVersion,
            }
            : {}),
    };
    if (options.activate !== false) {
        return activateSidePaneTab(current, tab);
    }
    if (!current) {
        return { tabs: [tab], activeTabId: "" };
    }
    const existingIndex = findTabIndexById(current.tabs, tab.id);
    if (existingIndex >= 0) {
        const tabs = [...current.tabs];
        tabs[existingIndex] = tab;
        return { ...current, tabs };
    }
    return { ...current, tabs: [...current.tabs, tab] };
}
/** ready/show 事件只允许激活其 origin workspace + session，后台事件仅挂载 guest。 */
export function applyBrowserUseSidePaneEvent(current, options, activeScope) {
    const shouldReveal = options.workspaceKey === activeScope.workspaceKey &&
        (options.remoteSessionId ?? "") === (activeScope.remoteSessionId ?? "") &&
        options.sessionId === activeScope.ownerTaskId;
    return {
        state: openBrowserUseSidePane(current, {
            ...options,
            activate: shouldReveal,
        }),
        shouldReveal,
    };
}
/** visibility 只选择 ready 已创建的 shell；迟到事件不得重建已关闭 tab。 */
export function applyBrowserUseSidePaneVisibilityEvent(current, options, activeScope) {
    const target = current?.tabs.find((tab) => tab.type === "browser-use" &&
        tab.tabId === options.tabId &&
        tab.workspaceKey === options.workspaceKey &&
        (tab.remoteSessionId ?? "") === (options.remoteSessionId ?? "") &&
        tab.sessionId === options.sessionId &&
        (options.browserId === undefined || tab.browserId === options.browserId) &&
        (options.browserGeneration === undefined ||
            tab.browserGeneration === options.browserGeneration));
    if (!target) {
        // 旧 visibility 路径复用了 ready 的 open helper。main 已关闭 tab 后，队列中
        // 迟到的 visible=true 会在 renderer 重建无 main authority 的僵尸 shell，之后点击关闭必然
        // 失败。visibility 是选择信号，只能命中现存且 scope/generation 完全一致的 shell。
        return { state: current, shouldReveal: false, didMatch: false };
    }
    const shouldReveal = options.workspaceKey === activeScope.workspaceKey &&
        (options.remoteSessionId ?? "") === (activeScope.remoteSessionId ?? "") &&
        options.sessionId === activeScope.ownerTaskId;
    return {
        state: shouldReveal ? setActiveSidePaneTab(current, target.id) : current,
        shouldReveal,
        didMatch: true,
    };
}
export function applyBrowserTabResidencyEvent(current, event) {
    if (!current)
        return current;
    const index = current.tabs.findIndex((tab) => (tab.type === "browser" && tab.id === event.tabId) ||
        (tab.type === "browser-use" && tab.tabId === event.tabId));
    if (index < 0)
        return current;
    const target = current.tabs[index];
    if (event.workspaceKey !== undefined && target.workspaceKey !== event.workspaceKey)
        return current;
    if (Object.hasOwn(event, "remoteSessionId") &&
        (target.remoteSessionId ?? "") !== (event.remoteSessionId ?? "")) {
        return current;
    }
    if (event.sessionId !== undefined &&
        (target.type === "browser-use"
            ? target.sessionId !== event.sessionId
            : (target.ownerTaskId ?? "unscoped") !== event.sessionId)) {
        return current;
    }
    if ((target.residencyGeneration ?? 0) > event.generation)
        return current;
    const tabs = [...current.tabs];
    tabs[index] = {
        ...target,
        ...(target.type === "browser-use" && event.browserId ? { browserId: event.browserId } : {}),
        ...(target.type === "browser-use" && event.browserGeneration !== undefined
            ? { browserGeneration: event.browserGeneration }
            : {}),
        residency: event.residency,
        residencyGeneration: event.generation,
    };
    return { ...current, tabs };
}
export function restoreBrowserTabShells(current, shells, scope) {
    let next = current ?? { tabs: [], activeTabId: "" };
    const hadActiveTabInScope = Boolean(scope &&
        current?.tabs.some((tab) => tab.id === current.activeTabId &&
            (tab.type === "browser" || tab.type === "browser-use") &&
            tab.workspaceKey === scope.workspaceKey &&
            (tab.remoteSessionId ?? "") === (scope.remoteSessionId ?? "") &&
            (tab.type === "browser-use"
                ? tab.sessionId === scope.sessionId
                : (tab.ownerTaskId ?? "unscoped") === scope.sessionId)));
    for (const shell of shells) {
        const existing = next.tabs.find((tab) => (tab.type === "browser" && tab.id === shell.tabId) ||
            (tab.type === "browser-use" && tab.tabId === shell.tabId));
        if (existing)
            continue;
        const tab = shell.origin === "agent"
            ? {
                id: `browser-use:${shell.tabId}`,
                type: "browser-use",
                ownerTaskId: shell.sessionId,
                workspaceKey: shell.workspaceKey,
                ...(shell.remoteSessionId ? { remoteSessionId: shell.remoteSessionId } : {}),
                sessionId: shell.sessionId,
                tabId: shell.tabId,
                browserId: shell.browserId,
                browserGeneration: shell.browserGeneration,
                openedAt: shell.openedAt,
                title: shell.title,
                faviconUrl: shell.faviconUrl,
                residency: "suspended",
                residencyGeneration: 0,
            }
            : {
                id: shell.tabId,
                type: "browser",
                // Bug 原因：草稿态内存 owner 是 null，但 IPC/持久层编码为 "unscoped"；
                // 冷恢复必须对称解码，否则 tab 虽已恢复到状态中，却会被草稿 scope 永久隐藏。
                ownerTaskId: shell.sessionId === "unscoped" ? null : shell.sessionId,
                workspaceKey: shell.workspaceKey,
                ...(shell.remoteSessionId ? { remoteSessionId: shell.remoteSessionId } : {}),
                initialUrl: shell.restoreUrl,
                title: shell.title,
                faviconUrl: shell.faviconUrl,
                openedAt: shell.openedAt,
                residency: "suspended",
                residencyGeneration: 0,
            };
        next = {
            tabs: [...next.tabs, tab],
            activeTabId: next.activeTabId || tab.id,
        };
    }
    if (scope && !hadActiveTabInScope) {
        const preferred = shells
            .filter((shell) => shell.workspaceKey === scope.workspaceKey &&
            (shell.remoteSessionId ?? "") === (scope.remoteSessionId ?? "") &&
            shell.sessionId === scope.sessionId)
            .sort((left, right) => (right.lastSelectedAt ?? Number.NEGATIVE_INFINITY) -
            (left.lastSelectedAt ?? Number.NEGATIVE_INFINITY) ||
            left.openedAt - right.openedAt ||
            left.tabId.localeCompare(right.tabId))[0];
        if (preferred) {
            // Bug 原因：旧恢复直接激活 openedAt 第一条，持久化的 lastSelectedAt 完全未消费。
            // tab strip 仍按 openedAt 保持原顺序，只单独选择当前 scope 的最近使用项。
            next = {
                ...next,
                activeTabId: preferred.origin === "agent" ? `browser-use:${preferred.tabId}` : preferred.tabId,
            };
        }
    }
    return next;
}
export function openCodeViewerSidePane(current, source, ownerTaskId) {
    // 同一个文件/图片在消息里被重复点击时，不能把右侧面板整块替换，
    // 用户刚在别的 pane 里看的内容会直接丢掉。这里按稳定 sourceKey 复用已有 code viewer tab，
    // 既避免重复开一排同名 tab，也能在再次打开时刷新到最新 source。
    const nextTab = createCodeViewerSidePaneTab(source);
    if (!current || nextTab.sourceKey === null) {
        return activateSidePaneTab(current, nextTab);
    }
    const ownerKey = sidePaneOwnerKey(ownerTaskId);
    const matchedTab = current.tabs.find((tab) => tab.type === "code-viewer" &&
        tab.sourceKey === nextTab.sourceKey &&
        sidePaneOwnerKey(tab.ownerTaskId) === ownerKey);
    return activateSidePaneTab(current, matchedTab ? { ...matchedTab, source: nextTab.source } : nextTab);
}
/**
 * 一次性打开一组代码预览 Tab。
 *
 * 自动打开生成产物时不能逐张调用 openCodeViewerSidePane：逐张提交会让右侧
 * 面板经历多次中间状态，并且最后一张会意外成为 active。这里复用单文件
 * 的 sourceKey/owner 规则批量收口，最后按调用方指定的顺序激活一张 Tab。
 */
export function openCodeViewerSidePanes(current, sources, ownerTaskId, activeIndex = 0) {
    if (sources.length === 0) {
        return current ?? { tabs: [], activeTabId: "" };
    }
    let next = current;
    const openedTabIds = [];
    const seenSourceKeys = new Set();
    for (const source of sources) {
        const normalizedSource = normalizeCodeViewerSource(source);
        const sourceKey = getCodeViewerTabSourceKey(normalizedSource);
        // sourceKey 是 workspace-scoped 的稳定身份；同一批次重复路径只打开一次。
        if (sourceKey !== null && seenSourceKeys.has(sourceKey))
            continue;
        if (sourceKey !== null)
            seenSourceKeys.add(sourceKey);
        next = openCodeViewerSidePane(next, normalizedSource, ownerTaskId);
        const activeTab = getActiveSidePaneTab(next);
        if (activeTab?.type === "code-viewer") {
            openedTabIds.push(activeTab.id);
        }
    }
    if (!next || openedTabIds.length === 0) {
        return next ?? { tabs: [], activeTabId: "" };
    }
    const safeIndex = Math.min(Math.max(activeIndex, 0), openedTabIds.length - 1);
    return {
        ...next,
        activeTabId: openedTabIds[safeIndex],
    };
}
export function activateGitSidePane(current) {
    return activateSidePaneTab(current, createGitSidePaneTab());
}
export function activateTreemappingSidePane(current, source) {
    return activateSidePaneTab(current, createTreemappingSidePaneTab(source));
}
export function openWhiteboardSidePane(current, options) {
    return activateSidePaneTab(current, createWhiteboardSidePaneTab(options));
}
export function openModelTrajectorySidePane(current, options) {
    return activateSidePaneTab(current, createModelTrajectorySidePaneTab(options));
}
export function activateDeveloperToolsSidePane(current) {
    return activateSidePaneTab(current, createDeveloperToolsSidePaneTab());
}
export function openTerminalSidePane(current, options) {
    return activateSidePaneTab(current, createTerminalSidePaneTab(options));
}
export function openSubagentSessionSidePane(current, options) {
    const nextTab = createSubagentSessionSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "subagent-session" && tab.id === nextTab.id);
    const nextTitle = options.title.trim();
    return activateSidePaneTab(current, existing
        ? {
            ...existing,
            workspacePath: options.workspacePath,
            ...(options.workspaceIdentity ? { workspaceIdentity: options.workspaceIdentity } : {}),
            ...(options.remoteSessionId ? { remoteSessionId: options.remoteSessionId } : {}),
            rootSessionId: options.rootSessionId ?? options.parentSessionId,
            parentSessionId: options.parentSessionId,
            subagentType: options.subagentType,
            // HMR 期间可能复用旧结构的内存 tab；新入口没有 title 时保留已知标题，
            // 但绝不再回退到旧的 type + ordinal 展示规则。
            title: nextTitle || existing.title || "",
        }
        : nextTab);
}
export function openSubagentDirectorySidePane(current, options) {
    const nextTab = createSubagentDirectorySidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "subagent-directory" && tab.id === nextTab.id);
    return activateSidePaneTab(current, existing ? { ...existing, ...nextTab } : nextTab);
}
export function syncSubagentSessionSidePaneTabs(current, options) {
    if (!current)
        return null;
    const validChildSessionIds = new Set(options.validChildSessionIds);
    const removedTabs = current.tabs.filter((tab) => tab.type === "subagent-session" &&
        tab.rootSessionId === options.rootSessionId &&
        tab.parentSessionId === options.parentSessionId &&
        !validChildSessionIds.has(tab.childSessionId));
    if (removedTabs.length === 0)
        return current;
    const removedIds = new Set(removedTabs.map((tab) => tab.id));
    const tabs = current.tabs.filter((tab) => !removedIds.has(tab.id));
    if (tabs.length === 0)
        return null;
    if (!removedIds.has(current.activeTabId))
        return { ...current, tabs };
    const directory = tabs.find((tab) => tab.type === "subagent-directory" && tab.rootSessionId === options.rootSessionId);
    if (directory)
        return { tabs, activeTabId: directory.id };
    const removedIndex = current.tabs.findIndex((tab) => tab.id === current.activeTabId);
    const previous = tabs[Math.max(0, Math.min(removedIndex - 1, tabs.length - 1))];
    return { tabs, activeTabId: previous?.id ?? tabs.at(-1).id };
}
export function openSelectionSideChatPane(current, options) {
    const existing = current?.tabs.find((tab) => tab.type === "selection-side-chat" &&
        tab.workspaceKey === options.workspaceKey &&
        tab.parentSessionId === options.parentSessionId &&
        tab.childSessionId === options.childSessionId);
    const ordinal = existing?.ordinal ??
        getNextSelectionSideChatOrdinal(current?.tabs ?? [], options.workspaceKey, options.parentSessionId);
    const nextTab = createSelectionSideChatPaneTab({ ...options, ordinal });
    return activateSidePaneTab(current, existing ? { ...existing, ...nextTab } : nextTab);
}
function getNextSelectionSideChatOrdinal(tabs, workspaceKey, parentSessionId) {
    const used = new Set(tabs.flatMap((tab) => tab.type === "selection-side-chat" &&
        tab.workspaceKey === workspaceKey &&
        tab.parentSessionId === parentSessionId
        ? [tab.ordinal]
        : []));
    let ordinal = 1;
    while (used.has(ordinal))
        ordinal += 1;
    return ordinal;
}
export function getActiveSelectionSideChatTab(current, scope) {
    const active = getActiveSidePaneTab(current);
    return active?.type === "selection-side-chat" &&
        active.workspaceKey === scope.workspaceKey &&
        active.parentSessionId === scope.parentSessionId
        ? active
        : null;
}
export function openPlanDetailSidePane(current, options) {
    const nextTab = createPlanDetailSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "plan-detail" && tab.id === nextTab.id);
    // 同一个 toolCall 只保留一个 tab；再次点击用卡片当前正文刷新 fallback，
    // 详情组件的实时正文仍以父 conversation projection 为权威。
    return activateSidePaneTab(current, existing ? { ...existing, ...nextTab } : nextTab);
}
/**
 * 打开或复用一个 workflow run 详情 tab。
 *
 * 复用规则与 plan-detail 同构（结构化 id 幂等），刻意也**同样没有 GC**：事件日志读的是
 * journal，而 `workflowRuns` 投影只留最近 8 个 run，所以一个被淘汰的 run 仍有完整可读的
 * 事件日志——那正是用户会把这个 tab 留着的场景。投影缺席退化成详情页的空态，不关 tab。
 */
export function openWorkflowRunSidePane(current, options) {
    const nextTab = createWorkflowRunSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "workflow-run" && tab.id === nextTab.id);
    if (existing === undefined)
        return activateSidePaneTab(current, nextTab);
    // 落点每次都重算（与脚本 transcript tab 同一条规则）：请求带 phaseId 就落到它，不带就显式删键；
    // `openedAt` 随每次打开刷新，面板据此在同一站上再点一次也重新滚。
    const merged = { ...existing, ...nextTab };
    if (nextTab.focusPhaseId === undefined)
        delete merged.focusPhaseId;
    return activateSidePaneTab(current, merged);
}
/**
 * 「配置」被接受后的原地替换：旧 run 的 tab 换成新 run 的 tab，位置、名字、归属照旧；它原来是活动
 * tab 才让新 tab 成为活动 tab。新 run 的 tab 已经开着时，关掉旧的、聚焦已有的那一个（不出两个）。
 * 旧 tab 不在（用户已关掉）即原样返回——替换不是打开；结果里的 run 就是被替换的那一个（就地生效的
 * 修订没有后继）时同理，这个 tab 已经是它了。
 */
export function replaceWorkflowRunSidePane(current, options) {
    if (current === null)
        return current;
    const nextTab = createWorkflowRunSidePaneTab(options);
    const replaceRunId = options.replaceRunId;
    const index = current.tabs.findIndex((tab) => tab.type === "workflow-run" &&
        tab.workspaceKey === nextTab.workspaceKey &&
        tab.parentSessionId === nextTab.parentSessionId &&
        tab.runId === replaceRunId);
    const previous = current.tabs[index];
    if (index < 0 || previous?.type !== "workflow-run")
        return current;
    // 就地生效的修订（只改并发上限、run 又在飞：docs/dynamic-workflow/concurrency.md）没有后继，
    // 结果里的 runId 就是被替换的这一个。tab 的 id 只由 runId 铸，所以不挡在这里的话，下面那支
    // 「新 tab 已经开着」会认出它自己、把这个 tab 关掉，只留一个指向已不存在 tab 的 activeTabId。
    if (nextTab.id === previous.id)
        return current;
    const wasActive = current.activeTabId === previous.id;
    const existingIndex = findTabIndexById(current.tabs, nextTab.id);
    if (existingIndex >= 0) {
        const tabs = current.tabs.filter((_, tabIndex) => tabIndex !== index);
        return { tabs, activeTabId: wasActive ? nextTab.id : current.activeTabId };
    }
    const replaced = {
        ...nextTab,
        ...(previous.ownerTaskId === undefined ? {} : { ownerTaskId: previous.ownerTaskId }),
        ...(nextTab.workflowName === undefined && previous.workflowName !== undefined
            ? { workflowName: previous.workflowName }
            : {}),
    };
    const tabs = [...current.tabs];
    tabs[index] = replaced;
    return { tabs, activeTabId: wasActive ? replaced.id : current.activeTabId };
}
/**
 * 打开或复用一条对话的 run 目录 tab。身份是对话，所以页脚行重复点击只是聚焦。
 *
 * GC 同样**没有**（与 workflow-run 同一条理由链）：目录页每次挂载自己重读一页 journal，
 * 所以一个被恢复出来的旧 tab 不会显示过期名单，也就没有该回收的东西。
 */
export function openWorkflowRunDirectorySidePane(current, options) {
    const nextTab = createWorkflowRunDirectorySidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "workflow-directory" && tab.id === nextTab.id);
    return activateSidePaneTab(current, existing ? { ...existing, ...nextTab } : nextTab);
}
/**
 * 打开或复用一个 actor transcript tab。
 *
 * 复用规则与 workflow-run 同构（结构化 id 幂等），GC 同样**没有**：actor 会话在 run 结束
 * 之后继续可读，那正是把它落成真实持久会话换来的东西。见类型上那段注释。
 *
 * 合并时新请求里缺席的键不覆盖旧值：先从未启动的药丸开（无会话 id）、后从已启动的药丸再开
 * （带会话 id）补上会话；反过来再开一次不带会话的请求也不会把已知的会话 id 抹掉。
 */
export function openWorkflowActorSessionSidePane(current, options) {
    const nextTab = createWorkflowActorSessionSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "workflow-actor-session" && tab.id === nextTab.id);
    return activateSidePaneTab(current, existing ? { ...existing, ...nextTab } : nextTab);
}
/**
 * 打开或复用一个 run 的脚本 transcript tab。
 *
 * 落点**每次都重算**：再点一枚脚本药丸的意思是「带我去那一站」，所以请求带 phaseId 就落到
 * 它，不带就不落（显式删键，同 `openWorkflowArtifactSidePane` 对 version 的处理）。`openedAt`
 * 随每次打开刷新，面板据此在同一站上再点一次也重新滚动。
 */
export function openWorkflowWorkspaceSidePane(current, options) {
    const nextTab = createWorkflowWorkspaceSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "workflow-workspace" && tab.id === nextTab.id);
    if (existing === undefined)
        return activateSidePaneTab(current, nextTab);
    const merged = { ...existing, ...nextTab };
    if (nextTab.focusPhaseId === undefined)
        delete merged.focusPhaseId;
    return activateSidePaneTab(current, merged);
}
/**
 * 打开或复用一个产物的全尺寸 tab。
 *
 * 复用时**不把旧 tab 的 version 保留下来**：再次点击一枚 chip 的意思是「让我看这个产物」，
 * 而 chip 从不带版本号，所以合并结果里 `version` 缺席即回到最新版。反过来，若请求显式带了
 * 版本（例如将来某处要跳到某一版），那一版才是落点。
 */
export function openWorkflowArtifactSidePane(current, options) {
    const nextTab = createWorkflowArtifactSidePaneTab(options);
    const existing = current?.tabs.find((tab) => tab.type === "workflow-artifact" && tab.id === nextTab.id);
    if (existing === undefined)
        return activateSidePaneTab(current, nextTab);
    // 合并时**丢掉旧 tab 上的 version**：`...nextTab` 里缺席的键不会覆盖旧值，而那正好是
    // 「chip 不带版本号 ⇒ 回到最新版」这条语义会被悄悄破坏的地方（旧 tab 停在 v1，再点一次
    // 仍然停在 v1）。显式删键，让缺席真的是缺席。
    const merged = { ...existing, ...nextTab };
    if (nextTab.version === undefined)
        delete merged.version;
    return activateSidePaneTab(current, merged);
}
export function isSidePaneTabVisibleForParent(tab, parentSessionId) {
    if (tab.type === "browser-use") {
        return tab.sessionId === parentSessionId;
    }
    // 归属于某条对话（而非 workspace 全局）的 tab 按 parentSessionId 收窄。
    if (tab.type === "selection-side-chat" ||
        tab.type === "plan-detail" ||
        tab.type === "plugin-ui" ||
        tab.type === "workflow-run" ||
        tab.type === "workflow-directory" ||
        tab.type === "workflow-actor-session" ||
        tab.type === "workflow-workspace" ||
        tab.type === "workflow-artifact") {
        return tab.parentSessionId === parentSessionId;
    }
    if (tab.type === "subagent-session" ||
        tab.type === "subagent-directory" ||
        tab.type === "bash-output") {
        return tab.rootSessionId === parentSessionId;
    }
    return true;
}
export function getVisibleSidePaneTabs(input, scopeOrParent) {
    if (Array.isArray(input)) {
        return getVisibleSidePaneTabsByScope(input, scopeOrParent);
    }
    const parentSessionId = scopeOrParent;
    return input?.tabs.filter((tab) => isSidePaneTabVisibleForParent(tab, parentSessionId)) ?? [];
}
export function selectSidePaneTabsForParent(current, parentSessionId, preferredTabId) {
    if (!current)
        return null;
    const visibleTabs = getVisibleSidePaneTabs(current, parentSessionId);
    if (visibleTabs.length === 0) {
        return current.activeTabId === "" ? current : { ...current, activeTabId: "" };
    }
    const preferred = preferredTabId
        ? visibleTabs.find((tab) => tab.id === preferredTabId)
        : undefined;
    const currentActive = visibleTabs.find((tab) => tab.id === current.activeTabId);
    const nextActive = currentActive ??
        preferred ??
        visibleTabs.findLast((tab) => tab.type === "subagent-session" ||
            tab.type === "subagent-directory" ||
            tab.type === "selection-side-chat" ||
            tab.type === "plan-detail" ||
            tab.type === "workflow-run" ||
            tab.type === "workflow-actor-session" ||
            tab.type === "workflow-workspace" ||
            tab.type === "workflow-artifact") ??
        visibleTabs.at(-1);
    return nextActive && nextActive.id !== current.activeTabId
        ? { ...current, activeTabId: nextActive.id }
        : current;
}
export function closeVisibleOtherSidePaneTabs(current, tabId, parentSessionId) {
    if (!current)
        return null;
    const visibleTabs = getVisibleSidePaneTabs(current, parentSessionId);
    const target = visibleTabs.find((tab) => tab.id === tabId);
    if (!target)
        return current;
    const closingIds = new Set(visibleTabs.filter((tab) => tab.id !== tabId).map((tab) => tab.id));
    return {
        tabs: current.tabs.filter((tab) => !closingIds.has(tab.id)),
        activeTabId: target.id,
    };
}
export function closeVisibleSidePaneTabs(current, parentSessionId) {
    if (!current)
        return null;
    const closingIds = new Set(getVisibleSidePaneTabs(current, parentSessionId).map((tab) => tab.id));
    const tabs = current.tabs.filter((tab) => !closingIds.has(tab.id));
    return tabs.length === 0 ? null : { tabs, activeTabId: "" };
}
export function closeSidePaneTabForParent(current, tabId, parentSessionId, preferredTabId) {
    const next = closeSidePaneTab(current, tabId);
    return selectSidePaneTabsForParent(next, parentSessionId, preferredTabId);
}
export function closeSidePaneTab(current, tabId) {
    if (!current) {
        return null;
    }
    const closingIndex = findTabIndexById(current.tabs, tabId);
    if (closingIndex < 0) {
        return current;
    }
    const nextTabs = current.tabs.filter((tab) => tab.id !== tabId);
    if (nextTabs.length === 0) {
        return null;
    }
    if (current.activeTabId !== tabId) {
        return {
            tabs: nextTabs,
            activeTabId: current.activeTabId,
        };
    }
    const fallbackIndex = Math.min(closingIndex, nextTabs.length - 1);
    return {
        tabs: nextTabs,
        activeTabId: nextTabs[fallbackIndex].id,
    };
}
export function closeOtherSidePaneTabs(current, tabId) {
    if (!current) {
        return null;
    }
    const targetTab = current.tabs.find((tab) => tab.id === tabId);
    if (!targetTab || current.tabs.length <= 1) {
        return current;
    }
    return {
        // 交互说明：右键“关闭其他标签”以当前被操作的 tab 为保留对象，
        // 即使它原本不是激活项，也要同步激活，避免内容区指向一个已被移除的 activeTabId。
        tabs: [targetTab],
        activeTabId: targetTab.id,
    };
}
export function closeAllSidePaneTabs() {
    return null;
}
export function setActiveSidePaneTab(current, tabId) {
    if (!current || !current.tabs.some((tab) => tab.id === tabId)) {
        return current;
    }
    return {
        ...current,
        activeTabId: tabId,
    };
}
export function updateBrowserSidePaneTab(current, tabId, patch) {
    if (!current) {
        return current;
    }
    let didUpdate = false;
    const nextTabs = current.tabs.map((tab) => {
        if (tab.id !== tabId) {
            return tab;
        }
        if (tab.type === "browser" || tab.type === "browser-use") {
            didUpdate = true;
            return { ...tab, ...patch };
        }
        return tab;
    });
    return didUpdate
        ? {
            ...current,
            tabs: nextTabs,
        }
        : current;
}
/** 按 workspace/session/browser generation/tab 完整匹配运行态，避免 stale run 串写。 */
export function markBrowserUseSidePaneTabOperation(current, options) {
    if (!current)
        return current;
    let didUpdate = false;
    const tabs = current.tabs.map((tab) => {
        if (tab.type !== "browser-use" ||
            tab.workspaceKey !== options.workspaceKey ||
            tab.sessionId !== options.sessionId ||
            (tab.browserId !== undefined && tab.browserId !== options.browserId) ||
            (tab.browserGeneration !== undefined &&
                tab.browserGeneration !== options.browserGeneration) ||
            tab.tabId !== options.tabId) {
            return tab;
        }
        didUpdate = true;
        return {
            ...tab,
            browserUseOperationUntil: options.operationUntil,
            ...(options.resetsResizeBaseline
                ? {
                    browserUseResizeBaselineVersion: (tab.browserUseResizeBaselineVersion ?? 0) + 1,
                }
                : {}),
        };
    });
    return didUpdate ? { ...current, tabs } : current;
}
export function reorderSidePaneTab(current, activeTabId, overTabId) {
    if (!current || activeTabId === overTabId) {
        return current;
    }
    const activeIndex = findTabIndexById(current.tabs, activeTabId);
    const overIndex = findTabIndexById(current.tabs, overTabId);
    if (activeIndex < 0 || overIndex < 0) {
        return current;
    }
    const nextTabs = [...current.tabs];
    const [movedTab] = nextTabs.splice(activeIndex, 1);
    if (!movedTab) {
        return current;
    }
    nextTabs.splice(overIndex, 0, movedTab);
    return {
        ...current,
        tabs: nextTabs,
    };
}
export function toggleBrowserSidePane(current, ownerTaskId, remoteSessionId) {
    const ownerKey = sidePaneOwnerKey(ownerTaskId);
    const activeTab = getActiveSidePaneTab(current);
    if (activeTab?.type === "browser" && sidePaneOwnerKey(activeTab.ownerTaskId) === ownerKey) {
        return closeSidePaneTab(current, activeTab.id);
    }
    return activateBrowserSidePane(current, {
        ownerTaskId,
        ...(remoteSessionId ? { remoteSessionId } : {}),
    });
}
export function toggleGitSidePane(current) {
    const activeTab = getActiveSidePaneTab(current);
    if (activeTab?.type === "git") {
        return closeSidePaneTab(current, activeTab.id);
    }
    return activateGitSidePane(current);
}
export function closeCodeViewerSidePane(current) {
    const activeTab = getActiveSidePaneTab(current);
    return activeTab?.type === "code-viewer" ? closeSidePaneTab(current, activeTab.id) : current;
}
export function closeGitSidePane(current) {
    return closeSidePaneTab(current, "git");
}
export function openBackgroundBashSidePane(current, target) {
    const workspaceKey = target.workspaceIdentity?.trim() || target.workspacePath;
    const id = "bash-output:" +
        [
            workspaceKey,
            target.remoteSessionId ?? "",
            target.rootSessionId,
            target.sessionId,
            target.workId,
        ]
            .map(encodeSidePaneTabIdPart)
            .join(":");
    const existing = current?.tabs.find((tab) => tab.id === id);
    return activateSidePaneTab(current, existing ?? {
        ...target,
        id,
        type: "bash-output",
        workspaceKey,
        ownerTaskId: target.rootSessionId,
        openedAt: Date.now(),
    });
}
//# sourceMappingURL=workspaceSidePane.js.map