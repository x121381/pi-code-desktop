function terminalStatusForPhase(phase) {
    if (phase === "completedSuccess" || phase === "completedInterrupted") {
        return "completed";
    }
    if (phase === "error") {
        return "failed";
    }
    return null;
}
function taskTitleBody(title, fallbackMessageId, formatMessage) {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
        return formatMessage({ id: "notification.taskWithTitle" }, { title: trimmedTitle });
    }
    return formatMessage({ id: fallbackMessageId });
}
function terminalPayloadForSession(session, status, formatMessage) {
    if (status === "completed") {
        return {
            taskId: session.sessionId,
            status,
            title: formatMessage({ id: "notification.completed" }),
            body: taskTitleBody(session.title, "notification.completedBody", formatMessage),
        };
    }
    return {
        taskId: session.sessionId,
        status,
        title: formatMessage({ id: "notification.error" }),
        body: taskTitleBody(session.title, "notification.error", formatMessage),
    };
}
export function collectTerminalTaskNotificationPayloads(params) {
    const payloads = [];
    for (const session of params.sessions) {
        const status = terminalStatusForPhase(session.phase);
        if (!status)
            continue;
        const previous = params.previousBySessionId.get(session.sessionId);
        if (!previous)
            continue;
        const previousStatus = terminalStatusForPhase(previous.phase);
        if (previousStatus === status)
            continue;
        payloads.push(terminalPayloadForSession(session, status, params.formatMessage));
    }
    return payloads;
}
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isPlanApprovalInteraction(payload) {
    if (payload.toolName === "ExitPlanMode") {
        return true;
    }
    if (!isPlainRecord(payload.schema)) {
        return false;
    }
    return (payload.schema.interaction === "plan_approval" || payload.schema.toolName === "ExitPlanMode");
}
function pendingInteractionPayload(params) {
    const { snapshot, interaction, formatMessage } = params;
    const requestId = interaction.interactionId;
    const taskId = snapshot.sessionId;
    const taskTitle = snapshot.meta.title;
    // workspace Hook review 的唯一入口是 Settings；不得把它伪装成
    // permission/elicitation 系统通知。
    if (interaction.payload.kind === "workspaceHookReview") {
        return null;
    }
    if (interaction.payload.kind === "permission") {
        return {
            taskId,
            status: "permission_request",
            requestId,
            title: formatMessage({ id: "notification.permissionRequired" }),
            body: interaction.payload.summary.trim() ||
                taskTitleBody(taskTitle, "notification.permissionRequired", formatMessage),
        };
    }
    if (isPlanApprovalInteraction(interaction.payload)) {
        return {
            taskId,
            status: "elicitation_request",
            requestId,
            title: formatMessage({ id: "notification.planApprovalRequired" }),
            body: formatMessage({ id: "notification.planApprovalBody" }),
        };
    }
    return {
        taskId,
        status: "elicitation_request",
        requestId,
        title: formatMessage({ id: "notification.inputRequired" }),
        body: interaction.payload.prompt.trim() ||
            taskTitleBody(taskTitle, "notification.inputRequired", formatMessage),
    };
}
export function collectPendingInteractionNotificationPayloads(params) {
    return params.snapshot.pendingInteractions
        .filter((interaction) => !params.seenRequestIds.has(interaction.interactionId))
        .flatMap((interaction) => {
        const payload = pendingInteractionPayload({
            snapshot: params.snapshot,
            interaction,
            formatMessage: params.formatMessage,
        });
        return payload ? [payload] : [];
    });
}
//# sourceMappingURL=taskNotificationOrchestrator.js.map