import { WORKFLOW_HOLE_SITE_ID_PATTERN, } from "@zcode/shared/zcode-protocol-v4";
export function isHoleSiteId(id) {
    return WORKFLOW_HOLE_SITE_ID_PATTERN.test(id);
}
/** `id` 起、沿父表一路向外的每一层留白（自己在最前）；防环：同一个 id 不走第二次。 */
function holeAncestors(id, parents) {
    const out = [];
    for (let cur = id; cur !== undefined && !out.includes(cur); cur = parents[cur]) {
        if (isHoleSiteId(cur))
            out.push(cur);
    }
    return out;
}
/** `id` 是补全 `holeId` 本身、还是它里面（任意深度）的留白。 */
export function fillContains(holeId, id, parents) {
    return holeAncestors(id, parents).includes(holeId);
}
/**
 * 父表：每个留白自己的阶段与站上的 `fill` 就是包着它的留白（分析器的约定，docs/analysis.md「Sites」）。
 * 阶段优先（补全过的留白只剩阶段），站兜底（开着的留白在 display 上是一个 kind hole 的站）。
 */
export function holeParentsOf(graph, phases) {
    const parents = {};
    for (const step of graph.steps) {
        if (step.kind === "hole" && step.fill !== undefined && step.fill !== step.id)
            parents[step.id] = step.fill;
    }
    for (const phase of phases) {
        if (isHoleSiteId(phase.id) && phase.fill !== undefined && phase.fill !== phase.id)
            parents[phase.id] = phase.fill;
    }
    return parents;
}
/**
 * 把「头已经代表了它」的留白阶段从时间线上拿掉：已补全、自己没有成员、而它的体里另有站的留白。
 * 分析器把这种阶段留在表里（侧栏与 `phaseNames` 靠它念得出接龙每一步的名字，docs/analysis.md
 * 「Sites」），但时间线上它只会是体前面一盏空灯——头已经说了它的名字。拿掉时把进它的边接到出它的
 * 边上（`a → h → b` 成 `a → b`），轨道因此不断；没有体站的补全不拿（它的站带笔标，是唯一的痕迹）。
 */
export function withoutHeadedHolePhases(graph) {
    const phases = graph.phases ?? [];
    const open = new Set((graph.holes ?? []).map((hole) => hole.siteId));
    const withMembers = new Set(graph.steps.flatMap((step) => (step.phase === undefined ? [] : [step.phase])));
    const parents = holeParentsOf(graph, phases);
    const hidden = new Set(phases
        .filter((phase) => isHoleSiteId(phase.id) && !open.has(phase.id) && !withMembers.has(phase.id))
        .filter((hole) => phases.some((phase) => phase.id !== hole.id &&
        phase.fill !== undefined &&
        fillContains(hole.id, phase.fill, parents)))
        .map((phase) => phase.id));
    if (hidden.size === 0)
        return graph;
    // 逐个收缩：每拿掉一个就把经过它的路径接上，连续的几个被拿掉的阶段因此也接得通。
    let edges = [...(graph.phaseEdges ?? [])];
    for (const id of hidden) {
        const into = edges.filter((edge) => edge.to === id && edge.from !== id);
        const out = edges.filter((edge) => edge.from === id && edge.to !== id);
        edges = edges.filter((edge) => edge.from !== id && edge.to !== id);
        for (const a of into)
            for (const b of out)
                edges.push({ from: a.from, to: b.to, ...(b.back === true ? { back: true } : {}) });
    }
    const seen = new Set();
    const phaseEdges = edges.filter((edge) => {
        const key = `${edge.from}>${edge.to}>${edge.back === true ? 1 : 0}`;
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
    return {
        ...graph,
        phaseEdges,
        phases: phases
            .filter((phase) => !hidden.has(phase.id))
            .map((phase) => phase.alongside === undefined
            ? phase
            : { ...phase, alongside: phase.alongside.filter((id) => !hidden.has(id)) }),
    };
}
/**
 * 时间线从哪张图建站：头已代表的留白阶段拿掉（{@link withoutHeadedHolePhases}），父表却从**拿掉
 * 之前**的图算——被拿掉的留白仍是它体里留白的父，嵌套才不断。
 */
export function timelineHoleGraph(full) {
    const graph = withoutHeadedHolePhases(full);
    return { graph, parents: holeParentsOf(full, full.phases ?? []), phases: graph.phases ?? [] };
}
/** 一站属于哪片补全区域（摊进站的字段）：已补全的留白自己的站属于它自己，其余站属于阶段的 `fill`。 */
export function stationFillOf(phase, hole) {
    const fill = hole?.state === "filled" ? phase.id : phase.fill;
    return fill === undefined ? {} : { fill };
}
/**
 * 从 display 与 run 读出留白表。`phases` 是模型建站用的那张阶段表（隐式阶段已合成），下标与站一致。
 */
export function holeTable(graph, phases, run, labels, 
/** 从**收缩之前**的图算出的父表（被拿掉的留白阶段仍然是它体里留白的父）；缺席时就地算。 */
parents = holeParentsOf(graph, phases)) {
    const runHoles = new Map((run?.holes ?? []).map((hole) => [hole.siteId, hole]));
    const index = new Map(phases.map((phase, i) => [phase.id, i]));
    const byPhase = new Map();
    const open = new Set();
    for (const hole of graph.holes ?? []) {
        open.add(hole.siteId);
        const live = runHoles.get(hole.siteId);
        const waiting = live?.state === "waiting";
        byPhase.set(hole.siteId, {
            siteId: hole.siteId,
            state: waiting ? "waiting" : "open",
            ...(hole.tail === true ? { tail: true } : {}),
            ...(waiting && live.since !== undefined ? { since: live.since } : {}),
            ...(waiting && live.prompt !== undefined ? { prompt: live.prompt } : {}),
        });
    }
    // 补全过的留白：run 记过 filled 的、被某个阶段 / 站点的 `fill` 点名的、阶段 id 本身就是留白 id 的。
    const filled = new Set();
    for (const hole of runHoles.values())
        if (hole.state === "filled")
            filled.add(hole.siteId);
    // 被点名的留白连同它的每一层外层：内层补全后外层可能不再被任何阶段直接点名。
    for (const phase of phases) {
        if (phase.fill !== undefined)
            for (const id of holeAncestors(phase.fill, parents))
                filled.add(id);
        if (isHoleSiteId(phase.id))
            filled.add(phase.id);
    }
    for (const step of graph.steps) {
        if (step.fill !== undefined)
            for (const id of holeAncestors(step.fill, parents))
                filled.add(id);
    }
    for (const id of open)
        filled.delete(id);
    const fills = [];
    const last = phases.length - 1;
    for (const holeId of filled) {
        const live = runHoles.get(holeId);
        const label = labels?.get(holeId);
        const own = index.get(holeId);
        // 体：`fill` 是它、或是它里面任一层留白的站——外层的跨度盖住内层的。它自己的站不在体里
        // （它的 `fill` 是外层），紧挨在体之前时下面把它归进头下。
        const body = phases.flatMap((phase, i) => phase.fill !== undefined && fillContains(holeId, phase.fill, parents) ? [i] : []);
        if (own !== undefined) {
            byPhase.set(holeId, {
                siteId: holeId,
                state: "filled",
                // 站在表末的留白就是脚本的尾巴：补全后仍留 40px，头才放得下。
                ...(own === last && body.length === 0 ? { tail: true } : {}),
                ...(live?.filledAt === undefined ? {} : { filledAt: live.filledAt }),
                ...(live?.filledBy === undefined ? {} : { filledBy: live.filledBy }),
            });
        }
        if (body.length === 0)
            continue;
        // 留白自己的阶段紧挨在体之前时也归进头下（体在首个标记之前的语句落在那一站）。
        const from = own !== undefined && own === Math.min(...body) - 1 ? own : Math.min(...body);
        fills.push({
            holeId,
            name: live?.name ?? label?.name ?? holeId,
            from,
            to: Math.max(...body),
            ...(live?.filledAt === undefined ? {} : { filledAt: live.filledAt }),
        });
    }
    // 同起点的外层在前：跨度长的在前，跨度也相同时按嵌套深度（外层浅）。修复原因：id 不再逐层
    // 拼接后，沿父表收集的次序是由内向外的，靠插入次序会把内层的头排到外层前面。
    const depth = (id) => holeAncestors(id, parents).length;
    fills.sort((left, right) => left.from - right.from || right.to - left.to || depth(left.holeId) - depth(right.holeId));
    return { byPhase, fills, parents };
}
/** 尾巴留白：开着 / 等着 → 虚线残段 40px 淡出；无阶段补全后 → 只留 40px 的余地（头要落下）。 */
export function tailStubOf(stations) {
    const hole = stations[stations.length - 1]?.hole;
    if (hole === undefined || hole.tail !== true)
        return undefined;
    return hole.state === "filled" ? "filled" : "open";
}
/** 触到开着 / 等着的留白的轨道段是虚线：那里还不是代码。 */
export function railTouchesHole(stations, rail) {
    const at = (i) => {
        const state = stations[i]?.hole?.state;
        return state === "open" || state === "waiting";
    };
    return at(rail.from) || at(rail.to);
}
/**
 * 补全行的草稿阶段线（docs/dynamic-workflow/presentation.md「The fill row」）：父轨道上补全所在的那一截
 * ——补全的站全墨、两侧各一个邻站 ghost（40%）——其余站不画。弧、带、运行态一律不带：这是一张说
 * 「新的站落在哪两站之间」的静态图。留白不认识时 undefined。
 */
export function narrowTimelineToFill(model, holeId) {
    const fill = model.fills?.find((candidate) => candidate.holeId === holeId);
    let from;
    let to;
    if (fill !== undefined) {
        from = fill.from;
        to = fill.to;
    }
    else {
        const own = model.stations.findIndex((station) => station.hole?.siteId === holeId && station.hole.state === "filled");
        if (own < 0)
            return undefined;
        from = own;
        to = own;
    }
    const start = Math.max(0, from - 1);
    const end = Math.min(model.stations.length - 1, to + 1);
    const stations = model.stations.slice(start, end + 1).map((station, i) => {
        const at = start + i;
        const ghost = at < from || at > to;
        const { typing: _typing, ...rest } = station;
        void _typing;
        return ghost ? { ...rest, ghost: true } : rest;
    });
    const rails = model.rails.flatMap((rail) => rail.kind === undefined && rail.from >= start && rail.to <= end && rail.to === rail.from + 1
        ? [{ ...rail, from: rail.from - start, to: rail.to - start }]
        : []);
    const includesLast = end === model.stations.length - 1;
    return {
        arcs: [],
        bands: [],
        fills: fill === undefined ? [] : [{ ...fill, from: from - start, to: to - start }],
        live: false,
        rails,
        runningIndex: undefined,
        stations,
        ...(includesLast && model.tailStub !== undefined ? { tailStub: model.tailStub } : {}),
    };
}
//# sourceMappingURL=timeline-holes.js.map