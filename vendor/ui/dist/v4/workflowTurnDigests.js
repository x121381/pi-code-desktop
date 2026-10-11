import { readWorkflowName } from "@/ToolCallBlocks/renderers/createWorkflowInput.js";
export function resolveWorkflowTurnDigests(unit, join) {
    const digests = [];
    const seen = new Set();
    // 图是 run 的属性（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「The model」）：
    // 补全过的 run 取最新补全行的图，否则按发起 toolCallId。
    const graphOf = (originToolCallId, runId) => join.fillGraphByRunId?.get(runId)?.graph ??
        (originToolCallId === undefined ? undefined : join.graphByToolCallId?.get(originToolCallId));
    const launch = unit.workflowLaunch;
    if (launch !== undefined) {
        // 就地生效的设置轮：`amend` 不带 predecessorRunId（缺席即「没有前驱、改的就是自己」，
        // workflow-row-meta.ts）。它是唯一一个点名了 run 却不是「启动 / 恢复了它」的来源，所以
        // **不占**这一轮的出卡名额——同一轮里真的发起了这条 run 的来源照常出它的卡。
        const rowOnly = launch.amend !== undefined && launch.amend.predecessorRunId === undefined;
        if (!rowOnly)
            seen.add(launch.runId);
        digests.push({
            graph: graphOf(launch.toolCallId, launch.runId),
            ...(join.fillGraphByRunId?.get(launch.runId) === undefined
                ? {}
                : { holeLabels: join.fillGraphByRunId.get(launch.runId).holeLabels }),
            key: `launch:${launch.toolCallId}`,
            name: launch.name,
            runId: launch.runId,
            summary: join.byRunId?.get(launch.runId),
            toolCallId: launch.toolCallId,
            ...(rowOnly ? { rowOnly: true } : {}),
            ...(launch.amend === undefined
                ? {}
                : {
                    settings: {
                        amend: launch.amend,
                        ...(unit.startedAt === undefined ? {} : { at: unit.startedAt }),
                    },
                }),
        });
    }
    for (const row of unit.assistantWorkRows) {
        if (row.kind !== "toolCall")
            continue;
        const created = join.byToolCallId?.get(row.toolCallId);
        if (created !== undefined) {
            if (seen.has(created.runId))
                continue;
            seen.add(created.runId);
            digests.push({
                graph: graphOf(row.toolCallId, created.runId),
                ...(join.fillGraphByRunId?.get(created.runId) === undefined
                    ? {}
                    : { holeLabels: join.fillGraphByRunId.get(created.runId).holeLabels }),
                key: `${row.rowId}:${row.toolCallId}`,
                name: readWorkflowName(row.input),
                runId: created.runId,
                summary: created,
                toolCallId: row.toolCallId,
            });
            continue;
        }
        if (row.display?.kind !== "resume_workflow_run")
            continue;
        const runId = row.display.runId;
        if (seen.has(runId))
            continue;
        seen.add(runId);
        const resumed = join.byRunId?.get(runId);
        digests.push({
            // 发起行 id 只有联接到投影才知道；不在投影里的 resume 卡没有图可找。
            graph: graphOf(resumed?.toolCallId, runId),
            ...(join.fillGraphByRunId?.get(runId) === undefined
                ? {}
                : { holeLabels: join.fillGraphByRunId.get(runId).holeLabels }),
            key: `${row.rowId}:${row.toolCallId}`,
            name: undefined,
            runId,
            summary: resumed,
            toolCallId: row.toolCallId,
        });
    }
    return digests;
}
//# sourceMappingURL=workflowTurnDigests.js.map