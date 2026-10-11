import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { PhaseBinder } from "@/components/workflow-graph/instance-phases.js";
import type { WorkflowCausalityGraphData } from "@/components/workflow-graph/types.js";
/**
 * 一站观察到的东西（docs/dynamic-workflow/presentation.md「The timeline model」「Past six
 * participants」）：落在这一站站点上的实例，加上界在这一站花掉的**表外**条目。
 *
 * 住在时间线模型之外，与 timeline-bands.ts 同一个理由（主文件的 max-lines 门），也同一条纪律：
 * 纯函数、无 React、无 DOM、无时间。
 */
export interface ObservedPhase {
    visited: boolean;
    rounds: number;
    settled: number;
    observed: number;
    /** 控制流进入过这一站（`run.phases` 里有它的进入记录）。 */
    entered: boolean;
}
/**
 * 归约列不出来的那些（`run.unlistedByPhase`，presentation.md「Reduction」）。`actors` 是这一站
 * 出生、此刻不在表里的子代理——出生就被拒的、排队时被淘汰的、跑完被淘汰的都算，它们没有药丸、
 * 没有脸、没有转录；`settled` 是其中已知跑完的，`failed ⊆ settled`；`nodesSettled` 是记在这一格
 * 上的表外已结算**节点**数。缺席 = 这一站一条都没少。
 */
export interface StationUnlisted {
    actors: number;
    settled: number;
    failed: number;
    nodesSettled: number;
}
/**
 * 表外那一格按**出生阶段的戳**归位：与药丸绑定、站的观察同一个 `phaseBinder`——一次划分，不是
 * 一次广播。无 `phaseName` 的那一格因此落在无名的站上（与无戳实例同一条规则），而不是凭空
 * 挑一站。同名再入的两站各拿一份，与节点的算法一致。
 */
export declare function stationUnlisted(run: WorkflowRunState | undefined, binder: PhaseBinder, phaseId: string): StationUnlisted | undefined;
type WorkflowRunPhaseEntry = NonNullable<WorkflowRunState["phases"]>[number];
/**
 * 一站的进入记录：按名字关联（`phaseNameMatches`，docs/dynamic-workflow/presentation.md
 * 追记 2026-09-05；规则 2026-09-09 抽到 phase-name.ts，与实例绑定共用一条）。同一个 128 字
 * 前缀下可能有两条记录，精确的那条优先。
 */
export declare function phaseEntryFor(run: WorkflowRunState | undefined, name: string | undefined): WorkflowRunPhaseEntry | undefined;
/**
 * 站点集合：成员 step 的 `source ?? id`——may-set 拷贝报的是站点 id，与 run-status.ts 的
 * 关联键同源；漏掉 `source` 会让拷贝站永远「未到」。
 */
export declare function siteIdsOf(steps: readonly WorkflowCausalityGraphData["steps"][number][]): Set<string>;
/**
 * 一站观察到的节点：站点相同还不够——同一个站点被 k 个阶段再入时 k 张卡共享站点 id，节点还要
 * 按实例的出生戳落到这一站（`belongs`，追记 2026-09-09「站的观察」），否则 visited / rounds /
 * fraction 一起虚高 k 倍。
 */
export declare function observePhase(run: WorkflowRunState | undefined, siteIds: ReadonlySet<string>, entry: WorkflowRunPhaseEntry | undefined, belongs: (node: WorkflowRunState["nodes"][number]) => boolean, unlisted: StationUnlisted | undefined): ObservedPhase;
export {};
//# sourceMappingURL=station-observation.d.ts.map