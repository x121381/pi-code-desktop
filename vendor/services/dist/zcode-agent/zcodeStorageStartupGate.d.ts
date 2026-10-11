import { type ZCodeStorageStartupState } from "@zcode/shared";
/** 一个 protocol client 对应一个进程代次，状态只来自该连接的合法控制帧。 */
export declare class ZCodeStorageStartupGate {
    private current?;
    private terminalError?;
    private pending?;
    private resolve?;
    private reject?;
    private timer?;
    private readonly changed;
    readonly onDidChange: import("@zcode/rpc").Event<{
        schemaVersion: 1;
        attemptId: string;
        sequence: number;
        databaseId: string;
        databaseKind: "session" | "tasks-index";
        phase: "failed" | "ready" | "checking" | "waiting_for_lock" | "migrating" | "committing";
        elapsedMs: number;
        sqliteCode?: number | undefined;
        systemCode?: string | undefined;
        migrationId?: string | undefined;
        migration?: {
            kind: "none" | "initialize" | "upgrade";
            executedCount: number;
            committedCount: number;
            lastAppliedMigrationId?: string | null | undefined;
        } | undefined;
        completed?: number | undefined;
        total?: number | undefined;
        errorCode?: "storage_full" | "permission_denied" | "io_error" | "out_of_memory" | "corrupt" | "open_failed" | "lock_timeout" | "checksum_mismatch" | "sql_failed" | "startup_status_timeout" | "transport_closed" | "unsupported_runtime" | undefined;
    }>;
    constructor(required: boolean, firstStatusTimeoutMs?: number);
    get isWaiting(): boolean;
    get snapshot(): ZCodeStorageStartupState | undefined;
    accept(input: unknown): boolean;
    wait(signal?: AbortSignal): Promise<void>;
    dispose(): void;
    private ensurePending;
    private fail;
}
//# sourceMappingURL=zcodeStorageStartupGate.d.ts.map