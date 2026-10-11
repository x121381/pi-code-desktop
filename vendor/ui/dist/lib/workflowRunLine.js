import { isSessionWorkflowRunLive } from "@zcode/shared/zcode-protocol-v4";
import { bandOf, foldPhaseBands, trackOf } from "../components/workflow-timeline/timeline-bands.js";
/** 一个会话最多画的运行行数；其余折成「+n」。 */
export const WORKFLOW_RUN_LINE_MAX_LINES = 2;
/** 迷你轨道最多画的站点数；更多时折到运行站 ±2 并带「+n」尾。 */
const WORKFLOW_RUN_RAIL_MAX_STATIONS = 6;
/** 折叠时保留在运行站两侧的站点数。 */
const RAIL_FOLD_RADIUS = 2;
/** 控制流是否到过这一站：running / done / failed 都算。 */
function isWorkflowRunStationReached(status) {
    return status !== "pending";
}
/**
 * 迷你轨道的折叠：≤ 6 站全画；更多时以运行站为中心（没有运行站就取最后一个到过的站，再没有就取首站）
 * 保留 ±2 共 5 站，其余合成「+n」尾。这是**固定窗口**而不是滚动：侧栏没有横向手势。
 */
export function foldWorkflowRunRail(phases) {
    if (phases.length === 0) {
        return { stations: [], hidden: 0, implicit: true };
    }
    // 折带必须在**全表**上做：窗口只取其中一段，而带是声明序上的连通分量，按窗口内的下标重折
    // 会把跨窗口边界的带拆断。折完再窗口化，双线段标志随站走。
    const bands = foldPhaseBands(phases.length, phases.map((phase) => phase.alongside ?? []));
    const all = phases.map((phase, index) => {
        const band = index === 0 ? undefined : bandOf(bands, index);
        const twin = band !== undefined &&
            band === bandOf(bands, index - 1) &&
            trackOf(bands, index) !== trackOf(bands, index - 1);
        return {
            name: phase.name,
            status: phase.status,
            // 等着补全的留白是控制流到了的地方：进入它的段已走过。
            reached: isWorkflowRunStationReached(phase.status) || phase.hole === "waiting",
            ...(twin ? { twin: true } : {}),
            ...(phase.hole === undefined ? {} : { hole: phase.hole }),
        };
    });
    if (all.length <= WORKFLOW_RUN_RAIL_MAX_STATIONS) {
        return { stations: all, hidden: 0, implicit: false };
    }
    // 窗口以运行站为锚；run 停在留白上时那一站就是锚（灯是警示色的虚线，不是 running）。
    let anchor = all.findIndex((station) => station.status === "running" || station.hole === "waiting");
    if (anchor < 0) {
        for (let index = all.length - 1; index >= 0; index -= 1) {
            if (all[index].reached) {
                anchor = index;
                break;
            }
        }
    }
    if (anchor < 0)
        anchor = 0;
    const windowSize = RAIL_FOLD_RADIUS * 2 + 1;
    let start = Math.max(0, anchor - RAIL_FOLD_RADIUS);
    const end = Math.min(all.length, start + windowSize);
    start = Math.max(0, end - windowSize);
    const stations = all.slice(start, end);
    return { stations, hidden: all.length - stations.length, implicit: false };
}
/** 并行阶段之间的连接词：同时在跑的几站并排，而不是排队。 */
export const WORKFLOW_RUN_PARALLEL_SEPARATOR = " ∥ ";
/**
 * 同时在跑的站名，连成 tooltip 里的一段。并行时「当前阶段」不再是一个站——谁都不比谁更当前，
 * 所以那一段换成全部在跑的站名。
 *
 * 只有一个（或零个）站在跑时返回 `undefined`：调用方退回 `currentPhase`，文案一字不变。
 */
export function workflowRunParallelPhaseLabel(phases) {
    const running = phases.filter((phase) => phase.status === "running");
    return running.length > 1
        ? running.map((phase) => phase.name).join(WORKFLOW_RUN_PARALLEL_SEPARATOR)
        : undefined;
}
/**
 * 选出要画的行：在跑的永远画；已结束的只在**未确认**时画（确认 = 会话被打开过）。
 * 输入顺序已由投影排好（在跑的按启动序在前，其后最近结束的），这里只过滤与截断。
 */
export function selectWorkflowRunLines(activity, isAcknowledged) {
    if (activity === undefined)
        return { lines: [], overflow: 0 };
    const visible = activity.runs.filter((run) => isSessionWorkflowRunLive(run.status) || !isAcknowledged(run.runId));
    return {
        lines: visible.slice(0, WORKFLOW_RUN_LINE_MAX_LINES),
        overflow: Math.max(0, visible.length - WORKFLOW_RUN_LINE_MAX_LINES),
    };
}
/** 已结束（可被确认）的 run id：打开会话时整批确认。 */
export function settledWorkflowRunIds(activity) {
    if (activity === undefined)
        return [];
    return activity.runs
        .filter((run) => !isSessionWorkflowRunLive(run.status))
        .map((run) => run.runId);
}
/** 在跑的 run 数（收起的项目组头旁的脉冲灯与数量）。 */
export function countLiveWorkflowRuns(activity) {
    if (activity === undefined)
        return 0;
    return activity.runs.filter((run) => isSessionWorkflowRunLive(run.status)).length;
}
//# sourceMappingURL=workflowRunLine.js.map