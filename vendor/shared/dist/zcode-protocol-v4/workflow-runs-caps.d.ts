import { type WorkflowRunState, type WorkflowRunUsage } from "./workflow-runs.js";
/** 一条被拒实例的事件对两个计数器的影响。 */
export interface UnlistedInstanceEvent {
    /** 这条实例没能进表（upsert 因触界拒了它），而不是「表里已有、原地更新」。 */
    rejected: boolean;
    /** 本条事件抬过了该 run 的水位。false = 重传/迟到，计数器一个都不动。 */
    advancesWaterMark: boolean;
    eventType: string;
    /** `node-settled` 的 `cached` 标记：缓存命中的结算没有 queued，它自己就是出生事件。 */
    cached: boolean;
}
/**
 * 把一条**被拒**实例的事件记进 usage 的两个计数器。
 *
 * 出生事件有两条（与归约主文件里 phaseName / node-progress 的判定逐字同一条）：`node-queued`，
 * 以及 replay 命中时直接发的 `node-settled { cached: true }`。中间相位一条都不计——它们描述的是
 * 同一个实例在动，不是又多了一个实例。
 *
 * 为什么 `nodesUnlistedSettled` 不需要夹到 `nodesUnlisted` 以下：引擎在**一世之内**对同一实例
 * 最多发一条 `node-queued`（repair / nudge 不重新入队，也没有退避重试），最多发一条
 * `node-settled`（scheduler 的 settled 闩），而缓存命中的结算自带出生。所以「结算数 ≤ 出生数」
 * 是结构性的。真要是哪天不成立了，那是引擎或 `run-started` 清零出了问题——夹一下只会把它藏起来。
 */
export declare function countUnlistedInstance(usage: WorkflowRunUsage, event: UnlistedInstanceEvent): WorkflowRunUsage;
/**
 * 一条**表外**实例回到了节点表（workflow-runs-eviction.ts 的 activation：它被派活了，于是
 * 连人带活重新入座）：`nodesUnlisted` 减一。
 *
 * 夹零而不是让它变负：这个计数器是**加出来**的，没有可去重的身份，而回表的实例理论上总该
 * 先被计过一次（被拒的出生，或被淘汰的那一刻）。夹一下只会少算一条，不夹会在协议线上发出
 * 一个负数，而读面把它直接加进步数总和。归零即整个键缺席（与 {@link countUnlistedInstance}
 * 同规），所以这里要显式摘键而不是写一个 0。
 */
export declare function discountUnlistedInstance(usage: WorkflowRunUsage): WorkflowRunUsage;
/**
 * 整键的条目预算（{@link WORKFLOW_RUNS_LIMITS.maxTotalEntries}）：超了就淘汰**最旧的终态 run**，
 * 直到回到预算内或者没有可淘汰的为止。
 *
 * 三条不动的：在跑的 run（`pending` / `running`）——它正在产生事实，把它的表抽掉等于让面板当场
 * 失明；事件所属的那条 run——刚到的事实必须留得住；以及任何一条 run 的**部分**条目——这个协议
 * 没有条目删除语法，砍一半会让下游的增量对不上（diff 只能整键重发）。
 *
 * 纯且确定：只看 `runs` 的顺序（最旧在前）与各自的 status，所以冷回放逐条重放会淘汰出同一个集合。
 * 预算之内时返回**同一个数组**，让未改动 run 的引用与增量的快路径都留着。
 */
export declare function evictForEntryBudget(runs: WorkflowRunState[], eventRunId: string): WorkflowRunState[];
/**
 * 一条 run 走了多少步、结算了多少步——**表内 + 表外**。
 *
 * 读面（run 卡、时间线摘要、TUI 镜像）必须都走这一个函数：它们此前各自数 `nodes`，于是同一条
 * 撞过界的 run 在三个地方显示三个数字，而且三个都比真实步数小。
 */
export declare function workflowRunStepCounts(run: WorkflowRunState): {
    total: number;
    settled: number;
};
//# sourceMappingURL=workflow-runs-caps.d.ts.map