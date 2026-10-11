import { attachTaskListRowActivity, } from "@/v4/taskListRowActivity.js";
/** phase → 侧栏持久化状态（running/completed/error）；draft 无结果状态。 */
function phaseToStatus(phase) {
    switch (phase) {
        case "running":
        case "prewarming":
            return "running";
        case "completedSuccess":
        case "completedInterrupted":
            return "completed";
        case "error":
            return "error";
        default:
            return undefined; // draft
    }
}
/**
 * SessionSummary → 实时 detail ZCodeTaskMeta。sessions-index 不携带的字段
 * （traceId/mode/provider）取合理默认或沿用 previous；真实持久字段以 join 时的 task 行为准。
 */
export function mapSessionSummaryToTaskMeta(summary, options) {
    const previous = options.previous;
    const status = phaseToStatus(summary.phase);
    const summaryTitleIsCustom = summary.titleSource === "custom";
    // 旧 task-index 里已经存在 titleOverridden=true 的手动标题时，
    // sessions-index 冷启动 summary 可能仍是 first_input/generated 标题。只有 v4 session
    // store 明确标记 custom 时才把 summary.title 当成新的手动标题权威。
    const title = previous?.titleOverridden === true && !summaryTitleIsCustom
        ? previous.title
        : summary.title || previous?.title || "";
    const titleOverridden = summaryTitleIsCustom || previous?.titleOverridden === true
        ? true
        : undefined;
    return attachTaskListRowActivity({
        taskId: summary.sessionId,
        traceId: (previous?.traceId ?? `session-${summary.sessionId}`),
        title,
        ...(titleOverridden ? { titleOverridden } : {}),
        workspacePath: options.workspacePath,
        ...(options.workspaceIdentity
            ? { workspaceIdentity: options.workspaceIdentity }
            : {}),
        createdAt: summary.createdAt || previous?.createdAt || 0,
        updatedAt: summary.lastActivityAt || previous?.updatedAt || 0,
        mode: previous?.mode ?? "default",
        ...(previous?.model ? { model: previous.model } : {}),
        ...(summary.parentSessionId
            ? { forkedFromTaskId: summary.parentSessionId }
            : {}),
        ...(previous?.provider
            ? { provider: previous.provider }
            : {}),
        ...(status ? { status } : {}),
        ...(summary.pendingInteraction
            ? {
                pendingInteraction: {
                    interactionId: summary.pendingInteraction.interactionId,
                    kind: summary.pendingInteraction.kind,
                    ...(summary.pendingInteraction.toolName
                        ? { toolName: summary.pendingInteraction.toolName }
                        : {}),
                    ...(summary.pendingInteraction.autoResolution
                        ? { autoResolution: summary.pendingInteraction.autoResolution }
                        : {}),
                },
            }
            : {}),
        ...(previous?.unreadAt ? { unreadAt: previous.unreadAt } : {}),
    }, {
        phase: summary.phase,
        lastActivityAt: summary.lastActivityAt,
        hasBackgroundWork: summary.hasBackgroundWork,
        ...(summary.pendingInteractionSummary
            ? { pendingInteractions: summary.pendingInteractionSummary }
            : {}),
        ...(summary.workflowActivity ? { workflowActivity: summary.workflowActivity } : {}),
    });
}
//# sourceMappingURL=mapSessionSummaryToTaskMeta.js.map