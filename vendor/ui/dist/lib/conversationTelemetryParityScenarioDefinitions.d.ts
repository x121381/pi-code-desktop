export type ParityModelStatus = "model_request_started" | "model_request_completed" | "model_request_failed" | "model_retry_scheduled" | "model_stream_stalled";
export interface ParitySeed {
    sessionId: string;
    commandId: string;
    now: number;
    scope?: string;
    askMode?: string;
    modelName?: string;
    modelProvider?: string;
    providerHostname?: string;
}
export type ConversationTelemetryParityOperation = {
    kind: "focus";
    now: number;
    scope?: string;
} | {
    kind: "text";
    now: number;
    value: string;
    scope?: string;
} | ({
    kind: "seed";
    duplicate?: boolean;
} & ParitySeed) | {
    kind: "foreground.attach";
    sessionId: string;
    owner: string;
    scope?: string;
} | {
    kind: "foreground.detach";
    owner: string;
    scope?: string;
} | {
    kind: "turn.started";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    scope?: string;
} | {
    kind: "model.status";
    now: number;
    eventId: string;
    sessionId: string;
    commandId?: string;
    turnId?: string;
    requestId: string;
    status: ParityModelStatus;
    providerId: string;
    modelId: string;
    providerHostname?: string;
    durationMs?: number;
    reason?: string;
    retryable?: boolean;
    statusCode?: number;
    delayMs?: number;
    nextAttempt?: number;
    idleMs?: number;
    timeoutMs?: number;
    scope?: string;
} | {
    kind: "chunk";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    channel: "thought" | "text";
    firstChunk: boolean;
    parentToolCallId?: string;
    scope?: string;
} | {
    kind: "permission";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    phase: "requested" | "resolved" | "denied";
    requestId: string;
    toolCallId: string;
    decision?: "allow" | "deny" | "escalate" | "modify";
    scope?: string;
} | {
    kind: "tool";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    phase: "scheduled" | "started" | "progress" | "completed" | "failed";
    toolCallId: string;
    toolName: string;
    errorCode?: string;
    errorMessage?: string;
    parentToolCallId?: string;
    performance?: {
        totalMs?: number;
        permissionWaitMs?: number;
        commandRunMs?: number;
        exitCode?: number;
        timedOut?: boolean;
        outputBytes?: number;
        commandCategory?: string;
        commandName?: string;
        commandCount?: number;
        commandStatus?: "completed" | "failed" | "timed_out" | "cancelled" | "spawn_error" | "backgrounded";
        commandHash?: string;
        workspaceKind?: "local" | "remote" | "unknown";
    };
    scope?: string;
} | {
    kind: "usage";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    scope?: string;
} | {
    kind: "terminal";
    now: number;
    eventId: string;
    sessionId: string;
    commandId: string;
    turnId: string;
    status: "success" | "failed" | "interrupted";
    errorCode?: string;
    errorMessage?: string;
    duplicate?: boolean;
    scope?: string;
} | {
    kind: "compaction";
    now: number;
    eventId: string;
    sessionId: string;
    operationId: string;
    status: "completed" | "failed" | "interrupted";
    trigger: "manual" | "auto" | "partial" | "reactive" | "session_memory";
    summaryMessageId?: string;
    reason?: string;
    compactReason?: string;
    modelName?: string;
    modelProvider?: string;
    startedAt?: number;
    endedAt?: number;
    preCompactTokenCount?: number;
    postCompactTokenCount?: number;
    truePostCompactTokenCount?: number;
    duplicate?: boolean;
    scope?: string;
} | {
    kind: "visible.error";
    errorKey: string;
    displayMessage: string;
    code: string;
    traceId: string;
    sessionId: string;
    detail?: string;
    duplicate?: boolean;
    suppressed?: boolean;
    scope?: string;
} | {
    kind: "feedback";
    sessionId: string;
    messageId: string;
    reaction: "like" | "dislike" | "none";
    scope?: string;
} | {
    kind: "quota.assert";
} | {
    kind: "verification.assert";
} | {
    kind: "scope.dispose";
    scope?: string;
} | {
    kind: "web.noop";
    operations: ConversationTelemetryParityOperation[];
};
export interface ConversationTelemetryParityScenario {
    caseId: string;
    operations: ConversationTelemetryParityOperation[];
    minimumReportInventory: Record<string, number>;
    minimumArmsInventory: Record<string, number>;
    proof: string[];
}
export declare const CONVERSATION_TELEMETRY_PARITY_CASE_IDS: string[];
export declare function getConversationTelemetryParityScenario(caseId: string): ConversationTelemetryParityScenario;
//# sourceMappingURL=conversationTelemetryParityScenarioDefinitions.d.ts.map