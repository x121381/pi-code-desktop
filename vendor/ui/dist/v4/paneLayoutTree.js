// 分屏 Layout 层二叉分割树的模型与纯状态机。
// 对齐：Focus 指向 Layout 的 pane，
// pane 指向 (workspaceScope, sessionId)，SessionDataLayer 对上两层零感知。
//
// 设计边界：
// - 布局 = 二叉分割树（VS Code editor groups 模型）：任意 pane 可向右/向下拆分，
//   嵌套即得 2x2 等网格；叶子上限 MAX_WORKBENCH_PANES（性能基线 4 pane）。
// - pane 绑定 = { workspaceScope, sessionId }：pane 自带 workspace 归属（含远程
//   remoteSessionId），不再限制同 workspace；早期版本的「split 属于别的 workspace 时
//   不渲染」规则删除——pane 跨 workspace tab 常驻。
// - workspaceScope 语义 = session 归属的主（primary）workspace，是连接路由键；
//   不是「session 能触达的全部路径」（未来跨 workspace session 的辅助路径是
//   session 属性，不进布局层）。
// - primary pane（workspace-main）是保留叶子：不进 panes，绑定沿用既有选择态
//   （activeTaskId → shell props），避免与 zcodeSessionStore/tabStore 双写；
//   tabStore（workspace tab 语义）完全不动。
// 所有转移函数无副作用；无变化时返回原引用（zustand 免重渲染）。
/** primary pane 固定 id（沿用写死的 paneId，testid 契约不变）。 */
export const V4_PRIMARY_PANE_ID = "workspace-main";
/** 叶子 pane 数量上限（性能验收基线「4 pane 同时流式不掉帧」；也是 CLI 子进程数软上限）。 */
export const MAX_WORKBENCH_PANES = 4;
/** 分割占比边界：first 子树占比最小 25% / 最大 75%（拖拽与持久化共用同一 clamp）。 */
export const SPLIT_RATIO_MIN = 0.25;
export const SPLIT_RATIO_MAX = 0.75;
export const DEFAULT_SPLIT_RATIO = 0.5;
export function clampSplitRatio(ratio) {
    if (!Number.isFinite(ratio)) {
        return DEFAULT_SPLIT_RATIO;
    }
    return Math.min(SPLIT_RATIO_MAX, Math.max(SPLIT_RATIO_MIN, ratio));
}
/** 身份/隔离语义统一口径：workspaceKey = workspaceIdentity?.trim() || workspacePath。 */
export function paneWorkspaceKey(scope) {
    return scope.workspaceIdentity?.trim() || scope.workspacePath;
}
export function paneBindingMatchesSession(binding, scope, sessionId) {
    return Boolean(binding?.sessionId === sessionId &&
        paneWorkspaceKey(binding.workspaceScope) === paneWorkspaceKey(scope));
}
export const PRIMARY_LEAF = {
    type: "leaf",
    paneId: V4_PRIMARY_PANE_ID,
};
export const INITIAL_PANE_LAYOUT = {
    root: PRIMARY_LEAF,
    panes: {},
    focusedPaneId: V4_PRIMARY_PANE_ID,
};
// ============================================================================
// 树工具（未变化路径保持结构共享 = 原引用）。
// ============================================================================
/** 前序收集叶子 paneId。 */
export function leafPaneIds(node) {
    if (node.type === "leaf") {
        return [node.paneId];
    }
    return [...leafPaneIds(node.first), ...leafPaneIds(node.second)];
}
export function countPanes(state) {
    return leafPaneIds(state.root).length;
}
/** 是否还能再拆出新 pane（叶子数 < MAX_WORKBENCH_PANES）。 */
export function canAddPane(state) {
    return countPanes(state) < MAX_WORKBENCH_PANES;
}
function leafExists(node, paneId) {
    if (node.type === "leaf") {
        return node.paneId === paneId;
    }
    return leafExists(node.first, paneId) || leafExists(node.second, paneId);
}
/** 焦点 pane 不在树中（如刚被关闭/恢复数据异常）时退化为 primary。 */
export function effectiveFocusedPaneId(state) {
    return leafExists(state.root, state.focusedPaneId)
        ? state.focusedPaneId
        : V4_PRIMARY_PANE_ID;
}
/** 分配新 pane id：pane-<n>，n = 树内既有序号最大值 + 1（与 workspace-main/split 保留 id 无碰撞）。 */
function allocatePaneId(root) {
    let max = 0;
    for (const paneId of leafPaneIds(root)) {
        const match = /^pane-(\d+)$/.exec(paneId);
        if (match) {
            max = Math.max(max, Number(match[1]));
        }
    }
    return `pane-${max + 1}`;
}
function splitNodeIds(node) {
    if (node.type === "leaf") {
        return [];
    }
    return [node.id, ...splitNodeIds(node.first), ...splitNodeIds(node.second)];
}
/** 分配新分割节点 id：n<k>（短 id，进 CSS 变量名 --v4-split-<id>）。 */
function allocateSplitNodeId(root) {
    let max = 0;
    for (const id of splitNodeIds(root)) {
        const match = /^n(\d+)$/.exec(id);
        if (match) {
            max = Math.max(max, Number(match[1]));
        }
    }
    return `n${max + 1}`;
}
/** 把 paneId 叶子替换为 replacement；未命中路径保持原引用。 */
function replaceLeaf(node, paneId, replacement) {
    if (node.type === "leaf") {
        return node.paneId === paneId ? replacement : node;
    }
    const first = replaceLeaf(node.first, paneId, replacement);
    const second = replaceLeaf(node.second, paneId, replacement);
    if (first === node.first && second === node.second) {
        return node;
    }
    return { ...node, first, second };
}
/** 移除叶子：父分割节点塌缩为兄弟子树；返回 null 表示整棵树被移除（仅当根就是该叶子）。 */
function removeLeaf(node, paneId) {
    if (node.type === "leaf") {
        return node.paneId === paneId ? null : node;
    }
    const first = removeLeaf(node.first, paneId);
    if (first === null) {
        return node.second;
    }
    const second = removeLeaf(node.second, paneId);
    if (second === null) {
        return node.first;
    }
    if (first === node.first && second === node.second) {
        return node;
    }
    return { ...node, first, second };
}
function replaceSplitRatio(node, splitId, ratio) {
    if (node.type === "leaf") {
        return node;
    }
    if (node.id === splitId) {
        return node.ratio === ratio ? node : { ...node, ratio };
    }
    const first = replaceSplitRatio(node.first, splitId, ratio);
    const second = replaceSplitRatio(node.second, splitId, ratio);
    if (first === node.first && second === node.second) {
        return node;
    }
    return { ...node, first, second };
}
// ============================================================================
// 纯状态机（单测对象）
// ============================================================================
/**
 * 在 anchor pane 处拆分：anchor 叶子替换为分割节点 { anchor, 新 pane }，
 * 新 pane 绑定 binding（draft 或已有 session）并接管焦点。
 * anchor 不在树中 / 叶子数达上限 → no-op（原引用）。
 */
export function splitPaneAt(state, anchorPaneId, direction, binding) {
    if (!leafExists(state.root, anchorPaneId) || !canAddPane(state)) {
        return state;
    }
    const newPaneId = allocatePaneId(state.root);
    const splitNode = {
        type: "split",
        id: allocateSplitNodeId(state.root),
        direction,
        ratio: DEFAULT_SPLIT_RATIO,
        first: { type: "leaf", paneId: anchorPaneId },
        second: { type: "leaf", paneId: newPaneId },
    };
    return {
        root: replaceLeaf(state.root, anchorPaneId, splitNode),
        panes: { ...state.panes, [newPaneId]: binding },
        focusedPaneId: newPaneId,
    };
}
/**
 * 在 anchor pane 四周拆分：left/up 把新 pane 放在 anchor 前，right/down 放在后。
 * 拖拽分屏需要保留用户的方位意图；旧 splitPaneAt 继续保持「anchor 在前、新 pane 在后」契约。
 */
export function splitPaneAtSide(state, anchorPaneId, side, binding) {
    if (!leafExists(state.root, anchorPaneId) || !canAddPane(state)) {
        return state;
    }
    const newPaneId = allocatePaneId(state.root);
    const anchorLeaf = { type: "leaf", paneId: anchorPaneId };
    const newLeaf = { type: "leaf", paneId: newPaneId };
    const before = side === "left" || side === "up";
    const splitNode = {
        type: "split",
        id: allocateSplitNodeId(state.root),
        direction: side === "left" || side === "right" ? "row" : "column",
        ratio: DEFAULT_SPLIT_RATIO,
        first: before ? newLeaf : anchorLeaf,
        second: before ? anchorLeaf : newLeaf,
    };
    return {
        root: replaceLeaf(state.root, anchorPaneId, splitNode),
        panes: { ...state.panes, [newPaneId]: binding },
        focusedPaneId: newPaneId,
    };
}
/**
 * 关闭 pane：叶子移除，父分割节点塌缩为兄弟子树；绑定移除。
 * primary 不可关；pane 不在树中 → no-op。焦点在被关 pane 上时归还 primary。
 * 关 pane ≠ 停 session：只是退订视图，session 在 CLI 里照跑。
 */
export function closePane(state, paneId) {
    if (paneId === V4_PRIMARY_PANE_ID || !leafExists(state.root, paneId)) {
        return state;
    }
    const root = removeLeaf(state.root, paneId) ?? PRIMARY_LEAF;
    const panes = { ...state.panes };
    delete panes[paneId];
    return {
        root,
        panes,
        focusedPaneId: state.focusedPaneId === paneId ? V4_PRIMARY_PANE_ID : state.focusedPaneId,
    };
}
/** draft pane 首发 createSession 后原地绑定 session。pane 无绑定/未变（且无待验证标记）时 no-op。 */
export function bindPaneSession(state, paneId, sessionId) {
    const binding = state.panes[paneId];
    if (!binding ||
        (binding.sessionId === sessionId && !binding.restoredUnvalidated)) {
        return state;
    }
    // 实时绑定即权威，不需要再验证：不带 restoredUnvalidated 重建。
    return {
        ...state,
        panes: {
            ...state.panes,
            [paneId]: { workspaceScope: binding.workspaceScope, sessionId },
        },
    };
}
/**
 * 原位替换非 primary pane 的完整 session binding。
 * draft split 后普通 session 点击过去只更新 shell activeTaskId，导致 primary
 * draft 被新 session 覆盖；这里先替换 focused secondary 的 scope + session owner。
 */
export function replacePaneBinding(state, paneId, binding) {
    if (!state.panes[paneId] || paneId === V4_PRIMARY_PANE_ID) {
        return state;
    }
    return {
        ...state,
        panes: {
            ...state.panes,
            [paneId]: binding,
        },
        focusedPaneId: paneId,
    };
}
export function findPaneIdForSession(state, scope, sessionId) {
    for (const [paneId, binding] of Object.entries(state.panes)) {
        if (paneBindingMatchesSession(binding, scope, sessionId)) {
            return paneId;
        }
    }
    return null;
}
/** 拖拽调宽提交：按分割节点 id 定位，clamp 到 [25%, 75%]；未变化返回原引用。 */
export function setSplitNodeRatio(state, splitId, ratio) {
    const root = replaceSplitRatio(state.root, splitId, clampSplitRatio(ratio));
    if (root === state.root) {
        return state;
    }
    return { ...state, root };
}
/** 聚焦 pane：只接受当前树里存在的叶子，其余 no-op（原引用）。 */
export function focusPane(state, paneId) {
    if (state.focusedPaneId === paneId || !leafExists(state.root, paneId)) {
        return state;
    }
    return { ...state, focusedPaneId: paneId };
}
/** 持久化恢复的 pane 绑定经 sessions-index 验证在场后清除待验证标记。无标记时 no-op。 */
export function confirmRestoredPaneSession(state, paneId) {
    const binding = state.panes[paneId];
    if (!binding?.restoredUnvalidated) {
        return state;
    }
    return {
        ...state,
        panes: {
            ...state.panes,
            [paneId]: {
                workspaceScope: binding.workspaceScope,
                sessionId: binding.sessionId,
            },
        },
    };
}
/**
 * 侧栏/下钻「在分屏打开」：该 session 已在某个 pane（按 workspaceKey + sessionId 判等，
 * 归属/隔离语义）→ 聚焦它；否则拆分当前焦点 pane 向右。达上限且无既有 pane → no-op。
 */
export function openSessionInNewPane(state, scope, sessionId) {
    const workspaceKey = paneWorkspaceKey(scope);
    for (const [paneId, binding] of Object.entries(state.panes)) {
        if (binding.sessionId === sessionId &&
            paneWorkspaceKey(binding.workspaceScope) === workspaceKey) {
            return focusPane(state, paneId);
        }
    }
    return splitPaneAt(state, effectiveFocusedPaneId(state), "row", {
        workspaceScope: scope,
        sessionId,
    });
}
//# sourceMappingURL=paneLayoutTree.js.map