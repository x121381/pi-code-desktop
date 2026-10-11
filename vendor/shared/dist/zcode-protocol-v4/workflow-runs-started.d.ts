import { type WorkflowRunState } from "./workflow-runs.js";
/**
 * `run-started` → run 回到 running、用量归零、上一世的结算残影剥净。
 *
 * resume 修复：
 * 同 runId 可能再次 run-started（进程内 cancel → resume）。原样展开会让上一世的
 * 结算残影（error / resultPreview）挂在一个 running 的 run 上——journal 侧的清空
 * 语义（updateRunStatus 非终态清 settlement）在投影侧的对应就是这几行剥除。
 * 停驻中的升级问题同属"上一世的残影"，而且比结算残影更没有活下去的理由：那些问题
 * 挂在上一世的停驻 deferred 上，cancel 时已随 cancelAsk 一起被拒。新的一世里对应的
 * ask 会重跑、actor 重新提问、得一个**新 qid**——留着旧的只会让侧栏摆出一个永远
 * 等不到答案、也再没有人在等它的问题。
 * `resumable` 同属上一世的结算事实：resume 一旦开跑，它就不再可恢复。
 *
 * 用量整体换成零对象，因此**被拒实例的两个计数器（`nodesUnlisted` / `nodesUnlistedSettled`）
 * 也随之清零**——这正是它们需要的语义：重臂会把整段脚本前缀再发一遍（已完成实例的 cached
 * settle、新实例的 queued），不清零等于把两世「没进表的步数」加在一起。见 workflow-runs-caps.ts。
 * 同理由清掉 `unlistedByPhase`（那是上一世的界花在哪里），并且**溢出过的 run 连两张表一起清空**
 * ——规则与理由在 workflow-runs-eviction.ts 的 workflowRunTablesForNewLife。
 *
 * `concurrency` **不**在剥除之列：它不是上一世的残影，而是这个 run 跑在什么并发下的事实
 * （两条界都是），而共享桶那一侧甚至是进程级的现状。规则在 workflow-runs-concurrency.ts。
 * `subagentModel` 同理，而且更硬：它是用户给这次 run 定下的条件，resume 重臂带同一个值。
 */
export declare function reduceRunStarted(run: WorkflowRunState, payload: Record<string, unknown>): WorkflowRunState;
//# sourceMappingURL=workflow-runs-started.d.ts.map