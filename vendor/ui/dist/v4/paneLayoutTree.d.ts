/** primary pane 固定 id（沿用写死的 paneId，testid 契约不变）。 */
export declare const V4_PRIMARY_PANE_ID = "workspace-main";
/** 叶子 pane 数量上限（性能验收基线「4 pane 同时流式不掉帧」；也是 CLI 子进程数软上限）。 */
export declare const MAX_WORKBENCH_PANES = 4;
/** 分割占比边界：first 子树占比最小 25% / 最大 75%（拖拽与持久化共用同一 clamp）。 */
export declare const SPLIT_RATIO_MIN = 0.25;
export declare const SPLIT_RATIO_MAX = 0.75;
export declare const DEFAULT_SPLIT_RATIO = 0.5;
export declare function clampSplitRatio(ratio: number): number;
/**
 * pane 的 workspace 归属（= session 的 primary workspace，连接路由键）。
 * - 本地：只有 workspacePath；
 * - 远程（SSH/WSL/Docker）：workspaceIdentity 必填（Workspace Identity 约束），
 *   remoteSessionId 指向 remoteWorkspaceSessionStore 的连接（缺省时按 identity 解析）。
 */
export interface PaneWorkspaceScope {
    readonly workspacePath: string;
    readonly workspaceIdentity?: string;
    readonly remoteSessionId?: string;
}
/** 身份/隔离语义统一口径：workspaceKey = workspaceIdentity?.trim() || workspacePath。 */
export declare function paneWorkspaceKey(scope: PaneWorkspaceScope): string;
export declare function paneBindingMatchesSession(binding: PaneBinding | null | undefined, scope: PaneWorkspaceScope, sessionId: string): boolean;
export interface PaneBinding {
    /** = session 归属的主 workspace（连接路由键）；辅助路径不在此。 */
    readonly workspaceScope: PaneWorkspaceScope;
    /** 绑定的 CLI session；null = draft（空 pane 动线：首发 createSession 后原地绑定）。 */
    readonly sessionId: string | null;
    /** 只读 pane 不渲染 composer/input；当前用于 subagent 行内侧开的 child session。 */
    readonly readOnly?: boolean;
    /**
     * 从持久化恢复、尚未经该 scope 的 sessions-index 验证存在性的绑定（标记本身不持久化）。
     * 在场 → confirmRestoredPaneSession 清除；已删 → closePane 优雅塌缩。
     */
    readonly restoredUnvalidated?: boolean;
}
export type SplitDirection = "row" | "column";
/** IDE 式拖拽拆分方向：left/up 插到 anchor 前，right/down 插到 anchor 后。 */
export type PaneSplitSide = "left" | "right" | "up" | "down";
export type PaneLayoutNode = {
    readonly type: "leaf";
    readonly paneId: string;
} | {
    readonly type: "split";
    /** 分割节点 id（拖拽 CSS 变量与 setSplitRatio 的定位键）。 */
    readonly id: string;
    readonly direction: SplitDirection;
    /** first 子树占比，clamp [0.25, 0.75]。 */
    readonly ratio: number;
    readonly first: PaneLayoutNode;
    readonly second: PaneLayoutNode;
};
export interface PaneLayoutSnapshot {
    readonly root: PaneLayoutNode;
    /** 非 primary pane 的绑定；primary 绑定沿用 shell props（activeTaskId），不入此表。 */
    readonly panes: Readonly<Record<string, PaneBinding>>;
    /** 全应用唯一的「当前」pane（Focus 层单值）。 */
    readonly focusedPaneId: string;
}
export declare const PRIMARY_LEAF: PaneLayoutNode;
export declare const INITIAL_PANE_LAYOUT: PaneLayoutSnapshot;
/** 前序收集叶子 paneId。 */
export declare function leafPaneIds(node: PaneLayoutNode): string[];
export declare function countPanes(state: PaneLayoutSnapshot): number;
/** 是否还能再拆出新 pane（叶子数 < MAX_WORKBENCH_PANES）。 */
export declare function canAddPane(state: PaneLayoutSnapshot): boolean;
/** 焦点 pane 不在树中（如刚被关闭/恢复数据异常）时退化为 primary。 */
export declare function effectiveFocusedPaneId(state: PaneLayoutSnapshot): string;
/**
 * 在 anchor pane 处拆分：anchor 叶子替换为分割节点 { anchor, 新 pane }，
 * 新 pane 绑定 binding（draft 或已有 session）并接管焦点。
 * anchor 不在树中 / 叶子数达上限 → no-op（原引用）。
 */
export declare function splitPaneAt(state: PaneLayoutSnapshot, anchorPaneId: string, direction: SplitDirection, binding: PaneBinding): PaneLayoutSnapshot;
/**
 * 在 anchor pane 四周拆分：left/up 把新 pane 放在 anchor 前，right/down 放在后。
 * 拖拽分屏需要保留用户的方位意图；旧 splitPaneAt 继续保持「anchor 在前、新 pane 在后」契约。
 */
export declare function splitPaneAtSide(state: PaneLayoutSnapshot, anchorPaneId: string, side: PaneSplitSide, binding: PaneBinding): PaneLayoutSnapshot;
/**
 * 关闭 pane：叶子移除，父分割节点塌缩为兄弟子树；绑定移除。
 * primary 不可关；pane 不在树中 → no-op。焦点在被关 pane 上时归还 primary。
 * 关 pane ≠ 停 session：只是退订视图，session 在 CLI 里照跑。
 */
export declare function closePane(state: PaneLayoutSnapshot, paneId: string): PaneLayoutSnapshot;
/** draft pane 首发 createSession 后原地绑定 session。pane 无绑定/未变（且无待验证标记）时 no-op。 */
export declare function bindPaneSession(state: PaneLayoutSnapshot, paneId: string, sessionId: string): PaneLayoutSnapshot;
/**
 * 原位替换非 primary pane 的完整 session binding。
 * draft split 后普通 session 点击过去只更新 shell activeTaskId，导致 primary
 * draft 被新 session 覆盖；这里先替换 focused secondary 的 scope + session owner。
 */
export declare function replacePaneBinding(state: PaneLayoutSnapshot, paneId: string, binding: PaneBinding): PaneLayoutSnapshot;
export declare function findPaneIdForSession(state: PaneLayoutSnapshot, scope: PaneWorkspaceScope, sessionId: string): string | null;
/** 拖拽调宽提交：按分割节点 id 定位，clamp 到 [25%, 75%]；未变化返回原引用。 */
export declare function setSplitNodeRatio(state: PaneLayoutSnapshot, splitId: string, ratio: number): PaneLayoutSnapshot;
/** 聚焦 pane：只接受当前树里存在的叶子，其余 no-op（原引用）。 */
export declare function focusPane(state: PaneLayoutSnapshot, paneId: string): PaneLayoutSnapshot;
/** 持久化恢复的 pane 绑定经 sessions-index 验证在场后清除待验证标记。无标记时 no-op。 */
export declare function confirmRestoredPaneSession(state: PaneLayoutSnapshot, paneId: string): PaneLayoutSnapshot;
/**
 * 侧栏/下钻「在分屏打开」：该 session 已在某个 pane（按 workspaceKey + sessionId 判等，
 * 归属/隔离语义）→ 聚焦它；否则拆分当前焦点 pane 向右。达上限且无既有 pane → no-op。
 */
export declare function openSessionInNewPane(state: PaneLayoutSnapshot, scope: PaneWorkspaceScope, sessionId: string): PaneLayoutSnapshot;
//# sourceMappingURL=paneLayoutTree.d.ts.map