/**
 * workflow run 详情页的纯逻辑：Cancel 可用性、结果/失败面板判定、事件日志行摘要。
 *
 * 抽成纯函数是因为详情页里唯一有"规则"的部分就是这些，而它们全都能被穷举单测，
 * 不必渲染一张 React Flow 画布。组件只负责把这里的结果贴到 DOM 上。
 */
import { type WorkflowRunStopReason } from "@/components/workflow-graph/run-status-presentation.js";
import type { WorkflowRunActor, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
/**
 * Cancel 只在 `running` 上可用。
 *
 * 取消走的是既有的 v4 `cancelBackgroundWork {workId: runId}`（三个入口一个实现，
 * 没有第二条 cancel RPC），而它对已终结的任务本来就是 noop——按钮在终态禁用是为了
 * 不给出一个点下去毫无反应的控件，不是为了兜底。run 缺席（被 8-run 上限淘汰或冷启动
 * 尚未投影）时同样不可取消：此时我们对它的在飞状态一无所知。
 */
export declare function isWorkflowRunCancellable(run: WorkflowRunState | undefined): boolean;
/**
 * Resume 可用性。**一个信源**：投影 run 的 `resumable` 状态位——由 CLI 在 `run-settled`
 * 载荷上按 resume 门的**同一个谓词**算好（live 与冷回放同一条铸造链），UI 绝不自行按
 * status + failureCode 推导（两处谓词会漂移：按钮亮着但命令被拒）。
 *
 * 投影缺席（被 8-run 上限淘汰）一律不可恢复：宁可少一个按钮，不给出一个点下去必被拒的控件。
 */
export declare function isWorkflowRunResumable(run: WorkflowRunState | undefined): boolean;
type WorkflowRunResultView = 
/** run 不在投影里：不可能有结果可言。 */
{
    kind: "absent";
}
/** pending / running：还没有结果面板。 */
 | {
    kind: "none";
}
/**
 * 完成。`preview` 本阶段**恒缺席**——脚本产物只在 `RunSettlement.artifact` 里，既不在
 * `run-settled` 事件上（它只携 status 与 error），也不在 journal 里。所以完成态只能指向
 * 会话里那条后台结果轮，绝不编造一个结果视图。schema 保留了该字段，真填上时如实展示。
 */
 | {
    kind: "completed";
    preview?: string;
}
/**
 * errored / stopped。`message` 是投影给出的预格式化
 * 原文（schema 里就是一个 string）；`stopReason` 只在 stopped 且投影带该键时在场。
 */
 | {
    kind: "error";
    status: "errored" | "stopped";
    stopReason?: WorkflowRunStopReason;
    message?: string;
};
export declare function workflowRunResultView(run: WorkflowRunState | undefined): WorkflowRunResultView;
/** 事件日志的一条输入（= v4 query 结果里的一项）。 */
export interface WorkflowRunEventItem {
    sequence: number;
    type: string;
    payload: Record<string, unknown>;
    truncated?: boolean;
}
export interface WorkflowRunEventLine {
    sequence: number;
    type: string;
    /** 已本地化的主标签。 */
    label: string;
    /** 身份与数据（站点实例、actor 名、日志正文、错误原文）；不需要本地化。 */
    detail?: string;
    /** 失败/取消着色；其余一律 default（叠加视图的四值词汇表之外不新增视觉词汇）。 */
    tone: "default" | "failed";
    truncated?: boolean;
}
type FormatMessage = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
/**
 * 引擎事件 → 可读一行。
 *
 * 词汇表按**引擎实际发出的**种类写：run-started / actor-created / node-queued /
 * node-dispatched / node-repairing / node-nudged / node-settled / usage-updated / log /
 * import-cache-closed / report / escalation-raised / escalation-resolved / run-settled，以及自适应并发的
 * node-waiting / node-executing / concurrency-changed（default 分支先交给同族模块）。后两个由 driver 在执行 ask
 * 的边界内发出（引擎核心不感知升级），但走的是完全相同的两条轨，所以在这里与其余同族。
 * `payload` 是事件对象去掉 `type` 后的其余字段（run service 的映射契约），
 * 所以这里的读法就是引擎的字段名，不做二次重塑。
 *
 * 每个分支都对形状做防御性读取：载荷已经过有界化，深层字段可能被削掉，
 * 而一条读不动的事件绝不能打挂整个事件日志。
 */
export declare function workflowRunEventLines(events: readonly WorkflowRunEventItem[], formatMessage: FormatMessage): WorkflowRunEventLine[];
/**
 * 一个可打开的 actor 实例。
 *
 * `siteId` + `ordinal` 是身份（journal 的键），`name` 只是展示；`sessionId` 是那条真实持久
 * 会话的 id，也是嵌套只读 SessionPane 唯一需要的东西。
 *
 * `sessionId` **可缺席**（schema-optional）：进度事件可能先于 actor 会话落库到达，老 run
 * 也可能根本没有；还没启动的槽位
 * 更是从来没有。缺席的实例照样开 tab——tab 的身份是 (runId, siteId, ordinal)，会话 id 只是
 * 随行的订阅目标，缺席时 tab 里是「尚未启动」占位。
 */
export interface WorkflowActorInstance {
    siteId: string;
    ordinal: number;
    name?: string;
    sessionId?: string;
    status: WorkflowRunActor["status"];
}
/**
 * 一个 actor transcript tab 相对「会话是否已经存在」的三种处境。
 *
 * `unknown` 不是错误分支，而是**最常见的长期态**：tab 刻意没有 GC，比 8-run 投影淘汰活得久。
 */
type WorkflowActorStartState = "notStarted" | "started" | "unknown";
/** actor transcript tab 交给门的身份：槽位 + 打开时已知的会话 id（可缺席）。 */
export interface WorkflowActorSlotRef {
    runId: string;
    siteId: string;
    ordinal: number;
    actorSessionId?: string;
}
/** 门的裁决：处境 + 该订阅的会话 id（缺席 = 没有可订阅的东西，面板只能占位）。 */
interface WorkflowActorGate {
    state: WorkflowActorStartState;
    sessionId?: string;
}
/**
 * 槽位 → 该 actor 是否已经启动，以及该订阅哪条会话。
 *
 * actor 会话是**懒创建**的：引擎在首个 ask 派发时才 `createActorSession`，所以在那之前
 * 订阅这条会话必然 `fault.subscribe.sessionNotFound`，而投影 store 失败后停在 `error`
 * 只等手动 retry——一个死面板。这个选择器就是那道门。
 *
 * 判定免竞态：`createActorSession` 在首个派发前就 `await` 完了会话落库（`workflow-driver.ts`
 * 的时序由测试钉住），所以**投影里见到 dispatched ⇒ 会话行已存在 ⇒ 订阅必然命中**。
 * 反过来 `queued` 不算启动：持久化顺序的保证挂在派发前，队列里的节点不构成会话存在的证据。
 *
 * 查找按 **(runId, siteId, ordinal)**：tab 可以在 actor 出现之前就开
 * （未启动的药丸），那时没有会话 id 可反查。三值里 `unknown` 与 `notStarted` 的分界仍是要紧
 * 的那条：
 *
 * - actor 不在投影里、tab **有**会话 id → `unknown`，**绝不拦**。run 被 8-run 上限淘汰、
 *   冷恢复后投影为空时，直接订阅是 transcript 唯一的路；拦住它等于把已完结 run 的唯一持久
 *   视图关死。
 * - actor 不在投影里、tab **没有**会话 id → `notStarted`：没有可订阅的东西，占位是诚实的
 *   （脚本还没走到 `agent()`；run 若已被淘汰，这个槽位也确实从未启动过）。
 * - actor 在、一个非 `queued` 节点都没有 → `notStarted`；有 → `started`，订阅目标取投影里的
 *   会话 id，tab 打开时带的作兜底。门读的就是实时投影，首个节点派发即自愈。
 *
 * 缓存命中是另一条开门的路：它直接发 `node-settled`，不经 `ensureSession`，这一世没建会话。
 * 门照样打开，因为投影里 actor 的 `sessionId` 就是**持有转录的那条**（shared 的
 * workflow-runs-actor-session.ts）：普通 resume 的命中指回本 run 早先建好的会话，修订 run 的
 * 导入命中指向前驱里被读取的会话。只有更早的 journal（命中不点名子代理）归属不上，门停在
 * notStarted——那条命中本来也证明不了任何会话。
 */
export declare function workflowActorStartState(runs: readonly WorkflowRunState[] | undefined, slot: WorkflowActorSlotRef): WorkflowActorGate;
export {};
//# sourceMappingURL=workflowRunPanel.d.ts.map