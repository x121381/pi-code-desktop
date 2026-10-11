/**
 * dwf run 详情页的自适应并发观察面（docs/dynamic-workflow/concurrency.md「Protocol and UI」）：
 * run 头的并发/冷却读数，以及事件日志里 `node-waiting` / `node-executing` / `concurrency-changed` /
 * `run-caps-changed` 四条事件的行。子代理徽标**不在**这里：它只有三态一个词（决策 39），直接由协议
 * actor 状态渲染。
 *
 * 展示规则与 workflowRunPanel.ts 共用事件类型，另在本地记录状态的**首次收到时刻**。
 * 协议只带相对量（`cooldownMs`——引擎无时钟），deadline 只能由 UI 按
 * "第一次见到这份状态的时刻"推。登记按对象身份（WeakMap）：归约对未变的 `concurrency` 保留同一对象
 * 引用，一被新事件替换就是新对象、重新登记。不放进协议，是因为它是本地观察，不是引擎事实。
 */
import type { WorkflowRunConcurrency, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { WorkflowRunEventItem, WorkflowRunEventLine } from "./workflowRunPanel.js";
type FormatMessage = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
export declare function throttleReasonLabel(reason: string, formatMessage: FormatMessage): string;
interface WorkflowRunConcurrencyView {
    /**
     * 芯片上那个数：生效的**界** `min(cap, limit ?? D)`（docs/dynamic-workflow/concurrency.md
     * 「Two bounds on a run」）——共享桶的 cap 与本 run 自己的界取小。它是上限，不是此刻在飞
     * 的个数（所以芯片的字是「最大并发数」）；两条界里哪一条在起作用不是读数要回答的问题。
     */
    cap: number;
    ceiling: number;
    /** 冷却 deadline（epoch ms）；无冷却或已过期时缺席。 */
    cooldownUntil?: number;
}
/**
 * run 头的并发读数（docs/dynamic-workflow/concurrency.md「What the user sees」）。`ceiling` 是默认
 * 并发 D，是参照线不是上限：本 run 的界 `bound = limit ?? D`，读数 `min(cap, bound)`。在场条件二选一：
 * 共享桶把 run 压在自己的界之下（`effective < bound`），或 run 有自己的界（`bound ≠ D`，高于低于
 * 都算——调到默认之上的 run 也要让人看见它的界）。跑在默认上、共享 cap 不低于 D 的 run
 * 没有可说的——共享 cap 自动长到 D 之上也一样，读数取小之后还是 D。
 * 冷却按收到时刻 + `cooldownMs` 推 deadline，过期即缺席——UI 不显示一个已经过去的时间。
 */
export declare function workflowRunConcurrencyView(concurrency: WorkflowRunConcurrency | undefined, now: number): WorkflowRunConcurrencyView | undefined;
/**
 * run 头的并发芯片：读数在场，**且** run 能配置（docs/dynamic-workflow/concurrency.md「What the
 * user sees」）。芯片说的是一条界，改这条界的控件是 Configure，所以两者同进同退。
 *
 * 修复原因：旧芯片只看读数，完成的 run 上 `cap` / `limit` 在归约里原样留着（终态只摘冷却），
 * 于是一个什么都不在跑的 run 永远挂着「并发数 4」，读起来像实时读数。完成的 run 没有东西还在这条界下
 * 跑，被替代的 run 的界归后继管；stopped / errored 留着，因为恢复或重试仍在这条界下跑。
 */
export declare function workflowRunConcurrencyChip(run: WorkflowRunState | undefined, now: number): WorkflowRunConcurrencyView | undefined;
/**
 * 四条并发事件（node-waiting / node-executing / concurrency-changed / run-caps-changed）→ 事件日志行；
 * 其余种类返回 undefined（交回主表的 default 兜底）。与 workflowRunEventLines 的其余分支同一条纪律：
 * 载荷防御性读取，一条读不动的事件绝不打挂整页。全部 tone default：等待不是失败，cap 变化也不是——
 * 前三条是运行时在自我调节，最后一条是用户在调它。
 */
export declare function workflowRunConcurrencyEventLine(event: WorkflowRunEventItem, formatMessage: FormatMessage): WorkflowRunEventLine | undefined;
export {};
//# sourceMappingURL=workflowRunThrottle.d.ts.map