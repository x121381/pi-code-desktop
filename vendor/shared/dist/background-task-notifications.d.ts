import type { ZCodeMessageWithParts } from "./zcode-protocol-legacy-types.js";
import type { ZCodeStreamEvent } from "./zcode-task-types-core.js";
export interface ZCodeBackgroundTaskNotificationInfo {
    error?: string;
    outputFile?: string;
    result?: string;
    status?: string;
    summary?: string;
    taskId?: string;
}
export declare function parseZCodeBackgroundTaskNotificationText(text: string | undefined): {
    notification: ZCodeBackgroundTaskNotificationInfo;
    toolUseId: string;
} | null;
export declare function collectZCodeBackgroundTaskNotificationsByToolUseId(messages: readonly ZCodeMessageWithParts[]): Map<string, ZCodeBackgroundTaskNotificationInfo>;
export declare function zcodeBackgroundTaskNotificationToolUpdateStatus(status: string | undefined): Extract<Extract<ZCodeStreamEvent, {
    type: "tool_call_update";
}>["status"], "completed" | "failed" | "stopped">;
export declare function attachZCodeBackgroundTaskNotificationToRaw(raw: unknown, notification: ZCodeBackgroundTaskNotificationInfo | undefined): unknown;
//# sourceMappingURL=background-task-notifications.d.ts.map