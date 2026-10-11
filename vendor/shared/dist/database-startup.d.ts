import { z } from "zod";
export declare const databaseStartupErrorCodeSchema: z.ZodEnum<{
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
}>;
export type DatabaseStartupErrorCode = z.infer<typeof databaseStartupErrorCodeSchema>;
/** 原始结构化 cause 比外层通用包装更准确；禁止从错误文案推断满盘或 OOM。 */
export declare function classifyDatabaseStartupError(error: unknown): DatabaseStartupErrorCode;
/** 只跨进程传输错误码和冻结迁移 ID，不携带 SQL、文件内容或凭据。 */
export declare function databaseStartupErrorDetails(error: unknown): {
    sqliteCode?: number;
    systemCode?: string;
    migrationId?: string;
};
export declare const databaseStartupErrorDetailsSchema: z.ZodObject<{
    sqliteCode: z.ZodOptional<z.ZodNumber>;
    systemCode: z.ZodOptional<z.ZodString>;
    migrationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const startupDiskSummarySchema: z.ZodObject<{
    scopeId: z.ZodString;
    observedAvailableDropPeakBytes: z.ZodNullable<z.ZodNumber>;
    minAvailableBytes: z.ZodNullable<z.ZodNumber>;
    quality: z.ZodEnum<{
        complete: "complete";
        unknown: "unknown";
        partial: "partial";
    }>;
    sampledAt: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
export type StartupDiskSummary = z.infer<typeof startupDiskSummarySchema>;
export declare const databaseStartupPhaseSchema: z.ZodEnum<{
    failed: "failed";
    starting: "starting";
    ready: "ready";
    preparing_host_storage: "preparing_host_storage";
    preparing_session_storage: "preparing_session_storage";
    starting_services: "starting_services";
}>;
export declare const databaseMigrationIdSchema: z.ZodString;
/** 需求种类与真实执行/提交分开；预检发现需求不意味着当前执行者运行过 SQL。 */
export declare const databaseMigrationFactsSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        none: "none";
        initialize: "initialize";
        upgrade: "upgrade";
    }>;
    executedCount: z.ZodNumber;
    committedCount: z.ZodNumber;
    lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export type DatabaseMigrationFacts = z.infer<typeof databaseMigrationFactsSchema>;
export declare const databaseStartupStateSchema: z.ZodObject<{
    disk: z.ZodArray<z.ZodObject<{
        scopeId: z.ZodString;
        observedAvailableDropPeakBytes: z.ZodNullable<z.ZodNumber>;
        minAvailableBytes: z.ZodNullable<z.ZodNumber>;
        quality: z.ZodEnum<{
            complete: "complete";
            unknown: "unknown";
            partial: "partial";
        }>;
        sampledAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strict>>;
    sqliteCode: z.ZodOptional<z.ZodNumber>;
    systemCode: z.ZodOptional<z.ZodString>;
    migrationId: z.ZodOptional<z.ZodString>;
    schemaVersion: z.ZodLiteral<1>;
    startupId: z.ZodString;
    attemptId: z.ZodString;
    sequence: z.ZodNumber;
    startedAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    phase: z.ZodEnum<{
        failed: "failed";
        starting: "starting";
        ready: "ready";
        preparing_host_storage: "preparing_host_storage";
        preparing_session_storage: "preparing_session_storage";
        starting_services: "starting_services";
    }>;
    databasePhase: z.ZodOptional<z.ZodEnum<{
        ready: "ready";
        checking: "checking";
        waiting_for_lock: "waiting_for_lock";
        migrating: "migrating";
        committing: "committing";
        maintaining: "maintaining";
    }>>;
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
    currentMigration: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<{
            none: "none";
            initialize: "initialize";
            upgrade: "upgrade";
        }>;
        executedCount: z.ZodNumber;
        committedCount: z.ZodNumber;
        lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    migrationBaselines: z.ZodOptional<z.ZodArray<z.ZodObject<{
        databaseId: z.ZodString;
        databaseKind: z.ZodEnum<{
            session: "session";
            "tasks-index": "tasks-index";
        }>;
        lastAppliedMigrationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    finalDatabase: z.ZodOptional<z.ZodBoolean>;
    failedPhase: z.ZodOptional<z.ZodEnum<{
        failed: "failed";
        starting: "starting";
        ready: "ready";
        preparing_host_storage: "preparing_host_storage";
        preparing_session_storage: "preparing_session_storage";
        starting_services: "starting_services";
    }>>;
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
export type DatabaseStartupState = z.infer<typeof databaseStartupStateSchema>;
/** 本地端口和启动快照必须来自同一 Host；此 ID 不承担工作区或任务身份。 */
export declare const databaseStartupPortPayloadSchema: z.ZodObject<{
    databaseStartupId: z.ZodString;
}, z.core.$strict>;
export declare const databaseStartupControlSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    action: z.ZodLiteral<"snapshot">;
}, z.core.$strict>, z.ZodObject<{
    action: z.ZodLiteral<"exit">;
}, z.core.$strict>, z.ZodObject<{
    action: z.ZodLiteral<"retry">;
    attemptId: z.ZodString;
}, z.core.$strict>], "action">;
export type DatabaseStartupControl = z.infer<typeof databaseStartupControlSchema>;
/** 迁移可手动重试；已部分装配服务或损坏/失联时通过退出重开恢复，避免重复启动副作用。 */
export declare function canRetryDatabaseStartup(state: Pick<DatabaseStartupState, "phase" | "failedPhase" | "errorCode">): boolean;
//# sourceMappingURL=database-startup.d.ts.map