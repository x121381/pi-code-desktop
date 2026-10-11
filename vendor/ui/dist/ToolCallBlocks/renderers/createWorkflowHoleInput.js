import { isSyntheticLaneId, } from "../../components/workflow-graph/types.js";
import { isPlainRecord } from "../../ToolCallBlocks/renderers/createWorkflowInput.js";
function trimmed(value) {
    if (typeof value !== "string")
        return undefined;
    const text = value.trim();
    return text.length > 0 ? text : undefined;
}
export function readWorkflowHoleTarget(input, fill) {
    if (!isPlainRecord(input))
        return undefined;
    const hole = isPlainRecord(input.hole) ? input.hole : undefined;
    const line = fill?.line ?? hole?.line;
    return {
        runId: trimmed(input.run_id),
        holeId: trimmed(input.hole_id) ?? trimmed(fill?.siteId),
        name: trimmed(fill?.name) ?? trimmed(hole?.name),
        draftPath: trimmed(fill?.draftPath) ?? trimmed(hole?.draft_path),
        line: typeof line === "number" && Number.isInteger(line) && line > 0 ? line : undefined,
    };
}
/** 补全的体（`script`）：与 CreateWorkflow 的脚本同一通道，流式草稿的笔从它里扫阶段。 */
export function readWorkflowHoleBody(input) {
    return isPlainRecord(input) && typeof input.script === "string" ? input.script : undefined;
}
/**
 * 一次补全写下了几个阶段、几个子代理（「留白已补全 · {name} · {k} 个阶段 · {m} 个子代理」）：
 * 有效脚本的图上带 `fill === holeId` 的阶段与站点。留白自己的阶段（无阶段的补全）不算阶段。
 */
export function workflowFillCounts(graph, holeId) {
    if (graph === undefined)
        return { agents: 0, phases: 0 };
    const phases = (graph.phases ?? []).filter((phase) => phase.fill === holeId).length;
    const lanes = new Set();
    for (const step of graph.steps) {
        // 补全写进来的开着的内层留白（kind `hole`、车道 `main`）不是子代理。
        if (step.fill === holeId && step.kind !== "hole" && !isSyntheticLaneId(step.lane)) {
            lanes.add(step.lane);
        }
    }
    return { agents: lanes.size, phases };
}
//# sourceMappingURL=createWorkflowHoleInput.js.map