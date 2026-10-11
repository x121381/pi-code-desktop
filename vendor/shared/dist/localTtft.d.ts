import { z } from "zod";
export declare const LOCAL_TTFT_STAGES: readonly ["renderer_prepare", "command_admission", "execution_wait", "request_prepare", "model_request", "output_return"];
export declare const LOCAL_TTFT_BUCKETS_MS: number[];
export declare const LOCAL_TTFT_MAX_DETAILS = 64;
export declare const LOCAL_TTFT_PREPARATION_STAGES: readonly ["context", "hooks", "persistence", "compaction", "mcp", "tools", "request_assembly"];
export declare const localTtftDetailSchema: z.ZodObject<{
    id: z.ZodString;
    stage: z.ZodEnum<{
        tools: "tools";
        attempt: "attempt";
        compaction: "compaction";
        context: "context";
        hooks: "hooks";
        mcp: "mcp";
        persistence: "persistence";
        request_assembly: "request_assembly";
        retry_wait: "retry_wait";
        user_confirmation: "user_confirmation";
    }>;
    start: z.ZodNumber;
    end: z.ZodOptional<z.ZodNumber>;
    outcome: z.ZodOptional<z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        cancelled: "cancelled";
        first_output: "first_output";
    }>>;
    requestId: z.ZodOptional<z.ZodString>;
    logicalCallId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        response: "response";
        preparation: "preparation";
    }>>;
    source: z.ZodEnum<{
        renderer: "renderer";
        cli: "cli";
    }>;
}, z.core.$strict>;
export type LocalTtftDetail = z.infer<typeof localTtftDetailSchema>;
export declare const LOCAL_TTFT_MAX_PENDING = 128;
export declare const LOCAL_TTFT_TTL_MS = 300000;
export declare const LOCAL_TTFT_CLOCK_MAX_ERROR_MS = 10;
export declare const LOCAL_TTFT_CLOCK_TTL_MS = 60000;
export declare const localTtftContextSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    observationId: z.ZodString;
}, z.core.$strict>;
export type LocalTtftContext = z.infer<typeof localTtftContextSchema>;
export declare const localTtftClockSchema: z.ZodObject<{
    instanceId: z.ZodString;
    receivedAt: z.ZodNumber;
    sentAt: z.ZodNumber;
}, z.core.$strict>;
export type LocalTtftClock = z.infer<typeof localTtftClockSchema>;
export interface LocalTtftCalibration {
    instanceId: string;
    offsetMs: number;
    errorMs: number;
    measuredAt: number;
}
export declare function calibrateLocalTtftClock(start: number, end: number, clock: LocalTtftClock): LocalTtftCalibration | undefined;
export declare const localTtftOutputKindSchema: z.ZodEnum<{
    text: "text";
    reasoning: "reasoning";
    tool: "tool";
}>;
export type LocalTtftOutputKind = z.infer<typeof localTtftOutputKindSchema>;
export declare const localTtftFactsSchema: z.ZodObject<{
    instanceId: z.ZodString;
    commandId: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    turnId: z.ZodOptional<z.ZodString>;
    productTurnId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    logicalCallId: z.ZodOptional<z.ZodString>;
    cliVersion: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        stage: z.ZodEnum<{
            tools: "tools";
            attempt: "attempt";
            compaction: "compaction";
            context: "context";
            hooks: "hooks";
            mcp: "mcp";
            persistence: "persistence";
            request_assembly: "request_assembly";
            retry_wait: "retry_wait";
            user_confirmation: "user_confirmation";
        }>;
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
        outcome: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
            first_output: "first_output";
        }>>;
        requestId: z.ZodOptional<z.ZodString>;
        logicalCallId: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<{
            response: "response";
            preparation: "preparation";
        }>>;
        source: z.ZodEnum<{
            renderer: "renderer";
            cli: "cli";
        }>;
    }, z.core.$strict>>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    revision: z.ZodOptional<z.ZodNumber>;
    sendMode: z.ZodOptional<z.ZodEnum<{
        queued: "queued";
        idle: "idle";
        guided: "guided";
    }>>;
    clockInvalid: z.ZodOptional<z.ZodBoolean>;
    receivedAt: z.ZodNumber;
    admittedAt: z.ZodOptional<z.ZodNumber>;
    executionAt: z.ZodOptional<z.ZodNumber>;
    requestAt: z.ZodOptional<z.ZodNumber>;
    outputAt: z.ZodOptional<z.ZodNumber>;
    outputKind: z.ZodOptional<z.ZodEnum<{
        text: "text";
        reasoning: "reasoning";
        tool: "tool";
    }>>;
    terminal: z.ZodOptional<z.ZodEnum<{
        interrupted: "interrupted";
        completed: "completed";
        failed: "failed";
        cancelled: "cancelled";
        rejected: "rejected";
    }>>;
    excluded: z.ZodOptional<z.ZodEnum<{
        failed: "failed";
        retry: "retry";
        unsupported: "unsupported";
        busy: "busy";
        capacity: "capacity";
    }>>;
    version: z.ZodLiteral<1>;
    observationId: z.ZodString;
}, z.core.$strict>;
export type LocalTtftFacts = z.infer<typeof localTtftFactsSchema>;
export declare const localTtftIntervalSchema: z.ZodObject<{
    stage: z.ZodEnum<{
        renderer_prepare: "renderer_prepare";
        command_admission: "command_admission";
        execution_wait: "execution_wait";
        request_prepare: "request_prepare";
        model_request: "model_request";
        output_return: "output_return";
    }>;
    start: z.ZodNumber;
    end: z.ZodNumber;
    source: z.ZodEnum<{
        renderer: "renderer";
        cli: "cli";
        aligned: "aligned";
    }>;
}, z.core.$strict>;
export declare const localTtftRecordSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    observationId: z.ZodString;
    commandId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    turnId: z.ZodOptional<z.ZodString>;
    productTurnId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    logicalCallId: z.ZodOptional<z.ZodString>;
    cliVersion: z.ZodOptional<z.ZodString>;
    cliInstanceId: z.ZodOptional<z.ZodString>;
    kind: z.ZodEnum<{
        start: "start";
        checkpoint: "checkpoint";
        first_output: "first_output";
        excluded: "excluded";
        first_text: "first_text";
        no_text: "no_text";
    }>;
    outcome: z.ZodEnum<{
        interrupted: "interrupted";
        failed: "failed";
        success: "success";
        cancelled: "cancelled";
        retry: "retry";
        expired: "expired";
        rejected: "rejected";
        background: "background";
        guided: "guided";
        unsupported: "unsupported";
        busy: "busy";
        capacity: "capacity";
        recovery: "recovery";
        resync: "resync";
        clock_invalid: "clock_invalid";
        unclosed: "unclosed";
    }>;
    start: z.ZodNumber;
    end: z.ZodNumber;
    firstOutputKind: z.ZodOptional<z.ZodEnum<{
        text: "text";
        reasoning: "reasoning";
        tool: "tool";
    }>>;
    quality: z.ZodEnum<{
        complete: "complete";
        clock_invalid: "clock_invalid";
        missing: "missing";
    }>;
    clockErrorMs: z.ZodOptional<z.ZodNumber>;
    intervals: z.ZodArray<z.ZodObject<{
        stage: z.ZodEnum<{
            renderer_prepare: "renderer_prepare";
            command_admission: "command_admission";
            execution_wait: "execution_wait";
            request_prepare: "request_prepare";
            model_request: "model_request";
            output_return: "output_return";
        }>;
        start: z.ZodNumber;
        end: z.ZodNumber;
        source: z.ZodEnum<{
            renderer: "renderer";
            cli: "cli";
            aligned: "aligned";
        }>;
    }, z.core.$strict>>;
    checkpointId: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        stage: z.ZodEnum<{
            tools: "tools";
            attempt: "attempt";
            compaction: "compaction";
            context: "context";
            hooks: "hooks";
            mcp: "mcp";
            persistence: "persistence";
            request_assembly: "request_assembly";
            retry_wait: "retry_wait";
            user_confirmation: "user_confirmation";
        }>;
        start: z.ZodNumber;
        end: z.ZodOptional<z.ZodNumber>;
        outcome: z.ZodOptional<z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
            first_output: "first_output";
        }>>;
        requestId: z.ZodOptional<z.ZodString>;
        logicalCallId: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<{
            response: "response";
            preparation: "preparation";
        }>>;
        source: z.ZodEnum<{
            renderer: "renderer";
            cli: "cli";
        }>;
    }, z.core.$strict>>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    sendMode: z.ZodOptional<z.ZodEnum<{
        queued: "queued";
        idle: "idle";
        guided: "guided";
    }>>;
    visibility: z.ZodOptional<z.ZodEnum<{
        background: "background";
        foreground: "foreground";
        background_returned: "background_returned";
    }>>;
    visibilityChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        at: z.ZodNumber;
        foreground: z.ZodBoolean;
    }, z.core.$strict>>>;
    userWaitMs: z.ZodOptional<z.ZodNumber>;
    executionMs: z.ZodOptional<z.ZodNumber>;
    timingReliable: z.ZodOptional<z.ZodBoolean>;
    cliTimingReliable: z.ZodOptional<z.ZodBoolean>;
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type LocalTtftRecord = z.infer<typeof localTtftRecordSchema>;
export declare const localTtftBatchSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    rendererInstanceId: z.ZodString;
    sequence: z.ZodNumber;
    records: z.ZodArray<z.ZodObject<{
        version: z.ZodLiteral<1>;
        observationId: z.ZodString;
        commandId: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        turnId: z.ZodOptional<z.ZodString>;
        productTurnId: z.ZodOptional<z.ZodString>;
        queryId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodOptional<z.ZodString>;
        logicalCallId: z.ZodOptional<z.ZodString>;
        cliVersion: z.ZodOptional<z.ZodString>;
        cliInstanceId: z.ZodOptional<z.ZodString>;
        kind: z.ZodEnum<{
            start: "start";
            checkpoint: "checkpoint";
            first_output: "first_output";
            excluded: "excluded";
            first_text: "first_text";
            no_text: "no_text";
        }>;
        outcome: z.ZodEnum<{
            interrupted: "interrupted";
            failed: "failed";
            success: "success";
            cancelled: "cancelled";
            retry: "retry";
            expired: "expired";
            rejected: "rejected";
            background: "background";
            guided: "guided";
            unsupported: "unsupported";
            busy: "busy";
            capacity: "capacity";
            recovery: "recovery";
            resync: "resync";
            clock_invalid: "clock_invalid";
            unclosed: "unclosed";
        }>;
        start: z.ZodNumber;
        end: z.ZodNumber;
        firstOutputKind: z.ZodOptional<z.ZodEnum<{
            text: "text";
            reasoning: "reasoning";
            tool: "tool";
        }>>;
        quality: z.ZodEnum<{
            complete: "complete";
            clock_invalid: "clock_invalid";
            missing: "missing";
        }>;
        clockErrorMs: z.ZodOptional<z.ZodNumber>;
        intervals: z.ZodArray<z.ZodObject<{
            stage: z.ZodEnum<{
                renderer_prepare: "renderer_prepare";
                command_admission: "command_admission";
                execution_wait: "execution_wait";
                request_prepare: "request_prepare";
                model_request: "model_request";
                output_return: "output_return";
            }>;
            start: z.ZodNumber;
            end: z.ZodNumber;
            source: z.ZodEnum<{
                renderer: "renderer";
                cli: "cli";
                aligned: "aligned";
            }>;
        }, z.core.$strict>>;
        checkpointId: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            stage: z.ZodEnum<{
                tools: "tools";
                attempt: "attempt";
                compaction: "compaction";
                context: "context";
                hooks: "hooks";
                mcp: "mcp";
                persistence: "persistence";
                request_assembly: "request_assembly";
                retry_wait: "retry_wait";
                user_confirmation: "user_confirmation";
            }>;
            start: z.ZodNumber;
            end: z.ZodOptional<z.ZodNumber>;
            outcome: z.ZodOptional<z.ZodEnum<{
                completed: "completed";
                failed: "failed";
                cancelled: "cancelled";
                first_output: "first_output";
            }>>;
            requestId: z.ZodOptional<z.ZodString>;
            logicalCallId: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodEnum<{
                response: "response";
                preparation: "preparation";
            }>>;
            source: z.ZodEnum<{
                renderer: "renderer";
                cli: "cli";
            }>;
        }, z.core.$strict>>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
        sendMode: z.ZodOptional<z.ZodEnum<{
            queued: "queued";
            idle: "idle";
            guided: "guided";
        }>>;
        visibility: z.ZodOptional<z.ZodEnum<{
            background: "background";
            foreground: "foreground";
            background_returned: "background_returned";
        }>>;
        visibilityChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            at: z.ZodNumber;
            foreground: z.ZodBoolean;
        }, z.core.$strict>>>;
        userWaitMs: z.ZodOptional<z.ZodNumber>;
        executionMs: z.ZodOptional<z.ZodNumber>;
        timingReliable: z.ZodOptional<z.ZodBoolean>;
        cliTimingReliable: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    dropped: z.ZodNumber;
}, z.core.$strict>;
export type LocalTtftBatch = z.infer<typeof localTtftBatchSchema>;
export declare function localTtftNow(): number;
//# sourceMappingURL=localTtft.d.ts.map