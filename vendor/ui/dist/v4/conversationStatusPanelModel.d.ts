import type { GitRepositorySummary } from "@zcode/shared";
import type { BackgroundWorkSummary, GoalState, PlanState, RunningSubagentSummary, ToolCallRow, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { SessionWorkflowPhaseSummary } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationStatusPanelGitModel {
    branchName: string | null;
    headRefType: GitRepositorySummary["headRefType"];
    dirtyFileCount: number;
    added: number;
    removed: number;
    ahead: number;
    behind: number;
    isClean: boolean;
}
export interface ConversationStatusPanelPlanModel {
    items: PlanState["items"];
    displayItems: PlanState["items"];
    completedCount: number;
    waitingCount: number;
    totalCount: number;
}
export interface ConversationStatusPanelSessionPlanItem {
    rowId: number;
    toolCallId: string;
    markdown: string;
    title?: string;
    planFilePath?: string;
}
export interface ConversationStatusPanelSessionPlansModel {
    items: ConversationStatusPanelSessionPlanItem[];
}
export interface ConversationStatusPanelRunningSubagent extends RunningSubagentSummary {
    controlWorkId?: string;
    cancellable?: boolean;
}
/**
 * Workflows 分区的一行。
 *
 * 字段成三簇，因为三种事实各自可以缺席：`status` / `nodesSettled` / `nodesTotal` 来自
 * `workflowRuns` 投影；`title` / `startedAt` 是后台任务的静态元数据；`workId` /
 * `cancellable` 是 Stop 的前提，只在后台任务仍 running 时出现。**缺席用字段不存在表达，
 * 而不是 0 或空串**——渲染层据此决定这行有没有状态词/步数、有没有时长、能不能停，一个假
 * 的 0/0 会显示成「一步都没跑」。分簇的理由见 `buildRunningWorkflowRuns`。
 */
export interface ConversationStatusPanelWorkflowRun {
    /** 身份与 React key；偏斜降级行用 workId 顶替（两者本就 ≡）。 */
    runId: string;
    /** 缺席即该行不可点（没有可开的详情页 tab），与投影里 run 无 toolCallId 同义。 */
    toolCallId?: string;
    /** 有 run 支撑才有状态词；降级行没有。 */
    status?: "pending" | "running";
    nodesSettled?: number;
    nodesTotal?: number;
    /**
     * 站点表（声明序）与当前站，与侧栏运行行同一条推导（shared 的 `deriveSessionWorkflowPhases`）。
     * 与 `status` 同簇：有 run 支撑才有；降级行没有。空数组 = 脚本没声明阶段。
     */
    phases?: SessionWorkflowPhaseSummary[];
    currentPhase?: string;
    /**
     * 展示名。**`title ≡ workId` 即「未命名」**，渲染层据此换成 i18n 兜底名：core 的
     * `workflowTaskSubject` 兜底链最终落到 taskId（≡ runId ≡ workId），而投影把非空
     * description 原样抄进 title——所以「题名恰好等于 id」是唯一可靠的未命名信号。
     * 模型不做这个替换（i18n 不属于模型层），只保证 title 原样透出。
     */
    title?: string;
    startedAt?: number;
    /** 停止按钮要的控制句柄；只在 work 仍 running 时出现（已结束的 work 没有可取消的东西）。 */
    workId?: string;
    cancellable?: boolean;
}
/**
 * 「打开哪个 run 的详情页」的意图。会话与 workspace 身份由宿主补齐，面板不感知 scope
 * （与工具卡走同一个 handler，不存在第二条打开路径）。
 *
 * 住在模型文件而不是组件里：composer 徽标的直达判定（`resolveSoleRunningWorkflowRunTarget`）
 * 与面板行产出同一形状，组件层从模型取类型，不反向依赖。
 */
export interface ConversationStatusPanelWorkflowRunTarget {
    runId: string;
    toolCallId: string;
    workflowName?: string;
}
/**
 * 面板行 → 打开意图。无 `toolCallId` 即 null（没有可开的详情页 tab）。名字只在真有时带上：
 * `title ≡ runId` 是未命名 run 的兜底样子（core 的 workflowTaskSubject 落到 taskId），把 runId
 * 冻进 tab 标签比通用兜底名更糟。面板行与 composer 徽标直达共用这一处换算。
 */
export declare function workflowRunOpenTarget(run: ConversationStatusPanelWorkflowRun): ConversationStatusPanelWorkflowRunTarget | null;
export interface ConversationStatusPanelModel {
    hasContent: boolean;
    git: ConversationStatusPanelGitModel | null;
    goal: GoalState | null;
    sessionPlans: ConversationStatusPanelSessionPlansModel | null;
    plan: ConversationStatusPanelPlanModel | null;
    runningBashWorks: BackgroundWorkSummary[];
    runningSubagentWorks: ConversationStatusPanelRunningSubagent[];
    runningWorkflowRuns: ConversationStatusPanelWorkflowRun[];
}
export interface BuildConversationStatusPanelModelInput {
    isOfficeMode?: boolean;
    gitSummary?: GitRepositorySummary | null;
    gitDirtyFileCount?: number;
    gitWorktreeChangeSummary?: {
        added: number;
        removed: number;
    } | null;
    goal?: GoalState | null;
    sessionPlans?: readonly ToolCallRow[];
    workspacePath?: string;
    plan?: PlanState | null;
    backgroundWorks?: readonly BackgroundWorkSummary[];
    runningSubagents?: readonly RunningSubagentSummary[];
    workflowRuns?: readonly WorkflowRunState[];
}
/**
 * 一条 run「此刻在做什么」的词（docs/dynamic-workflow/presentation.md「Other places a run appears」），
 * run 行第二行与胶囊共用这一条规则：
 * - pending → 状态词；
 * - 没声明阶段 → 步数（这是步数唯一还露面的地方）；
 * - 不止一站在烧 → 这些站名以 ` ∥ ` 相连（并行时谁都不比谁更当前）；
 * - 否则当前站；连当前站都没有（进了 run、还没进第一个 phase）→ 状态词；
 * - 降级行（无 status）→ null：不知道状态，就什么都不说。
 * 模型只给结构，文案（状态词、步数 key）由渲染层按 i18n 拼。
 */
export type ConversationStatusPanelWorkflowRunWords = {
    kind: "status";
    status: "pending" | "running";
} | {
    kind: "steps";
    done: number;
    total: number;
} | {
    kind: "phases";
    text: string;
};
export declare function workflowRunWords(run: ConversationStatusPanelWorkflowRun): ConversationStatusPanelWorkflowRunWords | null;
/**
 * composer 徽标直达：本会话的运行态**恰好**
 * 是一条可开详情页的 workflow run 时，返回它的打开意图；否则 null，徽标退回展开胶囊。
 *
 * 判定条件逐项都有理由：终端 / 子代理为零——徽标是它们唯一的入口，直达会把它们藏掉；
 * workflow 恰一条——两条以上选哪条是用户的事；带 `toolCallId`——降级行（work 有、run 无）与
 * 旧 CLI 的 run 没有可开的详情页，与面板行「不可点」同义，退回胶囊让 Stop 仍可达。
 * 输入就是 `buildConversationStatusPanelModel` 的产出：徽标与胶囊共用同一份运行态真值。
 */
export declare function resolveSoleRunningWorkflowRunTarget(model: Pick<ConversationStatusPanelModel, "runningBashWorks" | "runningSubagentWorks" | "runningWorkflowRuns">): ConversationStatusPanelWorkflowRunTarget | null;
export declare function buildConversationStatusPanelModel(input: BuildConversationStatusPanelModelInput): ConversationStatusPanelModel;
//# sourceMappingURL=conversationStatusPanelModel.d.ts.map