import type { SessionCreateSource } from "@zcode/shared";
import type { GroupedDraftTaskState } from "@/store/zcodeSessionStoreTypes.js";
export interface PendingCommandClientContext {
    workspace?: {
        workspacePath: string;
        workspaceIdentity?: string;
    };
    groupedDraftTask?: GroupedDraftTaskState;
    sessionCreateSource?: SessionCreateSource;
}
interface WorkspaceScopedPendingCommand {
    clientContext?: PendingCommandClientContext;
    replay: {
        kind: "input" | "sensitiveDigest";
        type: string;
        payload?: Record<string, unknown>;
    };
}
export declare function resolvePendingCommandWorkspaceKey(entry: WorkspaceScopedPendingCommand): string | null;
export declare function isPendingCommandForWorkspace(entry: WorkspaceScopedPendingCommand, workspacePath: string, workspaceIdentity?: string): boolean;
export {};
//# sourceMappingURL=pendingCommandWorkspace.d.ts.map