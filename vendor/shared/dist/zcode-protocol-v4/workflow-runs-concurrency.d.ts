import { type WorkflowRunState } from "./workflow-runs.js";
/**
 * `concurrency-changed` → `run.concurrency`。
 *
 * `ceiling` 是默认并发 D（docs/dynamic-workflow/concurrency.md「Protocol state」）：`run-started` 已把它
 * 记在 `run.concurrencyCeiling` 上时一律取那一个。共享桶的自动增长可以到 2D、被抬高的 run 还能更高，
 * 所以「见过的最大 previous / next」早已不是 D——它只是**老 CLI**（不发 `concurrencyCeiling`）时的
 * 退路：那时桶从天花板起步、只降不升，最大值恰好就是天花板。`cooldownMs` 只在带 Retry-After 的
 * 限流上在场；`idle_reset` 清掉它。`next` 读不动（缺席 / 非正整数）时整条只抬水位：没有 cap 就没有
 * 可显示的东西。
 *
 * `limit` 照搬：它是本 run 自己的界（`run-started` 带来的），与共享桶的涨落无关——治理器压低
 * 或放开一个 provider key，不会改变用户给这次 run 定的上限。
 */
export declare function reduceConcurrencyChanged(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
/**
 * `run-started` → `run.concurrency.limit`：本 run **自己的**那条界
 * （docs/dynamic-workflow/concurrency.md「Two bounds on a run」）。载荷带引擎的
 * `caps.maxConcurrency` 与 CLI 在铸载荷那一刻算出的 `concurrencyCeiling`——默认并发 D（线上键名
 * 早于「默认并发」这个概念，为兼容旧端保留）。D 是进程事实，不是引擎事实，所以它由 CLI 拼进
 * 载荷，与 `resumedFrom` 同一先例。
 *
 * 只在 `maxConcurrency ≠ D` 时记——**高于或低于**都记：D 是起点不是上限，用户可以把一个 run 调得
 * 比默认更并行。跑在默认上的 run 与从前逐字节相同，一个键都不多。老 CLI 不发 `concurrencyCeiling`，
 * 读不出 D 就无从判断这个 run 有没有自己的界——什么都不改。
 *
 * 共享桶那一侧（`cap` / `key` / `cooldownMs`）原样留着：resume 会为同一个 runId 再发一条
 * `run-started`，而那时进程里很可能已经学到了一个被限流压低的 cap，用 D 把它盖掉就是把读数
 * 抬回一个假值。
 */
export declare function reduceRunStartedConcurrency(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
/**
 * `run-caps-changed` → `run.concurrency.limit`：run **在飞时**它自己的那条界被改了
 * （docs/dynamic-workflow/concurrency.md）。只改 `max_concurrency` 的修订就地生效——不停这次 run、
 * 不另起一次——引擎改完 caps 发这条事件，载荷与 `run-started` 同形（引擎的 `caps.maxConcurrency`
 * 加 CLI 拼进来的 `concurrencyCeiling`，即默认并发 D）。所以这里与 `reduceRunStartedConcurrency`
 * 读同两个字段、守同一条「只在 ≠ D 时记」：同一个数经两条路进来不能得出两份读数。
 *
 * D 按「载荷 → 本 run 已知值」取。它是进程事实、整条 run 恒定，`run-started` 已经把它记在
 * `run.concurrencyCeiling` 上了，所以这条事件比 `run-started` 多一层退路；两个都没有才无从判断
 * 这个数是不是默认，什么都不改。`caps` 读不动同理。
 *
 * 调回 D 要把 `limit` **摘掉**而不是写成 D：跑在默认上的 run 按协议没有自己的界。摘完若共享桶
 * 那一侧也无话可说（cap 不低于 D、不在冷却——长到 D 之上的 cap 对一个默认 run 同样无话可说，
 * 读数是 `min(cap, D)`），整个 `concurrency` 键随之缺席——与一个从没调过界的 run 逐字节相同。
 * 本来就没有 `limit` 时一个字不动（幂等的支点）。
 */
export declare function reduceRunCapsChanged(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
/**
 * 摘掉 `concurrency.cooldownMs`（run 终态：不再派发任何东西，冷却没有对象）。没有可摘的就
 * 原样返回——幂等重放的支点，与主归约的 withoutPendingQuestions 同理。cap / ceiling 照留：
 * 它们是这次 run 跑在什么并发下的历史事实。
 */
export declare function withoutCooldown(run: WorkflowRunState): WorkflowRunState;
//# sourceMappingURL=workflow-runs-concurrency.d.ts.map