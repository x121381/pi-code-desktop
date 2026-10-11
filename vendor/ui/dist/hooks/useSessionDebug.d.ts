export declare function useSessionDebug({ workspacePath, workspaceIdentity, taskId, enabled, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string | null;
    enabled?: boolean;
}): {
    error: boolean;
    rounds: readonly [];
    networkEntries: readonly [];
    cache: null;
} | {
    error: boolean;
    sessionId: string;
    rounds: {
        eventKey: string;
        requestId: string;
        requestIndex: number;
        recordedAt: number;
        usage: {
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            reasoningTokens?: number | undefined;
            cachedInputTokens?: number | undefined;
            cachedWriteInputTokens?: number | undefined;
        };
        hitRate: number | null;
        generationDurationMs: number | null;
        tokensPerSecond: number | null;
    }[];
    networkEntries: {
        eventKey: string;
        traceId: string;
        recordedAt: number;
        statusType: "model_request_started" | "model_request_completed" | "model_request_failed" | "model_retry_scheduled" | "model_stream_stalled";
        requestHeaders: Record<string, string>;
        responseHeaders: Record<string, string>;
        requestHeaderCount: number;
        responseHeaderCount: number;
        requestId?: string | undefined;
        providerId?: string | undefined;
        modelId?: string | undefined;
        providerKind?: string | undefined;
        transport?: string | undefined;
        baseURL?: string | undefined;
        querySource?: string | undefined;
        queryId?: string | undefined;
        timestamp?: string | undefined;
        attempt?: number | undefined;
        maxAttempts?: number | undefined;
        nextAttempt?: number | undefined;
        retryable?: boolean | undefined;
        statusCode?: number | undefined;
        durationMs?: number | undefined;
        delayMs?: number | undefined;
        idleMs?: number | undefined;
        timeoutMs?: number | undefined;
        reason?: string | undefined;
        message?: string | undefined;
    }[];
    cache: {
        hitRateRequestCount: number;
        totalInputTokens: number;
        totalCacheReadTokens: number;
        hitRate: number | null;
    } | null;
};
//# sourceMappingURL=useSessionDebug.d.ts.map