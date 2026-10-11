import type { IServiceAccessor } from "@zcode/services";
import { type RemoteWorkspaceSession } from "@/store/remoteWorkspaceSessionStore.js";
interface WorkspaceServiceTargetTab {
    workspacePath: string;
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
    remoteTarget?: unknown;
}
export declare function getDisconnectedRemoteServices(): IServiceAccessor;
export declare function resolveWorkspaceServicesForTarget(params: {
    currentContextServices: IServiceAccessor;
    resolvedRemoteSessionId: string | null;
    baseServices: IServiceAccessor | null;
    sessionsById: Record<string, Pick<RemoteWorkspaceSession, "services">>;
    isRemoteTarget: boolean;
}): IServiceAccessor;
export declare function resolveBaseWorkspaceServices(contextServices: IServiceAccessor, registeredBaseServices: IServiceAccessor | null): IServiceAccessor;
export declare function resolveWorkspaceServiceIsRemoteTarget(params: {
    workspacePath: string | null | undefined;
    workspaceIdentity?: string | null;
    preferredRemoteSessionId?: string | null;
    activeWorkspacePath?: string | null;
    activeWorkspaceIdentity?: string | null;
    activeTab?: WorkspaceServiceTargetTab | null;
    workspaceTabs?: readonly WorkspaceServiceTargetTab[];
}): boolean;
export declare function useBaseWorkspaceServices(): IServiceAccessor;
export declare function useOptionalBaseWorkspaceServices(): IServiceAccessor | null;
export interface WorkspaceServicesResolution {
    services: IServiceAccessor;
    remoteSessionId: string | null;
    isRemoteTarget: boolean;
    connectionKind: "local-ready" | "remote-waiting" | "remote-ready";
    rpcReady: boolean;
}
export declare function useWorkspaceServicesResolution(workspacePath: string | null | undefined, preferredRemoteSessionId?: string | null, workspaceIdentity?: string | null, remoteTarget?: unknown): WorkspaceServicesResolution;
export declare function useWorkspaceServices(workspacePath: string | null | undefined, preferredRemoteSessionId?: string | null, workspaceIdentity?: string | null, remoteTarget?: unknown): IServiceAccessor;
export {};
//# sourceMappingURL=useWorkspaceServices.d.ts.map