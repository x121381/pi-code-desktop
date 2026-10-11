import { type BrowserTabResidencyState, type BrowserViewRestoredTabShell } from "@zcode/shared";
import type { PluginUiSidePaneTab } from "@/plugin-ui/contract.js";
import { type CodeViewerSource } from "@/lib/codeViewer.js";
export interface BrowserSidePaneTab {
    id: string;
    type: "browser";
    /** 打开 tab 时冻结的对话归属；null 表示草稿态。 */
    ownerTaskId?: string | null;
    /** 工作区隔离 key（workspaceIdentity || workspacePath）。 */
    workspaceKey?: string | null;
    remoteSessionId?: string | null;
    faviconUrl?: string | null;
    initialUrl?: string | null;
    /** 由 Agent 控制的页面触发的 popup；不应套用人类浏览器的持久化显示偏好。 */
    agentOpened?: boolean;
    openedAt?: number;
    title?: string | null;
    residency?: BrowserTabResidencyState;
    residencyGeneration?: number;
}
export type BrowserSidePaneMetadata = Partial<Pick<BrowserSidePaneTab, "faviconUrl" | "title">>;
export declare const BROWSER_USE_OPERATION_INDICATOR_DURATION_MS = 5000;
export interface BrowserPermissionsSidePaneTab {
    id: string;
    type: "browser-permissions";
    origin: string;
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
}
export interface GitSidePaneTab {
    id: "git";
    type: "git";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
}
export interface CodeViewerSidePaneTab {
    id: string;
    type: "code-viewer";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
    source: CodeViewerSource;
    sourceKey: string | null;
}
export type TreemappingSidePaneSource = {
    kind: "current";
} | {
    kind: "message";
    messageId: string;
    turnIndex?: number;
};
export interface TreemappingSidePaneTab {
    id: "treemapping";
    type: "treemapping";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
    source?: TreemappingSidePaneSource;
}
export interface WhiteboardSidePaneTab {
    id: string;
    type: "whiteboard";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    boardId: string;
    openedAt?: number;
    title: string;
}
export interface ModelTrajectorySidePaneTab {
    id: string;
    type: "model-trajectory";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
    /** 目标 task/session id；model-io 按该 id 匹配。 */
    taskId: string;
    title?: string | null;
}
export interface DeveloperToolsSidePaneTab {
    id: "developer-tools";
    type: "developer-tools";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
}
export interface TerminalSidePaneTab {
    id: string;
    type: "terminal";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    openedAt?: number;
    title: string;
    cwd?: string;
    remoteSessionId?: string | null;
}
/** browser-use 受控浏览器视图（renderer `<webview>` + main CDP）。 */
export interface BrowserUseSidePaneTab {
    id: string;
    type: "browser-use";
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    remoteSessionId?: string | null;
    sessionId: string;
    /** main 分配的 opaque IAB tab identity，也是 webview attach key。 */
    tabId: string;
    browserId?: string;
    browserGeneration?: number;
    openedAt?: number;
    title?: string | null;
    faviconUrl?: string | null;
    residency?: BrowserTabResidencyState;
    residencyGeneration?: number;
    /** 最近一次 agent browser-use 操作的 UI 指示截止时间。 */
    browserUseOperationUntil?: number;
    /** 模型布局命令对应的单调版本；目标 view 据此重建 ResizeObserver 基线。 */
    browserUseResizeBaselineVersion?: number;
}
export interface OpenBackgroundBashSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId: string;
    sessionId: string;
    workId: string;
    title: string;
}
export interface BackgroundBashSidePaneTab extends OpenBackgroundBashSideTabRequest {
    id: string;
    type: "bash-output";
    workspaceKey: string;
    ownerTaskId: string;
    openedAt?: number;
}
export interface SubagentSessionSidePaneTab {
    id: string;
    type: "subagent-session";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId: string;
    parentSessionId: string;
    childSessionId: string;
    subagentType: string;
    title: string;
}
export interface SubagentDirectorySidePaneTab {
    id: string;
    type: "subagent-directory";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId: string;
    parentSessionId: string;
}
export interface SelectionSideChatPaneTab {
    id: string;
    type: "selection-side-chat";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    childSessionId: string;
    ordinal: number;
}
export interface PlanDetailSidePaneTab {
    id: string;
    type: "plan-detail";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    toolCallId: string;
    markdown: string;
    planFilePath?: string;
}
export interface OpenPlanDetailSideTabRequest {
    parentSessionId: string;
    toolCallId: string;
    markdown: string;
    planFilePath?: string;
}
/**
 * workflow run 的详情页 tab。
 *
 * 身份是 **run**（`runId`），不是发起它的工具调用：一次 CreateWorkflow 只启一个 run，
 * 但 run 才是引擎、journal 与 `cancelBackgroundWork {workId}` 三处共用的键
 * （`workId ≡ taskId ≡ runId`）。`toolCallId` 仍要带上——静态因果图在那条工具调用行的
 * display 里，详情页按它在父会话投影里找图。
 *
 * ## 这个 tab 刻意**没有 GC**，别加
 *
 * 看起来很自然的两条回收规则都是错的：
 *
 * - **run 被 `WORKFLOW_RUNS_LIMITS.maxRuns`（8 条）淘汰时不要关它。** 详情页的事件日志读的是
 *   **journal**，不是 `workflowRuns` 投影。被淘汰的 run 丢的只有实时叠加状态，它的事件日志
 *   仍然**完整**——那恰恰是用户会把这个 tab 留着的场景（回看一次已结束的 run 是怎么跑的）。
 *   自动关掉等于亲手销毁一次已完结 run 的唯一持久视图。淘汰只降级成详情页里那块
 *   「已不在实时跟踪范围内」的空态，措辞也必须诚实：丢的是实时状态，run 本身没有消失。
 * - **父会话 edit / retry 时不要关它。** run 身份不会因为对话被改写而失效，最多是那条工具
 *   调用行不在窗口里了——那同样只降级成"没有图可画"，不是"这个 tab 该消失"。
 *
 * 可见性已经按 `parentSessionId` 收窄（同 plan-detail），所以 tab 不会泄漏到别的对话里。
 * `syncSubagentSessionSidePaneTabs` 那套回收只作用于 subagent-session，不要把它扩过来。
 */
export interface WorkflowRunSidePaneTab {
    id: string;
    type: "workflow-run";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    toolCallId: string;
    runId: string;
    /** 打开时冻结的展示名，仅作投影缺席（run 被淘汰 / 冷启动）时的标题兜底。 */
    workflowName?: string;
    /** 落点：展开这一站、列出全部、节头滚到顶。缺席即停在原处。 */
    focusPhaseId?: string;
}
export interface OpenWorkflowRunSideTabRequest {
    parentSessionId: string;
    toolCallId: string;
    runId: string;
    workflowName?: string;
    /** 落点：详情页展开这一站、列出全部、滚到节头。缺席即停在原处。 */
    phaseId?: string;
    /**
     * 「配置」之后面板跟着工作流走：
     * 把显示这个 run 的 tab **原地**换成新 run 的 tab——同一个位置、沿用它的名字与归属。没有这样的
     * tab（已关掉）就什么都不做：面板不会为此重新打开。
     */
    replaceRunId?: string;
}
/**
 * 一条对话的 workflow run 目录 tab。
 *
 * 身份是**对话**（`parentSessionId`）：一条对话只有一份 run 目录，所以页脚行重复点击幂等地
 * 聚焦同一个 tab——与 `subagent-directory` 同构。
 *
 * 这个 tab 不带任何 run 数据：目录页自己按 `parentSessionId` 读一页 journal（run 目录的
 * 单一信源）。把摘要冻进 tab 会让「重启后打开一个恢复出来的 tab」显示
 * 一份过期名单，而它恰恰就是为重启后那一刻存在的。
 */
export interface WorkflowRunDirectorySidePaneTab {
    id: string;
    type: "workflow-directory";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
}
export interface OpenWorkflowRunDirectorySideTabRequest {
    parentSessionId: string;
}
/**
 * 一个 dwf actor 实例的 transcript tab。
 *
 * 身份是 **actor 会话**：一个实例一条真实持久会话，所以 `actorSessionId` 就是 tab 身份。
 * `runId` / `siteId` / `ordinal` 一起带上是为了标题、搜索与排查——它们是 journal 的键，
 * 而会话 id 是 run service 按 `(runId, actorRef)` 铸造出来的，不该被 renderer 反解。
 *
 * ## 为什么是**独立类型**，不是给 `subagent-session` 加一个变体标记
 *
 * `syncSubagentSessionSidePaneTabs` 会删掉 `childSessionId` 不在 `validChildSessionIds`
 * 里的 subagent tab，而 actor 会话**永远不在**那个集合里（它不是子智能体的子会话）。复用
 * 那个类型等于：父会话的 subagent 投影每更新一次，这个 tab 就被回收一次。修法只能是教那套
 * 回收认识变体标记，也就是同样的工作量，只是把不变式藏进了回收逻辑里。
 *
 * 另外两处也会打架：subagent tab 的可见性按 `rootSessionId` 收窄（actor tab 要按
 * `parentSessionId`，同 workflow-run），而 `lastActiveSubagentTabByRootRef` 按
 * `rootSessionId` 记忆 active tab——actor tab 没有、也不该有一个 root 会话。
 *
 * ## GC：同 `workflow-run`，**没有**，别加
 *
 * actor 会话在 run 结束后继续存在（这正是持久化落库换来的durable-audit）。run 被 8-run
 * 上限淘汰、父会话 edit/retry、run 结算——三者都不该关掉一份仍然可读的 transcript。
 * 可见性已按 `parentSessionId` 收窄，所以它也不会泄漏到别的对话里。
 */
export interface WorkflowActorSessionSidePaneTab {
    id: string;
    type: "workflow-actor-session";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    runId: string;
    /**
     * actor 会话 id：嵌套只读 SessionPane 读的那条会话。**可缺席**——从一枚还没启动的药丸开的
     * tab 打开时没有会话；面板按
     * 槽位在实时投影里找它，找到即自愈。身份不在这里，在 (runId, siteId, ordinal)。
     */
    actorSessionId?: string;
    /** actor 站点 id 与序号：与 runId 一起是 tab 的身份，从不参与命名。 */
    siteId: string;
    ordinal: number;
    /** 脚本里写下的名字（`agent("reviewer")`）；分析拿不到字面量时缺席，标题走本地化兜底。 */
    actorName?: string;
}
export interface OpenWorkflowActorSessionSideTabRequest {
    parentSessionId: string;
    runId: string;
    /** 打开时已知的会话 id；未启动的槽位缺席。 */
    actorSessionId?: string;
    siteId: string;
    ordinal: number;
    actorName?: string;
}
export interface OpenScopedWorkflowActorSessionSideTabRequest extends OpenWorkflowActorSessionSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
/**
 * 一个 workflow run 的**脚本 transcript** tab：
 * 脚本里 `files.*` / `git.*` / `world.run` 的每一次调用回放成一张工具卡。
 *
 * 与 actor transcript 同一逻辑层级（都是「run 里某个参与者做过什么」），但工作区没有会话，
 * 所以它是自己的类型而不是 actor tab 的变体：面板不嵌 SessionPane，而是拿两条 journal 查询
 * 自己画卡片。身份是 **(workspace, 父会话, run)**——一个 run 一个 tab，从哪一站点开都是它；
 * `focusPhaseId` 只是落点（滚到那一站的第一张卡），每次打开都重新落。
 *
 * GC：同 `workflow-actor-session`，**没有**——journal 行在 run 结束后继续存在，这份回放正是
 * 为事后审计而存在的。可见性按 `parentSessionId` 收窄。
 */
export interface WorkflowWorkspaceSidePaneTab {
    id: string;
    type: "workflow-workspace";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    /** 发起该 run 的工具调用 id：静态图（阶段名、步标签）挂在那条行上，与 workflow-run tab 同一条路。 */
    toolCallId: string;
    runId: string;
    /** 打开时冻结的展示名，仅作投影缺席时的标题兜底。 */
    workflowName?: string;
    /** 落点：滚到这一站的第一张卡；还没到的站落到末尾。缺席即停在原处。 */
    focusPhaseId?: string;
}
export interface OpenWorkflowWorkspaceSideTabRequest {
    parentSessionId: string;
    toolCallId: string;
    runId: string;
    workflowName?: string;
    phaseId?: string;
}
export interface OpenScopedWorkflowWorkspaceSideTabRequest extends OpenWorkflowWorkspaceSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
/**
 * 一个 dwf **产物**的全尺寸查看 tab。
 *
 * ⚠ 术语：这里的 artifact 是脚本经 `artifact.*` 发布给用户看的产出（一个文件 / 一段 markdown /
 * 一张 journal 投影出来的看板），**不是**引擎内部 `RunSettlement.artifact` 那个「脚本顶层
 * 返回值」。
 *
 * 身份是 **(run, 产物 id)**，不含版本：同一个产物反复发布是同一件东西的新版本，再点一次
 * 应当**聚焦已开的 tab 并翻到最新版**，而不是并排开出 v1 / v2 两个 tab。`version` 因此只是
 * 打开时的初始落点（通知 chip / 中枢 chip 都不带版本号，缺席即最新版），头部的版本步进器
 * 才是真正的版本导航。
 *
 * ## GC：同 `workflow-run`，**没有**，别加
 *
 * 产物的字节在发布时刻就拷进了 store（发布即钉住的约定），所以一个被 8-run 上限
 * 淘汰、甚至整条对话被 edit 重写的 run，它的产物仍然**完整可读**——那正是用户会把这个 tab
 * 留着的场景。可见性已按 `parentSessionId` 收窄，tab 不会泄漏到别的对话里。
 */
export interface WorkflowArtifactSidePaneTab {
    id: string;
    type: "workflow-artifact";
    ownerTaskId?: string | null;
    openedAt?: number;
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    runId: string;
    /** 产物 id（脚本里的编译期字面量，`[A-Za-z0-9_.-]` ≤ 64）。 */
    artifactId: string;
    /** 打开时的初始版本；缺席即最新版。**不进 tab 身份**——见类型上那段注释。 */
    version?: number;
    /** 打开时冻结的展示名，仅作元数据缺席（冷恢复 / 老 CLI）时的标题兜底。 */
    title?: string;
}
export interface OpenWorkflowArtifactSideTabRequest {
    parentSessionId: string;
    runId: string;
    artifactId: string;
    version?: number;
    title?: string;
    /**
     * 最新版的 contentType（表面上的摘要带得到就带）。`useAppPanels.handleOpenWorkflowArtifact`
     * 据它决定 html 产物是直接开浏览器 tab 还是开产物 tab；缺席即一律开产物 tab。
     */
    contentType?: string;
    /**
     * 工作区相对的原路径。只有已经合并过 journal 的表面（run 侧板）带得到；缺席时由
     * `handleOpenWorkflowArtifact` 自己查 journal 补齐——摘要刻意不带它（状态帧体积）。
     */
    sourcePath?: string;
}
export interface OpenScopedWorkflowArtifactSideTabRequest extends OpenWorkflowArtifactSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export interface OpenScopedWorkflowRunSideTabRequest extends OpenWorkflowRunSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export interface OpenScopedWorkflowRunDirectorySideTabRequest extends OpenWorkflowRunDirectorySideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export interface OpenScopedPlanDetailSideTabRequest extends OpenPlanDetailSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export interface OpenSelectionSideChatRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    parentSessionId: string;
    childSessionId: string;
    /** active child 已确定不存在时，由宿主原子替换对应旧 tab。 */
    replacesChildSessionId?: string;
}
export interface OpenSubagentSideTabRequest {
    rootSessionId?: string;
    parentSessionId: string;
    childSessionId: string;
    subagentType: string;
    title: string;
}
export interface OpenSubagentDirectorySideTabRequest {
    rootSessionId?: string;
    parentSessionId: string;
}
export interface OpenScopedSubagentDirectorySideTabRequest extends OpenSubagentDirectorySideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export interface SyncSubagentSessionTabsRequest {
    rootSessionId: string;
    parentSessionId: string;
    validChildSessionIds: readonly string[];
}
export interface OpenScopedSubagentSideTabRequest extends OpenSubagentSideTabRequest {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export type WorkspaceSidePaneTab = BackgroundBashSidePaneTab | BrowserSidePaneTab | BrowserPermissionsSidePaneTab | GitSidePaneTab | CodeViewerSidePaneTab | TreemappingSidePaneTab | WhiteboardSidePaneTab | ModelTrajectorySidePaneTab | DeveloperToolsSidePaneTab | TerminalSidePaneTab | BrowserUseSidePaneTab | SubagentSessionSidePaneTab | SubagentDirectorySidePaneTab | SelectionSideChatPaneTab | PlanDetailSidePaneTab | PluginUiSidePaneTab | WorkflowRunSidePaneTab | WorkflowRunDirectorySidePaneTab | WorkflowActorSessionSidePaneTab | WorkflowWorkspaceSidePaneTab | WorkflowArtifactSidePaneTab;
/**
 * Browser/browser-use 的页面与 CDP 生命周期依赖 `<webview>` 持续连接 DOM。
 * 面板折叠或切到其它对话时仍必须后台挂载，只有显式关闭 tab 才能销毁页面状态。
 */
export declare function shouldMountSidePaneContent(isVisible: boolean, tabs: readonly WorkspaceSidePaneTab[]): boolean;
export declare function shouldMountBrowserTabGuest(tab: BrowserSidePaneTab | BrowserUseSidePaneTab): boolean;
export interface WorkspaceSidePaneState {
    tabs: WorkspaceSidePaneTab[];
    activeTabId: string;
}
export declare function normalizeWorkspaceSidePaneState(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState | null;
export declare function encodeSidePaneTabIdPart(value: string): string;
export declare function createSubagentSessionSidePaneTab(options: {
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId?: string;
    parentSessionId: string;
    childSessionId: string;
    subagentType: string;
    title: string;
}): SubagentSessionSidePaneTab;
export declare function createSubagentDirectorySidePaneTab(options: {
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId?: string;
    parentSessionId: string;
}): SubagentDirectorySidePaneTab;
export declare function createSelectionSideChatPaneTab(options: OpenSelectionSideChatRequest & {
    workspaceKey: string;
    ordinal: number;
}): SelectionSideChatPaneTab;
export declare function createPlanDetailSidePaneTab(options: OpenScopedPlanDetailSideTabRequest & {
    workspaceKey: string;
}): PlanDetailSidePaneTab;
export declare function activateSidePaneTab(current: WorkspaceSidePaneState | null, tab: WorkspaceSidePaneTab): WorkspaceSidePaneState;
export declare function getActiveSidePaneTab(current: WorkspaceSidePaneState | null): WorkspaceSidePaneTab | null;
/** 把草稿态的 null/undefined 归一，供侧栏按对话隔离。 */
export declare function sidePaneOwnerKey(taskId: string | null | undefined): string;
export declare function isWorkspaceGlobalSidePaneTab(tab: WorkspaceSidePaneTab): boolean;
export interface SidePaneVisibilityScope {
    workspaceKey: string | null;
    ownerTaskId: string | null;
}
/**
 * 新建 tab 在提交到共享侧栏状态时统一冻结工作区与对话归属。
 * browser-use 自带事件来源归属，因此已打标的 tab 绝不能被当前 UI scope 覆盖。
 */
export declare function stampSidePaneTabsOwnership(state: WorkspaceSidePaneState | null, ownership: {
    ownerTaskId: string | null;
    workspaceKey: string | null;
    remoteSessionId?: string | null;
}): WorkspaceSidePaneState | null;
export declare function resolveActiveTabForOwner(state: WorkspaceSidePaneState | null, scope: SidePaneVisibilityScope, preferredTabId?: string | null): string | null;
/**
 * 对话 scope 切换时同时解析 active tab 与折叠态。
 *
 * 目标对话没有 preferredTabId 时不能沿用上一个对话的 collapsed 状态，也不能简单地
 * 用“有可见 tab 就展开”覆盖状态。否则用户在 A 主动收起后切到 B 再切回 A，仍会被 A 的可见 tab
 * 自动展开。现在由调用方传入当前对话的主动偏好；没有偏好时才沿用默认的“有 tab 展开、无 tab 收起”。
 */
export declare function resolveSidePaneScopeState(state: WorkspaceSidePaneState | null, scope: SidePaneVisibilityScope, preferredTabId?: string | null, collapsedPreference?: boolean): {
    sidePaneState: WorkspaceSidePaneState | null;
    isSidePaneCollapsed: boolean;
};
export declare function restoreSidePaneTab(current: WorkspaceSidePaneState | null, tab: WorkspaceSidePaneTab): WorkspaceSidePaneState;
export declare function activateBrowserSidePane(current: WorkspaceSidePaneState | null, options?: {
    tabId?: string;
    initialUrl?: string | null;
    forceNew?: boolean;
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    remoteSessionId?: string | null;
    agentOpened?: boolean;
}): WorkspaceSidePaneState;
/** 打开/复用站点权限设置标签：同站点 + 同工作区 + 同对话只保留一个标签。 */
export declare function openBrowserPermissionsSidePane(current: WorkspaceSidePaneState | null, options: Pick<BrowserPermissionsSidePaneTab, "origin" | "ownerTaskId" | "workspaceKey">): WorkspaceSidePaneState;
export declare function openBrowserSidePane(current: WorkspaceSidePaneState | null, options?: {
    tabId?: string;
    initialUrl?: string | null;
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    remoteSessionId?: string | null;
    activate?: boolean;
    agentOpened?: boolean;
}): WorkspaceSidePaneState;
/**
 * 同一 workspace/owner 下认领同一个 URL 的 browser tab。
 *
 * 调用方（`useAppPanels`）需要**先**知道落点 tab 的 id 才能对它发导航请求，所以查找与打开
 * 拆成两步：这里定位，`openOrActivateBrowserSidePaneByUrl` 用同一个判据落点。两处共用它，
 * 不会出现「查的是 A、开的是 B」。
 */
export declare function findBrowserSidePaneTabByUrl(current: WorkspaceSidePaneState | null, options: {
    initialUrl: string;
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
}): BrowserSidePaneTab | undefined;
/**
 * URL 键复用：同一 workspace/session 的同一个 URL 只激活已有 tab。
 *
 * 两个用户：share handover 的分享链接，与 html 产物的直开。两者是同一句话——「带我去这个
 * 地址」，而不是「再开一个浏览器」。复用时**不**改 tab 的任何字段（`initialUrl` 就是键），
 * 要让 webview 重新取字节由调用方另发一次导航请求。
 */
export declare function openOrActivateBrowserSidePaneByUrl(current: WorkspaceSidePaneState | null, options: {
    initialUrl: string;
    /** 新建时用的 tab id；缺席即现生成。命中已有 tab 时忽略。 */
    tabId?: string;
    ownerTaskId?: string | null;
    workspaceKey?: string | null;
    remoteSessionId?: string | null;
}): WorkspaceSidePaneState;
/** 打开或更新一个受控 browser-use tab；ready 重放按 tabId 幂等。 */
export declare function openBrowserUseSidePane(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    sessionId: string;
    tabId: string;
    browserId?: string;
    browserGeneration?: number;
    remoteSessionId?: string;
    title?: string;
    activate?: boolean;
}): WorkspaceSidePaneState;
export interface BrowserUseSidePaneScope {
    workspaceKey: string;
    remoteSessionId?: string;
    ownerTaskId: string | null;
}
/** ready/show 事件只允许激活其 origin workspace + session，后台事件仅挂载 guest。 */
export declare function applyBrowserUseSidePaneEvent(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    remoteSessionId?: string;
    sessionId: string;
    tabId: string;
    browserId?: string;
    browserGeneration?: number;
}, activeScope: BrowserUseSidePaneScope): {
    state: WorkspaceSidePaneState;
    shouldReveal: boolean;
};
/** visibility 只选择 ready 已创建的 shell；迟到事件不得重建已关闭 tab。 */
export declare function applyBrowserUseSidePaneVisibilityEvent(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    remoteSessionId?: string;
    sessionId: string;
    tabId: string;
    browserId?: string;
    browserGeneration?: number;
}, activeScope: BrowserUseSidePaneScope): {
    state: WorkspaceSidePaneState | null;
    shouldReveal: boolean;
    didMatch: boolean;
};
export declare function applyBrowserTabResidencyEvent(current: WorkspaceSidePaneState | null, event: {
    tabId: string;
    workspaceKey?: string;
    remoteSessionId?: string;
    sessionId?: string;
    browserId?: string;
    browserGeneration?: number;
    generation: number;
    residency: Extract<BrowserTabResidencyState, "live-visible" | "live-background" | "suspended" | "restoring">;
}): WorkspaceSidePaneState | null;
export declare function restoreBrowserTabShells(current: WorkspaceSidePaneState | null, shells: readonly BrowserViewRestoredTabShell[], scope?: {
    workspaceKey: string;
    remoteSessionId?: string;
    sessionId: string;
}): WorkspaceSidePaneState;
export declare function openCodeViewerSidePane(current: WorkspaceSidePaneState | null, source: CodeViewerSource, ownerTaskId?: string | null): WorkspaceSidePaneState;
/**
 * 一次性打开一组代码预览 Tab。
 *
 * 自动打开生成产物时不能逐张调用 openCodeViewerSidePane：逐张提交会让右侧
 * 面板经历多次中间状态，并且最后一张会意外成为 active。这里复用单文件
 * 的 sourceKey/owner 规则批量收口，最后按调用方指定的顺序激活一张 Tab。
 */
export declare function openCodeViewerSidePanes(current: WorkspaceSidePaneState | null, sources: readonly CodeViewerSource[], ownerTaskId?: string | null, activeIndex?: number): WorkspaceSidePaneState;
export declare function activateGitSidePane(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState;
export declare function activateTreemappingSidePane(current: WorkspaceSidePaneState | null, source?: TreemappingSidePaneSource): WorkspaceSidePaneState;
export declare function openWhiteboardSidePane(current: WorkspaceSidePaneState | null, options: {
    boardId: string;
    title: string;
}): WorkspaceSidePaneState;
export declare function openModelTrajectorySidePane(current: WorkspaceSidePaneState | null, options: {
    taskId: string;
    title?: string | null;
}): WorkspaceSidePaneState;
export declare function activateDeveloperToolsSidePane(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState;
export declare function openTerminalSidePane(current: WorkspaceSidePaneState | null, options: {
    title: string;
    cwd?: string;
    remoteSessionId?: string | null;
}): WorkspaceSidePaneState;
export declare function openSubagentSessionSidePane(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId?: string;
    parentSessionId: string;
    childSessionId: string;
    subagentType: string;
    title: string;
}): WorkspaceSidePaneState;
export declare function openSubagentDirectorySidePane(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    rootSessionId?: string;
    parentSessionId: string;
}): WorkspaceSidePaneState;
export declare function syncSubagentSessionSidePaneTabs(current: WorkspaceSidePaneState | null, options: SyncSubagentSessionTabsRequest): WorkspaceSidePaneState | null;
export declare function openSelectionSideChatPane(current: WorkspaceSidePaneState | null, options: OpenSelectionSideChatRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
export declare function getActiveSelectionSideChatTab(current: WorkspaceSidePaneState | null, scope: {
    workspaceKey: string;
    parentSessionId: string;
}): SelectionSideChatPaneTab | null;
export declare function openPlanDetailSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedPlanDetailSideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
/**
 * 打开或复用一个 workflow run 详情 tab。
 *
 * 复用规则与 plan-detail 同构（结构化 id 幂等），刻意也**同样没有 GC**：事件日志读的是
 * journal，而 `workflowRuns` 投影只留最近 8 个 run，所以一个被淘汰的 run 仍有完整可读的
 * 事件日志——那正是用户会把这个 tab 留着的场景。投影缺席退化成详情页的空态，不关 tab。
 */
export declare function openWorkflowRunSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowRunSideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
/**
 * 「配置」被接受后的原地替换：旧 run 的 tab 换成新 run 的 tab，位置、名字、归属照旧；它原来是活动
 * tab 才让新 tab 成为活动 tab。新 run 的 tab 已经开着时，关掉旧的、聚焦已有的那一个（不出两个）。
 * 旧 tab 不在（用户已关掉）即原样返回——替换不是打开；结果里的 run 就是被替换的那一个（就地生效的
 * 修订没有后继）时同理，这个 tab 已经是它了。
 */
export declare function replaceWorkflowRunSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowRunSideTabRequest & {
    workspaceKey: string;
    replaceRunId: string;
}): WorkspaceSidePaneState | null;
/**
 * 打开或复用一条对话的 run 目录 tab。身份是对话，所以页脚行重复点击只是聚焦。
 *
 * GC 同样**没有**（与 workflow-run 同一条理由链）：目录页每次挂载自己重读一页 journal，
 * 所以一个被恢复出来的旧 tab 不会显示过期名单，也就没有该回收的东西。
 */
export declare function openWorkflowRunDirectorySidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowRunDirectorySideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
/**
 * 打开或复用一个 actor transcript tab。
 *
 * 复用规则与 workflow-run 同构（结构化 id 幂等），GC 同样**没有**：actor 会话在 run 结束
 * 之后继续可读，那正是把它落成真实持久会话换来的东西。见类型上那段注释。
 *
 * 合并时新请求里缺席的键不覆盖旧值：先从未启动的药丸开（无会话 id）、后从已启动的药丸再开
 * （带会话 id）补上会话；反过来再开一次不带会话的请求也不会把已知的会话 id 抹掉。
 */
export declare function openWorkflowActorSessionSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowActorSessionSideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
/**
 * 打开或复用一个 run 的脚本 transcript tab。
 *
 * 落点**每次都重算**：再点一枚脚本药丸的意思是「带我去那一站」，所以请求带 phaseId 就落到
 * 它，不带就不落（显式删键，同 `openWorkflowArtifactSidePane` 对 version 的处理）。`openedAt`
 * 随每次打开刷新，面板据此在同一站上再点一次也重新滚动。
 */
export declare function openWorkflowWorkspaceSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowWorkspaceSideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
/**
 * 打开或复用一个产物的全尺寸 tab。
 *
 * 复用时**不把旧 tab 的 version 保留下来**：再次点击一枚 chip 的意思是「让我看这个产物」，
 * 而 chip 从不带版本号，所以合并结果里 `version` 缺席即回到最新版。反过来，若请求显式带了
 * 版本（例如将来某处要跳到某一版），那一版才是落点。
 */
export declare function openWorkflowArtifactSidePane(current: WorkspaceSidePaneState | null, options: OpenScopedWorkflowArtifactSideTabRequest & {
    workspaceKey: string;
}): WorkspaceSidePaneState;
export declare function isSidePaneTabVisibleForParent(tab: WorkspaceSidePaneTab, parentSessionId: string | null): boolean;
export declare function getVisibleSidePaneTabs(tabs: WorkspaceSidePaneTab[], scope: SidePaneVisibilityScope): WorkspaceSidePaneTab[];
export declare function getVisibleSidePaneTabs(current: WorkspaceSidePaneState | null, parentSessionId: string | null): WorkspaceSidePaneTab[];
export declare function selectSidePaneTabsForParent(current: WorkspaceSidePaneState | null, parentSessionId: string | null, preferredTabId?: string | null): WorkspaceSidePaneState | null;
export declare function closeVisibleOtherSidePaneTabs(current: WorkspaceSidePaneState | null, tabId: string, parentSessionId: string | null): WorkspaceSidePaneState | null;
export declare function closeVisibleSidePaneTabs(current: WorkspaceSidePaneState | null, parentSessionId: string | null): WorkspaceSidePaneState | null;
export declare function closeSidePaneTabForParent(current: WorkspaceSidePaneState | null, tabId: string, parentSessionId: string | null, preferredTabId?: string | null): WorkspaceSidePaneState | null;
export declare function closeSidePaneTab(current: WorkspaceSidePaneState | null, tabId: string): WorkspaceSidePaneState | null;
export declare function closeOtherSidePaneTabs(current: WorkspaceSidePaneState | null, tabId: string): WorkspaceSidePaneState | null;
export declare function closeAllSidePaneTabs(): WorkspaceSidePaneState | null;
export declare function setActiveSidePaneTab(current: WorkspaceSidePaneState | null, tabId: string): WorkspaceSidePaneState | null;
export declare function updateBrowserSidePaneTab(current: WorkspaceSidePaneState | null, tabId: string, patch: BrowserSidePaneMetadata): WorkspaceSidePaneState | null;
/** 按 workspace/session/browser generation/tab 完整匹配运行态，避免 stale run 串写。 */
export declare function markBrowserUseSidePaneTabOperation(current: WorkspaceSidePaneState | null, options: {
    workspaceKey: string;
    sessionId: string;
    browserId: string;
    browserGeneration: number;
    tabId: string;
    operationUntil: number;
    resetsResizeBaseline?: boolean;
}): WorkspaceSidePaneState | null;
export declare function reorderSidePaneTab(current: WorkspaceSidePaneState | null, activeTabId: string, overTabId: string): WorkspaceSidePaneState | null;
export declare function toggleBrowserSidePane(current: WorkspaceSidePaneState | null, ownerTaskId?: string | null, remoteSessionId?: string | null): WorkspaceSidePaneState | null;
export declare function toggleGitSidePane(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState | null;
export declare function closeCodeViewerSidePane(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState | null;
export declare function closeGitSidePane(current: WorkspaceSidePaneState | null): WorkspaceSidePaneState | null;
export declare function openBackgroundBashSidePane(current: WorkspaceSidePaneState | null, target: OpenBackgroundBashSideTabRequest): WorkspaceSidePaneState;
//# sourceMappingURL=workspaceSidePane.d.ts.map