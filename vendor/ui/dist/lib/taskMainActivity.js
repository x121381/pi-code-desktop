import { hasRunningZCodeTimeline } from "@/lib/zcodeTimelineRuntime.js";
export function shouldMarkMainActiveFromStreamMirrorOps(ops) {
    if (ops.length === 0) {
        return true;
    }
    return ops.some((op) => {
        if (op.kind === "user_message") {
            return true;
        }
        return shouldMarkMainActiveFromStreamEvent(op.event);
    });
}
export function shouldMarkMainActiveFromStreamEvent(event) {
    switch (event.type) {
        case "task_run_started":
        case "goal_iteration_started":
            return true;
        case "agent_message_chunk":
        case "agent_thought_chunk":
            return event.content.length > 0 && isMainAgentStreamEvent(event);
        case "tool_call":
        case "tool_call_update":
            return isMainAgentStreamEvent(event);
        default:
            return false;
    }
}
export function hasForegroundStreamingAssistantMessage(messages) {
    return messages.some((message) => message.role === "assistant" &&
        message.streaming === true &&
        !isTaskChatTimelineMessage(message));
}
function isTaskChatTimelineMessage(message) {
    if (!message.syntheticTimeline && !message.uiTimeline)
        return false;
    return !(message.content.trim() ||
        message.thought?.trim() ||
        (message.toolCalls && message.toolCalls.length > 0));
}
function isTaskRuntimeBusy(taskStatus) {
    return taskStatus === "creating" || taskStatus === "restoring" || taskStatus === "streaming";
}
export function hasForegroundActivityFromMessages(messages) {
    return hasForegroundStreamingAssistantMessage(messages) || hasRunningZCodeTimeline(messages);
}
export function isMainActivityRuntimeBusy(params) {
    const runtimeStatus = params.runtimeState?.status;
    const setupBusy = runtimeStatus === "creating" || runtimeStatus === "restoring";
    if (setupBusy) {
        return true;
    }
    if (params.currentStatus === "submitting") {
        return true;
    }
    if (params.hasForegroundActivity === true) {
        return true;
    }
    return (params.isMainActive &&
        (Boolean(params.runtimeState?.activeInputId) ||
            (runtimeStatus != null && isTaskRuntimeBusy(runtimeStatus))));
}
function isMainAgentStreamEvent(event) {
    if (event.parentToolUseId != null) {
        return false;
    }
    return !("raw" in event && isSubagentToolRaw(event.raw));
}
function isSubagentToolRaw(raw) {
    return (typeof raw === "object" &&
        raw !== null &&
        "source" in raw &&
        raw.source === "subagent");
}
//# sourceMappingURL=taskMainActivity.js.map