import type { TaskNotificationPayload } from "@zcode/shared";
import type { ConversationSnapshot, SessionSummary } from "@zcode/shared/zcode-protocol-v4";
import type { IntlInstance } from "@/i18n/index.js";
type FormatMessage = IntlInstance["formatMessage"];
export declare function collectTerminalTaskNotificationPayloads(params: {
    previousBySessionId: ReadonlyMap<string, SessionSummary>;
    sessions: readonly SessionSummary[];
    formatMessage: FormatMessage;
}): TaskNotificationPayload[];
export declare function collectPendingInteractionNotificationPayloads(params: {
    snapshot: ConversationSnapshot;
    seenRequestIds: ReadonlySet<string>;
    formatMessage: FormatMessage;
}): TaskNotificationPayload[];
export {};
//# sourceMappingURL=taskNotificationOrchestrator.d.ts.map