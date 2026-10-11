import { BOT_TASK_STREAM_BROADCAST_CHANNEL, } from "@zcode/shared";
import { buildTaskWorkspaceKey } from "@/lib/taskQueryCache.js";
import { isWorkspaceTab } from "@/store/tabStore.js";
function isZCodeStreamEvent(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const event = value;
    return typeof event.type === "string" && typeof event.taskId === "string";
}
function isBotTaskStreamBroadcastPayload(payload) {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }
    const value = payload;
    return (typeof value.workspacePath === "string" &&
        typeof value.taskId === "string" &&
        typeof value.updatedAt === "number" &&
        (value.workspaceIdentity === undefined ||
            typeof value.workspaceIdentity === "string") &&
        isZCodeStreamEvent(value.event) &&
        value.event.taskId === value.taskId);
}
export function resolveBotTaskStreamBroadcast(message, tabs) {
    if (message.channel !== BOT_TASK_STREAM_BROADCAST_CHANNEL) {
        return null;
    }
    if (!isBotTaskStreamBroadcastPayload(message.payload)) {
        return null;
    }
    const targetWorkspaceKey = buildTaskWorkspaceKey(message.payload.workspacePath, message.payload.workspaceIdentity);
    const hasOpenWorkspace = tabs.some((tab) => isWorkspaceTab(tab) &&
        buildTaskWorkspaceKey(tab.workspacePath, tab.workspaceIdentity) ===
            targetWorkspaceKey);
    return hasOpenWorkspace ? message.payload : null;
}
//# sourceMappingURL=botsTaskStreamBroadcast.js.map