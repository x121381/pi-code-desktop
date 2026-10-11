import type { ConversationTelemetrySupervisor } from "@/v4/telemetry/conversationTelemetrySupervisor.js";
type SubscriptionErrorReporter = Pick<ConversationTelemetrySupervisor, "reportVisibleChatError">;
export declare function resolveSessionSubscriptionErrorCode(message: string): string;
export declare function useSessionSubscriptionErrorTelemetry(params: {
    supervisor: SubscriptionErrorReporter | null;
    sessionId: string | null;
    lastError: string | null;
    visible: boolean;
}): void;
export {};
//# sourceMappingURL=useSessionSubscriptionErrorTelemetry.d.ts.map