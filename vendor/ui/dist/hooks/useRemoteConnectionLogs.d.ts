import type { RemoteConnectionRuntimeLog } from "@zcode/shared";
export interface RemoteConnectionLogEntry {
    id: string;
    level: "info" | "success" | "warn" | "error";
    message: string;
    timestamp: string;
}
export declare function normalizeRemoteConnectionLogMessage(message: string): string;
export declare function appendRemoteConnectionRuntimeLog(currentLogs: RemoteConnectionLogEntry[], incoming: {
    id: string;
    level: RemoteConnectionLogEntry["level"];
    message: string;
    timestamp: string;
}): RemoteConnectionLogEntry[];
export declare function shouldAcceptRemoteConnectionRuntimeLog(entry: Pick<RemoteConnectionRuntimeLog, "requestId">, activeRequestId?: string | null): boolean;
export declare function useRemoteConnectionLogs(activeRequestId?: string | null): {
    connectionLogs: RemoteConnectionLogEntry[];
    resetConnectionLogs: () => void;
    appendConnectionLog: (level: RemoteConnectionLogEntry["level"], message: string) => void;
};
//# sourceMappingURL=useRemoteConnectionLogs.d.ts.map