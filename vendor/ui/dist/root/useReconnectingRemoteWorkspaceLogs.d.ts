import type { IPlatformService } from "@zcode/shared";
import { type RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
export declare function useReconnectingRemoteWorkspaceLogs({ platform, reconnectingWorkspaceKeys, resolveWorkspaceTargetByKey, resolveWorkspaceRequestIdByKey, }: {
    platform: IPlatformService;
    reconnectingWorkspaceKeys: string[];
    resolveWorkspaceTargetByKey: (workspaceKey: string) => import("@zcode/shared").RemoteWorkspaceSessionEntry["target"] | null;
    resolveWorkspaceRequestIdByKey?: (workspaceKey: string) => string | null;
}): {
    logsByWorkspaceKey: Record<string, RemoteConnectionLogEntry[]>;
    resetLogsForWorkspaceKey: (workspaceKey: string) => void;
};
//# sourceMappingURL=useReconnectingRemoteWorkspaceLogs.d.ts.map