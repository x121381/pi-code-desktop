export { channelReplyRequestSchema, channelReplyResultSchema } from "../channel-mention.js";
export { zcodeProtocolTraceSchema, type ZCodeProtocolTrace } from "./trace.js";
export { conversationQuoteSchema, conversationQuotesSchema } from "../conversationSelection.js";
import { z } from "zod";
export * from "../background-bash-output.js";
export * from "../process-diagnostic.js";
export { attachmentSourceKindSchema, type AttachmentSourceKind } from "../attachment-source.js";
export declare const zcodeTopicResourceReadParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    taskId: z.ZodString;
    inputId: z.ZodString;
    authorizationId: z.ZodString;
    messageId: z.ZodString;
    resourceIndex: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeTopicResourceReadResultSchema: z.ZodObject<{
    ref: z.ZodString;
    fileName: z.ZodString;
    mime: z.ZodString;
    bytes: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeTopicResourceCancelParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    taskId: z.ZodString;
}, z.core.$strict>;
export declare const zcodeTopicResourceCancelResultSchema: z.ZodObject<{
    cancelled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeTopicResourceReadParams = z.infer<typeof zcodeTopicResourceReadParamsSchema>;
export type ZCodeTopicResourceReadResult = z.infer<typeof zcodeTopicResourceReadResultSchema>;
export { activeWorkSummarySchema, type ActiveWorkSummary } from "../zcode-protocol-v4/snapshot.js";
import { zcodeDeliveryKindSchema, zcodeSessionApiRetryStatusSchema, zcodeSessionContextUsageSchema, zcodeSessionGoalSchema, zcodeSessionGoalVerificationSchema, zcodeSessionGoalVerificationTimelineSchema, zcodeSessionKindSchema, zcodeSessionModeSchema, zcodeToolStateSchema, zcodeWorkspaceRefSchema } from "../zcode-protocol-legacy-types.js";
export * from "../localTtft.js";
export { hookExecutionProjectionSchema, hookInvocationRowSchema, type HookExecutionProjection, type HookInvocationRow, } from "../zcode-protocol-v4/rows.js";
export declare const ZCODE_PROTOCOL_NAME: "ZCode Protocol";
export declare const ZCODE_PROTOCOL_VERSION: 1;
export declare const ZCODE_PROTOCOL_V4_WIRE_VERSION: 3;
export declare const zcodeRuntimeCapabilitiesSchema: z.ZodObject<{
    independentPlanState: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const zcodeProtocolErrorCodes: {
    readonly sessionUnavailable: -32004;
};
export declare const zcodeNodeReplImageToolResultDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"node_repl_images">;
    images: z.ZodArray<z.ZodObject<{
        base64: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodLiteral<"browser_turn_end">>;
}, z.core.$strict>;
export declare const zcodeCreateWorkflowToolResultDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"create_workflow">;
    ok: z.ZodBoolean;
    errorCount: z.ZodNumber;
    diagnostics: z.ZodArray<z.ZodObject<{
        line: z.ZodNumber;
        column: z.ZodNumber;
        code: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strict>>;
    causalityGraph: z.ZodOptional<z.ZodObject<{
        steps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                ask: "ask";
                "world-read": "world-read";
                hole: "hole";
            }>;
            label: z.ZodString;
            labelPattern: z.ZodOptional<z.ZodObject<{
                head: z.ZodOptional<z.ZodString>;
                tail: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            line: z.ZodOptional<z.ZodNumber>;
            column: z.ZodOptional<z.ZodNumber>;
            lane: z.ZodString;
            lanes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            source: z.ZodOptional<z.ZodString>;
            phase: z.ZodOptional<z.ZodString>;
            repeat: z.ZodOptional<z.ZodEnum<{
                stack: "stack";
                serial: "serial";
            }>>;
            fill: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        lanes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            namePattern: z.ZodOptional<z.ZodObject<{
                head: z.ZodOptional<z.ZodString>;
                tail: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            line: z.ZodOptional<z.ZodNumber>;
            column: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        participants: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            phase: z.ZodString;
            lane: z.ZodString;
            steps: z.ZodArray<z.ZodString>;
            member: z.ZodOptional<z.ZodObject<{
                index: z.ZodNumber;
                of: z.ZodNumber;
            }, z.core.$strict>>;
            many: z.ZodOptional<z.ZodLiteral<true>>;
        }, z.core.$strict>>;
        handoffs: z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            back: z.ZodOptional<z.ZodLiteral<true>>;
            types: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodNumber>;
            column: z.ZodOptional<z.ZodNumber>;
            alongside: z.ZodOptional<z.ZodArray<z.ZodString>>;
            fill: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
        phaseEdges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            back: z.ZodOptional<z.ZodLiteral<true>>;
        }, z.core.$strict>>>;
        phaseStreams: z.ZodOptional<z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
        }, z.core.$strict>>>;
        holes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            siteId: z.ZodString;
            name: z.ZodString;
            type: z.ZodString;
            phase: z.ZodOptional<z.ZodString>;
            tail: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>>;
        exits: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sink: z.ZodOptional<z.ZodArray<z.ZodString>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
    fill: z.ZodOptional<z.ZodObject<{
        siteId: z.ZodString;
        name: z.ZodString;
        draftPath: z.ZodOptional<z.ZodString>;
        line: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeProtocolRequestIdSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
export type ZCodeProtocolRequestId = z.infer<typeof zcodeProtocolRequestIdSchema>;
export declare const TOPIC_RESOURCE_RELAY_CHUNK_BYTES: number;
export declare const TOPIC_RESOURCE_RELAY_CHANNEL = "host-topic-resource";
export declare const zcodeTopicResourceRelayRequestSchema: z.ZodObject<{
    requestId: z.ZodString;
    taskId: z.ZodString;
    inputId: z.ZodString;
    authorizationId: z.ZodString;
    messageId: z.ZodString;
    resourceIndex: z.ZodNumber;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodString;
    remoteSessionId: z.ZodString;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeTopicResourceRelayRequest = z.infer<typeof zcodeTopicResourceRelayRequestSchema>;
export declare const zcodeTopicResourceRelayKeySchema: z.ZodObject<{
    requestId: z.ZodString;
    taskId: z.ZodString;
}, z.core.$strict>;
export declare const zcodeTopicResourceRelayChunkRequestSchema: z.ZodObject<{
    requestId: z.ZodString;
    taskId: z.ZodString;
    index: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeTopicResourceRelayMetadataSchema: z.ZodObject<{
    fileName: z.ZodString;
    mime: z.ZodString;
    bytes: z.ZodNumber;
    totalChunks: z.ZodNumber;
    checksum: z.ZodString;
}, z.core.$strict>;
export declare const zcodeTopicResourceRelayChunkSchema: z.ZodObject<{
    dataBase64: z.ZodString;
}, z.core.$strict>;
export declare const zcodeProtocolRequestSchema: z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodUnknown>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeProtocolRequest = z.infer<typeof zcodeProtocolRequestSchema>;
export declare const zcodeProtocolNotificationSchema: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodUnknown>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeProtocolNotification = z.infer<typeof zcodeProtocolNotificationSchema>;
export declare const zcodeProtocolResponseSchema: z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    result: z.ZodUnknown;
}, z.core.$strict>;
export type ZCodeProtocolResponse = z.infer<typeof zcodeProtocolResponseSchema>;
export declare const zcodeProtocolErrorSchema: z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    error: z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeProtocolError = z.infer<typeof zcodeProtocolErrorSchema>;
export declare const zcodeProtocolMessageSchema: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodUnknown>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodUnknown>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
        traceparent: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    result: z.ZodUnknown;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    error: z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>;
}, z.core.$strict>]>;
export type ZCodeProtocolMessage = z.infer<typeof zcodeProtocolMessageSchema>;
export declare const zcodeProtocolNotifications: {
    readonly storageStartup: "startup/storageState";
    readonly providerRuntimeHeadersCancelled: "interaction/providerRuntimeHeadersCancelled";
    readonly mcpTelemetry: "process/mcpTelemetry";
    readonly mcpResourceSamples: "process/mcpResourceSamples";
    readonly toolExecResource: "process/toolExecResource";
    readonly pluginOperationProgress: "plugins/operationProgress";
    readonly processResourceSample: "process/resourceSample";
    readonly processNetworkRequests: "process/networkRequests";
};
/** 启动控制面独立于 task stream；数据库身份不可携带路径/凭据。 */
export declare const zcodeStorageStartupStateSchema: z.ZodObject<{
    sqliteCode: z.ZodOptional<z.ZodNumber>;
    systemCode: z.ZodOptional<z.ZodString>;
    migrationId: z.ZodOptional<z.ZodString>;
    schemaVersion: z.ZodLiteral<1>;
    attemptId: z.ZodString;
    sequence: z.ZodNumber;
    databaseId: z.ZodString;
    databaseKind: z.ZodEnum<{
        session: "session";
        "tasks-index": "tasks-index";
    }>;
    phase: z.ZodEnum<{
        failed: "failed";
        ready: "ready";
        checking: "checking";
        waiting_for_lock: "waiting_for_lock";
        migrating: "migrating";
        committing: "committing";
    }>;
    migration: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<{
            none: "none";
            initialize: "initialize";
            upgrade: "upgrade";
        }>;
        executedCount: z.ZodNumber;
        committedCount: z.ZodNumber;
        lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    elapsedMs: z.ZodNumber;
    completed: z.ZodOptional<z.ZodNumber>;
    total: z.ZodOptional<z.ZodNumber>;
    errorCode: z.ZodOptional<z.ZodEnum<{
        storage_full: "storage_full";
        permission_denied: "permission_denied";
        io_error: "io_error";
        out_of_memory: "out_of_memory";
        corrupt: "corrupt";
        open_failed: "open_failed";
        lock_timeout: "lock_timeout";
        checksum_mismatch: "checksum_mismatch";
        sql_failed: "sql_failed";
        startup_status_timeout: "startup_status_timeout";
        transport_closed: "transport_closed";
        unsupported_runtime: "unsupported_runtime";
    }>>;
}, z.core.$strict>;
export type ZCodeStorageStartupState = z.infer<typeof zcodeStorageStartupStateSchema>;
export declare const zcodeMcpTelemetryEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    occurredAt: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    mcpId: z.ZodString;
    mcpInstanceId: z.ZodString;
    mcpIsolation: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>;
    mcpSource: z.ZodEnum<{
        custom: "custom";
        plugin: "plugin";
        builtin: "builtin";
    }>;
    kind: z.ZodLiteral<"process_start">;
}, z.core.$strict>, z.ZodObject<{
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    occurredAt: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    affectedSessionCount: z.ZodNumber;
    exitCode: z.ZodNullable<z.ZodNumber>;
    signal: z.ZodNullable<z.ZodString>;
    uptimeMs: z.ZodNumber;
    mcpId: z.ZodString;
    mcpInstanceId: z.ZodString;
    mcpIsolation: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>;
    mcpSource: z.ZodEnum<{
        custom: "custom";
        plugin: "plugin";
        builtin: "builtin";
    }>;
    kind: z.ZodLiteral<"process_crash">;
}, z.core.$strict>, z.ZodObject<{
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    occurredAt: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    kind: z.ZodLiteral<"session_startup">;
    configuredCount: z.ZodNumber;
    connectedCount: z.ZodNumber;
    failedCount: z.ZodNumber;
    processCount: z.ZodNumber;
    sessionId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    occurredAt: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    memoryKb: z.ZodNumber;
    memoryScope: z.ZodEnum<{
        process_tree: "process_tree";
        direct_process: "direct_process";
    }>;
    orphanSuspected: z.ZodBoolean;
    ownerSessionCount: z.ZodNumber;
    unownedSeconds: z.ZodNumber;
    mcpId: z.ZodString;
    mcpInstanceId: z.ZodString;
    mcpIsolation: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>;
    mcpSource: z.ZodEnum<{
        custom: "custom";
        plugin: "plugin";
        builtin: "builtin";
    }>;
    kind: z.ZodLiteral<"memory">;
}, z.core.$strict>], "kind">;
export type ZCodeMcpTelemetryEvent = z.infer<typeof zcodeMcpTelemetryEventSchema>;
/** MCP 每五分钟只探测一次，周期由生产者与设备总量过期判据共用。 */
export declare const ZCODE_MCP_RESOURCE_SAMPLE_INTERVAL_MS: number;
export declare const zcodeMcpResourceSampleSchema: z.ZodObject<{
    mcpId: z.ZodString;
    instanceToken: z.ZodString;
    sampledAt: z.ZodNumber;
    intervalMs: z.ZodNumber;
    processCount: z.ZodNumber;
    rssKbTotal: z.ZodNumber;
    rssKbMaxProcess: z.ZodNumber;
    cpuTimeMsDelta: z.ZodNumber;
    uptimeMinutes: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    logicalCpuCount: z.ZodNumber;
    totalMemoryGb: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeMcpResourceSample = z.infer<typeof zcodeMcpResourceSampleSchema>;
export declare const zcodeMcpResourceSamplesSchema: z.ZodArray<z.ZodObject<{
    mcpId: z.ZodString;
    instanceToken: z.ZodString;
    sampledAt: z.ZodNumber;
    intervalMs: z.ZodNumber;
    processCount: z.ZodNumber;
    rssKbTotal: z.ZodNumber;
    rssKbMaxProcess: z.ZodNumber;
    cpuTimeMsDelta: z.ZodNumber;
    uptimeMinutes: z.ZodNumber;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    logicalCpuCount: z.ZodNumber;
    totalMemoryGb: z.ZodNumber;
}, z.core.$strict>>;
export declare const BASH_RESOURCE_SAMPLE_INTERVAL_MS = 15000;
export declare const BASH_RESOURCE_MAX_SAMPLES = 20;
/** Bash 子进程的有界完成事实；禁止命令、路径与会话标识进入遥测旁路。 */
export declare const zcodeToolExecResourceSchema: z.ZodObject<{
    completionToken: z.ZodOptional<z.ZodString>;
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    toolName: z.ZodLiteral<"bash">;
    durationMs: z.ZodNumber;
    exitKind: z.ZodEnum<{
        completed: "completed";
        killed: "killed";
        error: "error";
        timeout: "timeout";
    }>;
    treeRssKbPeak: z.ZodOptional<z.ZodNumber>;
    treeCpuTimeMs: z.ZodOptional<z.ZodNumber>;
    sampleCount: z.ZodNumber;
    cliRssKb: z.ZodNumber;
    systemFreeMemoryKb: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeToolExecResource = z.infer<typeof zcodeToolExecResourceSchema>;
export declare const zcodeProcessResourceSampleSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        darwin: "darwin";
        aix: "aix";
        android: "android";
        freebsd: "freebsd";
        haiku: "haiku";
        linux: "linux";
        netbsd: "netbsd";
        openbsd: "openbsd";
        sunos: "sunos";
        win32: "win32";
        cygwin: "cygwin";
    }>;
    arch: z.ZodEnum<{
        arm: "arm";
        arm64: "arm64";
        ia32: "ia32";
        loong64: "loong64";
        mips: "mips";
        mipsel: "mipsel";
        ppc: "ppc";
        ppc64: "ppc64";
        riscv64: "riscv64";
        s390: "s390";
        s390x: "s390x";
        x64: "x64";
    }>;
    logicalCpuCount: z.ZodNumber;
    intervalMs: z.ZodNumber;
    cpuCores: z.ZodNumber;
    cpuPercent: z.ZodNumber;
    rssKb: z.ZodNumber;
    heapUsedKb: z.ZodOptional<z.ZodNumber>;
    uptimeMinutes: z.ZodOptional<z.ZodNumber>;
    totalMemoryGb: z.ZodOptional<z.ZodNumber>;
    instanceToken: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeProcessResourceSample = z.infer<typeof zcodeProcessResourceSampleSchema>;
export declare const zcodeProcessChildProcessesParamsSchema: z.ZodObject<{}, z.core.$strict>;
export declare const zcodeProcessChildProcessSchema: z.ZodObject<{
    pid: z.ZodNumber;
    serverName: z.ZodString;
    mcpSource: z.ZodEnum<{
        custom: "custom";
        plugin: "plugin";
        builtin: "builtin";
    }>;
    pluginName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeProcessChildProcessesResultSchema: z.ZodObject<{
    processes: z.ZodArray<z.ZodObject<{
        pid: z.ZodNumber;
        serverName: z.ZodString;
        mcpSource: z.ZodEnum<{
            custom: "custom";
            plugin: "plugin";
            builtin: "builtin";
        }>;
        pluginName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeProcessChildProcess = z.infer<typeof zcodeProcessChildProcessSchema>;
export type ZCodeProcessChildProcessesResult = z.infer<typeof zcodeProcessChildProcessesResultSchema>;
export type ZCodeDeliveryKind = z.infer<typeof zcodeDeliveryKindSchema>;
export declare const zcodeSessionPersistenceSchema: z.ZodEnum<{
    immediate: "immediate";
    deferred: "deferred";
}>;
export type ZCodeSessionPersistence = z.infer<typeof zcodeSessionPersistenceSchema>;
export type ZCodeWorkspaceRef = z.infer<typeof zcodeWorkspaceRefSchema>;
export declare const zcodePermissionOptionSchema: z.ZodObject<{
    optionId: z.ZodString;
    kind: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    response: z.ZodObject<{
        decision: z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            escalate: "escalate";
            modify: "modify";
        }>;
        reason: z.ZodOptional<z.ZodString>;
        modifiedInput: z.ZodOptional<z.ZodUnknown>;
        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<"addRules">;
            behavior: z.ZodEnum<{
                ask: "ask";
                allow: "allow";
                deny: "deny";
            }>;
            rules: z.ZodArray<z.ZodObject<{
                toolName: z.ZodString;
                ruleContent: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const zcodeProtocolMcpServerSchema: z.ZodUnion<readonly [z.ZodObject<{
    name: z.ZodString;
    command: z.ZodString;
    args: z.ZodArray<z.ZodString>;
    env: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>;
    isolation: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>>;
    protocolVersion: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        legacy: "legacy";
        "2026-07-28": "2026-07-28";
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        http: "http";
        sse: "sse";
    }>;
    url: z.ZodString;
    headers: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>;
    oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"client_credentials">;
        clientId: z.ZodString;
        clientSecret: z.ZodString;
        clientName: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"authorization_code">;
        clientId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
        clientName: z.ZodOptional<z.ZodString>;
        redirectPath: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    isolation: z.ZodOptional<z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>>;
    protocolVersion: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        legacy: "legacy";
        "2026-07-28": "2026-07-28";
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>]>;
export type ZCodeProtocolMcpServer = z.infer<typeof zcodeProtocolMcpServerSchema>;
export declare const zcodeMcpServerStatusKindSchema: z.ZodEnum<{
    failed: "failed";
    disabled: "disabled";
    connected: "connected";
    connecting: "connecting";
    disconnected: "disconnected";
    untrusted: "untrusted";
}>;
export declare const MCP_SERVER_FAILURE_KINDS: readonly ["config_invalid", "runtime_unavailable", "process_start_failed", "network_unreachable", "connection_timeout", "protocol_negotiation_failed", "tool_list_failed", "unexpected_disconnect", "oauth_authorization_failed", "official_origin_untrusted", "not_authenticated", "coding_plan_required", "server_not_found", "server_unavailable", "rate_limited", "server_internal_error", "protocol_error", "status_unavailable", "connection_failed"];
export declare const mcpServerFailureKindSchema: z.ZodEnum<{
    coding_plan_required: "coding_plan_required";
    not_authenticated: "not_authenticated";
    config_invalid: "config_invalid";
    runtime_unavailable: "runtime_unavailable";
    process_start_failed: "process_start_failed";
    network_unreachable: "network_unreachable";
    connection_timeout: "connection_timeout";
    protocol_negotiation_failed: "protocol_negotiation_failed";
    tool_list_failed: "tool_list_failed";
    unexpected_disconnect: "unexpected_disconnect";
    oauth_authorization_failed: "oauth_authorization_failed";
    official_origin_untrusted: "official_origin_untrusted";
    server_not_found: "server_not_found";
    server_unavailable: "server_unavailable";
    rate_limited: "rate_limited";
    server_internal_error: "server_internal_error";
    protocol_error: "protocol_error";
    status_unavailable: "status_unavailable";
    connection_failed: "connection_failed";
}>;
export type McpServerFailureKind = z.infer<typeof mcpServerFailureKindSchema>;
export declare const zcodeMcpServerStatusSnapshotSchema: z.ZodObject<{
    status: z.ZodEnum<{
        failed: "failed";
        disabled: "disabled";
        connected: "connected";
        connecting: "connecting";
        disconnected: "disconnected";
        untrusted: "untrusted";
    }>;
    transport: z.ZodEnum<{
        http: "http";
        sse: "sse";
        stdio: "stdio";
    }>;
    toolCount: z.ZodNumber;
    updatedAt: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    failureKind: z.ZodOptional<z.ZodEnum<{
        coding_plan_required: "coding_plan_required";
        not_authenticated: "not_authenticated";
        config_invalid: "config_invalid";
        runtime_unavailable: "runtime_unavailable";
        process_start_failed: "process_start_failed";
        network_unreachable: "network_unreachable";
        connection_timeout: "connection_timeout";
        protocol_negotiation_failed: "protocol_negotiation_failed";
        tool_list_failed: "tool_list_failed";
        unexpected_disconnect: "unexpected_disconnect";
        oauth_authorization_failed: "oauth_authorization_failed";
        official_origin_untrusted: "official_origin_untrusted";
        server_not_found: "server_not_found";
        server_unavailable: "server_unavailable";
        rate_limited: "rate_limited";
        server_internal_error: "server_internal_error";
        protocol_error: "protocol_error";
        status_unavailable: "status_unavailable";
        connection_failed: "connection_failed";
    }>>;
    serverRequestId: z.ZodOptional<z.ZodString>;
    protocolEra: z.ZodOptional<z.ZodEnum<{
        legacy: "legacy";
        modern: "modern";
    }>>;
    authorization: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"oauth_authorization_code">;
        authorizationUrl: z.ZodString;
        startedAt: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeMcpServerStatusSnapshot = z.infer<typeof zcodeMcpServerStatusSnapshotSchema>;
export declare const zcodeMcpListModeSchema: z.ZodEnum<{
    status: "status";
    connect: "connect";
}>;
export type ZCodeMcpListMode = z.infer<typeof zcodeMcpListModeSchema>;
export declare const zcodeMcpListParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        name: z.ZodString;
        command: z.ZodString;
        args: z.ZodArray<z.ZodString>;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            http: "http";
            sse: "sse";
        }>;
        url: z.ZodString;
        headers: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<"client_credentials">;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
            clientName: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"authorization_code">;
            clientId: z.ZodOptional<z.ZodString>;
            clientSecret: z.ZodOptional<z.ZodString>;
            clientName: z.ZodOptional<z.ZodString>;
            redirectPath: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>>;
    mode: z.ZodDefault<z.ZodEnum<{
        status: "status";
        connect: "connect";
    }>>;
}, z.core.$strict>;
export declare const zcodeMcpListResultSchema: z.ZodObject<{
    statuses: z.ZodRecord<z.ZodString, z.ZodObject<{
        status: z.ZodEnum<{
            failed: "failed";
            disabled: "disabled";
            connected: "connected";
            connecting: "connecting";
            disconnected: "disconnected";
            untrusted: "untrusted";
        }>;
        transport: z.ZodEnum<{
            http: "http";
            sse: "sse";
            stdio: "stdio";
        }>;
        toolCount: z.ZodNumber;
        updatedAt: z.ZodString;
        error: z.ZodOptional<z.ZodString>;
        failureKind: z.ZodOptional<z.ZodEnum<{
            coding_plan_required: "coding_plan_required";
            not_authenticated: "not_authenticated";
            config_invalid: "config_invalid";
            runtime_unavailable: "runtime_unavailable";
            process_start_failed: "process_start_failed";
            network_unreachable: "network_unreachable";
            connection_timeout: "connection_timeout";
            protocol_negotiation_failed: "protocol_negotiation_failed";
            tool_list_failed: "tool_list_failed";
            unexpected_disconnect: "unexpected_disconnect";
            oauth_authorization_failed: "oauth_authorization_failed";
            official_origin_untrusted: "official_origin_untrusted";
            server_not_found: "server_not_found";
            server_unavailable: "server_unavailable";
            rate_limited: "rate_limited";
            server_internal_error: "server_internal_error";
            protocol_error: "protocol_error";
            status_unavailable: "status_unavailable";
            connection_failed: "connection_failed";
        }>>;
        serverRequestId: z.ZodOptional<z.ZodString>;
        protocolEra: z.ZodOptional<z.ZodEnum<{
            legacy: "legacy";
            modern: "modern";
        }>>;
        authorization: z.ZodOptional<z.ZodObject<{
            type: z.ZodLiteral<"oauth_authorization_code">;
            authorizationUrl: z.ZodString;
            startedAt: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeMcpListResult = z.infer<typeof zcodeMcpListResultSchema>;
export declare const zcodeMcpUiOpenInstanceParamsSchema: z.ZodObject<{
    accountContext: z.ZodOptional<z.ZodString>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
    scopeId: z.ZodString;
    resourceUri: z.ZodString;
    ownerWebContentsId: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeMcpUiOpenInstanceResultSchema: z.ZodObject<{
    runtimeId: z.ZodString;
    generation: z.ZodNumber;
    appIdentity: z.ZodString;
    token: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiOpenInstanceParams = z.infer<typeof zcodeMcpUiOpenInstanceParamsSchema>;
export declare const zcodeMcpUiCloseInstanceParamsSchema: z.ZodObject<{
    onlyIfIdle: z.ZodOptional<z.ZodBoolean>;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export declare const zcodeMcpUiCloseInstanceResultSchema: z.ZodObject<{
    closed: z.ZodBoolean;
}, z.core.$strict>;
export declare const zcodeMcpReadResourceParamsSchema: z.ZodObject<{
    uri: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpReadResourceParams = z.infer<typeof zcodeMcpReadResourceParamsSchema>;
export declare const zcodeMcpResourceContentSchema: z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    blob: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const zcodeMcpReadResourceResultSchema: z.ZodObject<{
    contents: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        blob: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeMcpReadResourceResult = z.infer<typeof zcodeMcpReadResourceResultSchema>;
/**
 * 插件页面发起的 `resources/read` 代理。
 * 与 `mcp/readResource`（宿主取 ui:// HTML）参数同形，但结果去掉 `_meta`、受 8 MiB 与 mimeType 白名单约束。
 */
export declare const zcodeMcpUiReadResourceParamsSchema: z.ZodObject<{
    uri: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiReadResourceParams = z.infer<typeof zcodeMcpUiReadResourceParamsSchema>;
export declare const zcodeMcpUiResourceContentSchema: z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    blob: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeMcpUiReadResourceResultSchema: z.ZodObject<{
    contents: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        blob: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeMcpUiReadResourceResult = z.infer<typeof zcodeMcpUiReadResourceResultSchema>;
export declare const zcodeMcpUiSamplingParamsSchema: z.ZodObject<{
    operationId: z.ZodString;
    request: z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                user: "user";
                assistant: "assistant";
            }>;
            content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                annotations: z.ZodOptional<z.ZodObject<{
                    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                        user: "user";
                        assistant: "assistant";
                    }>>>;
                    priority: z.ZodOptional<z.ZodNumber>;
                    lastModified: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                mimeType: z.ZodEnum<{
                    "image/png": "image/png";
                    "image/jpeg": "image/jpeg";
                    "image/webp": "image/webp";
                }>;
                data: z.ZodString;
                annotations: z.ZodOptional<z.ZodObject<{
                    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                        user: "user";
                        assistant: "assistant";
                    }>>>;
                    priority: z.ZodOptional<z.ZodNumber>;
                    lastModified: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                annotations: z.ZodOptional<z.ZodObject<{
                    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                        user: "user";
                        assistant: "assistant";
                    }>>>;
                    priority: z.ZodOptional<z.ZodNumber>;
                    lastModified: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
                mimeType: z.ZodEnum<{
                    "image/png": "image/png";
                    "image/jpeg": "image/jpeg";
                    "image/webp": "image/webp";
                }>;
                data: z.ZodString;
                annotations: z.ZodOptional<z.ZodObject<{
                    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                        user: "user";
                        assistant: "assistant";
                    }>>>;
                    priority: z.ZodOptional<z.ZodNumber>;
                    lastModified: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>], "type">>]>;
        }, z.core.$strict>>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        maxTokens: z.ZodNumber;
        includeContext: z.ZodOptional<z.ZodLiteral<"none">>;
        modelPreferences: z.ZodOptional<z.ZodObject<{
            hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            costPriority: z.ZodOptional<z.ZodNumber>;
            speedPriority: z.ZodOptional<z.ZodNumber>;
            intelligencePriority: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export declare const zcodeMcpUiCancelSamplingParamsSchema: z.ZodObject<{
    operationId: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export declare const zcodeMcpUiSamplingResultSchema: z.ZodObject<{
    role: z.ZodLiteral<"assistant">;
    model: z.ZodString;
    content: z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
    }, z.core.$strict>;
    stopReason: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiSamplingParams = z.infer<typeof zcodeMcpUiSamplingParamsSchema>;
export type ZCodeMcpUiCancelSamplingParams = z.infer<typeof zcodeMcpUiCancelSamplingParamsSchema>;
export declare const zcodeMcpUiCallToolParamsSchema: z.ZodObject<{
    toolName: z.ZodString;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    callId: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiCallToolParams = z.infer<typeof zcodeMcpUiCallToolParamsSchema>;
/** 取消页面发起的工具调用（卡片卸载、会话切换）；agent 侧 abort 到 MCP client。 */
export declare const zcodeMcpUiCancelCallParamsSchema: z.ZodObject<{
    callId: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiCancelCallParams = z.infer<typeof zcodeMcpUiCancelCallParamsSchema>;
export declare const zcodeMcpUiCancelCallResultSchema: z.ZodObject<{
    cancelled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeMcpUiCancelCallResult = z.infer<typeof zcodeMcpUiCancelCallResultSchema>;
/** 页面发起的 resources/list、resources/templates/list、subscribe、unsubscribe 代理。 */
export declare const zcodeMcpUiListResourcesParamsSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiListResourcesParams = z.infer<typeof zcodeMcpUiListResourcesParamsSchema>;
export declare const zcodeMcpUiListResourcesResultSchema: z.ZodObject<{
    resources: z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>;
    nextCursor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeMcpUiListResourcesResult = z.infer<typeof zcodeMcpUiListResourcesResultSchema>;
export declare const zcodeMcpUiListResourceTemplatesResultSchema: z.ZodObject<{
    resourceTemplates: z.ZodArray<z.ZodObject<{
        uriTemplate: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    nextCursor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeMcpUiListResourceTemplatesResult = z.infer<typeof zcodeMcpUiListResourceTemplatesResultSchema>;
/** 订阅者身份 = 会话 + 沙箱作用域 + 实例代际（initId）；dispose 只退订本代际，新实例不受影响。 */
export declare const zcodeMcpUiResourceSubscriptionParamsSchema: z.ZodObject<{
    scopeId: z.ZodString;
    generation: z.ZodNumber;
    uri: z.ZodString;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiResourceSubscriptionParams = z.infer<typeof zcodeMcpUiResourceSubscriptionParamsSchema>;
export declare const zcodeMcpUiResourceSubscriptionResultSchema: z.ZodObject<{}, z.core.$strict>;
export declare const zcodeMcpUiRegisterAppToolsParamsSchema: z.ZodObject<{
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        outputSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        annotations: z.ZodOptional<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            readOnlyHint: z.ZodOptional<z.ZodBoolean>;
            destructiveHint: z.ZodOptional<z.ZodBoolean>;
            idempotentHint: z.ZodOptional<z.ZodBoolean>;
            openWorldHint: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    scopeId: z.ZodString;
    generation: z.ZodNumber;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiRegisterAppToolsParams = z.infer<typeof zcodeMcpUiRegisterAppToolsParamsSchema>;
export declare const zcodeMcpUiRegisterAppToolsResultSchema: z.ZodObject<{
    tools: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        modelName: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeMcpUiRegisterAppToolsResult = z.infer<typeof zcodeMcpUiRegisterAppToolsResultSchema>;
export declare const zcodeMcpUiUnregisterAppToolsParamsSchema: z.ZodObject<{
    scopeId: z.ZodString;
    generation: z.ZodNumber;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiUnregisterAppToolsParams = z.infer<typeof zcodeMcpUiUnregisterAppToolsParamsSchema>;
export declare const zcodeMcpUiUnregisterAppToolsResultSchema: z.ZodObject<{
    removed: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeMcpUiUnregisterAppToolsResult = z.infer<typeof zcodeMcpUiUnregisterAppToolsResultSchema>;
export declare const zcodeMcpUiClaimAppToolCallParamsSchema: z.ZodObject<{
    callId: z.ZodString;
    scopeId: z.ZodString;
    generation: z.ZodNumber;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiClaimAppToolCallParams = z.infer<typeof zcodeMcpUiClaimAppToolCallParamsSchema>;
export declare const zcodeMcpUiAppToolAcceptedResultSchema: z.ZodObject<{
    accepted: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeMcpUiAppToolAcceptedResult = z.infer<typeof zcodeMcpUiAppToolAcceptedResultSchema>;
export declare const zcodeMcpUiResolveAppToolCallParamsSchema: z.ZodObject<{
    callId: z.ZodString;
    result: z.ZodOptional<z.ZodObject<{
        content: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        structuredContent: z.ZodOptional<z.ZodUnknown>;
        isError: z.ZodOptional<z.ZodBoolean>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        message: z.ZodString;
    }, z.core.$strict>>;
    scopeId: z.ZodString;
    generation: z.ZodNumber;
    instance: z.ZodObject<{
        runtimeId: z.ZodString;
        generation: z.ZodNumber;
        appIdentity: z.ZodString;
        token: z.ZodString;
    }, z.core.$strict>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodString;
    pluginId: z.ZodString;
    serverName: z.ZodString;
}, z.core.$strict>;
export type ZCodeMcpUiResolveAppToolCallParams = z.infer<typeof zcodeMcpUiResolveAppToolCallParamsSchema>;
export declare const zcodeMcpUiCallToolResultSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    structuredContent: z.ZodOptional<z.ZodUnknown>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export type ZCodeMcpUiCallToolResult = z.infer<typeof zcodeMcpUiCallToolResultSchema>;
export declare const zcodeSessionImportMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
    timestamp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionImportMessage = z.infer<typeof zcodeSessionImportMessageSchema>;
export declare const zcodeSessionImportHistorySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    source: z.ZodLiteral<"claudeCode">;
    title: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodNumber>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
        timestamp: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"sharedContext">;
    title: z.ZodString;
    createdAt: z.ZodOptional<z.ZodNumber>;
    markdown: z.ZodString;
    provenance: z.ZodObject<{
        shareId: z.ZodString;
        contextId: z.ZodOptional<z.ZodString>;
        shareUrl: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            reserved: "reserved";
            attached: "attached";
            discarded: "discarded";
        }>>;
        projectionSha256: z.ZodString;
        artifactSetSha256: z.ZodString;
        formatterVersion: z.ZodLiteral<1>;
        markdownSha256: z.ZodString;
        installedArtifacts: z.ZodArray<z.ZodObject<{
            artifactId: z.ZodString;
            workspaceRelativePath: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>], "source">;
export type ZCodeSessionImportHistory = z.infer<typeof zcodeSessionImportHistorySchema>;
export declare const zcodeThoughtLevelOptionSchema: z.ZodObject<{
    value: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeModelReasoningOptionsSchema: z.ZodObject<{
    levels: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    defaultLevel: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeModelReasoningOptions = z.infer<typeof zcodeModelReasoningOptionsSchema>;
export declare const zcodeModelFormatPropertiesSchema: z.ZodObject<{
    inputFormat: z.ZodObject<{
        supportsText: z.ZodBoolean;
        supportsImage: z.ZodBoolean;
        supportsVideo: z.ZodBoolean;
        supportsAudio: z.ZodBoolean;
        supportsPdf: z.ZodBoolean;
    }, z.core.$strict>;
    outputFormat: z.ZodObject<{
        supportsText: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeModelFormatProperties = z.infer<typeof zcodeModelFormatPropertiesSchema>;
export declare const zcodeModelOptionSchema: z.ZodObject<{
    ref: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    label: z.ZodString;
    providerLabel: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    contextWindow: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    reasoning: z.ZodOptional<z.ZodObject<{
        levels: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        defaultLevel: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    properties: z.ZodObject<{
        inputFormat: z.ZodObject<{
            supportsText: z.ZodBoolean;
            supportsImage: z.ZodBoolean;
            supportsVideo: z.ZodBoolean;
            supportsAudio: z.ZodBoolean;
            supportsPdf: z.ZodBoolean;
        }, z.core.$strict>;
        outputFormat: z.ZodObject<{
            supportsText: z.ZodBoolean;
        }, z.core.$strict>;
    }, z.core.$strict>;
    disabledReason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeModelOption = z.infer<typeof zcodeModelOptionSchema>;
export declare const zcodeAccountAccessSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    family: z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>;
    planKind: z.ZodLiteral<"start-plan">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    family: z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>;
    planKind: z.ZodLiteral<"individual-coding-plan">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    family: z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>;
    planKind: z.ZodLiteral<"team-coding-plan">;
    productId: z.ZodString;
    organizationId: z.ZodString;
    projectId: z.ZodString;
}, z.core.$strict>], "planKind">;
export type ZCodeAccountAccess = z.infer<typeof zcodeAccountAccessSchema>;
/** Active Model 固定的账号访问类别；当前商品和 Team scope 由账号服务在请求期解析。 */
export declare const zcodeProviderAccountAccessSchema: z.ZodObject<{
    type: z.ZodLiteral<"zhipu-account">;
    accountType: z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>;
    mode: z.ZodEnum<{
        "start-plan": "start-plan";
        "individual-coding-plan": "individual-coding-plan";
        "team-coding-plan": "team-coding-plan";
        highspeed: "highspeed";
        "off-peak": "off-peak";
    }>;
    entitled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeProviderAccountAccess = z.infer<typeof zcodeProviderAccountAccessSchema>;
export type ZCodeSessionMode = z.infer<typeof zcodeSessionModeSchema>;
export type ZCodeSessionKind = z.infer<typeof zcodeSessionKindSchema>;
export type ZCodeSessionGoal = z.infer<typeof zcodeSessionGoalSchema>;
export declare const zcodeSessionTodoItemSchema: z.ZodObject<{
    content: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        in_progress: "in_progress";
    }>;
    priority: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>;
}, z.core.$strict>;
export declare const zcodeSessionGoalStatsSchema: z.ZodObject<{
    timeUsedSeconds: z.ZodNumber;
    tokensUsed: z.ZodNumber;
    tokenBudget: z.ZodNullable<z.ZodNumber>;
    contextUsed: z.ZodNumber;
    contextWindow: z.ZodNumber;
    toolCallCount: z.ZodNumber;
    iterationCount: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeSessionGoalStats = z.infer<typeof zcodeSessionGoalStatsSchema>;
export type ZCodeSessionGoalVerification = z.infer<typeof zcodeSessionGoalVerificationSchema>;
export type ZCodeSessionGoalVerificationTimeline = z.infer<typeof zcodeSessionGoalVerificationTimelineSchema>;
export declare const zcodeSessionTodoGroupSchema: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodEnum<{
        session: "session";
        goal_iteration: "goal_iteration";
    }>;
    goalIteration: z.ZodOptional<z.ZodNumber>;
    targetId: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodNumber>;
    todos: z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            completed: "completed";
            in_progress: "in_progress";
        }>;
        priority: z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeSessionTodoGroup = z.infer<typeof zcodeSessionTodoGroupSchema>;
export declare const zcodeSessionSettingsStateSchema: z.ZodObject<{
    model: z.ZodObject<{
        current: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        available: z.ZodArray<z.ZodObject<{
            ref: z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            label: z.ZodString;
            providerLabel: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            contextWindow: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            reasoning: z.ZodOptional<z.ZodObject<{
                levels: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                defaultLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            properties: z.ZodObject<{
                inputFormat: z.ZodObject<{
                    supportsText: z.ZodBoolean;
                    supportsImage: z.ZodBoolean;
                    supportsVideo: z.ZodBoolean;
                    supportsAudio: z.ZodBoolean;
                    supportsPdf: z.ZodBoolean;
                }, z.core.$strict>;
                outputFormat: z.ZodObject<{
                    supportsText: z.ZodBoolean;
                }, z.core.$strict>;
            }, z.core.$strict>;
            disabledReason: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        lastUsed: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    thoughtLevel: z.ZodObject<{
        enabled: z.ZodBoolean;
        current: z.ZodOptional<z.ZodString>;
        defaultLevel: z.ZodOptional<z.ZodString>;
        available: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    mode: z.ZodObject<{
        current: z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
        }>;
    }, z.core.$strict>;
    permission: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
        }>>;
        rulesRevision: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeSessionSettingsState = z.infer<typeof zcodeSessionSettingsStateSchema>;
export declare const zcodePendingPermissionSchema: z.ZodObject<{
    requestId: z.ZodString;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    reason: z.ZodString;
    riskLevel: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
        critical: "critical";
    }>;
    input: z.ZodOptional<z.ZodUnknown>;
    origin: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"subagent">;
        agentId: z.ZodString;
        agentType: z.ZodString;
        childSessionId: z.ZodString;
        childTurnId: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parentSessionId: z.ZodString;
        parentToolCallId: z.ZodOptional<z.ZodString>;
        parentTurnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    options: z.ZodArray<z.ZodObject<{
        optionId: z.ZodString;
        kind: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        response: z.ZodObject<{
            decision: z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                escalate: "escalate";
                modify: "modify";
            }>;
            reason: z.ZodOptional<z.ZodString>;
            modifiedInput: z.ZodOptional<z.ZodUnknown>;
            permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"addRules">;
                behavior: z.ZodEnum<{
                    ask: "ask";
                    allow: "allow";
                    deny: "deny";
                }>;
                rules: z.ZodArray<z.ZodObject<{
                    toolName: z.ZodString;
                    ruleContent: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    requestedAt: z.ZodNumber;
}, z.core.$strict>;
export type ZCodePendingPermission = z.infer<typeof zcodePendingPermissionSchema>;
export declare const zcodeActiveToolCallSchema: z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        failed: "failed";
        denied: "denied";
    }>;
    startedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeActiveToolCall = z.infer<typeof zcodeActiveToolCallSchema>;
export declare const zcodeSessionProjectionSchema: z.ZodObject<{
    sessionId: z.ZodString;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        error: "error";
        idle: "idle";
        waiting: "waiting";
        paused: "paused";
    }>;
    mode: z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    turnCount: z.ZodNumber;
    totalTokenCount: z.ZodNumber;
    contextUsed: z.ZodNumber;
    contextWindow: z.ZodNumber;
    currentTurnId: z.ZodOptional<z.ZodString>;
    pendingPermissions: z.ZodArray<z.ZodObject<{
        requestId: z.ZodString;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        reason: z.ZodString;
        riskLevel: z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
            critical: "critical";
        }>;
        input: z.ZodOptional<z.ZodUnknown>;
        origin: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"subagent">;
            agentId: z.ZodString;
            agentType: z.ZodString;
            childSessionId: z.ZodString;
            childTurnId: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            parentSessionId: z.ZodString;
            parentToolCallId: z.ZodOptional<z.ZodString>;
            parentTurnId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        options: z.ZodArray<z.ZodObject<{
            optionId: z.ZodString;
            kind: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            response: z.ZodObject<{
                decision: z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    escalate: "escalate";
                    modify: "modify";
                }>;
                reason: z.ZodOptional<z.ZodString>;
                modifiedInput: z.ZodOptional<z.ZodUnknown>;
                permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    type: z.ZodLiteral<"addRules">;
                    behavior: z.ZodEnum<{
                        ask: "ask";
                        allow: "allow";
                        deny: "deny";
                    }>;
                    rules: z.ZodArray<z.ZodObject<{
                        toolName: z.ZodString;
                        ruleContent: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        requestedAt: z.ZodNumber;
    }, z.core.$strict>>;
    activeToolCalls: z.ZodArray<z.ZodObject<{
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            completed: "completed";
            failed: "failed";
            denied: "denied";
        }>;
        startedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        sessionId: z.ZodString;
        targetId: z.ZodString;
        objective: z.ZodString;
        summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        status: z.ZodEnum<{
            active: "active";
            complete: "complete";
            paused: "paused";
            budget_limited: "budget_limited";
        }>;
        tokenBudget: z.ZodNullable<z.ZodNumber>;
        tokensUsed: z.ZodNumber;
        timeUsedSeconds: z.ZodNumber;
        activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strict>>>;
    lastError: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        message: z.ZodString;
        detail: z.ZodOptional<z.ZodString>;
        attribution: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodEnum<{
                provider: "provider";
                tool: "tool";
                runtime: "runtime";
                network: "network";
            }>>;
            reason: z.ZodOptional<z.ZodString>;
            errorPhase: z.ZodOptional<z.ZodEnum<{
                response: "response";
                prepare: "prepare";
                configuration: "configuration";
                connect: "connect";
                stream: "stream";
                parse: "parse";
                validation: "validation";
                unhandled: "unhandled";
            }>>;
            exceptionKind: z.ZodOptional<z.ZodEnum<{
                validation: "validation";
                api_call: "api_call";
                generic: "generic";
                protocol: "protocol";
                provider_business: "provider_business";
                transport: "transport";
                type_error: "type_error";
            }>>;
            providerId: z.ZodOptional<z.ZodString>;
            modelId: z.ZodOptional<z.ZodString>;
            providerKind: z.ZodOptional<z.ZodString>;
            transport: z.ZodOptional<z.ZodEnum<{
                http: "http";
                sse: "sse";
                websocket: "websocket";
            }>>;
            statusCode: z.ZodOptional<z.ZodNumber>;
            providerErrorCode: z.ZodOptional<z.ZodString>;
            retryable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeSessionProjection = z.infer<typeof zcodeSessionProjectionSchema>;
export type ZCodeToolState = z.infer<typeof zcodeToolStateSchema>;
export declare const zcodeSlashCommandSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    inputHint: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        builtin: "builtin";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionApiRetryStatus = z.infer<typeof zcodeSessionApiRetryStatusSchema>;
export type ZCodeSessionContextUsage = z.infer<typeof zcodeSessionContextUsageSchema>;
export declare const zcodeModelStreamingKindSchema: z.ZodEnum<{
    error: "error";
    finish: "finish";
    start: "start";
    tool_call: "tool_call";
    text_start: "text_start";
    text_delta: "text_delta";
    text_end: "text_end";
    reasoning_start: "reasoning_start";
    reasoning_delta: "reasoning_delta";
    reasoning_end: "reasoning_end";
    tool_input_start: "tool_input_start";
    tool_input_delta: "tool_input_delta";
    tool_input_end: "tool_input_end";
}>;
export declare const zcodeModelStreamingEventPayloadSchema: z.ZodObject<{
    assistantMessageId: z.ZodOptional<z.ZodString>;
    delta: z.ZodOptional<z.ZodString>;
    done: z.ZodOptional<z.ZodBoolean>;
    input: z.ZodOptional<z.ZodUnknown>;
    kind: z.ZodEnum<{
        error: "error";
        finish: "finish";
        start: "start";
        tool_call: "tool_call";
        text_start: "text_start";
        text_delta: "text_delta";
        text_end: "text_end";
        reasoning_start: "reasoning_start";
        reasoning_delta: "reasoning_delta";
        reasoning_end: "reasoning_end";
        tool_input_start: "tool_input_start";
        tool_input_delta: "tool_input_delta";
        tool_input_end: "tool_input_end";
    }>;
    partId: z.ZodOptional<z.ZodString>;
    providerExecuted: z.ZodOptional<z.ZodBoolean>;
    toolCallId: z.ZodOptional<z.ZodString>;
    toolName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeSessionStateSnapshotSchema: z.ZodObject<{
    protocol: z.ZodObject<{
        name: z.ZodLiteral<"ZCode Protocol">;
        version: z.ZodLiteral<1>;
    }, z.core.$strict>;
    session: z.ZodObject<{
        sessionId: z.ZodString;
        workspace: z.ZodObject<{
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspaceKey: z.ZodString;
        }, z.core.$strict>;
        parentSessionId: z.ZodOptional<z.ZodString>;
        traceId: z.ZodOptional<z.ZodString>;
        sessionKind: z.ZodEnum<{
            fork: "fork";
            selection_side_chat: "selection_side_chat";
            interactive: "interactive";
            workflow_parent: "workflow_parent";
            workflow_child: "workflow_child";
            subagent_child: "subagent_child";
            nested_workflow_child: "nested_workflow_child";
        }>;
        title: z.ZodString;
        titleSource: z.ZodOptional<z.ZodEnum<{
            default: "default";
            custom: "custom";
            first_input: "first_input";
            generated: "generated";
        }>>;
        mode: z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
        }>;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
            waiting: "waiting";
            paused: "paused";
        }>;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            sessionId: z.ZodString;
            targetId: z.ZodString;
            objective: z.ZodString;
            summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            status: z.ZodEnum<{
                active: "active";
                complete: "complete";
                paused: "paused";
                budget_limited: "budget_limited";
            }>;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            tokensUsed: z.ZodNumber;
            timeUsedSeconds: z.ZodNumber;
            activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
        }, z.core.$strict>>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        archivedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    settings: z.ZodObject<{
        model: z.ZodObject<{
            current: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            available: z.ZodArray<z.ZodObject<{
                ref: z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>;
                label: z.ZodString;
                providerLabel: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                contextWindow: z.ZodOptional<z.ZodNumber>;
                maxOutputTokens: z.ZodOptional<z.ZodNumber>;
                reasoning: z.ZodOptional<z.ZodObject<{
                    levels: z.ZodArray<z.ZodObject<{
                        value: z.ZodString;
                        label: z.ZodString;
                        description: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    defaultLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                properties: z.ZodObject<{
                    inputFormat: z.ZodObject<{
                        supportsText: z.ZodBoolean;
                        supportsImage: z.ZodBoolean;
                        supportsVideo: z.ZodBoolean;
                        supportsAudio: z.ZodBoolean;
                        supportsPdf: z.ZodBoolean;
                    }, z.core.$strict>;
                    outputFormat: z.ZodObject<{
                        supportsText: z.ZodBoolean;
                    }, z.core.$strict>;
                }, z.core.$strict>;
                disabledReason: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            lastUsed: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        thoughtLevel: z.ZodObject<{
            enabled: z.ZodBoolean;
            current: z.ZodOptional<z.ZodString>;
            defaultLevel: z.ZodOptional<z.ZodString>;
            available: z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        mode: z.ZodObject<{
            current: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
        }, z.core.$strict>;
        permission: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>>;
            rulesRevision: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    projection: z.ZodObject<{
        sessionId: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
            waiting: "waiting";
            paused: "paused";
        }>;
        mode: z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
        }>;
        turnCount: z.ZodNumber;
        totalTokenCount: z.ZodNumber;
        contextUsed: z.ZodNumber;
        contextWindow: z.ZodNumber;
        currentTurnId: z.ZodOptional<z.ZodString>;
        pendingPermissions: z.ZodArray<z.ZodObject<{
            requestId: z.ZodString;
            toolCallId: z.ZodString;
            toolName: z.ZodString;
            reason: z.ZodString;
            riskLevel: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
                critical: "critical";
            }>;
            input: z.ZodOptional<z.ZodUnknown>;
            origin: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"subagent">;
                agentId: z.ZodString;
                agentType: z.ZodString;
                childSessionId: z.ZodString;
                childTurnId: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                parentSessionId: z.ZodString;
                parentToolCallId: z.ZodOptional<z.ZodString>;
                parentTurnId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            options: z.ZodArray<z.ZodObject<{
                optionId: z.ZodString;
                kind: z.ZodString;
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                response: z.ZodObject<{
                    decision: z.ZodEnum<{
                        allow: "allow";
                        deny: "deny";
                        escalate: "escalate";
                        modify: "modify";
                    }>;
                    reason: z.ZodOptional<z.ZodString>;
                    modifiedInput: z.ZodOptional<z.ZodUnknown>;
                    permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        type: z.ZodLiteral<"addRules">;
                        behavior: z.ZodEnum<{
                            ask: "ask";
                            allow: "allow";
                            deny: "deny";
                        }>;
                        rules: z.ZodArray<z.ZodObject<{
                            toolName: z.ZodString;
                            ruleContent: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            requestedAt: z.ZodNumber;
        }, z.core.$strict>>;
        activeToolCalls: z.ZodArray<z.ZodObject<{
            toolCallId: z.ZodString;
            toolName: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                running: "running";
                completed: "completed";
                failed: "failed";
                denied: "denied";
            }>;
            startedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            sessionId: z.ZodString;
            targetId: z.ZodString;
            objective: z.ZodString;
            summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            status: z.ZodEnum<{
                active: "active";
                complete: "complete";
                paused: "paused";
                budget_limited: "budget_limited";
            }>;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            tokensUsed: z.ZodNumber;
            timeUsedSeconds: z.ZodNumber;
            activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
        }, z.core.$strict>>>;
        lastError: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            message: z.ZodString;
            detail: z.ZodOptional<z.ZodString>;
            attribution: z.ZodOptional<z.ZodObject<{
                source: z.ZodOptional<z.ZodEnum<{
                    provider: "provider";
                    tool: "tool";
                    runtime: "runtime";
                    network: "network";
                }>>;
                reason: z.ZodOptional<z.ZodString>;
                errorPhase: z.ZodOptional<z.ZodEnum<{
                    response: "response";
                    prepare: "prepare";
                    configuration: "configuration";
                    connect: "connect";
                    stream: "stream";
                    parse: "parse";
                    validation: "validation";
                    unhandled: "unhandled";
                }>>;
                exceptionKind: z.ZodOptional<z.ZodEnum<{
                    validation: "validation";
                    api_call: "api_call";
                    generic: "generic";
                    protocol: "protocol";
                    provider_business: "provider_business";
                    transport: "transport";
                    type_error: "type_error";
                }>>;
                providerId: z.ZodOptional<z.ZodString>;
                modelId: z.ZodOptional<z.ZodString>;
                providerKind: z.ZodOptional<z.ZodString>;
                transport: z.ZodOptional<z.ZodEnum<{
                    http: "http";
                    sse: "sse";
                    websocket: "websocket";
                }>>;
                statusCode: z.ZodOptional<z.ZodNumber>;
                providerErrorCode: z.ZodOptional<z.ZodString>;
                retryable: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    runtime: z.ZodObject<{
        eventSeq: z.ZodNumber;
        stateRevision: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        activeTurnId: z.ZodOptional<z.ZodString>;
        activeTurnKind: z.ZodOptional<z.ZodEnum<{
            rewind: "rewind";
            regular: "regular";
            compact: "compact";
        }>>;
        pendingRequestIds: z.ZodArray<z.ZodString>;
        apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            kind: z.ZodLiteral<"api_retry">;
            attempt: z.ZodNumber;
            maxRetries: z.ZodNumber;
            retryDelayMs: z.ZodNumber;
            errorStatus: z.ZodNullable<z.ZodNumber>;
            error: z.ZodString;
        }, z.core.$strict>>>;
        contextUsage: z.ZodOptional<z.ZodObject<{
            used: z.ZodNumber;
            size: z.ZodNumber;
            cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodString;
            }, z.core.$strict>>>;
            cache: z.ZodOptional<z.ZodObject<{
                inputTokens: z.ZodNumber;
                cacheReadTokens: z.ZodNumber;
                cacheWriteTokens: z.ZodNumber;
                latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
                totalInputTokens: z.ZodOptional<z.ZodNumber>;
                totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
                totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
                hitRate: z.ZodNullable<z.ZodNumber>;
            }, z.core.$strict>>;
            breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
                source: z.ZodEnum<{
                    system_prompt: "system_prompt";
                    meta_user_context: "meta_user_context";
                    skills: "skills";
                    tool_prompt: "tool_prompt";
                    system_tool_schemas: "system_tool_schemas";
                    mcp_tool_schemas: "mcp_tool_schemas";
                    messages: "messages";
                }>;
                chars: z.ZodNumber;
            }, z.core.$strict>>>;
        }, z.core.$strict>>;
        goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
            nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            passed: z.ZodBoolean;
            reason: z.ZodString;
        }, z.core.$strict>>>;
        goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
            version: z.ZodLiteral<1>;
            kind: z.ZodLiteral<"synthetic">;
            type: z.ZodLiteral<"goal_verification">;
            display: z.ZodLiteral<"separator">;
            targetId: z.ZodString;
            verificationId: z.ZodString;
            status: z.ZodEnum<{
                completed: "completed";
                started: "started";
                cancelled: "cancelled";
                failed_closed: "failed_closed";
            }>;
            verification: z.ZodOptional<z.ZodObject<{
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                passed: z.ZodBoolean;
                reason: z.ZodString;
            }, z.core.$strict>>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
            anchorTurnId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodNumber;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    messages: z.ZodArray<z.ZodObject<{
        info: z.ZodDiscriminatedUnion<[z.ZodObject<{
            messageId: z.ZodString;
            sessionId: z.ZodString;
            role: z.ZodLiteral<"user">;
            time: z.ZodObject<{
                created: z.ZodNumber;
                completed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            system: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            synthetic: z.ZodOptional<z.ZodBoolean>;
            source: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                agent_listing_delta: "agent_listing_delta";
                background_task: "background_task";
                fork: "fork";
                goal_state_change: "goal_state_change";
                "goal-continuation": "goal-continuation";
                plugin_reference: "plugin_reference";
                bot_topic_context: "bot_topic_context";
                rewind: "rewind";
                selection_side_chat: "selection_side_chat";
                subagent_message: "subagent_message";
                todo_reminder: "todo_reminder";
                workflow_launch: "workflow_launch";
                shared_context: "shared_context";
            }>>;
            visibility: z.ZodOptional<z.ZodEnum<{
                "user-visible": "user-visible";
                "model-only": "model-only";
            }>>;
            semantics: z.ZodOptional<z.ZodObject<{
                origin: z.ZodEnum<{
                    real_user: "real_user";
                    agent_runtime: "agent_runtime";
                    system: "system";
                    migration: "migration";
                    import: "import";
                }>;
                kind: z.ZodEnum<{
                    todo_reminder: "todo_reminder";
                    shared_context: "shared_context";
                    user_prompt: "user_prompt";
                    slash_command: "slash_command";
                    system_reminder: "system_reminder";
                    background_notification: "background_notification";
                    subagent_notification: "subagent_notification";
                    rewind_notice: "rewind_notice";
                    fork_notice: "fork_notice";
                    timeline_event: "timeline_event";
                    compact_summary: "compact_summary";
                    assistant_response: "assistant_response";
                }>;
                source: z.ZodOptional<z.ZodString>;
                commandName: z.ZodOptional<z.ZodString>;
                uiVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    debug: "debug";
                }>;
                providerVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
                transcriptVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
            }, z.core.$strict>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            messageId: z.ZodString;
            sessionId: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            time: z.ZodObject<{
                created: z.ZodNumber;
                completed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            parentMessageId: z.ZodString;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            path: z.ZodObject<{
                cwd: z.ZodString;
                root: z.ZodString;
            }, z.core.$strict>;
            cost: z.ZodNumber;
            tokens: z.ZodObject<{
                total: z.ZodOptional<z.ZodNumber>;
                input: z.ZodNumber;
                output: z.ZodNumber;
                reasoning: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>;
            finish: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            semantics: z.ZodOptional<z.ZodObject<{
                origin: z.ZodEnum<{
                    real_user: "real_user";
                    agent_runtime: "agent_runtime";
                    system: "system";
                    migration: "migration";
                    import: "import";
                }>;
                kind: z.ZodEnum<{
                    todo_reminder: "todo_reminder";
                    shared_context: "shared_context";
                    user_prompt: "user_prompt";
                    slash_command: "slash_command";
                    system_reminder: "system_reminder";
                    background_notification: "background_notification";
                    subagent_notification: "subagent_notification";
                    rewind_notice: "rewind_notice";
                    fork_notice: "fork_notice";
                    timeline_event: "timeline_event";
                    compact_summary: "compact_summary";
                    assistant_response: "assistant_response";
                }>;
                source: z.ZodOptional<z.ZodString>;
                commandName: z.ZodOptional<z.ZodString>;
                uiVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    debug: "debug";
                }>;
                providerVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
                transcriptVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
            }, z.core.$strict>>;
            structured: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>], "role">;
        parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
            synthetic: z.ZodOptional<z.ZodBoolean>;
            ignored: z.ZodOptional<z.ZodBoolean>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"reasoning">;
            text: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"file">;
            mime: z.ZodString;
            filename: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"tool">;
            callId: z.ZodString;
            tool: z.ZodString;
            state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                status: z.ZodLiteral<"pending">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                raw: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"running">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                title: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                startedAt: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"completed">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                output: z.ZodString;
                title: z.ZodString;
                metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                startedAt: z.ZodNumber;
                completedAt: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"error">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                error: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                startedAt: z.ZodNumber;
                completedAt: z.ZodNumber;
            }, z.core.$strict>], "status">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"step-start">;
            snapshot: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"step-finish">;
            reason: z.ZodString;
            snapshot: z.ZodOptional<z.ZodString>;
            cost: z.ZodNumber;
            tokens: z.ZodObject<{
                total: z.ZodOptional<z.ZodNumber>;
                input: z.ZodNumber;
                output: z.ZodNumber;
                reasoning: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"snapshot">;
            snapshot: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"patch">;
            hash: z.ZodString;
            files: z.ZodArray<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"compaction">;
            auto: z.ZodBoolean;
            reason: z.ZodOptional<z.ZodString>;
            summaryMessageId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"timeline">;
            timelineType: z.ZodEnum<{
                goal_verification: "goal_verification";
                context_compaction: "context_compaction";
                session_fork: "session_fork";
                model_change: "model_change";
            }>;
            display: z.ZodEnum<{
                separator: "separator";
                worklog: "worklog";
            }>;
            status: z.ZodOptional<z.ZodString>;
            anchorMessageId: z.ZodOptional<z.ZodString>;
            anchorTurnId: z.ZodOptional<z.ZodString>;
            time: z.ZodOptional<z.ZodObject<{
                start: z.ZodOptional<z.ZodNumber>;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            operationId: z.ZodOptional<z.ZodString>;
            trigger: z.ZodOptional<z.ZodEnum<{
                auto: "auto";
                manual: "manual";
                partial: "partial";
                reactive: "reactive";
                session_memory: "session_memory";
            }>>;
            phase: z.ZodOptional<z.ZodEnum<{
                reactive: "reactive";
                standalone_turn: "standalone_turn";
                pre_request: "pre_request";
                mid_turn: "mid_turn";
            }>>;
            compactReason: z.ZodOptional<z.ZodString>;
            boundaryId: z.ZodOptional<z.ZodString>;
            summaryMessageId: z.ZodOptional<z.ZodString>;
            preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            attempt: z.ZodOptional<z.ZodNumber>;
            maxAttempts: z.ZodOptional<z.ZodNumber>;
            reason: z.ZodOptional<z.ZodString>;
            targetId: z.ZodOptional<z.ZodString>;
            verificationId: z.ZodOptional<z.ZodString>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            verification: z.ZodOptional<z.ZodObject<{
                passed: z.ZodBoolean;
                reason: z.ZodString;
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strict>>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            targetMessageId: z.ZodOptional<z.ZodString>;
            targetCheckpointId: z.ZodOptional<z.ZodString>;
            restoredFileCount: z.ZodOptional<z.ZodNumber>;
            fromModel: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                label: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            toModel: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                label: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"subagent">;
            prompt: z.ZodString;
            description: z.ZodString;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            command: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"agent">;
            name: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"retry">;
            attempt: z.ZodNumber;
            error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>>;
    goalStats: z.ZodOptional<z.ZodObject<{
        timeUsedSeconds: z.ZodNumber;
        tokensUsed: z.ZodNumber;
        tokenBudget: z.ZodNullable<z.ZodNumber>;
        contextUsed: z.ZodNumber;
        contextWindow: z.ZodNumber;
        toolCallCount: z.ZodNumber;
        iterationCount: z.ZodNumber;
    }, z.core.$strict>>;
    todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
        content: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            completed: "completed";
            in_progress: "in_progress";
        }>;
        priority: z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
        }>;
    }, z.core.$strict>>>;
    todoGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodEnum<{
            session: "session";
            goal_iteration: "goal_iteration";
        }>;
        goalIteration: z.ZodOptional<z.ZodNumber>;
        targetId: z.ZodOptional<z.ZodString>;
        startedAt: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodNumber>;
        todos: z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                completed: "completed";
                in_progress: "in_progress";
            }>;
            priority: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    slashCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputHint: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            builtin: "builtin";
        }>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodeSessionStateSnapshot = z.infer<typeof zcodeSessionStateSnapshotSchema>;
export declare const zcodeEventEnvelopeSchema: z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
}, z.core.$strict>;
export declare const zcodeComputerUseOperationEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"turn-started">;
    turnId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"turn-completed">;
    turnId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"turn-failed">;
    turnId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"tool-scheduled">;
    turnId: z.ZodString;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    computerUse: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"tool-started">;
    turnId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sequenceNumber: z.ZodNumber;
    sessionId: z.ZodString;
    timestamp: z.ZodNumber;
    kind: z.ZodLiteral<"session-closed">;
}, z.core.$strict>], "kind">;
export type ZCodeComputerUseOperationEvent = z.infer<typeof zcodeComputerUseOperationEventSchema>;
export declare const zcodeSessionEventTypeSchema: z.ZodEnum<{
    "session.created": "session.created";
    "session.resumed": "session.resumed";
    "session.updated": "session.updated";
    "session.titleUpdated": "session.titleUpdated";
    "session.closed": "session.closed";
    "turn.started": "turn.started";
    "turn.steerQueued": "turn.steerQueued";
    "turn.steerDrained": "turn.steerDrained";
    "turn.completed": "turn.completed";
    "turn.failed": "turn.failed";
    "message.upserted": "message.upserted";
    "message.removed": "message.removed";
    "part.started": "part.started";
    "part.delta": "part.delta";
    "part.upserted": "part.upserted";
    "part.removed": "part.removed";
    "model.streaming": "model.streaming";
    "tool.updated": "tool.updated";
    "permission.requested": "permission.requested";
    "permission.resolved": "permission.resolved";
    "userInput.requested": "userInput.requested";
    "userInput.resolved": "userInput.resolved";
    "checkpoint.created": "checkpoint.created";
    "rewind.triggered": "rewind.triggered";
    "streamRecovery.updated": "streamRecovery.updated";
}>;
export type ZCodeSessionEventType = z.infer<typeof zcodeSessionEventTypeSchema>;
export declare const zcodeProtocolErrorDetailSchema: z.ZodObject<{
    type: z.ZodString;
    message: z.ZodString;
    stack: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    underlyingErrorMessage: z.ZodOptional<z.ZodString>;
    underlyingErrorDetail: z.ZodOptional<z.ZodString>;
    attribution: z.ZodOptional<z.ZodObject<{
        source: z.ZodOptional<z.ZodEnum<{
            provider: "provider";
            tool: "tool";
            runtime: "runtime";
            network: "network";
        }>>;
        reason: z.ZodOptional<z.ZodString>;
        errorPhase: z.ZodOptional<z.ZodEnum<{
            response: "response";
            prepare: "prepare";
            configuration: "configuration";
            connect: "connect";
            stream: "stream";
            parse: "parse";
            validation: "validation";
            unhandled: "unhandled";
        }>>;
        exceptionKind: z.ZodOptional<z.ZodEnum<{
            validation: "validation";
            api_call: "api_call";
            generic: "generic";
            protocol: "protocol";
            provider_business: "provider_business";
            transport: "transport";
            type_error: "type_error";
        }>>;
        providerId: z.ZodOptional<z.ZodString>;
        modelId: z.ZodOptional<z.ZodString>;
        providerKind: z.ZodOptional<z.ZodString>;
        transport: z.ZodOptional<z.ZodEnum<{
            http: "http";
            sse: "sse";
            websocket: "websocket";
        }>>;
        statusCode: z.ZodOptional<z.ZodNumber>;
        providerErrorCode: z.ZodOptional<z.ZodString>;
        retryable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    retryable: z.ZodOptional<z.ZodBoolean>;
    data: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export declare const zcodeSessionCreatedEventPayloadSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    contextWindow: z.ZodNumber;
}, z.core.$strict>;
export declare const zcodeSessionResumedEventPayloadSchema: z.ZodObject<{
    directory: z.ZodString;
    interruptedToolCount: z.ZodNumber;
    messageCount: z.ZodNumber;
    partCount: z.ZodNumber;
    recoveredCompactTimelineCount: z.ZodOptional<z.ZodNumber>;
    recoveredSteerInputCount: z.ZodOptional<z.ZodNumber>;
    resumedTodoCount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const zcodeSessionTitleUpdatedEventPayloadSchema: z.ZodObject<{
    messageID: z.ZodOptional<z.ZodString>;
    previousTitle: z.ZodString;
    source: z.ZodEnum<{
        default: "default";
        custom: "custom";
        first_input: "first_input";
        generated: "generated";
    }>;
    title: z.ZodString;
}, z.core.$strict>;
export declare const zcodeTurnStartedEventPayloadSchema: z.ZodObject<{
    executionStartedAt: z.ZodOptional<z.ZodNumber>;
    turnNumber: z.ZodNumber;
    input: z.ZodString;
    inputId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    inputSource: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
        agent_listing_delta: "agent_listing_delta";
        background_task: "background_task";
        fork: "fork";
        goal_state_change: "goal_state_change";
        "goal-continuation": "goal-continuation";
        plugin_reference: "plugin_reference";
        bot_topic_context: "bot_topic_context";
        rewind: "rewind";
        selection_side_chat: "selection_side_chat";
        subagent_message: "subagent_message";
        todo_reminder: "todo_reminder";
        workflow_launch: "workflow_launch";
        shared_context: "shared_context";
    }>>;
    inputVisibility: z.ZodOptional<z.ZodEnum<{
        "user-visible": "user-visible";
        "model-only": "model-only";
    }>>;
    executionKind: z.ZodOptional<z.ZodEnum<{
        agent: "agent";
        controlOnly: "controlOnly";
    }>>;
    targetId: z.ZodOptional<z.ZodString>;
    messageId: z.ZodOptional<z.ZodString>;
    foregroundExecutionId: z.ZodOptional<z.ZodString>;
    intent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    originMeta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    backgroundSource: z.ZodOptional<z.ZodEnum<{
        bash: "bash";
        subagent: "subagent";
    }>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strict>;
export declare const zcodeTurnSteerQueuedEventPayloadSchema: z.ZodObject<{
    pendingInputId: z.ZodString;
    inputId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    input: z.ZodString;
    inputPreview: z.ZodString;
    inputSize: z.ZodNumber;
    commandKind: z.ZodOptional<z.ZodEnum<{
        compact: "compact";
        sendText: "sendText";
        sendGoalCommand: "sendGoalCommand";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        plan_approval_feedback: "plan_approval_feedback";
        workflow_refine_feedback: "workflow_refine_feedback";
    }>>;
    toolDisallowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    delivery: z.ZodOptional<z.ZodEnum<{
        queue: "queue";
        guide: "guide";
    }>>;
    targetTurnId: z.ZodString;
    queueLength: z.ZodNumber;
    intent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const zcodeTurnSteerDrainedEventPayloadSchema: z.ZodObject<{
    pendingInputIds: z.ZodArray<z.ZodString>;
    queryIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targetTurnId: z.ZodString;
    injectedMessageIds: z.ZodArray<z.ZodString>;
    drainedInputs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pendingInputId: z.ZodString;
        messageId: z.ZodString;
        text: z.ZodString;
        delivery: z.ZodOptional<z.ZodEnum<{
            queue: "queue";
            guide: "guide";
        }>>;
        intent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        toolDisallowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const zcodeTurnCompletedEventPayloadSchema: z.ZodObject<{
    response: z.ZodString;
    tokenCount: z.ZodNumber;
    usage: z.ZodOptional<z.ZodUnknown>;
    toolCallCount: z.ZodNumber;
    historyRoundCount: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodNumber;
    cacheStats: z.ZodOptional<z.ZodObject<{
        totalMessages: z.ZodNumber;
        cachedMessages: z.ZodNumber;
        lastCacheHit: z.ZodBoolean;
        cacheReadTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    inputId: z.ZodOptional<z.ZodString>;
    resultType: z.ZodEnum<{
        success: "success";
        cancelled: "cancelled";
        error_max_turns: "error_max_turns";
        error_max_budget: "error_max_budget";
        error_during_execution: "error_during_execution";
        error_max_tool_calls: "error_max_tool_calls";
    }>;
    backgroundSubagentResultConsumed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodeTurnFailedEventPayloadSchema: z.ZodObject<{
    error: z.ZodObject<{
        type: z.ZodString;
        message: z.ZodString;
        stack: z.ZodOptional<z.ZodString>;
        code: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        underlyingErrorMessage: z.ZodOptional<z.ZodString>;
        underlyingErrorDetail: z.ZodOptional<z.ZodString>;
        attribution: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodEnum<{
                provider: "provider";
                tool: "tool";
                runtime: "runtime";
                network: "network";
            }>>;
            reason: z.ZodOptional<z.ZodString>;
            errorPhase: z.ZodOptional<z.ZodEnum<{
                response: "response";
                prepare: "prepare";
                configuration: "configuration";
                connect: "connect";
                stream: "stream";
                parse: "parse";
                validation: "validation";
                unhandled: "unhandled";
            }>>;
            exceptionKind: z.ZodOptional<z.ZodEnum<{
                validation: "validation";
                api_call: "api_call";
                generic: "generic";
                protocol: "protocol";
                provider_business: "provider_business";
                transport: "transport";
                type_error: "type_error";
            }>>;
            providerId: z.ZodOptional<z.ZodString>;
            modelId: z.ZodOptional<z.ZodString>;
            providerKind: z.ZodOptional<z.ZodString>;
            transport: z.ZodOptional<z.ZodEnum<{
                http: "http";
                sse: "sse";
                websocket: "websocket";
            }>>;
            statusCode: z.ZodOptional<z.ZodNumber>;
            providerErrorCode: z.ZodOptional<z.ZodString>;
            retryable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        retryable: z.ZodOptional<z.ZodBoolean>;
        data: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>;
    turnPhase: z.ZodString;
    inputId: z.ZodOptional<z.ZodString>;
    backgroundSubagentResultConsumed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodeMessageUpsertedEventPayloadSchema: z.ZodObject<{
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    type: z.ZodOptional<z.ZodString>;
    compactBoundary: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export declare const zcodeMessageRemovedEventPayloadSchema: z.ZodObject<{
    messageId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeMessagePartDeltaEventPayloadSchema: z.ZodObject<{
    messageId: z.ZodString;
    partId: z.ZodString;
    field: z.ZodOptional<z.ZodEnum<{
        output: "output";
        input: "input";
        text: "text";
        reasoning: "reasoning";
    }>>;
    delta: z.ZodString;
}, z.core.$strict>;
export declare const zcodeMessagePartUpsertedEventPayloadSchema: z.ZodObject<{
    part: z.ZodDiscriminatedUnion<[z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        synthetic: z.ZodOptional<z.ZodBoolean>;
        ignored: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"reasoning">;
        text: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"file">;
        mime: z.ZodString;
        filename: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"tool">;
        callId: z.ZodString;
        tool: z.ZodString;
        state: z.ZodDiscriminatedUnion<[z.ZodObject<{
            status: z.ZodLiteral<"pending">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            raw: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"running">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            title: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            startedAt: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"completed">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            output: z.ZodString;
            title: z.ZodString;
            metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            startedAt: z.ZodNumber;
            completedAt: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            status: z.ZodLiteral<"error">;
            input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            error: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            startedAt: z.ZodNumber;
            completedAt: z.ZodNumber;
        }, z.core.$strict>], "status">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"step-start">;
        snapshot: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"step-finish">;
        reason: z.ZodString;
        snapshot: z.ZodOptional<z.ZodString>;
        cost: z.ZodNumber;
        tokens: z.ZodObject<{
            total: z.ZodOptional<z.ZodNumber>;
            input: z.ZodNumber;
            output: z.ZodNumber;
            reasoning: z.ZodNumber;
            cache: z.ZodObject<{
                read: z.ZodNumber;
                write: z.ZodNumber;
            }, z.core.$strict>;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"snapshot">;
        snapshot: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"patch">;
        hash: z.ZodString;
        files: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"compaction">;
        auto: z.ZodBoolean;
        reason: z.ZodOptional<z.ZodString>;
        summaryMessageId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"timeline">;
        timelineType: z.ZodEnum<{
            goal_verification: "goal_verification";
            context_compaction: "context_compaction";
            session_fork: "session_fork";
            model_change: "model_change";
        }>;
        display: z.ZodEnum<{
            separator: "separator";
            worklog: "worklog";
        }>;
        status: z.ZodOptional<z.ZodString>;
        anchorMessageId: z.ZodOptional<z.ZodString>;
        anchorTurnId: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodObject<{
            start: z.ZodOptional<z.ZodNumber>;
            end: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        operationId: z.ZodOptional<z.ZodString>;
        trigger: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            manual: "manual";
            partial: "partial";
            reactive: "reactive";
            session_memory: "session_memory";
        }>>;
        phase: z.ZodOptional<z.ZodEnum<{
            reactive: "reactive";
            standalone_turn: "standalone_turn";
            pre_request: "pre_request";
            mid_turn: "mid_turn";
        }>>;
        compactReason: z.ZodOptional<z.ZodString>;
        boundaryId: z.ZodOptional<z.ZodString>;
        summaryMessageId: z.ZodOptional<z.ZodString>;
        preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
        attempt: z.ZodOptional<z.ZodNumber>;
        maxAttempts: z.ZodOptional<z.ZodNumber>;
        reason: z.ZodOptional<z.ZodString>;
        targetId: z.ZodOptional<z.ZodString>;
        verificationId: z.ZodOptional<z.ZodString>;
        goalIteration: z.ZodOptional<z.ZodNumber>;
        verification: z.ZodOptional<z.ZodObject<{
            passed: z.ZodBoolean;
            reason: z.ZodString;
            nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        parentSessionId: z.ZodOptional<z.ZodString>;
        targetMessageId: z.ZodOptional<z.ZodString>;
        targetCheckpointId: z.ZodOptional<z.ZodString>;
        restoredFileCount: z.ZodOptional<z.ZodNumber>;
        fromModel: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        toModel: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            label: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"subagent">;
        prompt: z.ZodString;
        description: z.ZodString;
        agent: z.ZodString;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        command: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"agent">;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        partId: z.ZodString;
        sessionId: z.ZodString;
        messageId: z.ZodString;
        type: z.ZodLiteral<"retry">;
        attempt: z.ZodNumber;
        error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strict>], "type">;
}, z.core.$strict>;
export declare const zcodeMessagePartRemovedEventPayloadSchema: z.ZodObject<{
    messageId: z.ZodString;
    partId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeToolUpdatedEventPayloadSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    toolCallId: z.ZodString;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"scheduled">;
    assistantMessageId: z.ZodOptional<z.ZodString>;
    toolName: z.ZodString;
    input: z.ZodOptional<z.ZodUnknown>;
    inputByteLength: z.ZodOptional<z.ZodNumber>;
    inputOmitted: z.ZodOptional<z.ZodBoolean>;
    inputRef: z.ZodOptional<z.ZodLiteral<"model_stream">>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    parallelGroupIndex: z.ZodOptional<z.ZodNumber>;
    canRunParallel: z.ZodOptional<z.ZodBoolean>;
    schedule: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"started">;
    startedAt: z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>;
}, z.core.$strict>, z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"progress">;
    elapsedMs: z.ZodOptional<z.ZodNumber>;
    pid: z.ZodOptional<z.ZodNumber>;
    stdoutBytes: z.ZodOptional<z.ZodNumber>;
    stderrBytes: z.ZodOptional<z.ZodNumber>;
    outputBytes: z.ZodOptional<z.ZodNumber>;
    outputPreview: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        fullText: z.ZodString;
        totalLines: z.ZodNumber;
        totalBytes: z.ZodNumber;
        linesEstimated: z.ZodBoolean;
    }, z.core.$strict>>;
    stdoutTail: z.ZodOptional<z.ZodString>;
    stderrTail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"result">;
    result: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    duration: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"error">;
    error: z.ZodObject<{
        type: z.ZodString;
        message: z.ZodString;
        stack: z.ZodOptional<z.ZodString>;
        code: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        underlyingErrorMessage: z.ZodOptional<z.ZodString>;
        underlyingErrorDetail: z.ZodOptional<z.ZodString>;
        attribution: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodEnum<{
                provider: "provider";
                tool: "tool";
                runtime: "runtime";
                network: "network";
            }>>;
            reason: z.ZodOptional<z.ZodString>;
            errorPhase: z.ZodOptional<z.ZodEnum<{
                response: "response";
                prepare: "prepare";
                configuration: "configuration";
                connect: "connect";
                stream: "stream";
                parse: "parse";
                validation: "validation";
                unhandled: "unhandled";
            }>>;
            exceptionKind: z.ZodOptional<z.ZodEnum<{
                validation: "validation";
                api_call: "api_call";
                generic: "generic";
                protocol: "protocol";
                provider_business: "provider_business";
                transport: "transport";
                type_error: "type_error";
            }>>;
            providerId: z.ZodOptional<z.ZodString>;
            modelId: z.ZodOptional<z.ZodString>;
            providerKind: z.ZodOptional<z.ZodString>;
            transport: z.ZodOptional<z.ZodEnum<{
                http: "http";
                sse: "sse";
                websocket: "websocket";
            }>>;
            statusCode: z.ZodOptional<z.ZodNumber>;
            providerErrorCode: z.ZodOptional<z.ZodString>;
            retryable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        retryable: z.ZodOptional<z.ZodBoolean>;
        data: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"batch">;
    toolCallIds: z.ZodArray<z.ZodString>;
    successCount: z.ZodNumber;
    errorCount: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    parentToolCallId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
    }>>;
    agentId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
    childSessionId: z.ZodOptional<z.ZodString>;
    childToolCallId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    kind: z.ZodLiteral<"raw">;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>], "kind">;
export declare const zcodePermissionRequestedEventPayloadSchema: z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    riskLevel: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
        critical: "critical";
    }>;
    reason: z.ZodString;
    input: z.ZodUnknown;
    suggestedPermissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"addRules">;
        behavior: z.ZodEnum<{
            ask: "ask";
            allow: "allow";
            deny: "deny";
        }>;
        rules: z.ZodArray<z.ZodObject<{
            toolName: z.ZodString;
            ruleContent: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    approvalMode: z.ZodOptional<z.ZodLiteral<"user-once">>;
    origin: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"subagent">;
        agentId: z.ZodString;
        agentType: z.ZodString;
        childSessionId: z.ZodString;
        childTurnId: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parentSessionId: z.ZodString;
        parentToolCallId: z.ZodOptional<z.ZodString>;
        parentTurnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    options: z.ZodArray<z.ZodObject<{
        optionId: z.ZodString;
        kind: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        response: z.ZodObject<{
            decision: z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                escalate: "escalate";
                modify: "modify";
            }>;
            reason: z.ZodOptional<z.ZodString>;
            modifiedInput: z.ZodOptional<z.ZodUnknown>;
            permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"addRules">;
                behavior: z.ZodEnum<{
                    ask: "ask";
                    allow: "allow";
                    deny: "deny";
                }>;
                rules: z.ZodArray<z.ZodObject<{
                    toolName: z.ZodString;
                    ruleContent: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    childSessionId: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodePermissionResolvedEventPayloadSchema: z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    toolName: z.ZodOptional<z.ZodString>;
    decision: z.ZodOptional<z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        escalate: "escalate";
        modify: "modify";
    }>>;
    reason: z.ZodOptional<z.ZodString>;
    modifiedInput: z.ZodOptional<z.ZodUnknown>;
    inputSummary: z.ZodOptional<z.ZodUnknown>;
    childSessionId: z.ZodOptional<z.ZodString>;
    background: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodeUserInputRequestedEventPayloadSchema: z.ZodObject<{
    requestId: z.ZodString;
    prompt: z.ZodString;
    inputType: z.ZodOptional<z.ZodEnum<{
        text: "text";
        choice: "choice";
        confirm: "confirm";
    }>>;
    choices: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const zcodeUserInputResolvedEventPayloadSchema: z.ZodObject<{
    requestId: z.ZodString;
    value: z.ZodOptional<z.ZodUnknown>;
    cancelled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodeSessionClosedEventPayloadSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeSessionEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"session.created">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"session.resumed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"session.updated">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"session.titleUpdated">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"session.closed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"turn.started">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"turn.steerQueued">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"turn.steerDrained">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"turn.completed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"turn.failed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"message.upserted">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"message.removed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"part.started">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"part.delta">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"part.upserted">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"part.removed">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"model.streaming">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"tool.updated">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"permission.requested">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"permission.resolved">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"userInput.requested">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"userInput.resolved">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"checkpoint.created">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"rewind.triggered">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>, z.ZodObject<{
    eventId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    seq: z.ZodNumber;
    traceId: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodNumber;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    type: z.ZodLiteral<"streamRecovery.updated">;
    payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict>], "type">;
export type ZCodeSessionEvent = z.infer<typeof zcodeSessionEventSchema>;
export declare const zcodeSessionEventsResultSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.created">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.resumed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.titleUpdated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.closed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.started">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.steerQueued">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.steerDrained">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.completed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.failed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"message.upserted">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"message.removed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.started">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.delta">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.upserted">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.removed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"model.streaming">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"tool.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"permission.requested">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"permission.resolved">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"userInput.requested">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"userInput.resolved">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"checkpoint.created">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"rewind.triggered">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"streamRecovery.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>], "type">>;
}, z.core.$strict>;
export declare const zcodeSessionMessagesResultSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        info: z.ZodDiscriminatedUnion<[z.ZodObject<{
            messageId: z.ZodString;
            sessionId: z.ZodString;
            role: z.ZodLiteral<"user">;
            time: z.ZodObject<{
                created: z.ZodNumber;
                completed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            system: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            synthetic: z.ZodOptional<z.ZodBoolean>;
            source: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                agent_listing_delta: "agent_listing_delta";
                background_task: "background_task";
                fork: "fork";
                goal_state_change: "goal_state_change";
                "goal-continuation": "goal-continuation";
                plugin_reference: "plugin_reference";
                bot_topic_context: "bot_topic_context";
                rewind: "rewind";
                selection_side_chat: "selection_side_chat";
                subagent_message: "subagent_message";
                todo_reminder: "todo_reminder";
                workflow_launch: "workflow_launch";
                shared_context: "shared_context";
            }>>;
            visibility: z.ZodOptional<z.ZodEnum<{
                "user-visible": "user-visible";
                "model-only": "model-only";
            }>>;
            semantics: z.ZodOptional<z.ZodObject<{
                origin: z.ZodEnum<{
                    real_user: "real_user";
                    agent_runtime: "agent_runtime";
                    system: "system";
                    migration: "migration";
                    import: "import";
                }>;
                kind: z.ZodEnum<{
                    todo_reminder: "todo_reminder";
                    shared_context: "shared_context";
                    user_prompt: "user_prompt";
                    slash_command: "slash_command";
                    system_reminder: "system_reminder";
                    background_notification: "background_notification";
                    subagent_notification: "subagent_notification";
                    rewind_notice: "rewind_notice";
                    fork_notice: "fork_notice";
                    timeline_event: "timeline_event";
                    compact_summary: "compact_summary";
                    assistant_response: "assistant_response";
                }>;
                source: z.ZodOptional<z.ZodString>;
                commandName: z.ZodOptional<z.ZodString>;
                uiVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    debug: "debug";
                }>;
                providerVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
                transcriptVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
            }, z.core.$strict>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            messageId: z.ZodString;
            sessionId: z.ZodString;
            role: z.ZodLiteral<"assistant">;
            time: z.ZodObject<{
                created: z.ZodNumber;
                completed: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>;
            parentMessageId: z.ZodString;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            path: z.ZodObject<{
                cwd: z.ZodString;
                root: z.ZodString;
            }, z.core.$strict>;
            cost: z.ZodNumber;
            tokens: z.ZodObject<{
                total: z.ZodOptional<z.ZodNumber>;
                input: z.ZodNumber;
                output: z.ZodNumber;
                reasoning: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>;
            finish: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            semantics: z.ZodOptional<z.ZodObject<{
                origin: z.ZodEnum<{
                    real_user: "real_user";
                    agent_runtime: "agent_runtime";
                    system: "system";
                    migration: "migration";
                    import: "import";
                }>;
                kind: z.ZodEnum<{
                    todo_reminder: "todo_reminder";
                    shared_context: "shared_context";
                    user_prompt: "user_prompt";
                    slash_command: "slash_command";
                    system_reminder: "system_reminder";
                    background_notification: "background_notification";
                    subagent_notification: "subagent_notification";
                    rewind_notice: "rewind_notice";
                    fork_notice: "fork_notice";
                    timeline_event: "timeline_event";
                    compact_summary: "compact_summary";
                    assistant_response: "assistant_response";
                }>;
                source: z.ZodOptional<z.ZodString>;
                commandName: z.ZodOptional<z.ZodString>;
                uiVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    debug: "debug";
                }>;
                providerVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
                transcriptVisibility: z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                }>;
            }, z.core.$strict>>;
            structured: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>], "role">;
        parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"text">;
            text: z.ZodString;
            synthetic: z.ZodOptional<z.ZodBoolean>;
            ignored: z.ZodOptional<z.ZodBoolean>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"reasoning">;
            text: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"file">;
            mime: z.ZodString;
            filename: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"tool">;
            callId: z.ZodString;
            tool: z.ZodString;
            state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                status: z.ZodLiteral<"pending">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                raw: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"running">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                title: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                startedAt: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"completed">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                output: z.ZodString;
                title: z.ZodString;
                metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                startedAt: z.ZodNumber;
                completedAt: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                status: z.ZodLiteral<"error">;
                input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                error: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                startedAt: z.ZodNumber;
                completedAt: z.ZodNumber;
            }, z.core.$strict>], "status">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"step-start">;
            snapshot: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"step-finish">;
            reason: z.ZodString;
            snapshot: z.ZodOptional<z.ZodString>;
            cost: z.ZodNumber;
            tokens: z.ZodObject<{
                total: z.ZodOptional<z.ZodNumber>;
                input: z.ZodNumber;
                output: z.ZodNumber;
                reasoning: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, z.core.$strict>;
            }, z.core.$strict>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"snapshot">;
            snapshot: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"patch">;
            hash: z.ZodString;
            files: z.ZodArray<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"compaction">;
            auto: z.ZodBoolean;
            reason: z.ZodOptional<z.ZodString>;
            summaryMessageId: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"timeline">;
            timelineType: z.ZodEnum<{
                goal_verification: "goal_verification";
                context_compaction: "context_compaction";
                session_fork: "session_fork";
                model_change: "model_change";
            }>;
            display: z.ZodEnum<{
                separator: "separator";
                worklog: "worklog";
            }>;
            status: z.ZodOptional<z.ZodString>;
            anchorMessageId: z.ZodOptional<z.ZodString>;
            anchorTurnId: z.ZodOptional<z.ZodString>;
            time: z.ZodOptional<z.ZodObject<{
                start: z.ZodOptional<z.ZodNumber>;
                end: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            operationId: z.ZodOptional<z.ZodString>;
            trigger: z.ZodOptional<z.ZodEnum<{
                auto: "auto";
                manual: "manual";
                partial: "partial";
                reactive: "reactive";
                session_memory: "session_memory";
            }>>;
            phase: z.ZodOptional<z.ZodEnum<{
                reactive: "reactive";
                standalone_turn: "standalone_turn";
                pre_request: "pre_request";
                mid_turn: "mid_turn";
            }>>;
            compactReason: z.ZodOptional<z.ZodString>;
            boundaryId: z.ZodOptional<z.ZodString>;
            summaryMessageId: z.ZodOptional<z.ZodString>;
            preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
            attempt: z.ZodOptional<z.ZodNumber>;
            maxAttempts: z.ZodOptional<z.ZodNumber>;
            reason: z.ZodOptional<z.ZodString>;
            targetId: z.ZodOptional<z.ZodString>;
            verificationId: z.ZodOptional<z.ZodString>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            verification: z.ZodOptional<z.ZodObject<{
                passed: z.ZodBoolean;
                reason: z.ZodString;
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strict>>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            targetMessageId: z.ZodOptional<z.ZodString>;
            targetCheckpointId: z.ZodOptional<z.ZodString>;
            restoredFileCount: z.ZodOptional<z.ZodNumber>;
            fromModel: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                label: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            toModel: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                label: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"subagent">;
            prompt: z.ZodString;
            description: z.ZodString;
            agent: z.ZodString;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            command: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"agent">;
            name: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            partId: z.ZodString;
            sessionId: z.ZodString;
            messageId: z.ZodString;
            type: z.ZodLiteral<"retry">;
            attempt: z.ZodNumber;
            error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeStateUpdatedNotificationSchema: z.ZodObject<{
    type: z.ZodLiteral<"state.updated">;
    scope: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
        server: "server";
    }>;
    workspace: z.ZodOptional<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>>;
    sessionId: z.ZodOptional<z.ZodString>;
    revision: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
    patch: z.ZodUnknown;
}, z.core.$strict>;
export type ZCodeStateUpdatedNotification = z.infer<typeof zcodeStateUpdatedNotificationSchema>;
export declare const zcodeSessionSubscribeParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    deliveryKind: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    afterSeq: z.ZodOptional<z.ZodNumber>;
    includeSnapshot: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeSessionSubscribeParams = z.infer<typeof zcodeSessionSubscribeParamsSchema>;
export declare const zcodeSessionSubscribeResultSchema: z.ZodObject<{
    sessionId: z.ZodString;
    eventSeq: z.ZodNumber;
    events: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.created">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.resumed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.titleUpdated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"session.closed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.started">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.steerQueued">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.steerDrained">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.completed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"turn.failed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"message.upserted">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"message.removed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.started">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.delta">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.upserted">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"part.removed">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"model.streaming">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"tool.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"permission.requested">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"permission.resolved">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"userInput.requested">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"userInput.resolved">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"checkpoint.created">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"rewind.triggered">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>, z.ZodObject<{
        eventId: z.ZodString;
        sessionId: z.ZodString;
        turnId: z.ZodOptional<z.ZodString>;
        seq: z.ZodNumber;
        traceId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
        deliveryKind: z.ZodOptional<z.ZodEnum<{
            "desktop-continuous": "desktop-continuous";
            "web-remote-replayable": "web-remote-replayable";
        }>>;
        type: z.ZodLiteral<"streamRecovery.updated">;
        payload: z.ZodOptional<z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$strict>], "type">>;
    snapshot: z.ZodOptional<z.ZodObject<{
        protocol: z.ZodObject<{
            name: z.ZodLiteral<"ZCode Protocol">;
            version: z.ZodLiteral<1>;
        }, z.core.$strict>;
        session: z.ZodObject<{
            sessionId: z.ZodString;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            traceId: z.ZodOptional<z.ZodString>;
            sessionKind: z.ZodEnum<{
                fork: "fork";
                selection_side_chat: "selection_side_chat";
                interactive: "interactive";
                workflow_parent: "workflow_parent";
                workflow_child: "workflow_child";
                subagent_child: "subagent_child";
                nested_workflow_child: "nested_workflow_child";
            }>;
            title: z.ZodString;
            titleSource: z.ZodOptional<z.ZodEnum<{
                default: "default";
                custom: "custom";
                first_input: "first_input";
                generated: "generated";
            }>>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            archivedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        settings: z.ZodObject<{
            model: z.ZodObject<{
                current: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                available: z.ZodArray<z.ZodObject<{
                    ref: z.ZodObject<{
                        providerId: z.ZodString;
                        modelId: z.ZodString;
                        options: z.ZodOptional<z.ZodObject<{
                            reasoningLevel: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    label: z.ZodString;
                    providerLabel: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    contextWindow: z.ZodOptional<z.ZodNumber>;
                    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodObject<{
                        levels: z.ZodArray<z.ZodObject<{
                            value: z.ZodString;
                            label: z.ZodString;
                            description: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        defaultLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    properties: z.ZodObject<{
                        inputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                            supportsImage: z.ZodBoolean;
                            supportsVideo: z.ZodBoolean;
                            supportsAudio: z.ZodBoolean;
                            supportsPdf: z.ZodBoolean;
                        }, z.core.$strict>;
                        outputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                        }, z.core.$strict>;
                    }, z.core.$strict>;
                    disabledReason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                lastUsed: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            thoughtLevel: z.ZodObject<{
                enabled: z.ZodBoolean;
                current: z.ZodOptional<z.ZodString>;
                defaultLevel: z.ZodOptional<z.ZodString>;
                available: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            mode: z.ZodObject<{
                current: z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>;
            }, z.core.$strict>;
            permission: z.ZodOptional<z.ZodObject<{
                mode: z.ZodOptional<z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>>;
                rulesRevision: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        projection: z.ZodObject<{
            sessionId: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            turnCount: z.ZodNumber;
            totalTokenCount: z.ZodNumber;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            currentTurnId: z.ZodOptional<z.ZodString>;
            pendingPermissions: z.ZodArray<z.ZodObject<{
                requestId: z.ZodString;
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                reason: z.ZodString;
                riskLevel: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                    critical: "critical";
                }>;
                input: z.ZodOptional<z.ZodUnknown>;
                origin: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"subagent">;
                    agentId: z.ZodString;
                    agentType: z.ZodString;
                    childSessionId: z.ZodString;
                    childTurnId: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    parentSessionId: z.ZodString;
                    parentToolCallId: z.ZodOptional<z.ZodString>;
                    parentTurnId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                options: z.ZodArray<z.ZodObject<{
                    optionId: z.ZodString;
                    kind: z.ZodString;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    response: z.ZodObject<{
                        decision: z.ZodEnum<{
                            allow: "allow";
                            deny: "deny";
                            escalate: "escalate";
                            modify: "modify";
                        }>;
                        reason: z.ZodOptional<z.ZodString>;
                        modifiedInput: z.ZodOptional<z.ZodUnknown>;
                        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            type: z.ZodLiteral<"addRules">;
                            behavior: z.ZodEnum<{
                                ask: "ask";
                                allow: "allow";
                                deny: "deny";
                            }>;
                            rules: z.ZodArray<z.ZodObject<{
                                toolName: z.ZodString;
                                ruleContent: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
                requestedAt: z.ZodNumber;
            }, z.core.$strict>>;
            activeToolCalls: z.ZodArray<z.ZodObject<{
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                    denied: "denied";
                }>;
                startedAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            lastError: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                code: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                detail: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        runtime: z.ZodObject<{
            eventSeq: z.ZodNumber;
            stateRevision: z.ZodNumber;
            deliveryKind: z.ZodOptional<z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>>;
            activeTurnId: z.ZodOptional<z.ZodString>;
            activeTurnKind: z.ZodOptional<z.ZodEnum<{
                rewind: "rewind";
                regular: "regular";
                compact: "compact";
            }>>;
            pendingRequestIds: z.ZodArray<z.ZodString>;
            apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                kind: z.ZodLiteral<"api_retry">;
                attempt: z.ZodNumber;
                maxRetries: z.ZodNumber;
                retryDelayMs: z.ZodNumber;
                errorStatus: z.ZodNullable<z.ZodNumber>;
                error: z.ZodString;
            }, z.core.$strict>>>;
            contextUsage: z.ZodOptional<z.ZodObject<{
                used: z.ZodNumber;
                size: z.ZodNumber;
                cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    amount: z.ZodNumber;
                    currency: z.ZodString;
                }, z.core.$strict>>>;
                cache: z.ZodOptional<z.ZodObject<{
                    inputTokens: z.ZodNumber;
                    cacheReadTokens: z.ZodNumber;
                    cacheWriteTokens: z.ZodNumber;
                    latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
                    totalInputTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
                    hitRate: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strict>>;
                breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    source: z.ZodEnum<{
                        system_prompt: "system_prompt";
                        meta_user_context: "meta_user_context";
                        skills: "skills";
                        tool_prompt: "tool_prompt";
                        system_tool_schemas: "system_tool_schemas";
                        mcp_tool_schemas: "mcp_tool_schemas";
                        messages: "messages";
                    }>;
                    chars: z.ZodNumber;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                passed: z.ZodBoolean;
                reason: z.ZodString;
            }, z.core.$strict>>>;
            goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
                version: z.ZodLiteral<1>;
                kind: z.ZodLiteral<"synthetic">;
                type: z.ZodLiteral<"goal_verification">;
                display: z.ZodLiteral<"separator">;
                targetId: z.ZodString;
                verificationId: z.ZodString;
                status: z.ZodEnum<{
                    completed: "completed";
                    started: "started";
                    cancelled: "cancelled";
                    failed_closed: "failed_closed";
                }>;
                verification: z.ZodOptional<z.ZodObject<{
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                }, z.core.$strict>>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        messages: z.ZodArray<z.ZodObject<{
            info: z.ZodDiscriminatedUnion<[z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"user">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                system: z.ZodOptional<z.ZodString>;
                tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                source: z.ZodOptional<z.ZodEnum<{
                    subagent: "subagent";
                    agent_listing_delta: "agent_listing_delta";
                    background_task: "background_task";
                    fork: "fork";
                    goal_state_change: "goal_state_change";
                    "goal-continuation": "goal-continuation";
                    plugin_reference: "plugin_reference";
                    bot_topic_context: "bot_topic_context";
                    rewind: "rewind";
                    selection_side_chat: "selection_side_chat";
                    subagent_message: "subagent_message";
                    todo_reminder: "todo_reminder";
                    workflow_launch: "workflow_launch";
                    shared_context: "shared_context";
                }>>;
                visibility: z.ZodOptional<z.ZodEnum<{
                    "user-visible": "user-visible";
                    "model-only": "model-only";
                }>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"assistant">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                parentMessageId: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                path: z.ZodObject<{
                    cwd: z.ZodString;
                    root: z.ZodString;
                }, z.core.$strict>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
                finish: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                structured: z.ZodOptional<z.ZodUnknown>;
            }, z.core.$strict>], "role">;
            parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                ignored: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"reasoning">;
                text: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"file">;
                mime: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"tool">;
                callId: z.ZodString;
                tool: z.ZodString;
                state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    status: z.ZodLiteral<"pending">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    raw: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"running">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    title: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"completed">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    output: z.ZodString;
                    title: z.ZodString;
                    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"error">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    error: z.ZodString;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>], "status">;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-start">;
                snapshot: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-finish">;
                reason: z.ZodString;
                snapshot: z.ZodOptional<z.ZodString>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"snapshot">;
                snapshot: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"patch">;
                hash: z.ZodString;
                files: z.ZodArray<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"compaction">;
                auto: z.ZodBoolean;
                reason: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"timeline">;
                timelineType: z.ZodEnum<{
                    goal_verification: "goal_verification";
                    context_compaction: "context_compaction";
                    session_fork: "session_fork";
                    model_change: "model_change";
                }>;
                display: z.ZodEnum<{
                    separator: "separator";
                    worklog: "worklog";
                }>;
                status: z.ZodOptional<z.ZodString>;
                anchorMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                time: z.ZodOptional<z.ZodObject<{
                    start: z.ZodOptional<z.ZodNumber>;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                operationId: z.ZodOptional<z.ZodString>;
                trigger: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    manual: "manual";
                    partial: "partial";
                    reactive: "reactive";
                    session_memory: "session_memory";
                }>>;
                phase: z.ZodOptional<z.ZodEnum<{
                    reactive: "reactive";
                    standalone_turn: "standalone_turn";
                    pre_request: "pre_request";
                    mid_turn: "mid_turn";
                }>>;
                compactReason: z.ZodOptional<z.ZodString>;
                boundaryId: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                attempt: z.ZodOptional<z.ZodNumber>;
                maxAttempts: z.ZodOptional<z.ZodNumber>;
                reason: z.ZodOptional<z.ZodString>;
                targetId: z.ZodOptional<z.ZodString>;
                verificationId: z.ZodOptional<z.ZodString>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                verification: z.ZodOptional<z.ZodObject<{
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strict>>;
                parentSessionId: z.ZodOptional<z.ZodString>;
                targetMessageId: z.ZodOptional<z.ZodString>;
                targetCheckpointId: z.ZodOptional<z.ZodString>;
                restoredFileCount: z.ZodOptional<z.ZodNumber>;
                fromModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                toModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"subagent">;
                prompt: z.ZodString;
                description: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                command: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"agent">;
                name: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"retry">;
                attempt: z.ZodNumber;
                error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, z.core.$strict>], "type">>;
        }, z.core.$strict>>;
        goalStats: z.ZodOptional<z.ZodObject<{
            timeUsedSeconds: z.ZodNumber;
            tokensUsed: z.ZodNumber;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            toolCallCount: z.ZodNumber;
            iterationCount: z.ZodNumber;
        }, z.core.$strict>>;
        todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                completed: "completed";
                in_progress: "in_progress";
            }>;
            priority: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
            }>;
        }, z.core.$strict>>>;
        todoGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            source: z.ZodEnum<{
                session: "session";
                goal_iteration: "goal_iteration";
            }>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            targetId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodNumber>;
            todos: z.ZodArray<z.ZodObject<{
                content: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    completed: "completed";
                    in_progress: "in_progress";
                }>;
                priority: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        slashCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeSessionListResultSchema: z.ZodObject<{
    sessions: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        workspace: z.ZodObject<{
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            workspaceKey: z.ZodString;
        }, z.core.$strict>;
        parentSessionId: z.ZodOptional<z.ZodString>;
        traceId: z.ZodOptional<z.ZodString>;
        sessionKind: z.ZodEnum<{
            fork: "fork";
            selection_side_chat: "selection_side_chat";
            interactive: "interactive";
            workflow_parent: "workflow_parent";
            workflow_child: "workflow_child";
            subagent_child: "subagent_child";
            nested_workflow_child: "nested_workflow_child";
        }>;
        title: z.ZodString;
        titleSource: z.ZodOptional<z.ZodEnum<{
            default: "default";
            custom: "custom";
            first_input: "first_input";
            generated: "generated";
        }>>;
        mode: z.ZodEnum<{
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
        }>;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            error: "error";
            idle: "idle";
            waiting: "waiting";
            paused: "paused";
        }>;
        model: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            sessionId: z.ZodString;
            targetId: z.ZodString;
            objective: z.ZodString;
            summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            status: z.ZodEnum<{
                active: "active";
                complete: "complete";
                paused: "paused";
                budget_limited: "budget_limited";
            }>;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            tokensUsed: z.ZodNumber;
            timeUsedSeconds: z.ZodNumber;
            activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
        }, z.core.$strict>>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        archivedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeSessionRunningSubagentSchema: z.ZodObject<{
    childSessionId: z.ZodString;
    agentId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    subagentType: z.ZodString;
    title: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodNumber>;
    endedAt: z.ZodOptional<z.ZodNumber>;
    status: z.ZodEnum<{
        running: "running";
        waiting: "waiting";
        blocked: "blocked";
    }>;
}, z.core.$strict>;
export type ZCodeSessionRunningSubagent = z.infer<typeof zcodeSessionRunningSubagentSchema>;
export declare const zcodeSessionEndedSubagentSchema: z.ZodObject<{
    childSessionId: z.ZodString;
    agentId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    subagentType: z.ZodString;
    title: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodOptional<z.ZodNumber>;
    endedAt: z.ZodOptional<z.ZodNumber>;
    status: z.ZodEnum<{
        failed: "failed";
        lost: "lost";
        success: "success";
        cancelled: "cancelled";
    }>;
}, z.core.$strict>;
export type ZCodeSessionEndedSubagent = z.infer<typeof zcodeSessionEndedSubagentSchema>;
export declare const zcodeSessionSubagentsResultSchema: z.ZodObject<{
    revision: z.ZodNumber;
    childSessionIds: z.ZodArray<z.ZodString>;
    running: z.ZodArray<z.ZodObject<{
        childSessionId: z.ZodString;
        agentId: z.ZodOptional<z.ZodString>;
        toolCallId: z.ZodOptional<z.ZodString>;
        subagentType: z.ZodString;
        title: z.ZodString;
        summary: z.ZodOptional<z.ZodString>;
        startedAt: z.ZodOptional<z.ZodNumber>;
        endedAt: z.ZodOptional<z.ZodNumber>;
        status: z.ZodEnum<{
            running: "running";
            waiting: "waiting";
            blocked: "blocked";
        }>;
    }, z.core.$strict>>;
    ended: z.ZodObject<{
        total: z.ZodNumber;
        items: z.ZodArray<z.ZodObject<{
            childSessionId: z.ZodString;
            agentId: z.ZodOptional<z.ZodString>;
            toolCallId: z.ZodOptional<z.ZodString>;
            subagentType: z.ZodString;
            title: z.ZodString;
            summary: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            endedAt: z.ZodOptional<z.ZodNumber>;
            status: z.ZodEnum<{
                failed: "failed";
                lost: "lost";
                success: "success";
                cancelled: "cancelled";
            }>;
        }, z.core.$strict>>;
        nextCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeSessionSubagentsResult = z.infer<typeof zcodeSessionSubagentsResultSchema>;
/** 服务端 feature key 的取值域在协议里的 zod 形态（packages/shared/src/dynamic-workflow-feature.ts）。 */
export declare const zcodeDynamicWorkflowModeSchema: z.ZodEnum<{
    disabled: "disabled";
    onDemand: "onDemand";
    alwaysOn: "alwaysOn";
}>;
export declare const zcodeSessionCreateParamsSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    parentSessionId: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>>;
    model: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    persistence: z.ZodOptional<z.ZodEnum<{
        immediate: "immediate";
        deferred: "deferred";
    }>>;
    thoughtLevel: z.ZodOptional<z.ZodString>;
    titleGenerationEnabled: z.ZodOptional<z.ZodBoolean>;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        name: z.ZodString;
        command: z.ZodString;
        args: z.ZodArray<z.ZodString>;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            http: "http";
            sse: "sse";
        }>;
        url: z.ZodString;
        headers: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<"client_credentials">;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
            clientName: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"authorization_code">;
            clientId: z.ZodOptional<z.ZodString>;
            clientSecret: z.ZodOptional<z.ZodString>;
            clientName: z.ZodOptional<z.ZodString>;
            redirectPath: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>>;
    toolAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    toolDenylist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    importedHistory: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"claudeCode">;
        title: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodNumber>;
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                user: "user";
                assistant: "assistant";
            }>;
            content: z.ZodString;
            timestamp: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"sharedContext">;
        title: z.ZodString;
        createdAt: z.ZodOptional<z.ZodNumber>;
        markdown: z.ZodString;
        provenance: z.ZodObject<{
            shareId: z.ZodString;
            contextId: z.ZodOptional<z.ZodString>;
            shareUrl: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                reserved: "reserved";
                attached: "attached";
                discarded: "discarded";
            }>>;
            projectionSha256: z.ZodString;
            artifactSetSha256: z.ZodString;
            formatterVersion: z.ZodLiteral<1>;
            markdownSha256: z.ZodString;
            installedArtifacts: z.ZodArray<z.ZodObject<{
                artifactId: z.ZodString;
                workspaceRelativePath: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    }, z.core.$strict>], "source">>;
    offPeakToolEnabled: z.ZodOptional<z.ZodBoolean>;
    dynamicWorkflowEnabled: z.ZodOptional<z.ZodBoolean>;
    dynamicWorkflowMode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        onDemand: "onDemand";
        alwaysOn: "alwaysOn";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionCreateParams = z.infer<typeof zcodeSessionCreateParamsSchema>;
export declare const zcodeSessionResumeParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    workspace: z.ZodOptional<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>>;
    thoughtLevel: z.ZodOptional<z.ZodString>;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        name: z.ZodString;
        command: z.ZodString;
        args: z.ZodArray<z.ZodString>;
        env: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            http: "http";
            sse: "sse";
        }>;
        url: z.ZodString;
        headers: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strict>>;
        oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<"client_credentials">;
            clientId: z.ZodString;
            clientSecret: z.ZodString;
            clientName: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"authorization_code">;
            clientId: z.ZodOptional<z.ZodString>;
            clientSecret: z.ZodOptional<z.ZodString>;
            clientName: z.ZodOptional<z.ZodString>;
            redirectPath: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        isolation: z.ZodOptional<z.ZodEnum<{
            workspace: "workspace";
            session: "session";
        }>>;
        protocolVersion: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            legacy: "legacy";
            "2026-07-28": "2026-07-28";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>>;
    toolAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    toolDenylist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    offPeakToolEnabled: z.ZodOptional<z.ZodBoolean>;
    dynamicWorkflowEnabled: z.ZodOptional<z.ZodBoolean>;
    dynamicWorkflowMode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        onDemand: "onDemand";
        alwaysOn: "alwaysOn";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionResumeParams = z.infer<typeof zcodeSessionResumeParamsSchema>;
export declare const zcodeSessionListParamsSchema: z.ZodObject<{
    workspace: z.ZodOptional<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>>;
    sessionIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    includeArchived: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionListParams = z.infer<typeof zcodeSessionListParamsSchema>;
export declare const zcodeSessionSubagentsParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    endedCursor: z.ZodOptional<z.ZodString>;
    endedLimit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionSubagentsParams = z.infer<typeof zcodeSessionSubagentsParamsSchema>;
export declare const zcodeUsageStatsParamsSchema: z.ZodObject<{
    range: z.ZodEnum<{
        all: "all";
        "7d": "7d";
        "30d": "30d";
    }>;
    timeZone: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeUsageStatsResultSchema: z.ZodObject<{
    range: z.ZodEnum<{
        all: "all";
        "7d": "7d";
        "30d": "30d";
    }>;
    generatedAt: z.ZodNumber;
    timeZone: z.ZodString;
    source: z.ZodLiteral<"agent-db">;
    summary: z.ZodObject<{
        totalTokens: z.ZodNumber;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        reasoningTokens: z.ZodNumber;
        cacheCreationTokens: z.ZodNumber;
        cacheReadTokens: z.ZodNumber;
        cacheHitRate: z.ZodNumber;
        totalSessions: z.ZodNumber;
        totalTurns: z.ZodNumber;
        toolCallCount: z.ZodNumber;
        toolErrorRate: z.ZodNumber;
        modelErrorRate: z.ZodNumber;
        avgTimeToFirstTokenMs: z.ZodNullable<z.ZodNumber>;
        avgTurnDurationMs: z.ZodNullable<z.ZodNumber>;
        activeDays: z.ZodNumber;
        currentStreakDays: z.ZodNumber;
        longestSessionMs: z.ZodNumber;
        longestStreakDays: z.ZodNumber;
        peakDayTokens: z.ZodNumber;
        favoriteModel: z.ZodNullable<z.ZodObject<{
            modelId: z.ZodNullable<z.ZodString>;
            totalTokens: z.ZodNumber;
            share: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    heatmap: z.ZodObject<{
        startDate: z.ZodNullable<z.ZodString>;
        endDate: z.ZodNullable<z.ZodString>;
        maxTokens: z.ZodNumber;
        weeks: z.ZodArray<z.ZodObject<{
            weekIndex: z.ZodNumber;
            days: z.ZodArray<z.ZodNullable<z.ZodObject<{
                date: z.ZodString;
                level: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
                totalTokens: z.ZodNumber;
                turnCount: z.ZodNumber;
                toolCallCount: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    dailyModelUsage: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        models: z.ZodArray<z.ZodObject<{
            modelId: z.ZodNullable<z.ZodString>;
            totalTokens: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    models: z.ZodArray<z.ZodObject<{
        modelId: z.ZodNullable<z.ZodString>;
        totalTokens: z.ZodNumber;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        requestCount: z.ZodNumber;
        share: z.ZodNumber;
    }, z.core.$strip>>;
    tools: z.ZodArray<z.ZodObject<{
        toolName: z.ZodString;
        callCount: z.ZodNumber;
        errorCount: z.ZodNumber;
        errorRate: z.ZodNumber;
        avgDurationMs: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const zcodeTaskTokenUsageParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strict>;
export declare const zcodeTaskTokenUsageResultSchema: z.ZodObject<{
    sessionId: z.ZodString;
    totalTokens: z.ZodNumber;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    reasoningTokens: z.ZodNumber;
    cacheCreationTokens: z.ZodNumber;
    cacheReadTokens: z.ZodNumber;
    modelRequestCount: z.ZodNumber;
    modelErrorCount: z.ZodNumber;
    inputBaselineBySource: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeTaskTokenUsageResult = z.infer<typeof zcodeTaskTokenUsageResultSchema>;
export declare const zcodeSessionReadParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    deliveryKind: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    messageLimit: z.ZodOptional<z.ZodNumber>;
    afterSeq: z.ZodOptional<z.ZodNumber>;
    contentProfile: z.ZodOptional<z.ZodEnum<{
        index: "index";
        full: "full";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionReadParams = z.infer<typeof zcodeSessionReadParamsSchema>;
export declare const zcodeSessionMessagesParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    afterMessageId: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionMessagesParams = z.infer<typeof zcodeSessionMessagesParamsSchema>;
export declare const zcodeSessionEventsParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    afterSeq: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionEventsParams = z.infer<typeof zcodeSessionEventsParamsSchema>;
export declare const zcodeSessionRuntimePreferencesScopeSchema: z.ZodEnum<{
    "runtime-materialization": "runtime-materialization";
    "user-execution": "user-execution";
}>;
export type ZCodeSessionRuntimePreferencesScope = z.infer<typeof zcodeSessionRuntimePreferencesScopeSchema>;
export { subagentRuntimeConfigSchema, type SubagentRuntimeConfig, } from "../subagent-runtime-config.js";
export declare const zcodeSubagentsReadRuntimeConfigParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strict>;
export declare const ZCODE_SESSION_RUNTIME_PREFERENCES_REQUEST_TIMEOUT_MS = 15000;
export declare const zcodeSessionRequestRuntimePreferencesParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    scope: z.ZodEnum<{
        "runtime-materialization": "runtime-materialization";
        "user-execution": "user-execution";
    }>;
}, z.core.$strict>;
export type ZCodeSessionRequestRuntimePreferencesParams = z.infer<typeof zcodeSessionRequestRuntimePreferencesParamsSchema>;
export declare const DEFAULT_ZCODE_MODEL_CONTEXT_BUDGET_STRATEGY: "preflight-v1";
export declare const zcodeModelContextBudgetStrategySchema: z.ZodEnum<{
    legacy: "legacy";
    "preflight-v1": "preflight-v1";
}>;
export type ZCodeModelContextBudgetStrategy = z.infer<typeof zcodeModelContextBudgetStrategySchema>;
export declare const zcodeSessionRuntimePreferencesResultSchema: z.ZodObject<{
    nativeSearchEnhancementsEnabled: z.ZodBoolean;
    subagentRuntimeConfigEnabled: z.ZodOptional<z.ZodBoolean>;
    memoryEnabled: z.ZodDefault<z.ZodBoolean>;
    askUserQuestionAutoResolutionEnabled: z.ZodDefault<z.ZodBoolean>;
    integratedTerminalShell: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"auto">;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"shell">;
        dialect: z.ZodEnum<{
            cmd: "cmd";
            "git-bash": "git-bash";
        }>;
        id: z.ZodString;
        label: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>], "mode">>;
    modelContextBudgetStrategy: z.ZodDefault<z.ZodEnum<{
        legacy: "legacy";
        "preflight-v1": "preflight-v1";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionRuntimePreferencesResult = z.infer<typeof zcodeSessionRuntimePreferencesResultSchema>;
/**
 * App 在提交 prompt 前只读采集的 IAB 可见状态。该字段只用于 provider-visible
 * ambient context，不进入用户可见 transcript；内容有界，禁止携带页面正文或凭据。
 */
export declare const zcodeBrowserAmbientContextSchema: z.ZodObject<{
    tabCount: z.ZodNumber;
    currentUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeBrowserAmbientContext = z.infer<typeof zcodeBrowserAmbientContextSchema>;
export declare const zcodeSessionSendParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    modelExecution: z.ZodOptional<z.ZodObject<{
        memoryExtraction: z.ZodOptional<z.ZodLiteral<"skip">>;
        selectionScope: z.ZodLiteral<"execution">;
        requestAuth: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodString>;
            apiKeyId: z.ZodOptional<z.ZodString>;
            accountScope: z.ZodOptional<z.ZodString>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
        subagents: z.ZodOptional<z.ZodObject<{
            foregroundModel: z.ZodLiteral<"submission">;
            background: z.ZodLiteral<"deny">;
        }, z.core.$strict>>;
        selectionFallback: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            rules: z.ZodArray<z.ZodObject<{
                reason: z.ZodEnum<{
                    highspeed_card_expired: "highspeed_card_expired";
                    highspeed_request_failed: "highspeed_request_failed";
                }>;
                providerErrorCode: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            target: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    inputId: z.ZodOptional<z.ZodString>;
    queryId: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    browserAmbientContext: z.ZodOptional<z.ZodObject<{
        tabCount: z.ZodNumber;
        currentUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
    expectedProviderRevision: z.ZodOptional<z.ZodString>;
    automationId: z.ZodOptional<z.ZodString>;
    offPeakTaskId: z.ZodOptional<z.ZodString>;
    offPeakRunType: z.ZodOptional<z.ZodEnum<{
        init: "init";
        resume: "resume";
    }>>;
    botDeliveryTarget: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<{
            feishu: "feishu";
            lark: "lark";
            weixin: "weixin";
        }>;
        botId: z.ZodString;
        providerUserId: z.ZodString;
        chatType: z.ZodEnum<{
            private: "private";
            group: "group";
        }>;
        threadId: z.ZodOptional<z.ZodString>;
        rootMessageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    toolDenylist: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const zcodeSessionSendResultSchema: z.ZodObject<{
    sessionId: z.ZodString;
    accepted: z.ZodLiteral<true>;
    stateRevision: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeSessionSendResult = z.infer<typeof zcodeSessionSendResultSchema>;
export declare const zcodeSessionHistoryTargetSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"turn">;
    turnIndex: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"message">;
    messageId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"checkpoint">;
    checkpointId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"latestCheckpoint">;
}, z.core.$strict>], "kind">;
export type ZCodeSessionHistoryTarget = z.infer<typeof zcodeSessionHistoryTargetSchema>;
export declare const zcodeSessionForkParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    target: z.ZodDefault<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"turn">;
        turnIndex: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"message">;
        messageId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"checkpoint">;
        checkpointId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"latestCheckpoint">;
    }, z.core.$strict>], "kind">>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionForkParams = z.infer<typeof zcodeSessionForkParamsSchema>;
export declare const zcodeSessionForkResultSchema: z.ZodObject<{
    forkedSessionId: z.ZodString;
    parentSessionId: z.ZodOptional<z.ZodString>;
    targetMessageId: z.ZodOptional<z.ZodString>;
    targetCheckpointId: z.ZodOptional<z.ZodString>;
    response: z.ZodString;
    snapshot: z.ZodObject<{
        protocol: z.ZodObject<{
            name: z.ZodLiteral<"ZCode Protocol">;
            version: z.ZodLiteral<1>;
        }, z.core.$strict>;
        session: z.ZodObject<{
            sessionId: z.ZodString;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            traceId: z.ZodOptional<z.ZodString>;
            sessionKind: z.ZodEnum<{
                fork: "fork";
                selection_side_chat: "selection_side_chat";
                interactive: "interactive";
                workflow_parent: "workflow_parent";
                workflow_child: "workflow_child";
                subagent_child: "subagent_child";
                nested_workflow_child: "nested_workflow_child";
            }>;
            title: z.ZodString;
            titleSource: z.ZodOptional<z.ZodEnum<{
                default: "default";
                custom: "custom";
                first_input: "first_input";
                generated: "generated";
            }>>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            archivedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        settings: z.ZodObject<{
            model: z.ZodObject<{
                current: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                available: z.ZodArray<z.ZodObject<{
                    ref: z.ZodObject<{
                        providerId: z.ZodString;
                        modelId: z.ZodString;
                        options: z.ZodOptional<z.ZodObject<{
                            reasoningLevel: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    label: z.ZodString;
                    providerLabel: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    contextWindow: z.ZodOptional<z.ZodNumber>;
                    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodObject<{
                        levels: z.ZodArray<z.ZodObject<{
                            value: z.ZodString;
                            label: z.ZodString;
                            description: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        defaultLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    properties: z.ZodObject<{
                        inputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                            supportsImage: z.ZodBoolean;
                            supportsVideo: z.ZodBoolean;
                            supportsAudio: z.ZodBoolean;
                            supportsPdf: z.ZodBoolean;
                        }, z.core.$strict>;
                        outputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                        }, z.core.$strict>;
                    }, z.core.$strict>;
                    disabledReason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                lastUsed: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            thoughtLevel: z.ZodObject<{
                enabled: z.ZodBoolean;
                current: z.ZodOptional<z.ZodString>;
                defaultLevel: z.ZodOptional<z.ZodString>;
                available: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            mode: z.ZodObject<{
                current: z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>;
            }, z.core.$strict>;
            permission: z.ZodOptional<z.ZodObject<{
                mode: z.ZodOptional<z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>>;
                rulesRevision: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        projection: z.ZodObject<{
            sessionId: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            turnCount: z.ZodNumber;
            totalTokenCount: z.ZodNumber;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            currentTurnId: z.ZodOptional<z.ZodString>;
            pendingPermissions: z.ZodArray<z.ZodObject<{
                requestId: z.ZodString;
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                reason: z.ZodString;
                riskLevel: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                    critical: "critical";
                }>;
                input: z.ZodOptional<z.ZodUnknown>;
                origin: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"subagent">;
                    agentId: z.ZodString;
                    agentType: z.ZodString;
                    childSessionId: z.ZodString;
                    childTurnId: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    parentSessionId: z.ZodString;
                    parentToolCallId: z.ZodOptional<z.ZodString>;
                    parentTurnId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                options: z.ZodArray<z.ZodObject<{
                    optionId: z.ZodString;
                    kind: z.ZodString;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    response: z.ZodObject<{
                        decision: z.ZodEnum<{
                            allow: "allow";
                            deny: "deny";
                            escalate: "escalate";
                            modify: "modify";
                        }>;
                        reason: z.ZodOptional<z.ZodString>;
                        modifiedInput: z.ZodOptional<z.ZodUnknown>;
                        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            type: z.ZodLiteral<"addRules">;
                            behavior: z.ZodEnum<{
                                ask: "ask";
                                allow: "allow";
                                deny: "deny";
                            }>;
                            rules: z.ZodArray<z.ZodObject<{
                                toolName: z.ZodString;
                                ruleContent: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
                requestedAt: z.ZodNumber;
            }, z.core.$strict>>;
            activeToolCalls: z.ZodArray<z.ZodObject<{
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                    denied: "denied";
                }>;
                startedAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            lastError: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                code: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                detail: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        runtime: z.ZodObject<{
            eventSeq: z.ZodNumber;
            stateRevision: z.ZodNumber;
            deliveryKind: z.ZodOptional<z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>>;
            activeTurnId: z.ZodOptional<z.ZodString>;
            activeTurnKind: z.ZodOptional<z.ZodEnum<{
                rewind: "rewind";
                regular: "regular";
                compact: "compact";
            }>>;
            pendingRequestIds: z.ZodArray<z.ZodString>;
            apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                kind: z.ZodLiteral<"api_retry">;
                attempt: z.ZodNumber;
                maxRetries: z.ZodNumber;
                retryDelayMs: z.ZodNumber;
                errorStatus: z.ZodNullable<z.ZodNumber>;
                error: z.ZodString;
            }, z.core.$strict>>>;
            contextUsage: z.ZodOptional<z.ZodObject<{
                used: z.ZodNumber;
                size: z.ZodNumber;
                cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    amount: z.ZodNumber;
                    currency: z.ZodString;
                }, z.core.$strict>>>;
                cache: z.ZodOptional<z.ZodObject<{
                    inputTokens: z.ZodNumber;
                    cacheReadTokens: z.ZodNumber;
                    cacheWriteTokens: z.ZodNumber;
                    latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
                    totalInputTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
                    hitRate: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strict>>;
                breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    source: z.ZodEnum<{
                        system_prompt: "system_prompt";
                        meta_user_context: "meta_user_context";
                        skills: "skills";
                        tool_prompt: "tool_prompt";
                        system_tool_schemas: "system_tool_schemas";
                        mcp_tool_schemas: "mcp_tool_schemas";
                        messages: "messages";
                    }>;
                    chars: z.ZodNumber;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                passed: z.ZodBoolean;
                reason: z.ZodString;
            }, z.core.$strict>>>;
            goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
                version: z.ZodLiteral<1>;
                kind: z.ZodLiteral<"synthetic">;
                type: z.ZodLiteral<"goal_verification">;
                display: z.ZodLiteral<"separator">;
                targetId: z.ZodString;
                verificationId: z.ZodString;
                status: z.ZodEnum<{
                    completed: "completed";
                    started: "started";
                    cancelled: "cancelled";
                    failed_closed: "failed_closed";
                }>;
                verification: z.ZodOptional<z.ZodObject<{
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                }, z.core.$strict>>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        messages: z.ZodArray<z.ZodObject<{
            info: z.ZodDiscriminatedUnion<[z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"user">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                system: z.ZodOptional<z.ZodString>;
                tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                source: z.ZodOptional<z.ZodEnum<{
                    subagent: "subagent";
                    agent_listing_delta: "agent_listing_delta";
                    background_task: "background_task";
                    fork: "fork";
                    goal_state_change: "goal_state_change";
                    "goal-continuation": "goal-continuation";
                    plugin_reference: "plugin_reference";
                    bot_topic_context: "bot_topic_context";
                    rewind: "rewind";
                    selection_side_chat: "selection_side_chat";
                    subagent_message: "subagent_message";
                    todo_reminder: "todo_reminder";
                    workflow_launch: "workflow_launch";
                    shared_context: "shared_context";
                }>>;
                visibility: z.ZodOptional<z.ZodEnum<{
                    "user-visible": "user-visible";
                    "model-only": "model-only";
                }>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"assistant">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                parentMessageId: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                path: z.ZodObject<{
                    cwd: z.ZodString;
                    root: z.ZodString;
                }, z.core.$strict>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
                finish: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                structured: z.ZodOptional<z.ZodUnknown>;
            }, z.core.$strict>], "role">;
            parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                ignored: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"reasoning">;
                text: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"file">;
                mime: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"tool">;
                callId: z.ZodString;
                tool: z.ZodString;
                state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    status: z.ZodLiteral<"pending">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    raw: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"running">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    title: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"completed">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    output: z.ZodString;
                    title: z.ZodString;
                    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"error">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    error: z.ZodString;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>], "status">;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-start">;
                snapshot: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-finish">;
                reason: z.ZodString;
                snapshot: z.ZodOptional<z.ZodString>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"snapshot">;
                snapshot: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"patch">;
                hash: z.ZodString;
                files: z.ZodArray<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"compaction">;
                auto: z.ZodBoolean;
                reason: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"timeline">;
                timelineType: z.ZodEnum<{
                    goal_verification: "goal_verification";
                    context_compaction: "context_compaction";
                    session_fork: "session_fork";
                    model_change: "model_change";
                }>;
                display: z.ZodEnum<{
                    separator: "separator";
                    worklog: "worklog";
                }>;
                status: z.ZodOptional<z.ZodString>;
                anchorMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                time: z.ZodOptional<z.ZodObject<{
                    start: z.ZodOptional<z.ZodNumber>;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                operationId: z.ZodOptional<z.ZodString>;
                trigger: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    manual: "manual";
                    partial: "partial";
                    reactive: "reactive";
                    session_memory: "session_memory";
                }>>;
                phase: z.ZodOptional<z.ZodEnum<{
                    reactive: "reactive";
                    standalone_turn: "standalone_turn";
                    pre_request: "pre_request";
                    mid_turn: "mid_turn";
                }>>;
                compactReason: z.ZodOptional<z.ZodString>;
                boundaryId: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                attempt: z.ZodOptional<z.ZodNumber>;
                maxAttempts: z.ZodOptional<z.ZodNumber>;
                reason: z.ZodOptional<z.ZodString>;
                targetId: z.ZodOptional<z.ZodString>;
                verificationId: z.ZodOptional<z.ZodString>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                verification: z.ZodOptional<z.ZodObject<{
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strict>>;
                parentSessionId: z.ZodOptional<z.ZodString>;
                targetMessageId: z.ZodOptional<z.ZodString>;
                targetCheckpointId: z.ZodOptional<z.ZodString>;
                restoredFileCount: z.ZodOptional<z.ZodNumber>;
                fromModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                toModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"subagent">;
                prompt: z.ZodString;
                description: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                command: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"agent">;
                name: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"retry">;
                attempt: z.ZodNumber;
                error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, z.core.$strict>], "type">>;
        }, z.core.$strict>>;
        goalStats: z.ZodOptional<z.ZodObject<{
            timeUsedSeconds: z.ZodNumber;
            tokensUsed: z.ZodNumber;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            toolCallCount: z.ZodNumber;
            iterationCount: z.ZodNumber;
        }, z.core.$strict>>;
        todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                completed: "completed";
                in_progress: "in_progress";
            }>;
            priority: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
            }>;
        }, z.core.$strict>>>;
        todoGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            source: z.ZodEnum<{
                session: "session";
                goal_iteration: "goal_iteration";
            }>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            targetId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodNumber>;
            todos: z.ZodArray<z.ZodObject<{
                content: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    completed: "completed";
                    in_progress: "in_progress";
                }>;
                priority: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        slashCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeSessionForkResult = z.infer<typeof zcodeSessionForkResultSchema>;
export declare const zcodeSessionCompactParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    inputId: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionCompactParams = z.infer<typeof zcodeSessionCompactParamsSchema>;
export declare const zcodeSessionCompactResultSchema: z.ZodObject<{
    response: z.ZodString;
    snapshot: z.ZodObject<{
        protocol: z.ZodObject<{
            name: z.ZodLiteral<"ZCode Protocol">;
            version: z.ZodLiteral<1>;
        }, z.core.$strict>;
        session: z.ZodObject<{
            sessionId: z.ZodString;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            traceId: z.ZodOptional<z.ZodString>;
            sessionKind: z.ZodEnum<{
                fork: "fork";
                selection_side_chat: "selection_side_chat";
                interactive: "interactive";
                workflow_parent: "workflow_parent";
                workflow_child: "workflow_child";
                subagent_child: "subagent_child";
                nested_workflow_child: "nested_workflow_child";
            }>;
            title: z.ZodString;
            titleSource: z.ZodOptional<z.ZodEnum<{
                default: "default";
                custom: "custom";
                first_input: "first_input";
                generated: "generated";
            }>>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            archivedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        settings: z.ZodObject<{
            model: z.ZodObject<{
                current: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                available: z.ZodArray<z.ZodObject<{
                    ref: z.ZodObject<{
                        providerId: z.ZodString;
                        modelId: z.ZodString;
                        options: z.ZodOptional<z.ZodObject<{
                            reasoningLevel: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    label: z.ZodString;
                    providerLabel: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    contextWindow: z.ZodOptional<z.ZodNumber>;
                    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodObject<{
                        levels: z.ZodArray<z.ZodObject<{
                            value: z.ZodString;
                            label: z.ZodString;
                            description: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        defaultLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    properties: z.ZodObject<{
                        inputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                            supportsImage: z.ZodBoolean;
                            supportsVideo: z.ZodBoolean;
                            supportsAudio: z.ZodBoolean;
                            supportsPdf: z.ZodBoolean;
                        }, z.core.$strict>;
                        outputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                        }, z.core.$strict>;
                    }, z.core.$strict>;
                    disabledReason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                lastUsed: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            thoughtLevel: z.ZodObject<{
                enabled: z.ZodBoolean;
                current: z.ZodOptional<z.ZodString>;
                defaultLevel: z.ZodOptional<z.ZodString>;
                available: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            mode: z.ZodObject<{
                current: z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>;
            }, z.core.$strict>;
            permission: z.ZodOptional<z.ZodObject<{
                mode: z.ZodOptional<z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>>;
                rulesRevision: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        projection: z.ZodObject<{
            sessionId: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            turnCount: z.ZodNumber;
            totalTokenCount: z.ZodNumber;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            currentTurnId: z.ZodOptional<z.ZodString>;
            pendingPermissions: z.ZodArray<z.ZodObject<{
                requestId: z.ZodString;
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                reason: z.ZodString;
                riskLevel: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                    critical: "critical";
                }>;
                input: z.ZodOptional<z.ZodUnknown>;
                origin: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"subagent">;
                    agentId: z.ZodString;
                    agentType: z.ZodString;
                    childSessionId: z.ZodString;
                    childTurnId: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    parentSessionId: z.ZodString;
                    parentToolCallId: z.ZodOptional<z.ZodString>;
                    parentTurnId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                options: z.ZodArray<z.ZodObject<{
                    optionId: z.ZodString;
                    kind: z.ZodString;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    response: z.ZodObject<{
                        decision: z.ZodEnum<{
                            allow: "allow";
                            deny: "deny";
                            escalate: "escalate";
                            modify: "modify";
                        }>;
                        reason: z.ZodOptional<z.ZodString>;
                        modifiedInput: z.ZodOptional<z.ZodUnknown>;
                        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            type: z.ZodLiteral<"addRules">;
                            behavior: z.ZodEnum<{
                                ask: "ask";
                                allow: "allow";
                                deny: "deny";
                            }>;
                            rules: z.ZodArray<z.ZodObject<{
                                toolName: z.ZodString;
                                ruleContent: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
                requestedAt: z.ZodNumber;
            }, z.core.$strict>>;
            activeToolCalls: z.ZodArray<z.ZodObject<{
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                    denied: "denied";
                }>;
                startedAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            lastError: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                code: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                detail: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        runtime: z.ZodObject<{
            eventSeq: z.ZodNumber;
            stateRevision: z.ZodNumber;
            deliveryKind: z.ZodOptional<z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>>;
            activeTurnId: z.ZodOptional<z.ZodString>;
            activeTurnKind: z.ZodOptional<z.ZodEnum<{
                rewind: "rewind";
                regular: "regular";
                compact: "compact";
            }>>;
            pendingRequestIds: z.ZodArray<z.ZodString>;
            apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                kind: z.ZodLiteral<"api_retry">;
                attempt: z.ZodNumber;
                maxRetries: z.ZodNumber;
                retryDelayMs: z.ZodNumber;
                errorStatus: z.ZodNullable<z.ZodNumber>;
                error: z.ZodString;
            }, z.core.$strict>>>;
            contextUsage: z.ZodOptional<z.ZodObject<{
                used: z.ZodNumber;
                size: z.ZodNumber;
                cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    amount: z.ZodNumber;
                    currency: z.ZodString;
                }, z.core.$strict>>>;
                cache: z.ZodOptional<z.ZodObject<{
                    inputTokens: z.ZodNumber;
                    cacheReadTokens: z.ZodNumber;
                    cacheWriteTokens: z.ZodNumber;
                    latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
                    totalInputTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
                    hitRate: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strict>>;
                breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    source: z.ZodEnum<{
                        system_prompt: "system_prompt";
                        meta_user_context: "meta_user_context";
                        skills: "skills";
                        tool_prompt: "tool_prompt";
                        system_tool_schemas: "system_tool_schemas";
                        mcp_tool_schemas: "mcp_tool_schemas";
                        messages: "messages";
                    }>;
                    chars: z.ZodNumber;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                passed: z.ZodBoolean;
                reason: z.ZodString;
            }, z.core.$strict>>>;
            goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
                version: z.ZodLiteral<1>;
                kind: z.ZodLiteral<"synthetic">;
                type: z.ZodLiteral<"goal_verification">;
                display: z.ZodLiteral<"separator">;
                targetId: z.ZodString;
                verificationId: z.ZodString;
                status: z.ZodEnum<{
                    completed: "completed";
                    started: "started";
                    cancelled: "cancelled";
                    failed_closed: "failed_closed";
                }>;
                verification: z.ZodOptional<z.ZodObject<{
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                }, z.core.$strict>>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        messages: z.ZodArray<z.ZodObject<{
            info: z.ZodDiscriminatedUnion<[z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"user">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                system: z.ZodOptional<z.ZodString>;
                tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                source: z.ZodOptional<z.ZodEnum<{
                    subagent: "subagent";
                    agent_listing_delta: "agent_listing_delta";
                    background_task: "background_task";
                    fork: "fork";
                    goal_state_change: "goal_state_change";
                    "goal-continuation": "goal-continuation";
                    plugin_reference: "plugin_reference";
                    bot_topic_context: "bot_topic_context";
                    rewind: "rewind";
                    selection_side_chat: "selection_side_chat";
                    subagent_message: "subagent_message";
                    todo_reminder: "todo_reminder";
                    workflow_launch: "workflow_launch";
                    shared_context: "shared_context";
                }>>;
                visibility: z.ZodOptional<z.ZodEnum<{
                    "user-visible": "user-visible";
                    "model-only": "model-only";
                }>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"assistant">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                parentMessageId: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                path: z.ZodObject<{
                    cwd: z.ZodString;
                    root: z.ZodString;
                }, z.core.$strict>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
                finish: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                structured: z.ZodOptional<z.ZodUnknown>;
            }, z.core.$strict>], "role">;
            parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                ignored: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"reasoning">;
                text: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"file">;
                mime: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"tool">;
                callId: z.ZodString;
                tool: z.ZodString;
                state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    status: z.ZodLiteral<"pending">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    raw: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"running">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    title: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"completed">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    output: z.ZodString;
                    title: z.ZodString;
                    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"error">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    error: z.ZodString;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>], "status">;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-start">;
                snapshot: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-finish">;
                reason: z.ZodString;
                snapshot: z.ZodOptional<z.ZodString>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"snapshot">;
                snapshot: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"patch">;
                hash: z.ZodString;
                files: z.ZodArray<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"compaction">;
                auto: z.ZodBoolean;
                reason: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"timeline">;
                timelineType: z.ZodEnum<{
                    goal_verification: "goal_verification";
                    context_compaction: "context_compaction";
                    session_fork: "session_fork";
                    model_change: "model_change";
                }>;
                display: z.ZodEnum<{
                    separator: "separator";
                    worklog: "worklog";
                }>;
                status: z.ZodOptional<z.ZodString>;
                anchorMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                time: z.ZodOptional<z.ZodObject<{
                    start: z.ZodOptional<z.ZodNumber>;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                operationId: z.ZodOptional<z.ZodString>;
                trigger: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    manual: "manual";
                    partial: "partial";
                    reactive: "reactive";
                    session_memory: "session_memory";
                }>>;
                phase: z.ZodOptional<z.ZodEnum<{
                    reactive: "reactive";
                    standalone_turn: "standalone_turn";
                    pre_request: "pre_request";
                    mid_turn: "mid_turn";
                }>>;
                compactReason: z.ZodOptional<z.ZodString>;
                boundaryId: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                attempt: z.ZodOptional<z.ZodNumber>;
                maxAttempts: z.ZodOptional<z.ZodNumber>;
                reason: z.ZodOptional<z.ZodString>;
                targetId: z.ZodOptional<z.ZodString>;
                verificationId: z.ZodOptional<z.ZodString>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                verification: z.ZodOptional<z.ZodObject<{
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strict>>;
                parentSessionId: z.ZodOptional<z.ZodString>;
                targetMessageId: z.ZodOptional<z.ZodString>;
                targetCheckpointId: z.ZodOptional<z.ZodString>;
                restoredFileCount: z.ZodOptional<z.ZodNumber>;
                fromModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                toModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"subagent">;
                prompt: z.ZodString;
                description: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                command: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"agent">;
                name: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"retry">;
                attempt: z.ZodNumber;
                error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, z.core.$strict>], "type">>;
        }, z.core.$strict>>;
        goalStats: z.ZodOptional<z.ZodObject<{
            timeUsedSeconds: z.ZodNumber;
            tokensUsed: z.ZodNumber;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            toolCallCount: z.ZodNumber;
            iterationCount: z.ZodNumber;
        }, z.core.$strict>>;
        todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                completed: "completed";
                in_progress: "in_progress";
            }>;
            priority: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
            }>;
        }, z.core.$strict>>>;
        todoGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            source: z.ZodEnum<{
                session: "session";
                goal_iteration: "goal_iteration";
            }>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            targetId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodNumber>;
            todos: z.ZodArray<z.ZodObject<{
                content: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    completed: "completed";
                    in_progress: "in_progress";
                }>;
                priority: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        slashCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    compact: z.ZodOptional<z.ZodObject<{
        state: z.ZodEnum<{
            accepted: "accepted";
            already_running: "already_running";
        }>;
        inputId: z.ZodOptional<z.ZodString>;
        operationId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeSessionCompactResult = z.infer<typeof zcodeSessionCompactResultSchema>;
export declare const zcodeSessionGoalActionSchema: z.ZodEnum<{
    set: "set";
    replace: "replace";
    resume: "resume";
    clear: "clear";
    show: "show";
    pause: "pause";
}>;
export type ZCodeSessionGoalAction = z.infer<typeof zcodeSessionGoalActionSchema>;
export declare const zcodeSessionGoalParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    inputId: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        set: "set";
        replace: "replace";
        resume: "resume";
        clear: "clear";
        show: "show";
        pause: "pause";
    }>;
    objective: z.ZodOptional<z.ZodString>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionGoalParams = z.infer<typeof zcodeSessionGoalParamsSchema>;
export declare const zcodeSessionGoalResultSchema: z.ZodObject<{
    response: z.ZodString;
    snapshot: z.ZodObject<{
        protocol: z.ZodObject<{
            name: z.ZodLiteral<"ZCode Protocol">;
            version: z.ZodLiteral<1>;
        }, z.core.$strict>;
        session: z.ZodObject<{
            sessionId: z.ZodString;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            parentSessionId: z.ZodOptional<z.ZodString>;
            traceId: z.ZodOptional<z.ZodString>;
            sessionKind: z.ZodEnum<{
                fork: "fork";
                selection_side_chat: "selection_side_chat";
                interactive: "interactive";
                workflow_parent: "workflow_parent";
                workflow_child: "workflow_child";
                subagent_child: "subagent_child";
                nested_workflow_child: "nested_workflow_child";
            }>;
            title: z.ZodString;
            titleSource: z.ZodOptional<z.ZodEnum<{
                default: "default";
                custom: "custom";
                first_input: "first_input";
                generated: "generated";
            }>>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            model: z.ZodOptional<z.ZodObject<{
                providerId: z.ZodString;
                modelId: z.ZodString;
                options: z.ZodOptional<z.ZodObject<{
                    reasoningLevel: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            createdAt: z.ZodNumber;
            updatedAt: z.ZodNumber;
            archivedAt: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>;
        settings: z.ZodObject<{
            model: z.ZodObject<{
                current: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                available: z.ZodArray<z.ZodObject<{
                    ref: z.ZodObject<{
                        providerId: z.ZodString;
                        modelId: z.ZodString;
                        options: z.ZodOptional<z.ZodObject<{
                            reasoningLevel: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                    }, z.core.$strict>;
                    label: z.ZodString;
                    providerLabel: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    contextWindow: z.ZodOptional<z.ZodNumber>;
                    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodObject<{
                        levels: z.ZodArray<z.ZodObject<{
                            value: z.ZodString;
                            label: z.ZodString;
                            description: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        defaultLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    properties: z.ZodObject<{
                        inputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                            supportsImage: z.ZodBoolean;
                            supportsVideo: z.ZodBoolean;
                            supportsAudio: z.ZodBoolean;
                            supportsPdf: z.ZodBoolean;
                        }, z.core.$strict>;
                        outputFormat: z.ZodObject<{
                            supportsText: z.ZodBoolean;
                        }, z.core.$strict>;
                    }, z.core.$strict>;
                    disabledReason: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                lastUsed: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            thoughtLevel: z.ZodObject<{
                enabled: z.ZodBoolean;
                current: z.ZodOptional<z.ZodString>;
                defaultLevel: z.ZodOptional<z.ZodString>;
                available: z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            mode: z.ZodObject<{
                current: z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>;
            }, z.core.$strict>;
            permission: z.ZodOptional<z.ZodObject<{
                mode: z.ZodOptional<z.ZodEnum<{
                    plan: "plan";
                    build: "build";
                    edit: "edit";
                    yolo: "yolo";
                    guarded: "guarded";
                    auto: "auto";
                }>>;
                rulesRevision: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        projection: z.ZodObject<{
            sessionId: z.ZodString;
            status: z.ZodEnum<{
                running: "running";
                completed: "completed";
                error: "error";
                idle: "idle";
                waiting: "waiting";
                paused: "paused";
            }>;
            mode: z.ZodEnum<{
                plan: "plan";
                build: "build";
                edit: "edit";
                yolo: "yolo";
                guarded: "guarded";
                auto: "auto";
            }>;
            turnCount: z.ZodNumber;
            totalTokenCount: z.ZodNumber;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            currentTurnId: z.ZodOptional<z.ZodString>;
            pendingPermissions: z.ZodArray<z.ZodObject<{
                requestId: z.ZodString;
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                reason: z.ZodString;
                riskLevel: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                    critical: "critical";
                }>;
                input: z.ZodOptional<z.ZodUnknown>;
                origin: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"subagent">;
                    agentId: z.ZodString;
                    agentType: z.ZodString;
                    childSessionId: z.ZodString;
                    childTurnId: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    parentSessionId: z.ZodString;
                    parentToolCallId: z.ZodOptional<z.ZodString>;
                    parentTurnId: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                options: z.ZodArray<z.ZodObject<{
                    optionId: z.ZodString;
                    kind: z.ZodString;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    response: z.ZodObject<{
                        decision: z.ZodEnum<{
                            allow: "allow";
                            deny: "deny";
                            escalate: "escalate";
                            modify: "modify";
                        }>;
                        reason: z.ZodOptional<z.ZodString>;
                        modifiedInput: z.ZodOptional<z.ZodUnknown>;
                        permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            type: z.ZodLiteral<"addRules">;
                            behavior: z.ZodEnum<{
                                ask: "ask";
                                allow: "allow";
                                deny: "deny";
                            }>;
                            rules: z.ZodArray<z.ZodObject<{
                                toolName: z.ZodString;
                                ruleContent: z.ZodOptional<z.ZodString>;
                            }, z.core.$strict>>;
                        }, z.core.$strict>>>;
                    }, z.core.$strict>;
                }, z.core.$strict>>;
                requestedAt: z.ZodNumber;
            }, z.core.$strict>>;
            activeToolCalls: z.ZodArray<z.ZodObject<{
                toolCallId: z.ZodString;
                toolName: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                    denied: "denied";
                }>;
                startedAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            backgroundJobs: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                sessionId: z.ZodString;
                targetId: z.ZodString;
                objective: z.ZodString;
                summaryTitle: z.ZodDefault<z.ZodNullable<z.ZodString>>;
                status: z.ZodEnum<{
                    active: "active";
                    complete: "complete";
                    paused: "paused";
                    budget_limited: "budget_limited";
                }>;
                tokenBudget: z.ZodNullable<z.ZodNumber>;
                tokensUsed: z.ZodNumber;
                timeUsedSeconds: z.ZodNumber;
                activeInputId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                activeRunStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                activeRunLastSeenAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
            lastError: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                code: z.ZodOptional<z.ZodString>;
                message: z.ZodString;
                detail: z.ZodOptional<z.ZodString>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodOptional<z.ZodEnum<{
                        provider: "provider";
                        tool: "tool";
                        runtime: "runtime";
                        network: "network";
                    }>>;
                    reason: z.ZodOptional<z.ZodString>;
                    errorPhase: z.ZodOptional<z.ZodEnum<{
                        response: "response";
                        prepare: "prepare";
                        configuration: "configuration";
                        connect: "connect";
                        stream: "stream";
                        parse: "parse";
                        validation: "validation";
                        unhandled: "unhandled";
                    }>>;
                    exceptionKind: z.ZodOptional<z.ZodEnum<{
                        validation: "validation";
                        api_call: "api_call";
                        generic: "generic";
                        protocol: "protocol";
                        provider_business: "provider_business";
                        transport: "transport";
                        type_error: "type_error";
                    }>>;
                    providerId: z.ZodOptional<z.ZodString>;
                    modelId: z.ZodOptional<z.ZodString>;
                    providerKind: z.ZodOptional<z.ZodString>;
                    transport: z.ZodOptional<z.ZodEnum<{
                        http: "http";
                        sse: "sse";
                        websocket: "websocket";
                    }>>;
                    statusCode: z.ZodOptional<z.ZodNumber>;
                    providerErrorCode: z.ZodOptional<z.ZodString>;
                    retryable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        runtime: z.ZodObject<{
            eventSeq: z.ZodNumber;
            stateRevision: z.ZodNumber;
            deliveryKind: z.ZodOptional<z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>>;
            activeTurnId: z.ZodOptional<z.ZodString>;
            activeTurnKind: z.ZodOptional<z.ZodEnum<{
                rewind: "rewind";
                regular: "regular";
                compact: "compact";
            }>>;
            pendingRequestIds: z.ZodArray<z.ZodString>;
            apiRetry: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                kind: z.ZodLiteral<"api_retry">;
                attempt: z.ZodNumber;
                maxRetries: z.ZodNumber;
                retryDelayMs: z.ZodNumber;
                errorStatus: z.ZodNullable<z.ZodNumber>;
                error: z.ZodString;
            }, z.core.$strict>>>;
            contextUsage: z.ZodOptional<z.ZodObject<{
                used: z.ZodNumber;
                size: z.ZodNumber;
                cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    amount: z.ZodNumber;
                    currency: z.ZodString;
                }, z.core.$strict>>>;
                cache: z.ZodOptional<z.ZodObject<{
                    inputTokens: z.ZodNumber;
                    cacheReadTokens: z.ZodNumber;
                    cacheWriteTokens: z.ZodNumber;
                    latestHitRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    hitRateRequestCount: z.ZodOptional<z.ZodNumber>;
                    totalInputTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheReadTokens: z.ZodOptional<z.ZodNumber>;
                    totalCacheWriteTokens: z.ZodOptional<z.ZodNumber>;
                    hitRate: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strict>>;
                breakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    source: z.ZodEnum<{
                        system_prompt: "system_prompt";
                        meta_user_context: "meta_user_context";
                        skills: "skills";
                        tool_prompt: "tool_prompt";
                        system_tool_schemas: "system_tool_schemas";
                        mcp_tool_schemas: "mcp_tool_schemas";
                        messages: "messages";
                    }>;
                    chars: z.ZodNumber;
                }, z.core.$strict>>>;
            }, z.core.$strict>>;
            goalVerifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
                nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                passed: z.ZodBoolean;
                reason: z.ZodString;
            }, z.core.$strict>>>;
            goalVerificationTimeline: z.ZodOptional<z.ZodArray<z.ZodObject<{
                version: z.ZodLiteral<1>;
                kind: z.ZodLiteral<"synthetic">;
                type: z.ZodLiteral<"goal_verification">;
                display: z.ZodLiteral<"separator">;
                targetId: z.ZodString;
                verificationId: z.ZodString;
                status: z.ZodEnum<{
                    completed: "completed";
                    started: "started";
                    cancelled: "cancelled";
                    failed_closed: "failed_closed";
                }>;
                verification: z.ZodOptional<z.ZodObject<{
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                }, z.core.$strict>>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                anchorAssistantMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                startedAt: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodNumber;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        messages: z.ZodArray<z.ZodObject<{
            info: z.ZodDiscriminatedUnion<[z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"user">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                system: z.ZodOptional<z.ZodString>;
                tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                source: z.ZodOptional<z.ZodEnum<{
                    subagent: "subagent";
                    agent_listing_delta: "agent_listing_delta";
                    background_task: "background_task";
                    fork: "fork";
                    goal_state_change: "goal_state_change";
                    "goal-continuation": "goal-continuation";
                    plugin_reference: "plugin_reference";
                    bot_topic_context: "bot_topic_context";
                    rewind: "rewind";
                    selection_side_chat: "selection_side_chat";
                    subagent_message: "subagent_message";
                    todo_reminder: "todo_reminder";
                    workflow_launch: "workflow_launch";
                    shared_context: "shared_context";
                }>>;
                visibility: z.ZodOptional<z.ZodEnum<{
                    "user-visible": "user-visible";
                    "model-only": "model-only";
                }>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                messageId: z.ZodString;
                sessionId: z.ZodString;
                role: z.ZodLiteral<"assistant">;
                time: z.ZodObject<{
                    created: z.ZodNumber;
                    completed: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>;
                parentMessageId: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                path: z.ZodObject<{
                    cwd: z.ZodString;
                    root: z.ZodString;
                }, z.core.$strict>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
                finish: z.ZodOptional<z.ZodString>;
                error: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                semantics: z.ZodOptional<z.ZodObject<{
                    origin: z.ZodEnum<{
                        real_user: "real_user";
                        agent_runtime: "agent_runtime";
                        system: "system";
                        migration: "migration";
                        import: "import";
                    }>;
                    kind: z.ZodEnum<{
                        todo_reminder: "todo_reminder";
                        shared_context: "shared_context";
                        user_prompt: "user_prompt";
                        slash_command: "slash_command";
                        system_reminder: "system_reminder";
                        background_notification: "background_notification";
                        subagent_notification: "subagent_notification";
                        rewind_notice: "rewind_notice";
                        fork_notice: "fork_notice";
                        timeline_event: "timeline_event";
                        compact_summary: "compact_summary";
                        assistant_response: "assistant_response";
                    }>;
                    source: z.ZodOptional<z.ZodString>;
                    commandName: z.ZodOptional<z.ZodString>;
                    uiVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        debug: "debug";
                    }>;
                    providerVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                    transcriptVisibility: z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                    }>;
                }, z.core.$strict>>;
                structured: z.ZodOptional<z.ZodUnknown>;
            }, z.core.$strict>], "role">;
            parts: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
                synthetic: z.ZodOptional<z.ZodBoolean>;
                ignored: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"reasoning">;
                text: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"file">;
                mime: z.ZodString;
                filename: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"tool">;
                callId: z.ZodString;
                tool: z.ZodString;
                state: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    status: z.ZodLiteral<"pending">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    raw: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"running">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    title: z.ZodOptional<z.ZodString>;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"completed">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    output: z.ZodString;
                    title: z.ZodString;
                    metadata: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>, z.ZodObject<{
                    status: z.ZodLiteral<"error">;
                    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    error: z.ZodString;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    startedAt: z.ZodNumber;
                    completedAt: z.ZodNumber;
                }, z.core.$strict>], "status">;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-start">;
                snapshot: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"step-finish">;
                reason: z.ZodString;
                snapshot: z.ZodOptional<z.ZodString>;
                cost: z.ZodNumber;
                tokens: z.ZodObject<{
                    total: z.ZodOptional<z.ZodNumber>;
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    reasoning: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, z.core.$strict>;
                }, z.core.$strict>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"snapshot">;
                snapshot: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"patch">;
                hash: z.ZodString;
                files: z.ZodArray<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"compaction">;
                auto: z.ZodBoolean;
                reason: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"timeline">;
                timelineType: z.ZodEnum<{
                    goal_verification: "goal_verification";
                    context_compaction: "context_compaction";
                    session_fork: "session_fork";
                    model_change: "model_change";
                }>;
                display: z.ZodEnum<{
                    separator: "separator";
                    worklog: "worklog";
                }>;
                status: z.ZodOptional<z.ZodString>;
                anchorMessageId: z.ZodOptional<z.ZodString>;
                anchorTurnId: z.ZodOptional<z.ZodString>;
                time: z.ZodOptional<z.ZodObject<{
                    start: z.ZodOptional<z.ZodNumber>;
                    end: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                operationId: z.ZodOptional<z.ZodString>;
                trigger: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    manual: "manual";
                    partial: "partial";
                    reactive: "reactive";
                    session_memory: "session_memory";
                }>>;
                phase: z.ZodOptional<z.ZodEnum<{
                    reactive: "reactive";
                    standalone_turn: "standalone_turn";
                    pre_request: "pre_request";
                    mid_turn: "mid_turn";
                }>>;
                compactReason: z.ZodOptional<z.ZodString>;
                boundaryId: z.ZodOptional<z.ZodString>;
                summaryMessageId: z.ZodOptional<z.ZodString>;
                preCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                postCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                truePostCompactTokenCount: z.ZodOptional<z.ZodNumber>;
                attempt: z.ZodOptional<z.ZodNumber>;
                maxAttempts: z.ZodOptional<z.ZodNumber>;
                reason: z.ZodOptional<z.ZodString>;
                targetId: z.ZodOptional<z.ZodString>;
                verificationId: z.ZodOptional<z.ZodString>;
                goalIteration: z.ZodOptional<z.ZodNumber>;
                verification: z.ZodOptional<z.ZodObject<{
                    passed: z.ZodBoolean;
                    reason: z.ZodString;
                    nextAction: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strict>>;
                parentSessionId: z.ZodOptional<z.ZodString>;
                targetMessageId: z.ZodOptional<z.ZodString>;
                targetCheckpointId: z.ZodOptional<z.ZodString>;
                restoredFileCount: z.ZodOptional<z.ZodNumber>;
                fromModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
                toModel: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                    label: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"subagent">;
                prompt: z.ZodString;
                description: z.ZodString;
                agent: z.ZodString;
                model: z.ZodOptional<z.ZodObject<{
                    providerId: z.ZodString;
                    modelId: z.ZodString;
                    options: z.ZodOptional<z.ZodObject<{
                        reasoningLevel: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>;
                }, z.core.$strict>>;
                command: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"agent">;
                name: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                partId: z.ZodString;
                sessionId: z.ZodString;
                messageId: z.ZodString;
                type: z.ZodLiteral<"retry">;
                attempt: z.ZodNumber;
                error: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, z.core.$strict>], "type">>;
        }, z.core.$strict>>;
        goalStats: z.ZodOptional<z.ZodObject<{
            timeUsedSeconds: z.ZodNumber;
            tokensUsed: z.ZodNumber;
            tokenBudget: z.ZodNullable<z.ZodNumber>;
            contextUsed: z.ZodNumber;
            contextWindow: z.ZodNumber;
            toolCallCount: z.ZodNumber;
            iterationCount: z.ZodNumber;
        }, z.core.$strict>>;
        todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                completed: "completed";
                in_progress: "in_progress";
            }>;
            priority: z.ZodEnum<{
                high: "high";
                medium: "medium";
                low: "low";
            }>;
        }, z.core.$strict>>>;
        todoGroups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            source: z.ZodEnum<{
                session: "session";
                goal_iteration: "goal_iteration";
            }>;
            goalIteration: z.ZodOptional<z.ZodNumber>;
            targetId: z.ZodOptional<z.ZodString>;
            startedAt: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodNumber>;
            todos: z.ZodArray<z.ZodObject<{
                content: z.ZodString;
                status: z.ZodEnum<{
                    pending: "pending";
                    completed: "completed";
                    in_progress: "in_progress";
                }>;
                priority: z.ZodEnum<{
                    high: "high";
                    medium: "medium";
                    low: "low";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        slashCommands: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputHint: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                builtin: "builtin";
            }>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    startedTurn: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeSessionGoalResult = z.infer<typeof zcodeSessionGoalResultSchema>;
export declare const zcodeSessionStopParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, z.core.$strict>;
export declare const zcodeBackgroundTaskInfoSchema: z.ZodObject<{
    taskId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodString>;
    toolName: z.ZodOptional<z.ZodString>;
    taskKind: z.ZodOptional<z.ZodEnum<{
        bash: "bash";
        subagent: "subagent";
    }>>;
    blocked: z.ZodOptional<z.ZodBoolean>;
    blockedReason: z.ZodOptional<z.ZodString>;
    cancellable: z.ZodOptional<z.ZodBoolean>;
    cancelRequestedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
    command: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        lost: "lost";
        spawn_error: "spawn_error";
        cancelled: "cancelled";
        timed_out: "timed_out";
    }>;
    pid: z.ZodOptional<z.ZodNumber>;
    startedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
    completedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
    outputPath: z.ZodOptional<z.ZodString>;
    stderrPersistedOutputPath: z.ZodOptional<z.ZodString>;
    stdoutPersistedOutputPath: z.ZodOptional<z.ZodString>;
    outputBytes: z.ZodOptional<z.ZodNumber>;
    outputTruncated: z.ZodOptional<z.ZodBoolean>;
    outputTail: z.ZodOptional<z.ZodString>;
    stderrBytes: z.ZodOptional<z.ZodNumber>;
    stderrTail: z.ZodOptional<z.ZodString>;
    stdoutBytes: z.ZodOptional<z.ZodNumber>;
    stdoutTail: z.ZodOptional<z.ZodString>;
    terminalId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeSessionCancelBackgroundTaskParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    taskId: z.ZodString;
}, z.core.$strict>;
export type ZCodeSessionCancelBackgroundTaskParams = z.infer<typeof zcodeSessionCancelBackgroundTaskParamsSchema>;
export declare const zcodeSessionCancelBackgroundTaskResultSchema: z.ZodObject<{
    cancelled: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    snapshot: z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
        toolCallId: z.ZodOptional<z.ZodString>;
        toolName: z.ZodOptional<z.ZodString>;
        taskKind: z.ZodOptional<z.ZodEnum<{
            bash: "bash";
            subagent: "subagent";
        }>>;
        blocked: z.ZodOptional<z.ZodBoolean>;
        blockedReason: z.ZodOptional<z.ZodString>;
        cancellable: z.ZodOptional<z.ZodBoolean>;
        cancelRequestedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
        command: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
            lost: "lost";
            spawn_error: "spawn_error";
            cancelled: "cancelled";
            timed_out: "timed_out";
        }>;
        pid: z.ZodOptional<z.ZodNumber>;
        startedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
        completedAt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodDate]>>;
        outputPath: z.ZodOptional<z.ZodString>;
        stderrPersistedOutputPath: z.ZodOptional<z.ZodString>;
        stdoutPersistedOutputPath: z.ZodOptional<z.ZodString>;
        outputBytes: z.ZodOptional<z.ZodNumber>;
        outputTruncated: z.ZodOptional<z.ZodBoolean>;
        outputTail: z.ZodOptional<z.ZodString>;
        stderrBytes: z.ZodOptional<z.ZodNumber>;
        stderrTail: z.ZodOptional<z.ZodString>;
        stdoutBytes: z.ZodOptional<z.ZodNumber>;
        stdoutTail: z.ZodOptional<z.ZodString>;
        terminalId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        lost: "lost";
        spawn_error: "spawn_error";
        cancelled: "cancelled";
        timed_out: "timed_out";
    }>;
    taskId: z.ZodString;
}, z.core.$strict>;
export type ZCodeSessionCancelBackgroundTaskResult = z.infer<typeof zcodeSessionCancelBackgroundTaskResultSchema>;
export declare const zcodeSessionSetModelParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    model: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
    persistAsWorkspaceLastUsed: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeSessionSetModelParams = z.infer<typeof zcodeSessionSetModelParamsSchema>;
export declare const zcodeSessionSetThoughtLevelParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    thoughtLevel: z.ZodOptional<z.ZodString>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
    persistAsWorkspaceLastUsed: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeSessionSetThoughtLevelParams = z.infer<typeof zcodeSessionSetThoughtLevelParamsSchema>;
export declare const zcodeSessionSetModeParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    mode: z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    expectedRevision: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeSessionSetModeParams = z.infer<typeof zcodeSessionSetModeParamsSchema>;
export declare const zcodeSessionCloseParamsSchema: z.ZodObject<{
    sessionId: z.ZodString;
    expectedPersistence: z.ZodOptional<z.ZodEnum<{
        immediate: "immediate";
        deferred: "deferred";
    }>>;
}, z.core.$strict>;
export type ZCodeSessionCloseParams = z.infer<typeof zcodeSessionCloseParamsSchema>;
export declare const zcodeSessionCloseResultSchema: z.ZodObject<{
    closed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeSessionCloseResult = z.infer<typeof zcodeSessionCloseResultSchema>;
export declare const zcodeWorkspaceReadPresentationParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const zcodeWorkspacePresentationSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    mode: z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
    }>;
    slashCommands: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputHint: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            builtin: "builtin";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeWorkspacePresentation = z.infer<typeof zcodeWorkspacePresentationSchema>;
export declare const zcodeWorkspaceHookTrustGrantParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    bundleDigest: z.ZodString;
    hookDeclarationDigest: z.ZodString;
}, z.core.$strict>;
export type ZCodeWorkspaceHookTrustGrantParams = z.infer<typeof zcodeWorkspaceHookTrustGrantParamsSchema>;
export declare const zcodeWorkspaceHookTrustGrantReasonCodeSchema: z.ZodEnum<{
    workspace_hooks_blocked_by_policy: "workspace_hooks_blocked_by_policy";
    workspace_hooks_bundle_changed: "workspace_hooks_bundle_changed";
    workspace_hooks_snapshot_mismatch: "workspace_hooks_snapshot_mismatch";
    workspace_hooks_policy_requires_pretrust: "workspace_hooks_policy_requires_pretrust";
    workspace_hooks_trust_store_corrupt: "workspace_hooks_trust_store_corrupt";
    workspace_hooks_config_unreadable: "workspace_hooks_config_unreadable";
}>;
export type ZCodeWorkspaceHookTrustGrantReasonCode = z.infer<typeof zcodeWorkspaceHookTrustGrantReasonCodeSchema>;
export declare const zcodeWorkspaceHookTrustGrantResultSchema: z.ZodObject<{
    accepted: z.ZodBoolean;
    reasonCode: z.ZodOptional<z.ZodEnum<{
        workspace_hooks_blocked_by_policy: "workspace_hooks_blocked_by_policy";
        workspace_hooks_bundle_changed: "workspace_hooks_bundle_changed";
        workspace_hooks_snapshot_mismatch: "workspace_hooks_snapshot_mismatch";
        workspace_hooks_policy_requires_pretrust: "workspace_hooks_policy_requires_pretrust";
        workspace_hooks_trust_store_corrupt: "workspace_hooks_trust_store_corrupt";
        workspace_hooks_config_unreadable: "workspace_hooks_config_unreadable";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkspaceHookTrustGrantResult = z.infer<typeof zcodeWorkspaceHookTrustGrantResultSchema>;
declare const zcodeWorkspaceModelMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    role: z.ZodLiteral<"system">;
    content: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    role: z.ZodLiteral<"user">;
    content: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    role: z.ZodLiteral<"assistant">;
    content: z.ZodString;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        input: z.ZodUnknown;
    }, z.core.$strict>>>;
}, z.core.$strict>, z.ZodObject<{
    role: z.ZodLiteral<"tool">;
    content: z.ZodString;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    isError: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>], "role">;
declare const zcodeWorkspaceModelToolSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>;
export declare const zcodeWorkspaceGenerateTextParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    selection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    prompt: z.ZodOptional<z.ZodString>;
    messages: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        role: z.ZodLiteral<"system">;
        content: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        role: z.ZodLiteral<"user">;
        content: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        role: z.ZodLiteral<"assistant">;
        content: z.ZodString;
        toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            input: z.ZodUnknown;
        }, z.core.$strict>>>;
    }, z.core.$strict>, z.ZodObject<{
        role: z.ZodLiteral<"tool">;
        content: z.ZodString;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        isError: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>], "role">>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strict>>>;
    querySource: z.ZodString;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    operationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeWorkspaceGenerateTextResultSchema: z.ZodObject<{
    text: z.ZodString;
    selection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    toolCalls: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        input: z.ZodUnknown;
    }, z.core.$strict>>>;
    finishReason: z.ZodOptional<z.ZodString>;
    usage: z.ZodOptional<z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
        cacheReadTokens: z.ZodOptional<z.ZodNumber>;
        cacheWriteTokens: z.ZodOptional<z.ZodNumber>;
        reasoningTokens: z.ZodOptional<z.ZodNumber>;
        serverToolUse: z.ZodOptional<z.ZodObject<{
            webSearchRequests: z.ZodOptional<z.ZodNumber>;
            webFetchRequests: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeWorkspaceGenerateTextParams = z.infer<typeof zcodeWorkspaceGenerateTextParamsSchema>;
export type ZCodeWorkspaceModelMessage = z.infer<typeof zcodeWorkspaceModelMessageSchema>;
export type ZCodeWorkspaceModelTool = z.infer<typeof zcodeWorkspaceModelToolSchema>;
export type ZCodeWorkspaceGenerateTextResult = z.infer<typeof zcodeWorkspaceGenerateTextResultSchema>;
export declare const zcodeWorkspaceCancelGenerateTextParamsSchema: z.ZodObject<{
    operationId: z.ZodString;
}, z.core.$strict>;
export declare const zcodeWorkspaceCancelGenerateTextResultSchema: z.ZodObject<{
    operationId: z.ZodString;
    cancelled: z.ZodBoolean;
}, z.core.$strict>;
export declare const zcodeProviderTestModelConnectivityParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    selection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const zcodeProviderTestModelConnectivityResultSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
}, z.core.$strict>;
export type ZCodeProviderTestModelConnectivityParams = z.infer<typeof zcodeProviderTestModelConnectivityParamsSchema>;
export type ZCodeProviderTestModelConnectivityResult = z.infer<typeof zcodeProviderTestModelConnectivityResultSchema>;
export declare const zcodeProviderUpdateAccountConfigParamsSchema: z.ZodObject<{
    revision: z.ZodString;
    basedOnZCodeBuiltinRevision: z.ZodString;
    providers: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        availability: z.ZodEnum<{
            pending: "pending";
            unknown: "unknown";
            unavailable: "unavailable";
            available: "available";
        }>;
        entitled: z.ZodBoolean;
        unavailableReason: z.ZodOptional<z.ZodEnum<{
            "not-authenticated": "not-authenticated";
            "not-connected": "not-connected";
            "credential-failed": "credential-failed";
            "not-entitled": "not-entitled";
        }>>;
        current: z.ZodOptional<z.ZodBoolean>;
        connectionKey: z.ZodOptional<z.ZodString>;
        effectiveAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const zcodeProviderUpdateAccountConfigResultSchema: z.ZodObject<{
    receivedRevision: z.ZodString;
    providerCount: z.ZodNumber;
    status: z.ZodEnum<{
        received: "received";
        unchanged: "unchanged";
    }>;
}, z.core.$strict>;
export type ZCodeProviderUpdateAccountConfigResult = z.infer<typeof zcodeProviderUpdateAccountConfigResultSchema>;
export declare const zcodeInteractionPreferencesSchema: z.ZodObject<{
    askUserQuestionAutoResolutionEnabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeInteractionPreferences = z.infer<typeof zcodeInteractionPreferencesSchema>;
export declare const zcodeWorkspaceUpdateInteractionPreferencesParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    preferences: z.ZodObject<{
        askUserQuestionAutoResolutionEnabled: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateInteractionPreferencesParams = z.infer<typeof zcodeWorkspaceUpdateInteractionPreferencesParamsSchema>;
export declare const zcodeWorkspaceUpdateInteractionPreferencesResultSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    askUserQuestionAutoResolutionEnabled: z.ZodBoolean;
    snoozedInteractionCount: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateInteractionPreferencesResult = z.infer<typeof zcodeWorkspaceUpdateInteractionPreferencesResultSchema>;
export declare const zcodeModelIoPreferencesSchema: z.ZodObject<{
    fullRetentionEnabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeModelIoPreferences = z.infer<typeof zcodeModelIoPreferencesSchema>;
export declare const zcodeWorkspaceUpdateModelIoPreferencesParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    preferences: z.ZodObject<{
        fullRetentionEnabled: z.ZodBoolean;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateModelIoPreferencesParams = z.infer<typeof zcodeWorkspaceUpdateModelIoPreferencesParamsSchema>;
export declare const zcodeWorkspaceUpdateModelIoPreferencesResultSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    fullRetentionEnabled: z.ZodBoolean;
    updatedSessionCount: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateModelIoPreferencesResult = z.infer<typeof zcodeWorkspaceUpdateModelIoPreferencesResultSchema>;
export declare const zcodeWorkspaceUpdateOffPeakToolPolicyParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateOffPeakToolPolicyParams = z.infer<typeof zcodeWorkspaceUpdateOffPeakToolPolicyParamsSchema>;
export declare const zcodeWorkspaceUpdateOffPeakToolPolicyResultSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateOffPeakToolPolicyResult = z.infer<typeof zcodeWorkspaceUpdateOffPeakToolPolicyResultSchema>;
export declare const zcodeWorkspaceUpdateDynamicWorkflowPolicyParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    enabled: z.ZodBoolean;
    mode: z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        onDemand: "onDemand";
        alwaysOn: "alwaysOn";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateDynamicWorkflowPolicyParams = z.infer<typeof zcodeWorkspaceUpdateDynamicWorkflowPolicyParamsSchema>;
export declare const zcodeWorkspaceUpdateDynamicWorkflowPolicyResultSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeWorkspaceUpdateDynamicWorkflowPolicyResult = z.infer<typeof zcodeWorkspaceUpdateDynamicWorkflowPolicyResultSchema>;
export declare const zcodePermissionRequestParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    reason: z.ZodString;
    riskLevel: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
        critical: "critical";
    }>;
    input: z.ZodUnknown;
    origin: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"subagent">;
        agentId: z.ZodString;
        agentType: z.ZodString;
        childSessionId: z.ZodString;
        childTurnId: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parentSessionId: z.ZodString;
        parentToolCallId: z.ZodOptional<z.ZodString>;
        parentTurnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    options: z.ZodArray<z.ZodObject<{
        optionId: z.ZodString;
        kind: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        response: z.ZodObject<{
            decision: z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                escalate: "escalate";
                modify: "modify";
            }>;
            reason: z.ZodOptional<z.ZodString>;
            modifiedInput: z.ZodOptional<z.ZodUnknown>;
            permissionUpdates: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"addRules">;
                behavior: z.ZodEnum<{
                    ask: "ask";
                    allow: "allow";
                    deny: "deny";
                }>;
                rules: z.ZodArray<z.ZodObject<{
                    toolName: z.ZodString;
                    ruleContent: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>>;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePermissionRequestParams = z.infer<typeof zcodePermissionRequestParamsSchema>;
/** Agent 请求 app 枚举当前 workspace/session 可达且已完成握手的 browser backend。 */
export declare const zcodeBrowserListParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    workspaceKey: z.ZodString;
    workspacePath: z.ZodString;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    sessionContext: z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>;
}, z.core.$strict>;
export type ZCodeBrowserListParams = z.infer<typeof zcodeBrowserListParamsSchema>;
export declare const zcodeBrowserListResultSchema: z.ZodObject<{
    browsers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        generation: z.ZodDefault<z.ZodNumber>;
        type: z.ZodEnum<{
            iab: "iab";
            extension: "extension";
            cdp: "cdp";
        }>;
        name: z.ZodString;
        capabilities: z.ZodObject<{
            browser: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
            tab: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        apiSupportOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeBrowserListResult = z.infer<typeof zcodeBrowserListResultSchema>;
/** Agent 把一条 browser-use 命令发送给 app 执行。 */
export declare const zcodeBrowserExecuteParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    browserId: z.ZodOptional<z.ZodString>;
    browserGeneration: z.ZodOptional<z.ZodNumber>;
    workspaceKey: z.ZodOptional<z.ZodString>;
    workspacePath: z.ZodOptional<z.ZodString>;
    workspaceIdentity: z.ZodOptional<z.ZodString>;
    remoteSessionId: z.ZodOptional<z.ZodString>;
    clientMode: z.ZodOptional<z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>>;
    sessionContext: z.ZodOptional<z.ZodEnum<{
        cached: "cached";
        live: "live";
    }>>;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
        method: z.ZodLiteral<"navigate">;
        url: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"back">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"forward">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"reload">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"snapshot">;
        maxElements: z.ZodOptional<z.ZodNumber>;
        includeHidden: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"click">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        doubleClick: z.ZodOptional<z.ZodBoolean>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"fill">;
        ref: z.ZodString;
        value: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"type">;
        ref: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"press">;
        key: z.ZodString;
        ref: z.ZodOptional<z.ZodString>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaKeypress">;
        keys: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"scroll">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaScroll">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"domCuaScroll">;
        nodeId: z.ZodOptional<z.ZodString>;
        scrollX: z.ZodNumber;
        scrollY: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"screenshot">;
        ref: z.ZodOptional<z.ZodString>;
        fullPage: z.ZodOptional<z.ZodBoolean>;
        clip: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getState">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"hover">;
        ref: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"select">;
        ref: z.ZodString;
        values: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"check">;
        ref: z.ZodString;
        checked: z.ZodOptional<z.ZodBoolean>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"drag">;
        fromRef: z.ZodOptional<z.ZodString>;
        toRef: z.ZodOptional<z.ZodString>;
        from: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        to: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cuaDrag">;
        path: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"elementInfo">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"evaluate">;
        expression: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"getDialog">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"handleDialog">;
        accept: z.ZodBoolean;
        promptText: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"waitFor">;
        selector: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        textGone: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwrightWaitForTimeout">;
        timeoutMs: z.ZodNumber;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"playwright">;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            name: z.ZodLiteral<"domSnapshot">;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementInfo">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"elementScreenshot">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"evaluate">;
            expression: z.ZodString;
            expressionKind: z.ZodEnum<{
                string: "string";
                function: "function";
            }>;
            arg: z.ZodOptional<z.ZodUnknown>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForLoadState">;
            state: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForURL">;
            url: z.ZodString;
            waitUntil: z.ZodOptional<z.ZodEnum<{
                load: "load";
                domcontentloaded: "domcontentloaded";
                networkidle: "networkidle";
                commit: "commit";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"waitForEvent">;
            event: z.ZodEnum<{
                download: "download";
                filechooser: "filechooser";
            }>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"downloadPath">;
            downloadId: z.ZodString;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"fileChooserSetFiles">;
            fileChooserId: z.ZodString;
            files: z.ZodArray<z.ZodString>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            name: z.ZodLiteral<"locator">;
            selector: z.ZodString;
            operation: z.ZodEnum<{
                fill: "fill";
                click: "click";
                press: "press";
                evaluate: "evaluate";
                waitFor: "waitFor";
                count: "count";
                allTextContents: "allTextContents";
                dblclick: "dblclick";
                downloadMedia: "downloadMedia";
                getAttribute: "getAttribute";
                innerText: "innerText";
                isEnabled: "isEnabled";
                isVisible: "isVisible";
                selectOption: "selectOption";
                setChecked: "setChecked";
                textContent: "textContent";
            }>;
            value: z.ZodOptional<z.ZodUnknown>;
            arg: z.ZodOptional<z.ZodUnknown>;
            expression: z.ZodOptional<z.ZodString>;
            expressionKind: z.ZodOptional<z.ZodEnum<{
                string: "string";
                function: "function";
            }>>;
            attribute: z.ZodOptional<z.ZodString>;
            checked: z.ZodOptional<z.ZodBoolean>;
            replace: z.ZodOptional<z.ZodBoolean>;
            force: z.ZodOptional<z.ZodBoolean>;
            button: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                middle: "middle";
            }>>;
            modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                Alt: "Alt";
                Shift: "Shift";
                Control: "Control";
                ControlOrMeta: "ControlOrMeta";
                Meta: "Meta";
            }>>>;
            state: z.ZodOptional<z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                attached: "attached";
                detached: "detached";
            }>>;
            selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>], "name">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"capabilities">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilityGet">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserVisibilitySet">;
        visible: z.ZodBoolean;
    }, z.core.$strict>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        method: z.ZodLiteral<"browserViewportSet">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"browserViewportReset">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStart">;
        options: z.ZodOptional<z.ZodObject<{
            viewport: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>>;
            fps: z.ZodOptional<z.ZodNumber>;
            jpegQuality: z.ZodOptional<z.ZodNumber>;
            maxDurationMs: z.ZodOptional<z.ZodNumber>;
            settleMs: z.ZodOptional<z.ZodNumber>;
            showCursor: z.ZodOptional<z.ZodBoolean>;
            actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"wait">;
                durationMs: z.ZodNumber;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"click">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                button: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                doubleClick: z.ZodOptional<z.ZodBoolean>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"type">;
                selector: z.ZodString;
                text: z.ZodString;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"hover">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"move">;
                x: z.ZodNumber;
                y: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scroll">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"scrollTo">;
                selector: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"wheel">;
                deltaX: z.ZodOptional<z.ZodNumber>;
                deltaY: z.ZodNumber;
                times: z.ZodOptional<z.ZodNumber>;
                intervalMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"drag">;
                path: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                type: z.ZodLiteral<"waitFor">;
                selector: z.ZodString;
                state: z.ZodOptional<z.ZodEnum<{
                    visible: "visible";
                    hidden: "hidden";
                    attached: "attached";
                    detached: "detached";
                }>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                delayAfterMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>], "type">>>;
        }, z.core.$strict>>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingStatus">;
        recordingId: z.ZodString;
        outputPath: z.ZodOptional<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"recordingCancel">;
        recordingId: z.ZodString;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"activateTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"newTab">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"listUserTabs">;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"claimTab">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalizeTabs">;
        keep: z.ZodArray<z.ZodObject<{
            tabId: z.ZodString;
            status: z.ZodEnum<{
                handoff: "handoff";
                deliverable: "deliverable";
            }>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markDeliverable">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"markHandoff">;
        tabId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"nameSession">;
        name: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"finalize">;
        tabId: z.ZodOptional<z.ZodString>;
        deliverable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"turnEnded">;
        turnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"closeSession">;
        closeTabs: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"cancelRequest">;
        requestId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"close">;
        tabId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        method: z.ZodLiteral<"list">;
    }, z.core.$strict>], "method">;
}, z.core.$strict>;
export type ZCodeBrowserExecuteParams = z.infer<typeof zcodeBrowserExecuteParamsSchema>;
export declare const zcodeBrowserExecuteResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    state: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
        canGoBack: z.ZodBoolean;
        canGoForward: z.ZodBoolean;
        scrollX: z.ZodOptional<z.ZodNumber>;
        scrollY: z.ZodOptional<z.ZodNumber>;
        viewportWidth: z.ZodOptional<z.ZodNumber>;
        viewportHeight: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    snapshot: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
        dom: z.ZodOptional<z.ZodArray<z.ZodObject<{
            tag: z.ZodString;
            depth: z.ZodNumber;
            inViewport: z.ZodBoolean;
            ref: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>>;
        domTruncated: z.ZodOptional<z.ZodBoolean>;
        elements: z.ZodArray<z.ZodObject<{
            ref: z.ZodString;
            tag: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            checked: z.ZodOptional<z.ZodBoolean>;
            selector: z.ZodString;
            xpath: z.ZodString;
            rect: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            inViewport: z.ZodBoolean;
            parentRef: z.ZodOptional<z.ZodString>;
            framePath: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
        truncated: z.ZodBoolean;
    }, z.core.$strict>>;
    image: z.ZodOptional<z.ZodObject<{
        base64: z.ZodString;
        mimeType: z.ZodLiteral<"image/png">;
    }, z.core.$strict>>;
    tabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tabId: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        active: z.ZodOptional<z.ZodBoolean>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
        }>>;
    }, z.core.$strict>>>;
    userTabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        lastOpened: z.ZodOptional<z.ZodString>;
        tabGroup: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    tab: z.ZodOptional<z.ZodObject<{
        tabId: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        active: z.ZodOptional<z.ZodBoolean>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
        }>>;
    }, z.core.$strict>>;
    value: z.ZodOptional<z.ZodUnknown>;
    element: z.ZodOptional<z.ZodObject<{
        ref: z.ZodString;
        tag: z.ZodString;
        role: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        checked: z.ZodOptional<z.ZodBoolean>;
        selector: z.ZodString;
        xpath: z.ZodString;
        rect: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        inViewport: z.ZodBoolean;
        parentRef: z.ZodOptional<z.ZodString>;
        framePath: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    dialog: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodEnum<{
            prompt: "prompt";
            alert: "alert";
            confirm: "confirm";
            beforeunload: "beforeunload";
        }>;
        message: z.ZodString;
        defaultPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    recording: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
        }>;
        phase: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
            preparing: "preparing";
            capturing: "capturing";
            finalizing: "finalizing";
        }>;
        progress: z.ZodNumber;
        startedAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        artifact: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            mimeType: z.ZodLiteral<"video/webm">;
            width: z.ZodNumber;
            height: z.ZodNumber;
            fps: z.ZodNumber;
            durationMs: z.ZodNumber;
            frameCount: z.ZodNumber;
        }, z.core.$strict>>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodEnum<{
            cancelled: "cancelled";
            timeout: "timeout";
            backend_unavailable: "backend_unavailable";
            capability_unsupported: "capability_unsupported";
            duplicate_request_id: "duplicate_request_id";
            ref_not_found: "ref_not_found";
            navigation_blocked: "navigation_blocked";
            renderer_unreachable: "renderer_unreachable";
            execution_error: "execution_error";
        }>;
        message: z.ZodString;
        sideEffect: z.ZodOptional<z.ZodEnum<{
            none: "none";
            uncertain: "uncertain";
        }>>;
    }, z.core.$strict>>;
    meta: z.ZodOptional<z.ZodObject<{
        browserUse: z.ZodLiteral<true>;
        backendType: z.ZodEnum<{
            iab: "iab";
            extension: "extension";
            cdp: "cdp";
        }>;
        browserId: z.ZodString;
        browserGeneration: z.ZodNumber;
        openTabIds: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
        currentUrl: z.ZodOptional<z.ZodString>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
            closed: "closed";
        }>>;
    }, z.core.$strict>>;
    elapsedMs: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeBrowserExecuteResult = z.infer<typeof zcodeBrowserExecuteResultSchema>;
export declare const zcodeUserInputOptionSchema: z.ZodObject<{
    value: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    preview: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodeUserInputQuestionSchema: z.ZodObject<{
    question: z.ZodString;
    header: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        preview: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    multiSelect: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeUserInputQuestion = z.infer<typeof zcodeUserInputQuestionSchema>;
export declare const zcodeUserInputRequestParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    toolName: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    questions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        header: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            preview: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        multiSelect: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>>;
    input: z.ZodOptional<z.ZodUnknown>;
    origin: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"subagent">;
        agentId: z.ZodString;
        agentType: z.ZodString;
        childSessionId: z.ZodString;
        childTurnId: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parentSessionId: z.ZodString;
        parentToolCallId: z.ZodOptional<z.ZodString>;
        parentTurnId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    schema: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export type ZCodeUserInputRequestParams = z.infer<typeof zcodeUserInputRequestParamsSchema>;
export declare const zcodeUserInputResponseSchema: z.ZodObject<{
    action: z.ZodEnum<{
        accept: "accept";
        decline: "decline";
        cancel: "cancel";
    }>;
    content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeUserInputResponse = z.infer<typeof zcodeUserInputResponseSchema>;
export declare const zcodeProviderRuntimeHeadersRequestReasonSchema: z.ZodEnum<{
    "model-request": "model-request";
}>;
export declare const zcodeProviderRuntimeHeadersRequestParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    modelSelection: z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    providerId: z.ZodString;
    accountAccess: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"zhipu-account">;
        accountType: z.ZodEnum<{
            bigmodel: "bigmodel";
            zai: "zai";
        }>;
        mode: z.ZodEnum<{
            "start-plan": "start-plan";
            "individual-coding-plan": "individual-coding-plan";
            "team-coding-plan": "team-coding-plan";
            highspeed: "highspeed";
            "off-peak": "off-peak";
        }>;
        entitled: z.ZodBoolean;
    }, z.core.$strict>>;
    expectedAccountScope: z.ZodOptional<z.ZodString>;
    rejectedProjectTokenFingerprint: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<{
        "model-request": "model-request";
    }>;
}, z.core.$strict>;
export type ZCodeProviderRuntimeHeadersRequestParams = z.infer<typeof zcodeProviderRuntimeHeadersRequestParamsSchema>;
/** 请求取消只作用于同 workspace/session 的这一轮凭据刷新。 */
export declare const zcodeProviderRuntimeHeadersCancelledSchema: z.ZodObject<{
    requestId: z.ZodString;
    sessionId: z.ZodString;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeProviderRuntimeHeadersCancelled = z.infer<typeof zcodeProviderRuntimeHeadersCancelledSchema>;
export declare const zcodeProviderRuntimeHeadersResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    headersApplied: z.ZodLiteral<true>;
    requestAuth: z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        apiKeyId: z.ZodOptional<z.ZodString>;
        accountScope: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>;
    errorMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    headersApplied: z.ZodLiteral<false>;
    errorMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "headersApplied">;
export type ZCodeProviderRuntimeHeadersResponse = z.infer<typeof zcodeProviderRuntimeHeadersResponseSchema>;
export declare const zcodeOfficialMcpAuthHeadersRequestParamsSchema: z.ZodObject<{
    requestId: z.ZodString;
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodString;
    mcpKey: z.ZodString;
    targetOrigin: z.ZodString;
}, z.core.$strict>;
export type ZCodeOfficialMcpAuthHeadersRequestParams = z.infer<typeof zcodeOfficialMcpAuthHeadersRequestParamsSchema>;
/**
 * 失败原因必须可枚举，避免调用方按文本分流；因此响应不含 errorMessage。
 *
 * `official_mcp_origin_untrusted` 是 host 侧二次校验的拒绝原因：`targetOrigin` 不等于当前
 * ZCode API origin。判定只看 origin，`pluginId` / `mcpKey` 仅用于日志归属。与"未登录/无凭据"
 * 分开，才能在排查时区分"被拒绝"和"没身份"。
 */
export declare const zcodeOfficialMcpAuthFailureReasonSchema: z.ZodEnum<{
    official_auth_unavailable: "official_auth_unavailable";
    official_auth_plan_required: "official_auth_plan_required";
    official_mcp_origin_untrusted: "official_mcp_origin_untrusted";
}>;
export declare const zcodeOfficialMcpAuthHeadersResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    ok: z.ZodLiteral<true>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        official_auth_unavailable: "official_auth_unavailable";
        official_auth_plan_required: "official_auth_plan_required";
        official_mcp_origin_untrusted: "official_mcp_origin_untrusted";
    }>;
}, z.core.$strict>], "ok">;
export type ZCodeOfficialMcpAuthHeadersResponse = z.infer<typeof zcodeOfficialMcpAuthHeadersResponseSchema>;
export declare const zcodePluginOptionValueSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
export type ZCodePluginOptionValue = z.infer<typeof zcodePluginOptionValueSchema>;
export declare const zcodePluginScopeSchema: z.ZodEnum<{
    user: "user";
    workspace: "workspace";
}>;
export type ZCodePluginScope = z.infer<typeof zcodePluginScopeSchema>;
export declare const zcodePluginHookDetailSchema: z.ZodObject<{
    event: z.ZodString;
    matcher: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        command: "command";
        process: "process";
    }>;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    async: z.ZodOptional<z.ZodBoolean>;
    shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
    timeout: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
    sourcePath: z.ZodString;
    runnable: z.ZodBoolean;
}, z.core.$strict>;
export declare const zcodePluginUserConfigOptionSchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
    sensitive: z.ZodOptional<z.ZodBoolean>;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        file: "file";
        directory: "directory";
    }>>;
}, z.core.$strict>;
export type ZCodePluginUserConfigOption = z.infer<typeof zcodePluginUserConfigOptionSchema>;
export declare const zcodePluginComponentKindSchema: z.ZodEnum<{
    agent: "agent";
    command: "command";
    mcp: "mcp";
    skill: "skill";
    hook: "hook";
}>;
export type ZCodePluginComponentKind = z.infer<typeof zcodePluginComponentKindSchema>;
export declare const zcodePluginComponentItemSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginComponentGroupSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        agent: "agent";
        command: "command";
        mcp: "mcp";
        skill: "skill";
        hook: "hook";
    }>;
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginComponentGroup = z.infer<typeof zcodePluginComponentGroupSchema>;
export declare const zcodePluginInfoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    enabled: z.ZodBoolean;
    source: z.ZodString;
    marketplace: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    authorUrl: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    skillCount: z.ZodOptional<z.ZodNumber>;
    skillRootCount: z.ZodNumber;
    commandRootCount: z.ZodNumber;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            agent: "agent";
            command: "command";
            mcp: "mcp";
            skill: "skill";
            hook: "hook";
        }>;
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    declaredMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    hostMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mcpServerNames: z.ZodArray<z.ZodString>;
    hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        matcher: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            command: "command";
            process: "process";
        }>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        async: z.ZodOptional<z.ZodBoolean>;
        shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        statusMessage: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodString;
        runnable: z.ZodBoolean;
    }, z.core.$strict>>>;
    rootPath: z.ZodString;
    userConfig: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
        sensitive: z.ZodOptional<z.ZodBoolean>;
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            file: "file";
            directory: "directory";
        }>>;
    }, z.core.$strict>>>;
    configuredOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    packageStatus: z.ZodOptional<z.ZodLiteral<"missing">>;
    rootSource: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
    enabledSource: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
    optionSources: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>>;
}, z.core.$strict>;
export type ZCodePluginInfo = z.infer<typeof zcodePluginInfoSchema>;
export declare const zcodePluginDiagnosticSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    severity: z.ZodOptional<z.ZodEnum<{
        error: "error";
        warning: "warning";
    }>>;
    pluginId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodePluginDiagnostic = z.infer<typeof zcodePluginDiagnosticSchema>;
export declare const zcodePluginsListParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    configScope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
}, z.core.$strict>;
export declare const zcodePluginsListResultSchema: z.ZodObject<{
    plugins: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        source: z.ZodString;
        marketplace: z.ZodString;
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        skillCount: z.ZodOptional<z.ZodNumber>;
        skillRootCount: z.ZodNumber;
        commandRootCount: z.ZodNumber;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                agent: "agent";
                command: "command";
                mcp: "mcp";
                skill: "skill";
                hook: "hook";
            }>;
            items: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        declaredMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hostMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        mcpServerNames: z.ZodArray<z.ZodString>;
        hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            matcher: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                command: "command";
                process: "process";
            }>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            async: z.ZodOptional<z.ZodBoolean>;
            shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            statusMessage: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            runnable: z.ZodBoolean;
        }, z.core.$strict>>>;
        rootPath: z.ZodString;
        userConfig: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
            title: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                file: "file";
                directory: "directory";
            }>>;
        }, z.core.$strict>>>;
        configuredOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        packageStatus: z.ZodOptional<z.ZodLiteral<"missing">>;
        rootSource: z.ZodOptional<z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>;
        enabledSource: z.ZodOptional<z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>;
        optionSources: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>>;
    }, z.core.$strict>>;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsListResult = z.infer<typeof zcodePluginsListResultSchema>;
export declare const zcodePluginUiSurfaceSchema: z.ZodObject<{
    pluginId: z.ZodString;
    pluginName: z.ZodString;
    id: z.ZodString;
    title: z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>;
    icon: z.ZodOptional<z.ZodString>;
    server: z.ZodString;
    resourceUri: z.ZodString;
    availability: z.ZodLiteral<"session">;
}, z.core.$strict>;
export type ZCodePluginUiSurface = z.infer<typeof zcodePluginUiSurfaceSchema>;
export declare const zcodePluginsListUiSurfacesParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodePluginsListUiSurfacesParams = z.infer<typeof zcodePluginsListUiSurfacesParamsSchema>;
export declare const zcodePluginsListUiSurfacesResultSchema: z.ZodObject<{
    surfaces: z.ZodArray<z.ZodObject<{
        pluginId: z.ZodString;
        pluginName: z.ZodString;
        id: z.ZodString;
        title: z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>]>;
        icon: z.ZodOptional<z.ZodString>;
        server: z.ZodString;
        resourceUri: z.ZodString;
        availability: z.ZodLiteral<"session">;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsListUiSurfacesResult = z.infer<typeof zcodePluginsListUiSurfacesResultSchema>;
export declare const zcodePluginReferenceCatalogEntrySchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    pluginId: z.ZodString;
    name: z.ZodString;
    marketplace: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
    displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    enabled: z.ZodBoolean;
    conflictingPluginIds: z.ZodArray<z.ZodString>;
    skillQualifiedNames: z.ZodArray<z.ZodString>;
    mcpServerNames: z.ZodArray<z.ZodString>;
    subagentNames: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export type ZCodePluginReferenceCatalogEntry = z.infer<typeof zcodePluginReferenceCatalogEntrySchema>;
export declare const zcodePluginsReferenceCatalogParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodePluginsReferenceCatalogParams = z.infer<typeof zcodePluginsReferenceCatalogParamsSchema>;
export declare const zcodePluginsReferenceCatalogResultSchema: z.ZodObject<{
    authority: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>;
    plugins: z.ZodArray<z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
        pluginId: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
        displayName: z.ZodOptional<z.ZodString>;
        displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        description: z.ZodOptional<z.ZodString>;
        descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        enabled: z.ZodBoolean;
        conflictingPluginIds: z.ZodArray<z.ZodString>;
        skillQualifiedNames: z.ZodArray<z.ZodString>;
        mcpServerNames: z.ZodArray<z.ZodString>;
        subagentNames: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsReferenceCatalogResult = z.infer<typeof zcodePluginsReferenceCatalogResultSchema>;
export declare const zcodeSkillReferenceCatalogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    path: z.ZodString;
    scope: z.ZodEnum<{
        user: "user";
        workspace: "workspace";
        plugin: "plugin";
    }>;
    enabled: z.ZodLiteral<true>;
    pluginName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeSkillReferenceCatalogEntry = z.infer<typeof zcodeSkillReferenceCatalogEntrySchema>;
export declare const zcodeSkillsReferenceCatalogParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeSkillsReferenceCatalogParams = z.infer<typeof zcodeSkillsReferenceCatalogParamsSchema>;
export declare const zcodeSkillsReferenceCatalogResultSchema: z.ZodObject<{
    authority: z.ZodEnum<{
        workspace: "workspace";
        session: "session";
    }>;
    skills: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        path: z.ZodString;
        scope: z.ZodEnum<{
            user: "user";
            workspace: "workspace";
            plugin: "plugin";
        }>;
        enabled: z.ZodLiteral<true>;
        pluginName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeSkillsReferenceCatalogResult = z.infer<typeof zcodeSkillsReferenceCatalogResultSchema>;
export declare const zcodeSavedWorkflowArgTypeSchema: z.ZodEnum<{
    string: "string";
    number: "number";
    boolean: "boolean";
    json: "json";
}>;
export type ZCodeSavedWorkflowArgType = z.infer<typeof zcodeSavedWorkflowArgTypeSchema>;
export declare const zcodeSavedWorkflowArgDeclarationSchema: z.ZodObject<{
    type: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        json: "json";
    }>;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
    default: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
export type ZCodeSavedWorkflowArgDeclaration = z.infer<typeof zcodeSavedWorkflowArgDeclarationSchema>;
export declare const zcodeSavedWorkflowArgsDeclarationSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    type: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        json: "json";
    }>;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
    default: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>>;
export type ZCodeSavedWorkflowArgsDeclaration = z.infer<typeof zcodeSavedWorkflowArgsDeclarationSchema>;
export declare const zcodeSavedWorkflowMetaSchema: z.ZodObject<{
    description: z.ZodString;
    whenToUse: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            json: "json";
        }>;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
        default: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodeSavedWorkflowMeta = z.infer<typeof zcodeSavedWorkflowMetaSchema>;
export declare const zcodeSavedWorkflowScopeSchema: z.ZodEnum<{
    project: "project";
    global: "global";
}>;
export type ZCodeSavedWorkflowScope = z.infer<typeof zcodeSavedWorkflowScopeSchema>;
export declare const zcodeSavedWorkflowEntrySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    whenToUse: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            json: "json";
        }>;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
        default: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strict>>>;
    scope: z.ZodEnum<{
        project: "project";
        global: "global";
    }>;
    path: z.ZodString;
}, z.core.$strict>;
export type ZCodeSavedWorkflowEntry = z.infer<typeof zcodeSavedWorkflowEntrySchema>;
export declare const zcodeSavedWorkflowInvalidEntrySchema: z.ZodObject<{
    path: z.ZodString;
    reason: z.ZodString;
}, z.core.$strict>;
export type ZCodeSavedWorkflowInvalidEntry = z.infer<typeof zcodeSavedWorkflowInvalidEntrySchema>;
/** 名字非法 / 未找到 / frontmatter 坏 / 读错——与 core store 的 resolve 失败四态逐字对应。 */
export declare const zcodeSavedWorkflowFailureReasonSchema: z.ZodEnum<{
    not_found: "not_found";
    invalid_name: "invalid_name";
    parse_error: "parse_error";
    read_error: "read_error";
}>;
export type ZCodeSavedWorkflowFailureReason = z.infer<typeof zcodeSavedWorkflowFailureReasonSchema>;
export declare const zcodeWorkflowsListParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsListParams = z.infer<typeof zcodeWorkflowsListParamsSchema>;
export declare const zcodeWorkflowsListResultSchema: z.ZodObject<{
    workflows: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        whenToUse: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                json: "json";
            }>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            default: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>>>;
        scope: z.ZodEnum<{
            project: "project";
            global: "global";
        }>;
        path: z.ZodString;
    }, z.core.$strict>>;
    invalid: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        reason: z.ZodString;
    }, z.core.$strict>>;
    dir: z.ZodString;
}, z.core.$strict>;
export type ZCodeWorkflowsListResult = z.infer<typeof zcodeWorkflowsListResultSchema>;
export declare const zcodeWorkflowsGetParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsGetParams = z.infer<typeof zcodeWorkflowsGetParamsSchema>;
export declare const zcodeWorkflowsGetResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    name: z.ZodString;
    path: z.ZodString;
    scope: z.ZodEnum<{
        project: "project";
        global: "global";
    }>;
    meta: z.ZodObject<{
        description: z.ZodString;
        whenToUse: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                json: "json";
            }>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            default: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    script: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        not_found: "not_found";
        invalid_name: "invalid_name";
        parse_error: "parse_error";
        read_error: "read_error";
    }>;
    detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type ZCodeWorkflowsGetResult = z.infer<typeof zcodeWorkflowsGetResultSchema>;
export declare const zcodeWorkflowsUpdateMetaParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
    meta: z.ZodObject<{
        description: z.ZodString;
        whenToUse: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                json: "json";
            }>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            default: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsUpdateMetaParams = z.infer<typeof zcodeWorkflowsUpdateMetaParamsSchema>;
export declare const zcodeWorkflowsUpdateMetaResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    path: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        not_found: "not_found";
        invalid_name: "invalid_name";
        parse_error: "parse_error";
        read_error: "read_error";
    }>;
    detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type ZCodeWorkflowsUpdateMetaResult = z.infer<typeof zcodeWorkflowsUpdateMetaResultSchema>;
export declare const zcodeWorkflowsDeleteParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsDeleteParams = z.infer<typeof zcodeWorkflowsDeleteParamsSchema>;
export declare const zcodeWorkflowsDeleteResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    path: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        not_found: "not_found";
        invalid_name: "invalid_name";
        parse_error: "parse_error";
        read_error: "read_error";
    }>;
    detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type ZCodeWorkflowsDeleteResult = z.infer<typeof zcodeWorkflowsDeleteResultSchema>;
export declare const ZCODE_WORKFLOWS_RUNS_MAX_LIMIT = 50;
export declare const zcodeWorkflowsRunsParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodOptional<z.ZodString>;
    limit: z.ZodNumber;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsRunsParams = z.infer<typeof zcodeWorkflowsRunsParamsSchema>;
export declare const zcodeSavedWorkflowRunStatusSchema: z.ZodEnum<{
    pending: "pending";
    running: "running";
    completed: "completed";
    stopped: "stopped";
    errored: "errored";
}>;
export type ZCodeSavedWorkflowRunStatus = z.infer<typeof zcodeSavedWorkflowRunStatusSchema>;
export declare const zcodeSavedWorkflowRunStopReasonSchema: z.ZodEnum<{
    interrupted: "interrupted";
    model: "model";
    user: "user";
    provider: "provider";
    superseded: "superseded";
}>;
export declare const zcodeSavedWorkflowRunSchema: z.ZodObject<{
    runId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        pending: "pending";
        running: "running";
        completed: "completed";
        stopped: "stopped";
        errored: "errored";
    }>;
    stopReason: z.ZodOptional<z.ZodEnum<{
        interrupted: "interrupted";
        model: "model";
        user: "user";
        provider: "provider";
        superseded: "superseded";
    }>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    spentTokens: z.ZodNumber;
    parentSessionId: z.ZodOptional<z.ZodString>;
    toolCallId: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cwd: z.ZodOptional<z.ZodString>;
    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<{
            file: "file";
            markdown: "markdown";
            chart: "chart";
            table: "table";
            metrics: "metrics";
            board: "board";
        }>;
        title: z.ZodOptional<z.ZodString>;
        version: z.ZodNumber;
        contentType: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodeSavedWorkflowRun = z.infer<typeof zcodeSavedWorkflowRunSchema>;
export declare const zcodeWorkflowsRunsResultSchema: z.ZodObject<{
    runs: z.ZodArray<z.ZodObject<{
        runId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            pending: "pending";
            running: "running";
            completed: "completed";
            stopped: "stopped";
            errored: "errored";
        }>;
        stopReason: z.ZodOptional<z.ZodEnum<{
            interrupted: "interrupted";
            model: "model";
            user: "user";
            provider: "provider";
            superseded: "superseded";
        }>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        spentTokens: z.ZodNumber;
        parentSessionId: z.ZodOptional<z.ZodString>;
        toolCallId: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        cwd: z.ZodOptional<z.ZodString>;
        artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<{
                file: "file";
                markdown: "markdown";
                chart: "chart";
                table: "table";
                metrics: "metrics";
                board: "board";
            }>;
            title: z.ZodOptional<z.ZodString>;
            version: z.ZodNumber;
            contentType: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
    truncated: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export type ZCodeWorkflowsRunsResult = z.infer<typeof zcodeWorkflowsRunsResultSchema>;
export declare const zcodeWorkflowsMoveParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    name: z.ZodString;
}, z.core.$strict>;
export type ZCodeWorkflowsMoveParams = z.infer<typeof zcodeWorkflowsMoveParamsSchema>;
export declare const zcodeWorkflowsMoveResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    from: z.ZodString;
    to: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        not_found: "not_found";
        invalid_name: "invalid_name";
        read_error: "read_error";
        target_exists: "target_exists";
        write_error: "write_error";
    }>;
    path: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type ZCodeWorkflowsMoveResult = z.infer<typeof zcodeWorkflowsMoveResultSchema>;
/** 另一档已有同名定义（遮蔽事实）；与 contracts 的 SavedWorkflowShadowing 逐字对齐。 */
export declare const zcodeSavedWorkflowShadowingSchema: z.ZodEnum<{
    hides_global: "hides_global";
    hidden_by_project: "hidden_by_project";
}>;
export type ZCodeSavedWorkflowShadowing = z.infer<typeof zcodeSavedWorkflowShadowingSchema>;
export declare const zcodeWorkflowsSaveParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    runId: z.ZodString;
    name: z.ZodString;
    meta: z.ZodObject<{
        description: z.ZodString;
        whenToUse: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                json: "json";
            }>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            default: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
    overwrite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodeWorkflowsSaveParams = z.infer<typeof zcodeWorkflowsSaveParamsSchema>;
export declare const zcodeWorkflowsSaveResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    ok: z.ZodLiteral<true>;
    name: z.ZodString;
    scope: z.ZodEnum<{
        project: "project";
        global: "global";
    }>;
    path: z.ZodString;
    overwritten: z.ZodBoolean;
    shadowing: z.ZodOptional<z.ZodEnum<{
        hides_global: "hides_global";
        hidden_by_project: "hidden_by_project";
    }>>;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    reason: z.ZodEnum<{
        invalid_name: "invalid_name";
        target_exists: "target_exists";
        write_error: "write_error";
        run_not_found: "run_not_found";
        script_missing: "script_missing";
        compile_failed: "compile_failed";
    }>;
    path: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type ZCodeWorkflowsSaveResult = z.infer<typeof zcodeWorkflowsSaveResultSchema>;
/** 转写自对话的候选：模型用 `SaveWorkflow` 存过、并在入参里认领了这次 run。 */
export declare const zcodeWorkflowsForRunCandidateSchema: z.ZodObject<{
    name: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        project: "project";
        global: "global";
    }>>;
}, z.core.$strict>;
export type ZCodeWorkflowsForRunCandidate = z.infer<typeof zcodeWorkflowsForRunCandidateSchema>;
/** 候选上界：一次 run 在一段对话里被存过的次数远小于它。 */
export declare const ZCODE_WORKFLOWS_FOR_RUN_MAX_CANDIDATES = 8;
export declare const zcodeWorkflowsForRunParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    runId: z.ZodString;
    candidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        scope: z.ZodOptional<z.ZodEnum<{
            project: "project";
            global: "global";
        }>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodeWorkflowsForRunParams = z.infer<typeof zcodeWorkflowsForRunParamsSchema>;
export declare const zcodeWorkflowsForRunResultSchema: z.ZodObject<{
    entry: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        whenToUse: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                json: "json";
            }>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            default: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$strict>>>;
        scope: z.ZodEnum<{
            project: "project";
            global: "global";
        }>;
        path: z.ZodString;
    }, z.core.$strict>>;
    match: z.ZodOptional<z.ZodEnum<{
        script: "script";
        name: "name";
        candidate: "candidate";
    }>>;
    runArgs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export type ZCodeWorkflowsForRunResult = z.infer<typeof zcodeWorkflowsForRunResultSchema>;
export declare const zcodePluginSuggestedReferenceStatusSchema: z.ZodEnum<{
    unavailable: "unavailable";
    disabled: "disabled";
    ready: "ready";
    missing: "missing";
    conflict: "conflict";
}>;
export type ZCodePluginSuggestedReferenceStatus = z.infer<typeof zcodePluginSuggestedReferenceStatusSchema>;
export declare const zcodePluginOperationStateSchema: z.ZodEnum<{
    failed: "failed";
    complete: "complete";
    cancelled: "cancelled";
    checking: "checking";
    refreshing: "refreshing";
    installing: "installing";
    enabling: "enabling";
    cancelling: "cancelling";
}>;
export type ZCodePluginOperationState = z.infer<typeof zcodePluginOperationStateSchema>;
export declare const zcodePluginOperationProgressNotificationSchema: z.ZodObject<{
    operationId: z.ZodString;
    state: z.ZodLiteral<"refreshing">;
}, z.core.$strict>;
export type ZCodePluginOperationProgressNotification = z.infer<typeof zcodePluginOperationProgressNotificationSchema>;
export declare const zcodePluginsResolveSuggestedReferenceParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    stableId: z.ZodString;
    operationId: z.ZodString;
    clientMode: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
    deliveryKind: z.ZodEnum<{
        "desktop-continuous": "desktop-continuous";
        "web-remote-replayable": "web-remote-replayable";
    }>;
}, z.core.$strict>;
export type ZCodePluginsResolveSuggestedReferenceParams = z.infer<typeof zcodePluginsResolveSuggestedReferenceParamsSchema>;
export declare const zcodePluginsSetEnabledParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodString;
    enabled: z.ZodBoolean;
    operationId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
}, z.core.$strict>;
export declare const zcodePluginsSetEnabledResultSchema: z.ZodObject<{
    plugin: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        source: z.ZodString;
        marketplace: z.ZodString;
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        skillCount: z.ZodOptional<z.ZodNumber>;
        skillRootCount: z.ZodNumber;
        commandRootCount: z.ZodNumber;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                agent: "agent";
                command: "command";
                mcp: "mcp";
                skill: "skill";
                hook: "hook";
            }>;
            items: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        declaredMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hostMcpServerNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        mcpServerNames: z.ZodArray<z.ZodString>;
        hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            matcher: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                command: "command";
                process: "process";
            }>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            async: z.ZodOptional<z.ZodBoolean>;
            shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            statusMessage: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            runnable: z.ZodBoolean;
        }, z.core.$strict>>>;
        rootPath: z.ZodString;
        userConfig: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            default: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodOptional<z.ZodBoolean>;
            sensitive: z.ZodOptional<z.ZodBoolean>;
            title: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                file: "file";
                directory: "directory";
            }>>;
        }, z.core.$strict>>>;
        configuredOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        packageStatus: z.ZodOptional<z.ZodLiteral<"missing">>;
        rootSource: z.ZodOptional<z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>;
        enabledSource: z.ZodOptional<z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>;
        optionSources: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>>>;
    }, z.core.$strict>;
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodePluginsSetEnabledResult = z.infer<typeof zcodePluginsSetEnabledResultSchema>;
export declare const zcodePluginStoreListingSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    icon: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    authorUrl: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
    privacyPolicy: z.ZodOptional<z.ZodString>;
    termsOfService: z.ZodOptional<z.ZodString>;
    heroImage: z.ZodOptional<z.ZodString>;
    examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type ZCodePluginStoreListing = z.infer<typeof zcodePluginStoreListingSchema>;
export declare const zcodePluginsResolveSuggestedReferenceResultSchema: z.ZodObject<{
    stableId: z.ZodString;
    status: z.ZodEnum<{
        unavailable: "unavailable";
        disabled: "disabled";
        ready: "ready";
        missing: "missing";
        conflict: "conflict";
    }>;
    marketplace: z.ZodOptional<z.ZodString>;
    pluginName: z.ZodOptional<z.ZodString>;
    sourceTrust: z.ZodOptional<z.ZodLiteral<"official">>;
    icon: z.ZodOptional<z.ZodString>;
    listing: z.ZodOptional<z.ZodObject<{
        displayName: z.ZodOptional<z.ZodString>;
        displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        icon: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        privacyPolicy: z.ZodOptional<z.ZodString>;
        termsOfService: z.ZodOptional<z.ZodString>;
        heroImage: z.ZodOptional<z.ZodString>;
        examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
        requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsResolveSuggestedReferenceResult = z.infer<typeof zcodePluginsResolveSuggestedReferenceResultSchema>;
export declare const zcodePluginMarketplaceSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    source: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    description: z.ZodOptional<z.ZodString>;
    lastUpdated: z.ZodOptional<z.ZodString>;
    pluginCount: z.ZodNumber;
    isOfficial: z.ZodOptional<z.ZodBoolean>;
    featured: z.ZodOptional<z.ZodArray<z.ZodString>>;
    refreshFailure: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        failedAt: z.ZodString;
        message: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginMarketplaceSummary = z.infer<typeof zcodePluginMarketplaceSummarySchema>;
export declare const zcodeAvailablePluginSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    marketplace: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    installed: z.ZodBoolean;
    componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    listing: z.ZodOptional<z.ZodObject<{
        displayName: z.ZodOptional<z.ZodString>;
        displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        icon: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        privacyPolicy: z.ZodOptional<z.ZodString>;
        termsOfService: z.ZodOptional<z.ZodString>;
        heroImage: z.ZodOptional<z.ZodString>;
        examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
        requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeAvailablePluginSummary = z.infer<typeof zcodeAvailablePluginSummarySchema>;
export declare const zcodeInstalledPluginSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    marketplace: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    enabled: z.ZodBoolean;
    scope: z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>;
    installPath: z.ZodOptional<z.ZodString>;
    installedAt: z.ZodOptional<z.ZodString>;
    componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodString;
        matcher: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            command: "command";
            process: "process";
        }>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        async: z.ZodOptional<z.ZodBoolean>;
        shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        statusMessage: z.ZodOptional<z.ZodString>;
        sourcePath: z.ZodString;
        runnable: z.ZodBoolean;
    }, z.core.$strict>>>;
    updateStatus: z.ZodOptional<z.ZodEnum<{
        none: "none";
        "update-available": "update-available";
        "version-changed": "version-changed";
    }>>;
    latestVersion: z.ZodOptional<z.ZodString>;
    listing: z.ZodOptional<z.ZodObject<{
        displayName: z.ZodOptional<z.ZodString>;
        displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        icon: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        privacyPolicy: z.ZodOptional<z.ZodString>;
        termsOfService: z.ZodOptional<z.ZodString>;
        heroImage: z.ZodOptional<z.ZodString>;
        examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
        requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeInstalledPluginSummary = z.infer<typeof zcodeInstalledPluginSummarySchema>;
export declare const zcodePluginsOverviewParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    configScope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
}, z.core.$strict>;
export declare const zcodePluginsOverviewResultSchema: z.ZodObject<{
    marketplaces: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        lastUpdated: z.ZodOptional<z.ZodString>;
        pluginCount: z.ZodNumber;
        isOfficial: z.ZodOptional<z.ZodBoolean>;
        featured: z.ZodOptional<z.ZodArray<z.ZodString>>;
        refreshFailure: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            failedAt: z.ZodString;
            message: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    availablePlugins: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        installed: z.ZodBoolean;
        componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        listing: z.ZodOptional<z.ZodObject<{
            displayName: z.ZodOptional<z.ZodString>;
            displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            icon: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            authorUrl: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodString>;
            privacyPolicy: z.ZodOptional<z.ZodString>;
            termsOfService: z.ZodOptional<z.ZodString>;
            heroImage: z.ZodOptional<z.ZodString>;
            examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
            requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    installedPlugins: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        scope: z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>;
        installPath: z.ZodOptional<z.ZodString>;
        installedAt: z.ZodOptional<z.ZodString>;
        componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            matcher: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                command: "command";
                process: "process";
            }>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            async: z.ZodOptional<z.ZodBoolean>;
            shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            statusMessage: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            runnable: z.ZodBoolean;
        }, z.core.$strict>>>;
        updateStatus: z.ZodOptional<z.ZodEnum<{
            none: "none";
            "update-available": "update-available";
            "version-changed": "version-changed";
        }>>;
        latestVersion: z.ZodOptional<z.ZodString>;
        listing: z.ZodOptional<z.ZodObject<{
            displayName: z.ZodOptional<z.ZodString>;
            displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            icon: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            authorUrl: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodString>;
            privacyPolicy: z.ZodOptional<z.ZodString>;
            termsOfService: z.ZodOptional<z.ZodString>;
            heroImage: z.ZodOptional<z.ZodString>;
            examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
            requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    restorableBuiltins: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        installed: z.ZodBoolean;
        componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        listing: z.ZodOptional<z.ZodObject<{
            displayName: z.ZodOptional<z.ZodString>;
            displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            icon: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            authorUrl: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodString>;
            privacyPolicy: z.ZodOptional<z.ZodString>;
            termsOfService: z.ZodOptional<z.ZodString>;
            heroImage: z.ZodOptional<z.ZodString>;
            examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
            requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    capability: z.ZodObject<{
        supported: z.ZodBoolean;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodePluginsOverviewResult = z.infer<typeof zcodePluginsOverviewResultSchema>;
export declare const zcodePluginsMarketplaceAddParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    source: z.ZodString;
    dryRun: z.ZodOptional<z.ZodBoolean>;
    operationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginsMarketplaceRemoveParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    marketplace: z.ZodString;
}, z.core.$strict>;
export declare const zcodePluginsMarketplaceUpdateParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    marketplace: z.ZodOptional<z.ZodString>;
    operationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginsMarketplaceMutationResultSchema: z.ZodObject<{
    marketplace: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        lastUpdated: z.ZodOptional<z.ZodString>;
        pluginCount: z.ZodNumber;
        isOfficial: z.ZodOptional<z.ZodBoolean>;
        featured: z.ZodOptional<z.ZodArray<z.ZodString>>;
        refreshFailure: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            failedAt: z.ZodString;
            message: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    marketplaces: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        description: z.ZodOptional<z.ZodString>;
        lastUpdated: z.ZodOptional<z.ZodString>;
        pluginCount: z.ZodNumber;
        isOfficial: z.ZodOptional<z.ZodBoolean>;
        featured: z.ZodOptional<z.ZodArray<z.ZodString>>;
        refreshFailure: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            failedAt: z.ZodString;
            message: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    diagnostics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type ZCodePluginsMarketplaceMutationResult = z.infer<typeof zcodePluginsMarketplaceMutationResultSchema>;
export declare const zcodePluginsInstallParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginName: z.ZodString;
    marketplace: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
    dryRun: z.ZodOptional<z.ZodBoolean>;
    operationId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginsCancelOperationParamsSchema: z.ZodObject<{
    operationId: z.ZodString;
}, z.core.$strict>;
export type ZCodePluginsCancelOperationParams = z.infer<typeof zcodePluginsCancelOperationParamsSchema>;
export declare const zcodePluginsCancelOperationResultSchema: z.ZodObject<{
    operationId: z.ZodString;
    cancelled: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodePluginsCancelOperationResult = z.infer<typeof zcodePluginsCancelOperationResultSchema>;
export declare const zcodePluginsUninstallParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodOptional<z.ZodString>;
    pluginName: z.ZodOptional<z.ZodString>;
    marketplace: z.ZodOptional<z.ZodString>;
    removeCache: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodePluginsInstallResultSchema: z.ZodObject<{
    installedPlugins: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        scope: z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>;
        installPath: z.ZodOptional<z.ZodString>;
        installedAt: z.ZodOptional<z.ZodString>;
        componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            matcher: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                command: "command";
                process: "process";
            }>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            async: z.ZodOptional<z.ZodBoolean>;
            shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            statusMessage: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            runnable: z.ZodBoolean;
        }, z.core.$strict>>>;
        updateStatus: z.ZodOptional<z.ZodEnum<{
            none: "none";
            "update-available": "update-available";
            "version-changed": "version-changed";
        }>>;
        latestVersion: z.ZodOptional<z.ZodString>;
        listing: z.ZodOptional<z.ZodObject<{
            displayName: z.ZodOptional<z.ZodString>;
            displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            icon: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            authorUrl: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodString>;
            privacyPolicy: z.ZodOptional<z.ZodString>;
            termsOfService: z.ZodOptional<z.ZodString>;
            heroImage: z.ZodOptional<z.ZodString>;
            examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
            requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    dependencyClosure: z.ZodArray<z.ZodString>;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsInstallResult = z.infer<typeof zcodePluginsInstallResultSchema>;
export declare const zcodePluginsUninstallResultSchema: z.ZodObject<{
    removedPlugin: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        marketplace: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        scope: z.ZodEnum<{
            user: "user";
            workspace: "workspace";
        }>;
        installPath: z.ZodOptional<z.ZodString>;
        installedAt: z.ZodOptional<z.ZodString>;
        componentTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hookDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            event: z.ZodString;
            matcher: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<{
                command: "command";
                process: "process";
            }>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            async: z.ZodOptional<z.ZodBoolean>;
            shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
            timeout: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            statusMessage: z.ZodOptional<z.ZodString>;
            sourcePath: z.ZodString;
            runnable: z.ZodBoolean;
        }, z.core.$strict>>>;
        updateStatus: z.ZodOptional<z.ZodEnum<{
            none: "none";
            "update-available": "update-available";
            "version-changed": "version-changed";
        }>>;
        latestVersion: z.ZodOptional<z.ZodString>;
        listing: z.ZodOptional<z.ZodObject<{
            displayName: z.ZodOptional<z.ZodString>;
            displayNameI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            descriptionI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            icon: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            author: z.ZodOptional<z.ZodString>;
            authorUrl: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodString>;
            privacyPolicy: z.ZodOptional<z.ZodString>;
            termsOfService: z.ZodOptional<z.ZodString>;
            heroImage: z.ZodOptional<z.ZodString>;
            examplePrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            examplePromptsI18n: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
            requiresPaidPlan: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsUninstallResult = z.infer<typeof zcodePluginsUninstallResultSchema>;
export declare const zcodePluginsUpdateParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodOptional<z.ZodString>;
    marketplace: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginsRestoreBuiltinParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodString;
}, z.core.$strict>;
export declare const zcodePluginsRestoreBuiltinResultSchema: z.ZodObject<{
    pluginId: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsRestoreBuiltinResult = z.infer<typeof zcodePluginsRestoreBuiltinResultSchema>;
export declare const zcodePluginsConfigureParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodString;
    options: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    clearOptionKeys: z.ZodOptional<z.ZodArray<z.ZodString>>;
    scope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
    dryRun: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const zcodePluginsConfigureResultSchema: z.ZodObject<{
    pluginId: z.ZodString;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsConfigureResult = z.infer<typeof zcodePluginsConfigureResultSchema>;
export declare const zcodePluginsResetConfigParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginId: z.ZodString;
    scope: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
    }>>;
}, z.core.$strict>;
export type ZCodePluginsResetConfigParams = z.infer<typeof zcodePluginsResetConfigParamsSchema>;
export declare const zcodePluginsValidateParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginName: z.ZodOptional<z.ZodString>;
    marketplace: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const zcodePluginsValidateResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    diagnostics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    compatibility: z.ZodObject<{
        runnable: z.ZodArray<z.ZodString>;
        diagnosticOnly: z.ZodArray<z.ZodString>;
        unsupported: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodePluginsValidateResult = z.infer<typeof zcodePluginsValidateResultSchema>;
export declare const zcodePluginsDescribeParamsSchema: z.ZodObject<{
    workspace: z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        remoteSessionId: z.ZodOptional<z.ZodString>;
        workspaceKey: z.ZodString;
    }, z.core.$strict>;
    pluginName: z.ZodString;
    marketplace: z.ZodString;
}, z.core.$strict>;
export declare const zcodePluginsDescribeResultSchema: z.ZodObject<{
    components: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            agent: "agent";
            command: "command";
            mcp: "mcp";
            skill: "skill";
            hook: "hook";
        }>;
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    diagnostics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            error: "error";
            warning: "warning";
        }>>;
        pluginId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    metadata: z.ZodOptional<z.ZodObject<{
        author: z.ZodOptional<z.ZodString>;
        authorUrl: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodePluginsDescribeResult = z.infer<typeof zcodePluginsDescribeResultSchema>;
export declare const zcodeAutomationScheduleRuleSchema: z.ZodObject<{
    unit: z.ZodEnum<{
        minute: "minute";
        hourly: "hourly";
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>;
    interval: z.ZodNumber;
    hour: z.ZodNumber;
    minute: z.ZodNumber;
    anchorAt: z.ZodNumber;
    weekdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    monthDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    months: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    monthlyMode: z.ZodOptional<z.ZodEnum<{
        date: "date";
        weekday: "weekday";
    }>>;
}, z.core.$strict>;
export type ZCodeAutomationScheduleRuleProtocol = z.infer<typeof zcodeAutomationScheduleRuleSchema>;
/** 会话侧长间隔周期 carrier 的 unit 枚举（与 scheduleRule.unit 同集）。 */
export declare const zcodeAutomationIntervalUnitSchema: z.ZodEnum<{
    minute: "minute";
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
    yearly: "yearly";
}>;
export declare const zcodeAutomationProtocolSchema: z.ZodObject<{
    automationId: z.ZodString;
    title: z.ZodString;
    cronExpr: z.ZodString;
    prompt: z.ZodString;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
        acceptEdits: "acceptEdits";
        dontAsk: "dontAsk";
        bypassPermissions: "bypassPermissions";
        autoEdit: "autoEdit";
    }>>;
    targetTaskId: z.ZodOptional<z.ZodString>;
    enabled: z.ZodBoolean;
    lifecycleStatus: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        active: "active";
        paused: "paused";
    }>;
    nextRunAt: z.ZodOptional<z.ZodNumber>;
    lastRunAt: z.ZodOptional<z.ZodNumber>;
    runCount: z.ZodNumber;
    recurring: z.ZodBoolean;
    maxRuns: z.ZodOptional<z.ZodNumber>;
    scheduleRule: z.ZodOptional<z.ZodObject<{
        unit: z.ZodEnum<{
            minute: "minute";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
            yearly: "yearly";
        }>;
        interval: z.ZodNumber;
        hour: z.ZodNumber;
        minute: z.ZodNumber;
        anchorAt: z.ZodNumber;
        weekdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        monthDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        months: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        monthlyMode: z.ZodOptional<z.ZodEnum<{
            date: "date";
            weekday: "weekday";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeAutomationProtocol = z.infer<typeof zcodeAutomationProtocolSchema>;
export declare const zcodeAutomationCreateParamsSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    cronExpr: z.ZodString;
    relativeDelayMinutes: z.ZodOptional<z.ZodNumber>;
    prompt: z.ZodString;
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    mode: z.ZodOptional<z.ZodEnum<{
        default: "default";
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
        auto: "auto";
        acceptEdits: "acceptEdits";
        dontAsk: "dontAsk";
        bypassPermissions: "bypassPermissions";
        autoEdit: "autoEdit";
    }>>;
    targetTaskId: z.ZodOptional<z.ZodString>;
    botDeliveryTarget: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<{
            feishu: "feishu";
            lark: "lark";
            weixin: "weixin";
        }>;
        botId: z.ZodString;
        providerUserId: z.ZodString;
        chatType: z.ZodEnum<{
            private: "private";
            group: "group";
        }>;
        threadId: z.ZodOptional<z.ZodString>;
        rootMessageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    recurring: z.ZodOptional<z.ZodBoolean>;
    maxRuns: z.ZodOptional<z.ZodNumber>;
    intervalUnit: z.ZodOptional<z.ZodEnum<{
        minute: "minute";
        hourly: "hourly";
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>>;
    interval: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeAutomationCreateProtocolParams = z.infer<typeof zcodeAutomationCreateParamsSchema>;
export declare const zcodeAutomationCreateResultSchema: z.ZodObject<{
    automation: z.ZodObject<{
        automationId: z.ZodString;
        title: z.ZodString;
        cronExpr: z.ZodString;
        prompt: z.ZodString;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodEnum<{
            default: "default";
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
            acceptEdits: "acceptEdits";
            dontAsk: "dontAsk";
            bypassPermissions: "bypassPermissions";
            autoEdit: "autoEdit";
        }>>;
        targetTaskId: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        lifecycleStatus: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            active: "active";
            paused: "paused";
        }>;
        nextRunAt: z.ZodOptional<z.ZodNumber>;
        lastRunAt: z.ZodOptional<z.ZodNumber>;
        runCount: z.ZodNumber;
        recurring: z.ZodBoolean;
        maxRuns: z.ZodOptional<z.ZodNumber>;
        scheduleRule: z.ZodOptional<z.ZodObject<{
            unit: z.ZodEnum<{
                minute: "minute";
                hourly: "hourly";
                daily: "daily";
                weekly: "weekly";
                monthly: "monthly";
                yearly: "yearly";
            }>;
            interval: z.ZodNumber;
            hour: z.ZodNumber;
            minute: z.ZodNumber;
            anchorAt: z.ZodNumber;
            weekdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            months: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthlyMode: z.ZodOptional<z.ZodEnum<{
                date: "date";
                weekday: "weekday";
            }>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeAutomationCreateProtocolResult = z.infer<typeof zcodeAutomationCreateResultSchema>;
export declare const zcodeAutomationUpdateParamsSchema: z.ZodObject<{
    automationId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    cronExpr: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    recurring: z.ZodOptional<z.ZodBoolean>;
    maxRuns: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    intervalUnit: z.ZodOptional<z.ZodEnum<{
        minute: "minute";
        hourly: "hourly";
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>>;
    interval: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ZCodeAutomationUpdateProtocolParams = z.infer<typeof zcodeAutomationUpdateParamsSchema>;
export declare const zcodeAutomationUpdateResultSchema: z.ZodObject<{
    automation: z.ZodObject<{
        automationId: z.ZodString;
        title: z.ZodString;
        cronExpr: z.ZodString;
        prompt: z.ZodString;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodEnum<{
            default: "default";
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
            acceptEdits: "acceptEdits";
            dontAsk: "dontAsk";
            bypassPermissions: "bypassPermissions";
            autoEdit: "autoEdit";
        }>>;
        targetTaskId: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        lifecycleStatus: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            active: "active";
            paused: "paused";
        }>;
        nextRunAt: z.ZodOptional<z.ZodNumber>;
        lastRunAt: z.ZodOptional<z.ZodNumber>;
        runCount: z.ZodNumber;
        recurring: z.ZodBoolean;
        maxRuns: z.ZodOptional<z.ZodNumber>;
        scheduleRule: z.ZodOptional<z.ZodObject<{
            unit: z.ZodEnum<{
                minute: "minute";
                hourly: "hourly";
                daily: "daily";
                weekly: "weekly";
                monthly: "monthly";
                yearly: "yearly";
            }>;
            interval: z.ZodNumber;
            hour: z.ZodNumber;
            minute: z.ZodNumber;
            anchorAt: z.ZodNumber;
            weekdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            months: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthlyMode: z.ZodOptional<z.ZodEnum<{
                date: "date";
                weekday: "weekday";
            }>>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
export type ZCodeAutomationUpdateProtocolResult = z.infer<typeof zcodeAutomationUpdateResultSchema>;
export declare const zcodeAutomationListParamsSchema: z.ZodObject<{}, z.core.$strict>;
export type ZCodeAutomationListProtocolParams = z.infer<typeof zcodeAutomationListParamsSchema>;
export declare const zcodeAutomationListResultSchema: z.ZodObject<{
    automations: z.ZodArray<z.ZodObject<{
        automationId: z.ZodString;
        title: z.ZodString;
        cronExpr: z.ZodString;
        prompt: z.ZodString;
        modelSelection: z.ZodOptional<z.ZodObject<{
            providerId: z.ZodString;
            modelId: z.ZodString;
            options: z.ZodOptional<z.ZodObject<{
                reasoningLevel: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        mode: z.ZodOptional<z.ZodEnum<{
            default: "default";
            plan: "plan";
            build: "build";
            edit: "edit";
            yolo: "yolo";
            guarded: "guarded";
            auto: "auto";
            acceptEdits: "acceptEdits";
            dontAsk: "dontAsk";
            bypassPermissions: "bypassPermissions";
            autoEdit: "autoEdit";
        }>>;
        targetTaskId: z.ZodOptional<z.ZodString>;
        enabled: z.ZodBoolean;
        lifecycleStatus: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            active: "active";
            paused: "paused";
        }>;
        nextRunAt: z.ZodOptional<z.ZodNumber>;
        lastRunAt: z.ZodOptional<z.ZodNumber>;
        runCount: z.ZodNumber;
        recurring: z.ZodBoolean;
        maxRuns: z.ZodOptional<z.ZodNumber>;
        scheduleRule: z.ZodOptional<z.ZodObject<{
            unit: z.ZodEnum<{
                minute: "minute";
                hourly: "hourly";
                daily: "daily";
                weekly: "weekly";
                monthly: "monthly";
                yearly: "yearly";
            }>;
            interval: z.ZodNumber;
            hour: z.ZodNumber;
            minute: z.ZodNumber;
            anchorAt: z.ZodNumber;
            weekdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthDays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            months: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            monthlyMode: z.ZodOptional<z.ZodEnum<{
                date: "date";
                weekday: "weekday";
            }>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeAutomationListProtocolResult = z.infer<typeof zcodeAutomationListResultSchema>;
export declare const zcodeAutomationCheckTaskBindingParamsSchema: z.ZodObject<{
    targetTaskId: z.ZodString;
}, z.core.$strict>;
export type ZCodeAutomationCheckTaskBindingProtocolParams = z.infer<typeof zcodeAutomationCheckTaskBindingParamsSchema>;
export declare const zcodeAutomationCheckTaskBindingResultSchema: z.ZodObject<{
    bound: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeAutomationCheckTaskBindingProtocolResult = z.infer<typeof zcodeAutomationCheckTaskBindingResultSchema>;
export declare const zcodeAutomationDeleteParamsSchema: z.ZodObject<{
    automationId: z.ZodString;
}, z.core.$strict>;
export type ZCodeAutomationDeleteProtocolParams = z.infer<typeof zcodeAutomationDeleteParamsSchema>;
export declare const zcodeAutomationDeleteResultSchema: z.ZodObject<{
    deleted: z.ZodBoolean;
}, z.core.$strict>;
export type ZCodeAutomationDeleteProtocolResult = z.infer<typeof zcodeAutomationDeleteResultSchema>;
export declare const zcodeOffPeakPermissionModeSchema: z.ZodEnum<{
    plan: "plan";
    build: "build";
    edit: "edit";
    yolo: "yolo";
    guarded: "guarded";
}>;
export type ZCodeOffPeakProtocolPermissionMode = z.infer<typeof zcodeOffPeakPermissionModeSchema>;
export declare const zcodeOffPeakCreateParamsSchema: z.ZodObject<{
    title: z.ZodString;
    prompt: z.ZodString;
    permissionMode: z.ZodOptional<z.ZodEnum<{
        plan: "plan";
        build: "build";
        edit: "edit";
        yolo: "yolo";
        guarded: "guarded";
    }>>;
    model: z.ZodOptional<z.ZodString>;
    thoughtLevel: z.ZodOptional<z.ZodString>;
    boundSessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeOffPeakCreateProtocolParams = z.infer<typeof zcodeOffPeakCreateParamsSchema>;
export declare const zcodeOffPeakTaskSnapshotSchema: z.ZodObject<{
    offPeakTaskId: z.ZodString;
    title: z.ZodString;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        queued: "queued";
        cancelled: "cancelled";
        paused: "paused";
    }>;
    queuePosition: z.ZodOptional<z.ZodNumber>;
    sessionId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeOffPeakTaskProtocolSnapshot = z.infer<typeof zcodeOffPeakTaskSnapshotSchema>;
export declare const zcodeOffPeakCreateResultSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    ok: z.ZodLiteral<true>;
    task: z.ZodObject<{
        offPeakTaskId: z.ZodString;
        title: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
            queued: "queued";
            cancelled: "cancelled";
            paused: "paused";
        }>;
        queuePosition: z.ZodOptional<z.ZodNumber>;
        sessionId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    failureStage: z.ZodEnum<{
        client_validation: "client_validation";
        ticket_request: "ticket_request";
        local_persist: "local_persist";
    }>;
    errorCategory: z.ZodEnum<{
        unknown: "unknown";
        network: "network";
        client_validation: "client_validation";
        local_persist: "local_persist";
        eligibility_3101: "eligibility_3101";
        quota_3103: "quota_3103";
        invalid_response: "invalid_response";
    }>;
    errorCode: z.ZodString;
}, z.core.$strict>], "ok">;
export type ZCodeOffPeakCreateProtocolResult = z.infer<typeof zcodeOffPeakCreateResultSchema>;
export declare const zcodeOffPeakListParamsSchema: z.ZodObject<{}, z.core.$strict>;
export type ZCodeOffPeakListProtocolParams = z.infer<typeof zcodeOffPeakListParamsSchema>;
export declare const zcodeOffPeakListResultSchema: z.ZodObject<{
    tasks: z.ZodArray<z.ZodObject<{
        offPeakTaskId: z.ZodString;
        title: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
            queued: "queued";
            cancelled: "cancelled";
            paused: "paused";
        }>;
        queuePosition: z.ZodOptional<z.ZodNumber>;
        sessionId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodNumber;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type ZCodeOffPeakListProtocolResult = z.infer<typeof zcodeOffPeakListResultSchema>;
export declare const zcodeProtocolMethods: {
    readonly runtimeCapabilities: "runtime/capabilities";
    readonly computerUseOperationEvent: "computer-use/operation-event";
    readonly sessionCreate: "session/create";
    readonly sessionResume: "session/resume";
    readonly sessionList: "session/list";
    readonly sessionSubagents: "session/subagents";
    readonly sessionRequestRuntimePreferences: "session/requestRuntimePreferences";
    readonly subagentsReadRuntimeConfig: "subagents/readRuntimeConfig";
    readonly sessionRead: "session/read";
    readonly sessionMessages: "session/messages";
    readonly sessionEvents: "session/events";
    readonly sessionDebug: "session/debug";
    readonly sessionSubscribe: "session/subscribe";
    readonly sessionSend: "session/send";
    readonly sessionStop: "session/stop";
    readonly sessionCancelBackgroundTask: "session/cancelBackgroundTask";
    readonly sessionFork: "session/fork";
    readonly sessionCompact: "session/compact";
    readonly sessionGoal: "session/goal";
    readonly sessionClose: "session/close";
    readonly sessionSetModel: "session/setModel";
    readonly sessionSetThoughtLevel: "session/setThoughtLevel";
    readonly sessionSetMode: "session/setMode";
    readonly workspaceReadPresentation: "workspace/readPresentation";
    readonly workspaceHookTrustGrant: "workspace/hooks/trustGrant";
    readonly providerUpdateAccountConfig: "provider/updateAccountConfig";
    readonly workspaceUpdateInteractionPreferences: "workspace/updateInteractionPreferences";
    readonly workspaceUpdateModelIoPreferences: "workspace/updateModelIoPreferences";
    readonly workspaceUpdateOffPeakToolPolicy: "workspace/updateOffPeakToolPolicy";
    readonly workspaceUpdateDynamicWorkflowPolicy: "workspace/updateDynamicWorkflowPolicy";
    readonly workspaceGenerateText: "workspace/generateText";
    readonly workspaceCancelGenerateText: "workspace/cancelGenerateText";
    readonly providerTestModelConnectivity: "provider/testModelConnectivity";
    readonly mcpList: "mcp/list";
    readonly mcpReadResource: "mcp/readResource";
    readonly mcpUiOpenInstance: "mcp/uiOpenInstance";
    readonly mcpUiCloseInstance: "mcp/uiCloseInstance";
    readonly mcpUiValidateInstance: "mcp/uiValidateInstance";
    readonly mcpUiSampling: "mcp/uiSampling";
    readonly mcpUiCancelSampling: "mcp/uiCancelSampling";
    readonly mcpUiCallTool: "mcp/uiCallTool";
    readonly mcpUiCancelCall: "mcp/uiCancelCall";
    readonly mcpUiReadResource: "mcp/uiReadResource";
    readonly mcpUiListResources: "mcp/uiListResources";
    readonly mcpUiListResourceTemplates: "mcp/uiListResourceTemplates";
    readonly mcpUiSubscribeResource: "mcp/uiSubscribeResource";
    readonly mcpUiUnsubscribeResource: "mcp/uiUnsubscribeResource";
    readonly mcpUiRegisterAppTools: "mcp/uiRegisterAppTools";
    readonly mcpUiUnregisterAppTools: "mcp/uiUnregisterAppTools";
    readonly mcpUiClaimAppToolCall: "mcp/uiClaimAppToolCall";
    readonly mcpUiResolveAppToolCall: "mcp/uiResolveAppToolCall";
    readonly pluginsList: "plugins/list";
    readonly pluginsReferenceCatalog: "plugins/referenceCatalog";
    readonly pluginsListUiSurfaces: "plugins/listUiSurfaces";
    readonly pluginsReferenceCatalogWithCategory: "plugins/referenceCatalogWithCategory";
    readonly skillsReferenceCatalog: "skills/referenceCatalog";
    readonly workflowsList: "workflows/list";
    readonly workflowsGet: "workflows/get";
    readonly workflowsUpdateMeta: "workflows/updateMeta";
    readonly workflowsDelete: "workflows/delete";
    readonly workflowsRuns: "workflows/runs";
    readonly workflowsMove: "workflows/move";
    readonly workflowsSave: "workflows/save";
    readonly workflowsForRun: "workflows/forRun";
    readonly pluginsResolveSuggestedReference: "plugins/resolveSuggestedReference";
    readonly pluginsSetEnabled: "plugins/setEnabled";
    readonly pluginsOverview: "plugins/overview";
    readonly pluginsMarketplaceAdd: "plugins/marketplace/add";
    readonly pluginsMarketplaceRemove: "plugins/marketplace/remove";
    readonly pluginsMarketplaceUpdate: "plugins/marketplace/update";
    readonly pluginsInstall: "plugins/install";
    readonly pluginsCancelOperation: "plugins/cancelOperation";
    readonly pluginsUninstall: "plugins/uninstall";
    readonly pluginsUpdate: "plugins/update";
    readonly pluginsRestoreBuiltin: "plugins/restoreBuiltin";
    readonly pluginsConfigure: "plugins/configure";
    readonly pluginsResetConfig: "plugins/resetConfig";
    readonly pluginsValidate: "plugins/validate";
    readonly pluginsDescribe: "plugins/describe";
    readonly automationCreate: "automation/create";
    readonly topicResourceRead: "topic/resource/read";
    readonly channelReply: "bot/channel/reply";
    readonly topicResourceCancel: "topic/resource/cancel";
    readonly automationUpdate: "automation/update";
    readonly automationCheckTaskBinding: "automation/checkTaskBinding";
    readonly automationList: "automation/list";
    readonly automationDelete: "automation/delete";
    readonly offPeakCreate: "offPeak/create";
    readonly offPeakList: "offPeak/list";
    readonly usageStats: "usage/stats";
    readonly sessionUsage: "session/usage";
    readonly processChildProcesses: "process/childProcesses";
    readonly processNetworkCapture: "process/networkCapture";
    readonly interactionRequestPermission: "interaction/requestPermission";
    readonly interactionRequestUserInput: "interaction/requestUserInput";
    readonly interactionRequestProviderRuntimeHeaders: "interaction/requestProviderRuntimeHeaders";
    readonly interactionRequestOfficialMcpAuthHeaders: "interaction/requestOfficialMcpAuthHeaders";
    readonly interactionBrowserList: "interaction/browserList";
    readonly interactionBrowserExecute: "interaction/browserExecute";
};
export type ZCodeProtocolMethod = (typeof zcodeProtocolMethods)[keyof typeof zcodeProtocolMethods];
export declare const zcodeProtocolEmptyResultSchema: z.ZodObject<{}, z.core.$strict>;
export declare const zcodeProtocolSessionMethodContracts: {
    readonly "mcp/uiOpenInstance": {
        readonly params: z.ZodObject<{
            accountContext: z.ZodOptional<z.ZodString>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
            scopeId: z.ZodString;
            resourceUri: z.ZodString;
            ownerWebContentsId: z.ZodNumber;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            runtimeId: z.ZodString;
            generation: z.ZodNumber;
            appIdentity: z.ZodString;
            token: z.ZodString;
        }, z.core.$strict>;
    };
    readonly "mcp/uiCloseInstance": {
        readonly params: z.ZodObject<{
            onlyIfIdle: z.ZodOptional<z.ZodBoolean>;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            closed: z.ZodBoolean;
        }, z.core.$strict>;
    };
    readonly "mcp/uiValidateInstance": {
        readonly params: z.ZodObject<{
            onlyIfIdle: z.ZodOptional<z.ZodBoolean>;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{}, z.core.$strict>;
    };
    readonly "workspace/hooks/trustGrant": {
        readonly params: z.ZodObject<{
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            bundleDigest: z.ZodString;
            hookDeclarationDigest: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            accepted: z.ZodBoolean;
            reasonCode: z.ZodOptional<z.ZodEnum<{
                workspace_hooks_blocked_by_policy: "workspace_hooks_blocked_by_policy";
                workspace_hooks_bundle_changed: "workspace_hooks_bundle_changed";
                workspace_hooks_snapshot_mismatch: "workspace_hooks_snapshot_mismatch";
                workspace_hooks_policy_requires_pretrust: "workspace_hooks_policy_requires_pretrust";
                workspace_hooks_trust_store_corrupt: "workspace_hooks_trust_store_corrupt";
                workspace_hooks_config_unreadable: "workspace_hooks_config_unreadable";
            }>>;
        }, z.core.$strict>;
    };
    readonly "mcp/list": {
        readonly params: z.ZodObject<{
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                name: z.ZodString;
                command: z.ZodString;
                args: z.ZodArray<z.ZodString>;
                env: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strict>>;
                isolation: z.ZodOptional<z.ZodEnum<{
                    workspace: "workspace";
                    session: "session";
                }>>;
                protocolVersion: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    legacy: "legacy";
                    "2026-07-28": "2026-07-28";
                }>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>, z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<{
                    http: "http";
                    sse: "sse";
                }>;
                url: z.ZodString;
                headers: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strict>>;
                oauth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
                    type: z.ZodLiteral<"client_credentials">;
                    clientId: z.ZodString;
                    clientSecret: z.ZodString;
                    clientName: z.ZodOptional<z.ZodString>;
                    scope: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    type: z.ZodLiteral<"authorization_code">;
                    clientId: z.ZodOptional<z.ZodString>;
                    clientSecret: z.ZodOptional<z.ZodString>;
                    clientName: z.ZodOptional<z.ZodString>;
                    redirectPath: z.ZodOptional<z.ZodString>;
                    scope: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>]>>;
                isolation: z.ZodOptional<z.ZodEnum<{
                    workspace: "workspace";
                    session: "session";
                }>>;
                protocolVersion: z.ZodOptional<z.ZodEnum<{
                    auto: "auto";
                    legacy: "legacy";
                    "2026-07-28": "2026-07-28";
                }>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>]>>>;
            mode: z.ZodDefault<z.ZodEnum<{
                status: "status";
                connect: "connect";
            }>>;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            statuses: z.ZodRecord<z.ZodString, z.ZodObject<{
                status: z.ZodEnum<{
                    failed: "failed";
                    disabled: "disabled";
                    connected: "connected";
                    connecting: "connecting";
                    disconnected: "disconnected";
                    untrusted: "untrusted";
                }>;
                transport: z.ZodEnum<{
                    http: "http";
                    sse: "sse";
                    stdio: "stdio";
                }>;
                toolCount: z.ZodNumber;
                updatedAt: z.ZodString;
                error: z.ZodOptional<z.ZodString>;
                failureKind: z.ZodOptional<z.ZodEnum<{
                    coding_plan_required: "coding_plan_required";
                    not_authenticated: "not_authenticated";
                    config_invalid: "config_invalid";
                    runtime_unavailable: "runtime_unavailable";
                    process_start_failed: "process_start_failed";
                    network_unreachable: "network_unreachable";
                    connection_timeout: "connection_timeout";
                    protocol_negotiation_failed: "protocol_negotiation_failed";
                    tool_list_failed: "tool_list_failed";
                    unexpected_disconnect: "unexpected_disconnect";
                    oauth_authorization_failed: "oauth_authorization_failed";
                    official_origin_untrusted: "official_origin_untrusted";
                    server_not_found: "server_not_found";
                    server_unavailable: "server_unavailable";
                    rate_limited: "rate_limited";
                    server_internal_error: "server_internal_error";
                    protocol_error: "protocol_error";
                    status_unavailable: "status_unavailable";
                    connection_failed: "connection_failed";
                }>>;
                serverRequestId: z.ZodOptional<z.ZodString>;
                protocolEra: z.ZodOptional<z.ZodEnum<{
                    legacy: "legacy";
                    modern: "modern";
                }>>;
                authorization: z.ZodOptional<z.ZodObject<{
                    type: z.ZodLiteral<"oauth_authorization_code">;
                    authorizationUrl: z.ZodString;
                    startedAt: z.ZodString;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    };
    readonly "mcp/readResource": {
        readonly params: z.ZodObject<{
            uri: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            contents: z.ZodArray<z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                blob: z.ZodOptional<z.ZodString>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiSampling": {
        readonly params: z.ZodObject<{
            operationId: z.ZodString;
            request: z.ZodObject<{
                messages: z.ZodArray<z.ZodObject<{
                    role: z.ZodEnum<{
                        user: "user";
                        assistant: "assistant";
                    }>;
                    content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
                        type: z.ZodLiteral<"text">;
                        text: z.ZodString;
                        annotations: z.ZodOptional<z.ZodObject<{
                            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                user: "user";
                                assistant: "assistant";
                            }>>>;
                            priority: z.ZodOptional<z.ZodNumber>;
                            lastModified: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"image">;
                        mimeType: z.ZodEnum<{
                            "image/png": "image/png";
                            "image/jpeg": "image/jpeg";
                            "image/webp": "image/webp";
                        }>;
                        data: z.ZodString;
                        annotations: z.ZodOptional<z.ZodObject<{
                            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                user: "user";
                                assistant: "assistant";
                            }>>>;
                            priority: z.ZodOptional<z.ZodNumber>;
                            lastModified: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    }, z.core.$strict>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                        type: z.ZodLiteral<"text">;
                        text: z.ZodString;
                        annotations: z.ZodOptional<z.ZodObject<{
                            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                user: "user";
                                assistant: "assistant";
                            }>>>;
                            priority: z.ZodOptional<z.ZodNumber>;
                            lastModified: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"image">;
                        mimeType: z.ZodEnum<{
                            "image/png": "image/png";
                            "image/jpeg": "image/jpeg";
                            "image/webp": "image/webp";
                        }>;
                        data: z.ZodString;
                        annotations: z.ZodOptional<z.ZodObject<{
                            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                                user: "user";
                                assistant: "assistant";
                            }>>>;
                            priority: z.ZodOptional<z.ZodNumber>;
                            lastModified: z.ZodOptional<z.ZodString>;
                        }, z.core.$strict>>;
                        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    }, z.core.$strict>], "type">>]>;
                }, z.core.$strict>>;
                systemPrompt: z.ZodOptional<z.ZodString>;
                maxTokens: z.ZodNumber;
                includeContext: z.ZodOptional<z.ZodLiteral<"none">>;
                modelPreferences: z.ZodOptional<z.ZodObject<{
                    hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        name: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>>>;
                    costPriority: z.ZodOptional<z.ZodNumber>;
                    speedPriority: z.ZodOptional<z.ZodNumber>;
                    intelligencePriority: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            role: z.ZodLiteral<"assistant">;
            model: z.ZodString;
            content: z.ZodObject<{
                type: z.ZodLiteral<"text">;
                text: z.ZodString;
            }, z.core.$strict>;
            stopReason: z.ZodString;
        }, z.core.$strict>;
    };
    readonly "mcp/uiCancelSampling": {
        readonly params: z.ZodObject<{
            operationId: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            cancelled: z.ZodBoolean;
        }, z.core.$strict>;
    };
    readonly "mcp/uiCallTool": {
        readonly params: z.ZodObject<{
            toolName: z.ZodString;
            arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            callId: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            content: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            structuredContent: z.ZodOptional<z.ZodUnknown>;
            isError: z.ZodOptional<z.ZodBoolean>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiCancelCall": {
        readonly params: z.ZodObject<{
            callId: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            cancelled: z.ZodBoolean;
        }, z.core.$strict>;
    };
    readonly "mcp/uiReadResource": {
        readonly params: z.ZodObject<{
            uri: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            contents: z.ZodArray<z.ZodObject<{
                uri: z.ZodString;
                mimeType: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                blob: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiListResources": {
        readonly params: z.ZodObject<{
            cursor: z.ZodOptional<z.ZodString>;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            resources: z.ZodArray<z.ZodObject<{
                uri: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strict>>;
            nextCursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiListResourceTemplates": {
        readonly params: z.ZodObject<{
            cursor: z.ZodOptional<z.ZodString>;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            resourceTemplates: z.ZodArray<z.ZodObject<{
                uriTemplate: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                mimeType: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            nextCursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiSubscribeResource": {
        readonly params: z.ZodObject<{
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            uri: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{}, z.core.$strict>;
    };
    readonly "mcp/uiUnsubscribeResource": {
        readonly params: z.ZodObject<{
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            uri: z.ZodString;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{}, z.core.$strict>;
    };
    readonly "mcp/uiRegisterAppTools": {
        readonly params: z.ZodObject<{
            tools: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                inputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                outputSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                annotations: z.ZodOptional<z.ZodObject<{
                    title: z.ZodOptional<z.ZodString>;
                    readOnlyHint: z.ZodOptional<z.ZodBoolean>;
                    destructiveHint: z.ZodOptional<z.ZodBoolean>;
                    idempotentHint: z.ZodOptional<z.ZodBoolean>;
                    openWorldHint: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>>;
            }, z.core.$strict>>;
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            tools: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                modelName: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    };
    readonly "mcp/uiUnregisterAppTools": {
        readonly params: z.ZodObject<{
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            removed: z.ZodNumber;
        }, z.core.$strict>;
    };
    readonly "mcp/uiClaimAppToolCall": {
        readonly params: z.ZodObject<{
            callId: z.ZodString;
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            accepted: z.ZodBoolean;
        }, z.core.$strict>;
    };
    readonly "mcp/uiResolveAppToolCall": {
        readonly params: z.ZodObject<{
            callId: z.ZodString;
            result: z.ZodOptional<z.ZodObject<{
                content: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                structuredContent: z.ZodOptional<z.ZodUnknown>;
                isError: z.ZodOptional<z.ZodBoolean>;
                _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strip>>;
            error: z.ZodOptional<z.ZodObject<{
                message: z.ZodString;
            }, z.core.$strict>>;
            scopeId: z.ZodString;
            generation: z.ZodNumber;
            instance: z.ZodObject<{
                runtimeId: z.ZodString;
                generation: z.ZodNumber;
                appIdentity: z.ZodString;
                token: z.ZodString;
            }, z.core.$strict>;
            workspace: z.ZodObject<{
                workspacePath: z.ZodString;
                workspaceIdentity: z.ZodOptional<z.ZodString>;
                remoteSessionId: z.ZodOptional<z.ZodString>;
                workspaceKey: z.ZodString;
            }, z.core.$strict>;
            sessionId: z.ZodString;
            pluginId: z.ZodString;
            serverName: z.ZodString;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            accepted: z.ZodBoolean;
        }, z.core.$strict>;
    };
    readonly "interaction/browserList": {
        readonly params: z.ZodObject<{
            requestId: z.ZodString;
            sessionId: z.ZodString;
            turnId: z.ZodOptional<z.ZodString>;
            workspaceKey: z.ZodString;
            workspacePath: z.ZodString;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            clientMode: z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>;
            sessionContext: z.ZodEnum<{
                cached: "cached";
                live: "live";
            }>;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            browsers: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                generation: z.ZodDefault<z.ZodNumber>;
                type: z.ZodEnum<{
                    iab: "iab";
                    extension: "extension";
                    cdp: "cdp";
                }>;
                name: z.ZodString;
                capabilities: z.ZodObject<{
                    browser: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        description: z.ZodString;
                    }, z.core.$strict>>>;
                    tab: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        description: z.ZodString;
                    }, z.core.$strict>>>;
                }, z.core.$strict>;
                apiSupportOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    };
    readonly "interaction/browserExecute": {
        readonly params: z.ZodObject<{
            requestId: z.ZodString;
            sessionId: z.ZodString;
            turnId: z.ZodOptional<z.ZodString>;
            browserId: z.ZodOptional<z.ZodString>;
            browserGeneration: z.ZodOptional<z.ZodNumber>;
            workspaceKey: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodOptional<z.ZodString>;
            workspaceIdentity: z.ZodOptional<z.ZodString>;
            remoteSessionId: z.ZodOptional<z.ZodString>;
            clientMode: z.ZodOptional<z.ZodEnum<{
                "desktop-continuous": "desktop-continuous";
                "web-remote-replayable": "web-remote-replayable";
            }>>;
            sessionContext: z.ZodOptional<z.ZodEnum<{
                cached: "cached";
                live: "live";
            }>>;
            command: z.ZodDiscriminatedUnion<[z.ZodObject<{
                method: z.ZodLiteral<"navigate">;
                url: z.ZodString;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"back">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"forward">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"reload">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"snapshot">;
                maxElements: z.ZodOptional<z.ZodNumber>;
                includeHidden: z.ZodOptional<z.ZodBoolean>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"click">;
                ref: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                button: z.ZodOptional<z.ZodEnum<{
                    left: "left";
                    right: "right";
                    middle: "middle";
                }>>;
                doubleClick: z.ZodOptional<z.ZodBoolean>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"fill">;
                ref: z.ZodString;
                value: z.ZodString;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"type">;
                ref: z.ZodOptional<z.ZodString>;
                text: z.ZodString;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"press">;
                key: z.ZodString;
                ref: z.ZodOptional<z.ZodString>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"cuaKeypress">;
                keys: z.ZodArray<z.ZodString>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"scroll">;
                ref: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"cuaScroll">;
                x: z.ZodNumber;
                y: z.ZodNumber;
                scrollX: z.ZodNumber;
                scrollY: z.ZodNumber;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"domCuaScroll">;
                nodeId: z.ZodOptional<z.ZodString>;
                scrollX: z.ZodNumber;
                scrollY: z.ZodNumber;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"screenshot">;
                ref: z.ZodOptional<z.ZodString>;
                fullPage: z.ZodOptional<z.ZodBoolean>;
                clip: z.ZodOptional<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"getState">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"hover">;
                ref: z.ZodOptional<z.ZodString>;
                x: z.ZodOptional<z.ZodNumber>;
                y: z.ZodOptional<z.ZodNumber>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"select">;
                ref: z.ZodString;
                values: z.ZodArray<z.ZodString>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"check">;
                ref: z.ZodString;
                checked: z.ZodOptional<z.ZodBoolean>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"drag">;
                fromRef: z.ZodOptional<z.ZodString>;
                toRef: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                to: z.ZodOptional<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"cuaDrag">;
                path: z.ZodArray<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                }, z.core.$strict>>;
                modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    Alt: "Alt";
                    Shift: "Shift";
                    Control: "Control";
                    ControlOrMeta: "ControlOrMeta";
                    Meta: "Meta";
                }>>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"elementInfo">;
                x: z.ZodNumber;
                y: z.ZodNumber;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"evaluate">;
                expression: z.ZodString;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"getDialog">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"handleDialog">;
                accept: z.ZodBoolean;
                promptText: z.ZodOptional<z.ZodString>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"waitFor">;
                selector: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                textGone: z.ZodOptional<z.ZodString>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"playwrightWaitForTimeout">;
                timeoutMs: z.ZodNumber;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"playwright">;
                action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    name: z.ZodLiteral<"domSnapshot">;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"elementInfo">;
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"elementScreenshot">;
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"evaluate">;
                    expression: z.ZodString;
                    expressionKind: z.ZodEnum<{
                        string: "string";
                        function: "function";
                    }>;
                    arg: z.ZodOptional<z.ZodUnknown>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"waitForLoadState">;
                    state: z.ZodOptional<z.ZodEnum<{
                        load: "load";
                        domcontentloaded: "domcontentloaded";
                        networkidle: "networkidle";
                    }>>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"waitForURL">;
                    url: z.ZodString;
                    waitUntil: z.ZodOptional<z.ZodEnum<{
                        load: "load";
                        domcontentloaded: "domcontentloaded";
                        networkidle: "networkidle";
                        commit: "commit";
                    }>>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"waitForEvent">;
                    event: z.ZodEnum<{
                        download: "download";
                        filechooser: "filechooser";
                    }>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"downloadPath">;
                    downloadId: z.ZodString;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"fileChooserSetFiles">;
                    fileChooserId: z.ZodString;
                    files: z.ZodArray<z.ZodString>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>, z.ZodObject<{
                    name: z.ZodLiteral<"locator">;
                    selector: z.ZodString;
                    operation: z.ZodEnum<{
                        fill: "fill";
                        click: "click";
                        press: "press";
                        evaluate: "evaluate";
                        waitFor: "waitFor";
                        count: "count";
                        allTextContents: "allTextContents";
                        dblclick: "dblclick";
                        downloadMedia: "downloadMedia";
                        getAttribute: "getAttribute";
                        innerText: "innerText";
                        isEnabled: "isEnabled";
                        isVisible: "isVisible";
                        selectOption: "selectOption";
                        setChecked: "setChecked";
                        textContent: "textContent";
                    }>;
                    value: z.ZodOptional<z.ZodUnknown>;
                    arg: z.ZodOptional<z.ZodUnknown>;
                    expression: z.ZodOptional<z.ZodString>;
                    expressionKind: z.ZodOptional<z.ZodEnum<{
                        string: "string";
                        function: "function";
                    }>>;
                    attribute: z.ZodOptional<z.ZodString>;
                    checked: z.ZodOptional<z.ZodBoolean>;
                    replace: z.ZodOptional<z.ZodBoolean>;
                    force: z.ZodOptional<z.ZodBoolean>;
                    button: z.ZodOptional<z.ZodEnum<{
                        left: "left";
                        right: "right";
                        middle: "middle";
                    }>>;
                    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                        Alt: "Alt";
                        Shift: "Shift";
                        Control: "Control";
                        ControlOrMeta: "ControlOrMeta";
                        Meta: "Meta";
                    }>>>;
                    state: z.ZodOptional<z.ZodEnum<{
                        visible: "visible";
                        hidden: "hidden";
                        attached: "attached";
                        detached: "detached";
                    }>>;
                    selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        value: z.ZodOptional<z.ZodString>;
                        label: z.ZodOptional<z.ZodString>;
                        index: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>>>;
                    timeoutMs: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strict>], "name">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"capabilities">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"browserVisibilityGet">;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"browserVisibilitySet">;
                visible: z.ZodBoolean;
            }, z.core.$strict>, z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
                method: z.ZodLiteral<"browserViewportSet">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"browserViewportReset">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"recordingStart">;
                options: z.ZodOptional<z.ZodObject<{
                    viewport: z.ZodOptional<z.ZodObject<{
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, z.core.$strict>>;
                    fps: z.ZodOptional<z.ZodNumber>;
                    jpegQuality: z.ZodOptional<z.ZodNumber>;
                    maxDurationMs: z.ZodOptional<z.ZodNumber>;
                    settleMs: z.ZodOptional<z.ZodNumber>;
                    showCursor: z.ZodOptional<z.ZodBoolean>;
                    actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                        type: z.ZodLiteral<"wait">;
                        durationMs: z.ZodNumber;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"click">;
                        selector: z.ZodOptional<z.ZodString>;
                        x: z.ZodOptional<z.ZodNumber>;
                        y: z.ZodOptional<z.ZodNumber>;
                        button: z.ZodOptional<z.ZodEnum<{
                            left: "left";
                            right: "right";
                            middle: "middle";
                        }>>;
                        doubleClick: z.ZodOptional<z.ZodBoolean>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"type">;
                        selector: z.ZodString;
                        text: z.ZodString;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"hover">;
                        selector: z.ZodOptional<z.ZodString>;
                        x: z.ZodOptional<z.ZodNumber>;
                        y: z.ZodOptional<z.ZodNumber>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"move">;
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"scroll">;
                        deltaX: z.ZodOptional<z.ZodNumber>;
                        deltaY: z.ZodNumber;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"scrollTo">;
                        selector: z.ZodOptional<z.ZodString>;
                        x: z.ZodOptional<z.ZodNumber>;
                        y: z.ZodOptional<z.ZodNumber>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"wheel">;
                        deltaX: z.ZodOptional<z.ZodNumber>;
                        deltaY: z.ZodNumber;
                        times: z.ZodOptional<z.ZodNumber>;
                        intervalMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"drag">;
                        path: z.ZodArray<z.ZodObject<{
                            x: z.ZodNumber;
                            y: z.ZodNumber;
                        }, z.core.$strict>>;
                        durationMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>, z.ZodObject<{
                        type: z.ZodLiteral<"waitFor">;
                        selector: z.ZodString;
                        state: z.ZodOptional<z.ZodEnum<{
                            visible: "visible";
                            hidden: "hidden";
                            attached: "attached";
                            detached: "detached";
                        }>>;
                        timeoutMs: z.ZodOptional<z.ZodNumber>;
                        delayAfterMs: z.ZodOptional<z.ZodNumber>;
                    }, z.core.$strict>], "type">>>;
                }, z.core.$strict>>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"recordingStatus">;
                recordingId: z.ZodString;
                outputPath: z.ZodOptional<z.ZodString>;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"recordingCancel">;
                recordingId: z.ZodString;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"activateTab">;
                tabId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"newTab">;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"listUserTabs">;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"claimTab">;
                tabId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"finalizeTabs">;
                keep: z.ZodArray<z.ZodObject<{
                    tabId: z.ZodString;
                    status: z.ZodEnum<{
                        handoff: "handoff";
                        deliverable: "deliverable";
                    }>;
                }, z.core.$strict>>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"markDeliverable">;
                tabId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"markHandoff">;
                tabId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"nameSession">;
                name: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"finalize">;
                tabId: z.ZodOptional<z.ZodString>;
                deliverable: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"turnEnded">;
                turnId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"closeSession">;
                closeTabs: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"cancelRequest">;
                requestId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"close">;
                tabId: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                method: z.ZodLiteral<"list">;
            }, z.core.$strict>], "method">;
        }, z.core.$strict>;
        readonly result: z.ZodObject<{
            ok: z.ZodBoolean;
            state: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
                title: z.ZodString;
                canGoBack: z.ZodBoolean;
                canGoForward: z.ZodBoolean;
                scrollX: z.ZodOptional<z.ZodNumber>;
                scrollY: z.ZodOptional<z.ZodNumber>;
                viewportWidth: z.ZodOptional<z.ZodNumber>;
                viewportHeight: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
            snapshot: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
                title: z.ZodString;
                dom: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    tag: z.ZodString;
                    depth: z.ZodNumber;
                    inViewport: z.ZodBoolean;
                    ref: z.ZodOptional<z.ZodString>;
                    role: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                }, z.core.$strict>>>;
                domTruncated: z.ZodOptional<z.ZodBoolean>;
                elements: z.ZodArray<z.ZodObject<{
                    ref: z.ZodString;
                    tag: z.ZodString;
                    role: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    value: z.ZodOptional<z.ZodString>;
                    disabled: z.ZodOptional<z.ZodBoolean>;
                    checked: z.ZodOptional<z.ZodBoolean>;
                    selector: z.ZodString;
                    xpath: z.ZodString;
                    rect: z.ZodObject<{
                        x: z.ZodNumber;
                        y: z.ZodNumber;
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, z.core.$strict>;
                    inViewport: z.ZodBoolean;
                    parentRef: z.ZodOptional<z.ZodString>;
                    framePath: z.ZodOptional<z.ZodString>;
                    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                }, z.core.$strict>>;
                truncated: z.ZodBoolean;
            }, z.core.$strict>>;
            image: z.ZodOptional<z.ZodObject<{
                base64: z.ZodString;
                mimeType: z.ZodLiteral<"image/png">;
            }, z.core.$strict>>;
            tabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                tabId: z.ZodString;
                url: z.ZodString;
                title: z.ZodString;
                viewport: z.ZodObject<{
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                active: z.ZodOptional<z.ZodBoolean>;
                lifecycle: z.ZodOptional<z.ZodEnum<{
                    active: "active";
                    handoff: "handoff";
                    deliverable: "deliverable";
                }>>;
            }, z.core.$strict>>>;
            userTabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                lastOpened: z.ZodOptional<z.ZodString>;
                tabGroup: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
                url: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            tab: z.ZodOptional<z.ZodObject<{
                tabId: z.ZodString;
                url: z.ZodString;
                title: z.ZodString;
                viewport: z.ZodObject<{
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                active: z.ZodOptional<z.ZodBoolean>;
                lifecycle: z.ZodOptional<z.ZodEnum<{
                    active: "active";
                    handoff: "handoff";
                    deliverable: "deliverable";
                }>>;
            }, z.core.$strict>>;
            value: z.ZodOptional<z.ZodUnknown>;
            element: z.ZodOptional<z.ZodObject<{
                ref: z.ZodString;
                tag: z.ZodString;
                role: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                value: z.ZodOptional<z.ZodString>;
                disabled: z.ZodOptional<z.ZodBoolean>;
                checked: z.ZodOptional<z.ZodBoolean>;
                selector: z.ZodString;
                xpath: z.ZodString;
                rect: z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                }, z.core.$strict>;
                inViewport: z.ZodBoolean;
                parentRef: z.ZodOptional<z.ZodString>;
                framePath: z.ZodOptional<z.ZodString>;
                attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            }, z.core.$strict>>;
            dialog: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                type: z.ZodEnum<{
                    prompt: "prompt";
                    alert: "alert";
                    confirm: "confirm";
                    beforeunload: "beforeunload";
                }>;
                message: z.ZodString;
                defaultPrompt: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>>;
            recording: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                status: z.ZodEnum<{
                    running: "running";
                    completed: "completed";
                    failed: "failed";
                    cancelled: "cancelled";
                }>;
                phase: z.ZodEnum<{
                    completed: "completed";
                    failed: "failed";
                    cancelled: "cancelled";
                    preparing: "preparing";
                    capturing: "capturing";
                    finalizing: "finalizing";
                }>;
                progress: z.ZodNumber;
                startedAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
                artifact: z.ZodOptional<z.ZodObject<{
                    path: z.ZodString;
                    mimeType: z.ZodLiteral<"video/webm">;
                    width: z.ZodNumber;
                    height: z.ZodNumber;
                    fps: z.ZodNumber;
                    durationMs: z.ZodNumber;
                    frameCount: z.ZodNumber;
                }, z.core.$strict>>;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            error: z.ZodOptional<z.ZodObject<{
                code: z.ZodEnum<{
                    cancelled: "cancelled";
                    timeout: "timeout";
                    backend_unavailable: "backend_unavailable";
                    capability_unsupported: "capability_unsupported";
                    duplicate_request_id: "duplicate_request_id";
                    ref_not_found: "ref_not_found";
                    navigation_blocked: "navigation_blocked";
                    renderer_unreachable: "renderer_unreachable";
                    execution_error: "execution_error";
                }>;
                message: z.ZodString;
                sideEffect: z.ZodOptional<z.ZodEnum<{
                    none: "none";
                    uncertain: "uncertain";
                }>>;
            }, z.core.$strict>>;
            meta: z.ZodOptional<z.ZodObject<{
                browserUse: z.ZodLiteral<true>;
                backendType: z.ZodEnum<{
                    iab: "iab";
                    extension: "extension";
                    cdp: "cdp";
                }>;
                browserId: z.ZodString;
                browserGeneration: z.ZodNumber;
                openTabIds: z.ZodArray<z.ZodString>;
                tabId: z.ZodOptional<z.ZodString>;
                currentUrl: z.ZodOptional<z.ZodString>;
                lifecycle: z.ZodOptional<z.ZodEnum<{
                    active: "active";
                    handoff: "handoff";
                    deliverable: "deliverable";
                    closed: "closed";
                }>>;
            }, z.core.$strict>>;
            elapsedMs: z.ZodNumber;
        }, z.core.$strict>;
    };
};
export type ZCodeProtocolSessionMethodContract = (typeof zcodeProtocolSessionMethodContracts)[keyof typeof zcodeProtocolSessionMethodContracts];
/** 仅存储准备子进程的私有控制帧，原始路径不进入业务事件或遥测。 */
export declare const zcodeStoragePreparationFrameSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    method: z.ZodLiteral<"startup/storagePath">;
    params: z.ZodObject<{
        path: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"startup/storagePrepared">;
    params: z.ZodObject<{}, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"startup/storageState">;
    params: z.ZodObject<{
        sqliteCode: z.ZodOptional<z.ZodNumber>;
        systemCode: z.ZodOptional<z.ZodString>;
        migrationId: z.ZodOptional<z.ZodString>;
        schemaVersion: z.ZodLiteral<1>;
        attemptId: z.ZodString;
        sequence: z.ZodNumber;
        databaseId: z.ZodString;
        databaseKind: z.ZodEnum<{
            session: "session";
            "tasks-index": "tasks-index";
        }>;
        phase: z.ZodEnum<{
            failed: "failed";
            ready: "ready";
            checking: "checking";
            waiting_for_lock: "waiting_for_lock";
            migrating: "migrating";
            committing: "committing";
        }>;
        migration: z.ZodOptional<z.ZodObject<{
            kind: z.ZodEnum<{
                none: "none";
                initialize: "initialize";
                upgrade: "upgrade";
            }>;
            executedCount: z.ZodNumber;
            committedCount: z.ZodNumber;
            lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        elapsedMs: z.ZodNumber;
        completed: z.ZodOptional<z.ZodNumber>;
        total: z.ZodOptional<z.ZodNumber>;
        errorCode: z.ZodOptional<z.ZodEnum<{
            storage_full: "storage_full";
            permission_denied: "permission_denied";
            io_error: "io_error";
            out_of_memory: "out_of_memory";
            corrupt: "corrupt";
            open_failed: "open_failed";
            lock_timeout: "lock_timeout";
            checksum_mismatch: "checksum_mismatch";
            sql_failed: "sql_failed";
            startup_status_timeout: "startup_status_timeout";
            transport_closed: "transport_closed";
            unsupported_runtime: "unsupported_runtime";
        }>>;
    }, z.core.$strict>;
}, z.core.$strict>], "method">;
export declare const zcodeStoragePathReadySchema: z.ZodObject<{
    method: z.ZodLiteral<"startup/storagePathReady">;
    reuse: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export { localTtftFactsSchema } from "../localTtft.js";
export { botIdentitySchema, botTopicInputMessageSchema, botGroupInputSourceSchema, type BotGroupInputSource, } from "../bots.js";
export { botTopicContextSchema, botTopicMessageSchema, type BotTopicHistoryBatch, type BotTopicMessage, } from "../bots.js";
//# sourceMappingURL=index.d.ts.map