import { phaseNameMatches } from "../../components/workflow-graph/phase-name.js";
/**
 * 表外那一格按**出生阶段的戳**归位：与药丸绑定、站的观察同一个 `phaseBinder`——一次划分，不是
 * 一次广播。无 `phaseName` 的那一格因此落在无名的站上（与无戳实例同一条规则），而不是凭空
 * 挑一站。同名再入的两站各拿一份，与节点的算法一致。
 */
export function stationUnlisted(run, binder, phaseId) {
    const buckets = run?.unlistedByPhase;
    if (buckets === undefined)
        return undefined;
    const total = { actors: 0, failed: 0, nodesSettled: 0, settled: 0 };
    for (const bucket of buckets) {
        if (!binder.has(phaseId, bucket.phaseName))
            continue;
        total.actors += bucket.actors;
        // 归零的子键在线上缺席：缺席说的是「零个」，不是「不知道」——还没跑完的那些因此留在 pending。
        total.settled += bucket.actorsSettled ?? 0;
        total.failed += bucket.actorsFailed ?? 0;
        total.nodesSettled += bucket.settled;
    }
    return total.actors === 0 && total.settled === 0 && total.nodesSettled === 0 ? undefined : total;
}
/**
 * 一站的进入记录：按名字关联（`phaseNameMatches`，docs/dynamic-workflow/presentation.md
 * 追记 2026-09-05；规则 2026-09-09 抽到 phase-name.ts，与实例绑定共用一条）。同一个 128 字
 * 前缀下可能有两条记录，精确的那条优先。
 */
export function phaseEntryFor(run, name) {
    const entries = run?.phases;
    if (entries === undefined || name === undefined)
        return undefined;
    return (entries.find((entry) => entry.name === name) ??
        entries.find((entry) => phaseNameMatches(name, entry.name)));
}
/**
 * 站点集合：成员 step 的 `source ?? id`——may-set 拷贝报的是站点 id，与 run-status.ts 的
 * 关联键同源；漏掉 `source` 会让拷贝站永远「未到」。
 */
export function siteIdsOf(steps) {
    return new Set(steps.map((step) => step.source ?? step.id));
}
/**
 * 一站观察到的节点：站点相同还不够——同一个站点被 k 个阶段再入时 k 张卡共享站点 id，节点还要
 * 按实例的出生戳落到这一站（`belongs`，追记 2026-09-09「站的观察」），否则 visited / rounds /
 * fraction 一起虚高 k 倍。
 */
export function observePhase(run, siteIds, entry, belongs, unlisted) {
    const result = {
        entered: false,
        observed: 0,
        rounds: 0,
        settled: 0,
        visited: false,
    };
    if (run === undefined)
        return result;
    for (const node of run.nodes) {
        if (!siteIds.has(node.siteId) || !belongs(node))
            continue;
        result.visited = true;
        result.observed += 1;
        if (node.ordinal > result.rounds)
            result.rounds = node.ordinal;
        if (node.phase === "settled")
            result.settled += 1;
    }
    // 表外已结算的**节点**：分子与分母一起抬。它们确实跑过，只是详情停在界上——少算分母会让
    // 「300/300」变成「1/1」，那是一句假话；visited / rounds 不动，那两个说的是控制流。
    result.observed += unlisted?.nodesSettled ?? 0;
    result.settled += unlisted?.nodesSettled ?? 0;
    // 进入记录：到过 = 有节点落在这站 ∨ 控制流进入过；轮次取两者之大（单阶段循环体的第二轮
    // 由节点数出来，零成员站的第二轮只有进入记录知道）。
    if (entry !== undefined) {
        result.entered = true;
        result.visited = true;
        if (entry.rounds > result.rounds)
            result.rounds = entry.rounds;
    }
    return result;
}
//# sourceMappingURL=station-observation.js.map