import type { RemoteWorkspaceSessionEntry } from "@zcode/shared";
interface ReconnectingRemoteWorkspaceEntry {
    workspaceKey?: string;
    id?: string;
    requestId?: string;
    target: RemoteWorkspaceSessionEntry["target"];
}
export declare function buildRemoteWorkspaceReconnectLogLabelPrefix(target: RemoteWorkspaceSessionEntry["target"]): string;
export declare function resolveRemoteWorkspaceReconnectLogWorkspaceKeys({ runtimeLabel, runtimeRequestId, reconnectingEntries, }: {
    runtimeLabel: string;
    runtimeRequestId?: string;
    reconnectingEntries: ReconnectingRemoteWorkspaceEntry[];
}): string[];
export declare const resolveRemoteWorkspaceReconnectLogHistoryIds: typeof resolveRemoteWorkspaceReconnectLogWorkspaceKeys;
export {};
//# sourceMappingURL=reconnectingRemoteWorkspaceLogs.d.ts.map