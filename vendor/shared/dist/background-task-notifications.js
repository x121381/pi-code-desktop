import { textFromZCodeMessageParts } from "./zcode-protocol-legacy-types.js";
export function parseZCodeBackgroundTaskNotificationText(text) {
    const trimmed = text?.trim();
    if (!trimmed?.startsWith("<task-notification>")) {
        return null;
    }
    const toolUseId = readTaskNotificationTag(trimmed, "tool-use-id");
    if (!toolUseId) {
        return null;
    }
    return {
        toolUseId,
        notification: {
            error: readTaskNotificationTag(trimmed, "error"),
            outputFile: readTaskNotificationTag(trimmed, "output-file"),
            result: readTaskNotificationTag(trimmed, "result"),
            status: readTaskNotificationTag(trimmed, "status"),
            summary: readTaskNotificationTag(trimmed, "summary"),
            taskId: readTaskNotificationTag(trimmed, "task-id"),
        },
    };
}
export function collectZCodeBackgroundTaskNotificationsByToolUseId(messages) {
    const notifications = new Map();
    for (const message of messages) {
        if (message.info.role !== "user") {
            continue;
        }
        const parsed = parseZCodeBackgroundTaskNotificationText(textFromZCodeMessageParts(message.parts));
        if (!parsed) {
            continue;
        }
        notifications.set(parsed.toolUseId, parsed.notification);
    }
    return notifications;
}
export function zcodeBackgroundTaskNotificationToolUpdateStatus(status) {
    if (status === "failed" || status === "lost") {
        return "failed";
    }
    // task-notification 的 killed/stopped 都表示被停止，不能折成 completed。
    if (status === "stopped" || status === "killed") {
        return "stopped";
    }
    return "completed";
}
export function attachZCodeBackgroundTaskNotificationToRaw(raw, notification) {
    if (!notification) {
        return raw;
    }
    const record = asPlainRecord(raw);
    const meta = asPlainRecord(record._meta);
    const zcode = asPlainRecord(meta.zcode);
    return {
        ...record,
        _meta: {
            ...meta,
            zcode: {
                ...zcode,
                taskNotification: notification,
            },
        },
    };
}
function readTaskNotificationTag(text, tag) {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "u"));
    const value = match?.[1]?.trim();
    return value ? decodeTaskNotificationXmlText(value) : undefined;
}
function decodeTaskNotificationXmlText(value) {
    return value
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}
function asPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : {};
}
//# sourceMappingURL=background-task-notifications.js.map