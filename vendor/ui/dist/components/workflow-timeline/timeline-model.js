import { laneRefsById } from "../../components/workflow-graph/lane-name.js";
import { collapseStatuses, liveParticipantView, participantStatus, participantsOfPhase, withImplicitPhase, } from "../../components/workflow-graph/participant-model.js";
import { phaseBinder } from "../../components/workflow-graph/instance-phases.js";
import { phaseMembers } from "../../components/workflow-graph/phase-model.js";
import { workflowRunOverlay } from "../../components/workflow-graph/run-status.js";
import { laneClassOf, } from "../../components/workflow-graph/types.js";
import { sharedTimelineModel } from "./timeline-cache.js";
import { isCurrentPhase, phaseStreamIndexes, stageStatuses, stationStatus, streamInk, } from "./stage-lamps.js";
import { holeTable, railTouchesHole, stationFillOf, tailStubOf, timelineHoleGraph, } from "./timeline-holes.js";
import { observePhase, phaseEntryFor, siteIdsOf, stationUnlisted, } from "./station-observation.js";
import { assignAirLanes, bandOf, foldPhaseBands, foldPhaseEdges, trackOf, } from "./timeline-bands.js";
// 弧的分道是纯下标的组合学，与带的折叠同住 timeline-bands.ts；这里转出去，渲染层的入口不变。
export { arcLaneCount, assignArcLanes } from "./timeline-bands.js";
/**
 * 一个模型，三处消费（不变式 1）：卡、详情页与侧栏清单在同一帧里拿到**同一个**模型对象，
 * 按 (graph, run) 的对象身份记忆——为什么身份是正确的键见 `timeline-cache.ts`。模型是只读的，
 * 没有消费者改它，所以共享顺带也是引用稳定性的来源。
 */
export function buildWorkflowTimeline(input, run, 
/**
 * 补全过的留白的名与类型（docs/dynamic-workflow/presentation.md「Holes on the timeline」）：没有 run 的
 * 静态图（确认窗、补全行）从工具入参递进来。给了它就不走共享缓存——那张表是按 (graph, run) 键的。
 */
holeLabels) {
    if (holeLabels !== undefined)
        return computeWorkflowTimeline(input, run, holeLabels);
    return sharedTimelineModel(input, run, () => computeWorkflowTimeline(input, run, undefined));
}
function computeWorkflowTimeline(input, run, holeLabels) {
    // 头已代表的留白阶段不成站；父表从收缩之前的图算，嵌套才不断（timeline-holes.ts）。
    const { graph, parents, phases } = timelineHoleGraph(withImplicitPhase(input));
    const index = new Map(phases.map((phase, i) => [phase.id, i]));
    const members = phaseMembers(graph);
    const holes = holeTable(graph, phases, run, holeLabels, parents);
    const overlay = workflowRunOverlay(run, graph);
    const live = liveParticipantView(graph, run);
    const binder = phaseBinder(graph, run);
    const laneRefs = laneRefsById(graph.lanes);
    const sessionByInstance = new Map((run?.actors ?? []).map((actor) => [`${actor.siteId}@${actor.ordinal}`, actor.sessionId]));
    const askingInstances = new Set((run?.pendingQuestions ?? [])
        .filter((question) => question.actorSiteId !== undefined && question.actorOrdinal !== undefined)
        .map((question) => `${question.actorSiteId}@${question.actorOrdinal}`));
    // 边：先按下标去重（自环与指向未列出阶段的边在这一粒度上没有话说），再交给带的折叠——
    // 相邻的成轨道段，其余成弧，带把分叉与汇合那几条吃掉（`timeline-bands.ts`）。
    const edges = [];
    const seen = new Set();
    for (const edge of graph.phaseEdges ?? []) {
        const from = index.get(edge.from);
        const to = index.get(edge.to);
        if (from === undefined || to === undefined || from === to)
            continue;
        const key = `${from}>${to}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        edges.push({ from, to });
    }
    // 阶段流（spec「Streams」）：同样按下标去重；它们把一条线上的 stage 从带里拿出来。
    const streams = phaseStreamIndexes(graph.phaseStreams, index);
    const alongsideIndexes = phases.map((phase) => (phase.alongside ?? []).flatMap((id) => {
        const at = index.get(id);
        return at === undefined ? [] : [at];
    }));
    const folded = foldPhaseBands(phases.length, alongsideIndexes, streams);
    const fold = foldPhaseEdges(phases.length, folded, edges, streams);
    const arcPairs = [...fold.arcs].sort((left, right) => Math.abs(left.from - left.to) - Math.abs(right.from - right.to));
    // 回边的两端上环；端点在带里时整条带都上环——带是一个节点，再入的是整条带。
    const onLoop = new Set();
    for (const arc of arcPairs) {
        if (arc.to >= arc.from || arc.stream)
            continue;
        for (const end of [arc.from, arc.to]) {
            const band = bandOf(folded, end);
            if (band === undefined)
                onLoop.add(end);
            else
                for (let i = band.from; i <= band.to; i += 1)
                    onLoop.add(i);
        }
    }
    // 名称哈希会碰撞；以实例身份分配连续编号，同一代理跨阶段保持同一头像。
    const avatarIndexes = new Map();
    const nodeStatuses = [];
    const entered = [];
    const hasMembers = [];
    const stations = phases.map((phase, i) => {
        const memberSteps = members.get(phase.id) ?? [];
        const unlisted = stationUnlisted(run, binder, phase.id);
        const observed = observePhase(run, siteIdsOf(memberSteps), phaseEntryFor(run, phase.name), (node) => binder.has(phase.id, node.phaseName), unlisted);
        const pills = participantsOfPhase(live.graph, phase.id).map((participant) => {
            const instance = live.instances[participant.id];
            const lane = laneRefs.get(participant.lane) ?? {
                id: participant.lane,
                laneClass: laneClassOf(participant.lane),
            };
            // 折叠为空 = 这个子代理在这一站、这一次 run 里什么都没做：空心是诚实的。undefined 只留给
            // 无 run 的静态药丸。
            const status = run === undefined
                ? undefined
                : (participantStatus(participant, overlay.statuses, live.participantStatuses) ??
                    "pending");
            const sessionId = instance === undefined
                ? undefined
                : sessionByInstance.get(`${participant.lane}@${instance.ordinal}`);
            const slot = run !== undefined && lane.laneClass === "agent"
                ? {
                    ordinal: instance?.ordinal ?? (participant.member?.index ?? 0) + 1,
                    siteId: participant.lane,
                }
                : undefined;
            const avatarKey = `${participant.lane}@${instance?.ordinal ?? (participant.member?.index ?? 0) + 1}`;
            if (lane.laneClass === "agent" && !avatarIndexes.has(avatarKey)) {
                avatarIndexes.set(avatarKey, avatarIndexes.size);
            }
            return {
                ...(lane.laneClass === "agent" ? { avatarIndex: avatarIndexes.get(avatarKey) } : {}),
                key: participant.id,
                lane,
                laneClass: lane.laneClass,
                ...(instance?.name === undefined ? {} : { runtimeName: instance.name }),
                status,
                ...(instance === undefined
                    ? {}
                    : {
                        instance: {
                            ordinal: instance.ordinal,
                            siteId: participant.lane,
                            ...(sessionId === undefined ? {} : { sessionId }),
                        },
                    }),
                ...(slot === undefined ? {} : { slot }),
                ...(run !== undefined && lane.laneClass === "workspace"
                    ? { workspace: { phaseId: phase.id } }
                    : {}),
                stepIds: [...participant.steps],
                ...(instance !== undefined && askingInstances.has(`${participant.lane}@${instance.ordinal}`)
                    ? { asking: true }
                    : {}),
            };
        });
        const nodeStatus = collapseStatuses(memberSteps.map((step) => step.id), overlay.statuses);
        nodeStatuses.push(nodeStatus);
        entered.push(observed.entered);
        hasMembers.push(memberSteps.length > 0);
        // 停在留白上的 run：那一站就是当前站（进入它的段行进、镜头对准它），灯的画法由 `hole` 说。
        const hole = holes.byPhase.get(phase.id);
        const waiting = hole?.state === "waiting";
        return {
            id: phase.id,
            naming: { id: phase.id, ...(phase.name === undefined ? {} : { name: phase.name }) },
            pills,
            status: waiting
                ? "running"
                : stationStatus(run, nodeStatus, isCurrentPhase(run, phase.name), observed.entered),
            visited: observed.visited || waiting,
            rounds: observed.rounds,
            ...(hole === undefined ? {} : { hole }),
            ...stationFillOf(phase, hole),
            onLoop: onLoop.has(i),
            track: trackOf(folded, i),
            ...(observed.observed === 0
                ? {}
                : { fraction: { observed: observed.observed, settled: observed.settled } }),
            ...(unlisted === undefined ? {} : { unlisted }),
        };
    });
    // stage 的灯（spec「Station status」）：并行或有流、且有成员 step 的站只看自己的节点与喂它的站。
    const staged = stageStatuses({
        alongside: alongsideIndexes,
        entered,
        hasMembers,
        nodeStatuses,
        run,
        sequential: stations.map((station) => station.status),
        streams,
    });
    // 等着补全的留白照旧是 running（run 停在它上面）：它在 future 里时也是并行站，不让 stage 规则
    // 按「没有节点 → pending」把它改掉（dwf-recursive 与 dwf-pipeline-display 合并时对齐的两条规则）。
    stations.forEach((station, i) => {
        if (station.hole?.state !== "waiting")
            station.status = staged[i];
    });
    const visited = (i) => stations[i]?.visited === true;
    let runningIndex;
    for (let i = stations.length - 1; i >= 0; i -= 1) {
        if (stations[i]?.status === "running") {
            runningIndex = i;
            break;
        }
    }
    const rails = fold.rails.map((rail) => ({
        from: rail.from,
        ink: rail.kind === "stream"
            ? streamInk(stations[rail.from], stations[rail.to])
            : visited(rail.from) && visited(rail.to)
                ? "strong"
                : "faint",
        ...(rail.kind === undefined ? {} : { kind: rail.kind }),
        to: rail.to,
        ...(railTouchesHole(stations, rail) ? { dashed: true } : {}),
    }));
    const lanes = assignAirLanes(arcPairs);
    const arcs = arcPairs.map((arc, at) => {
        const back = arc.to < arc.from;
        const strong = back
            ? visited(arc.from) && (stations[arc.to]?.rounds ?? 0) >= 2
            : visited(arc.from) && visited(arc.to);
        return {
            air: arc.air,
            from: arc.from,
            ink: arc.stream
                ? streamInk(stations[arc.from], stations[arc.to])
                : strong
                    ? "strong"
                    : "faint",
            lane: lanes[at] ?? 0,
            ...(arc.stream ? { stream: true } : {}),
            to: arc.to,
        };
    });
    // 行进边：从上一个已结算的阶段进入正在运行的阶段的那一条。投影没有时间戳，所以按三条规则
    // 取最诚实的一条：再入的回边 > 进入该站的轨道段 > 任一落在该站的弧。
    // 每个正在运行的站各走一遍——带里两条轨道可以同时在跑，它们各自的分叉都该亮。
    for (let r = 0; r < stations.length; r += 1) {
        if (stations[r]?.status !== "running")
            continue;
        const entry = bandOf(folded, r)?.from ?? r;
        // 流轨与流弧不参与（spec「March」末段）：它们的墨已经说了有没有东西在过。
        const reentry = arcs.find((arc) => !arc.stream &&
            arc.to === entry &&
            arc.from > arc.to &&
            visited(arc.from) &&
            stations[r].rounds >= 2);
        if (reentry !== undefined) {
            reentry.ink = "march";
            continue;
        }
        // 双线段不是控制流走的路，它只说「这两站并行」，永不行进。
        const inbound = rails.filter((rail) => rail.to === r && rail.kind !== "twin" && rail.kind !== "stream" && visited(rail.from));
        if (inbound.length > 0) {
            for (const rail of inbound)
                rail.ink = "march";
            continue;
        }
        const landing = arcs.find((arc) => !arc.stream && arc.to === r && visited(arc.from));
        if (landing !== undefined)
            landing.ink = "march";
    }
    const railInk = (from, to) => rails.find((rail) => rail.from === from && rail.to === to && rail.kind !== "twin")?.ink ??
        "faint";
    const bands = fold.bands.map((band) => ({
        from: band.from,
        ...(band.join === undefined ? {} : { join: band.join }),
        ...(band.pred === undefined ? {} : { pred: band.pred }),
        to: band.to,
        tracks: band.tracks.map((members) => {
            const head = members[0];
            const tail = members[members.length - 1];
            return {
                entry: band.pred === undefined
                    ? (visited(head) ? "strong" : "faint")
                    : railInk(band.pred, head),
                exit: band.join === undefined
                    ? (visited(tail) ? "strong" : "faint")
                    : railInk(tail, band.join),
                stations: [...members],
            };
        }),
    }));
    const tailStub = tailStubOf(stations);
    return {
        arcs,
        bands,
        fills: holes.fills,
        ...(Object.keys(holes.parents).length === 0 ? {} : { holeParents: holes.parents }),
        live: run !== undefined,
        rails,
        runningIndex,
        stations,
        ...(tailStub === undefined ? {} : { tailStub }),
    };
}
//# sourceMappingURL=timeline-model.js.map