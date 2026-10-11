import { z } from "zod";
export declare const SESSION_DEBUG_LIMITS: {
    readonly rounds: 200;
    readonly network: 100;
    readonly dedupe: 2000;
};
export declare const sessionDebugParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strict>;
export declare const sessionDebugRoundSchema: z.ZodObject<{
    eventKey: z.ZodString;
    requestId: z.ZodString;
    requestIndex: z.ZodNumber;
    recordedAt: z.ZodNumber;
    usage: z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
        reasoningTokens: z.ZodOptional<z.ZodNumber>;
        cachedInputTokens: z.ZodOptional<z.ZodNumber>;
        cachedWriteInputTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    hitRate: z.ZodNullable<z.ZodNumber>;
    generationDurationMs: z.ZodNullable<z.ZodNumber>;
    tokensPerSecond: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
export declare const sessionDebugNetworkEntrySchema: z.ZodObject<{
    eventKey: z.ZodString;
    traceId: z.ZodString;
    recordedAt: z.ZodNumber;
    statusType: z.ZodEnum<{
        model_request_started: "model_request_started";
        model_request_completed: "model_request_completed";
        model_request_failed: "model_request_failed";
        model_retry_scheduled: "model_retry_scheduled";
        model_stream_stalled: "model_stream_stalled";
    }>;
    requestId: z.ZodOptional<z.ZodString>;
    providerId: z.ZodOptional<z.ZodString>;
    modelId: z.ZodOptional<z.ZodString>;
    providerKind: z.ZodOptional<z.ZodString>;
    transport: z.ZodOptional<z.ZodString>;
    baseURL: z.ZodOptional<z.ZodString>;
    querySource: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    attempt: z.ZodOptional<z.ZodNumber>;
    maxAttempts: z.ZodOptional<z.ZodNumber>;
    nextAttempt: z.ZodOptional<z.ZodNumber>;
    retryable: z.ZodOptional<z.ZodBoolean>;
    statusCode: z.ZodOptional<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayMs: z.ZodOptional<z.ZodNumber>;
    idleMs: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    requestHeaders: z.ZodRecord<z.ZodString, z.ZodString>;
    responseHeaders: z.ZodRecord<z.ZodString, z.ZodString>;
    requestHeaderCount: z.ZodNumber;
    responseHeaderCount: z.ZodNumber;
}, z.core.$strict>;
export declare const sessionDebugSnapshotSchema: z.ZodObject<{
    sessionId: z.ZodString;
    rounds: z.ZodArray<z.ZodObject<{
        eventKey: z.ZodString;
        requestId: z.ZodString;
        requestIndex: z.ZodNumber;
        recordedAt: z.ZodNumber;
        usage: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNumber>;
            outputTokens: z.ZodOptional<z.ZodNumber>;
            totalTokens: z.ZodOptional<z.ZodNumber>;
            reasoningTokens: z.ZodOptional<z.ZodNumber>;
            cachedInputTokens: z.ZodOptional<z.ZodNumber>;
            cachedWriteInputTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        hitRate: z.ZodNullable<z.ZodNumber>;
        generationDurationMs: z.ZodNullable<z.ZodNumber>;
        tokensPerSecond: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strict>>;
    networkEntries: z.ZodArray<z.ZodObject<{
        eventKey: z.ZodString;
        traceId: z.ZodString;
        recordedAt: z.ZodNumber;
        statusType: z.ZodEnum<{
            model_request_started: "model_request_started";
            model_request_completed: "model_request_completed";
            model_request_failed: "model_request_failed";
            model_retry_scheduled: "model_retry_scheduled";
            model_stream_stalled: "model_stream_stalled";
        }>;
        requestId: z.ZodOptional<z.ZodString>;
        providerId: z.ZodOptional<z.ZodString>;
        modelId: z.ZodOptional<z.ZodString>;
        providerKind: z.ZodOptional<z.ZodString>;
        transport: z.ZodOptional<z.ZodString>;
        baseURL: z.ZodOptional<z.ZodString>;
        querySource: z.ZodOptional<z.ZodString>;
        queryId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodOptional<z.ZodString>;
        attempt: z.ZodOptional<z.ZodNumber>;
        maxAttempts: z.ZodOptional<z.ZodNumber>;
        nextAttempt: z.ZodOptional<z.ZodNumber>;
        retryable: z.ZodOptional<z.ZodBoolean>;
        statusCode: z.ZodOptional<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayMs: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        reason: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        requestHeaders: z.ZodRecord<z.ZodString, z.ZodString>;
        responseHeaders: z.ZodRecord<z.ZodString, z.ZodString>;
        requestHeaderCount: z.ZodNumber;
        responseHeaderCount: z.ZodNumber;
    }, z.core.$strict>>;
    cache: z.ZodNullable<z.ZodObject<{
        hitRateRequestCount: z.ZodNumber;
        totalInputTokens: z.ZodNumber;
        totalCacheReadTokens: z.ZodNumber;
        hitRate: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type SessionDebugSnapshot = z.infer<typeof sessionDebugSnapshotSchema>;
export type SessionDebugNetworkEntry = z.infer<typeof sessionDebugNetworkEntrySchema>;
/** 输出 token 与首输出到请求结束的同源时间；未知值不能用请求总耗时替代。 */
export declare function calculateOutputTps(outputTokens: number | undefined, generationDurationMs: number | null): number | null;
//# sourceMappingURL=session-debug.d.ts.map