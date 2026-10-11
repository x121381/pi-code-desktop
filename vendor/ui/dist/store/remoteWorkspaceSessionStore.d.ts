import type { RemoteTarget } from "@zcode/shared";
import type { IServiceAccessor } from "@zcode/services";
export interface RemoteWorkspaceSession {
    sessionId: string;
    target?: RemoteTarget;
    services: IServiceAccessor;
    dispose?: (reason?: Error) => void;
}
interface RemoteWorkspaceSessionState {
    baseServices: IServiceAccessor | null;
    sessionsById: Record<string, RemoteWorkspaceSession>;
    sessionIdByWorkspacePath: Record<string, string>;
    sessionIdByWorkspaceIdentity: Record<string, string>;
    registerBaseServices: (services: IServiceAccessor) => void;
    registerSession: (session: RemoteWorkspaceSession) => void;
    unregisterSession: (sessionId: string) => void;
    bindWorkspacePath: (workspacePath: string, sessionId: string) => void;
    unbindWorkspacePath: (workspacePath: string) => void;
    bindWorkspaceIdentity: (workspaceIdentity: string, sessionId: string) => void;
    unbindWorkspaceIdentity: (workspaceIdentity: string) => void;
}
export declare const useRemoteWorkspaceSessionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RemoteWorkspaceSessionState>>;
export declare function registerRemoteWorkspaceSession(session: RemoteWorkspaceSession): void;
export declare function registerBaseWorkspaceServices(services: IServiceAccessor): void;
export declare function unregisterRemoteWorkspaceSession(sessionId: string): void;
export declare function bindRemoteWorkspacePath(workspacePath: string, sessionId: string): void;
export declare function unbindRemoteWorkspacePath(workspacePath: string): void;
export declare function bindRemoteWorkspaceIdentity(workspaceIdentity: string, sessionId: string): void;
export declare function unbindRemoteWorkspaceIdentity(workspaceIdentity: string): void;
export declare function getRemoteWorkspaceSession(sessionId: string): RemoteWorkspaceSession | null;
/** 当前在册代理的远程 session 身份；旧代代理不匹配，仅用于 scope 诊断。 */
export declare function findRemoteWorkspaceSessionIdForAgentService(agentService: object): string | null;
export declare function getRemoteWorkspaceServicesForPath(workspacePath: string): IServiceAccessor | null;
export declare function getRemoteWorkspaceServicesForIdentity(workspaceIdentity: string): IServiceAccessor | null;
export declare function getRegisteredBaseWorkspaceServices(): IServiceAccessor | null;
export declare function resolveRegisteredWorkspaceServices(params: {
    workspacePath?: string;
    workspaceIdentity?: string;
}): IServiceAccessor | null;
export {};
//# sourceMappingURL=remoteWorkspaceSessionStore.d.ts.map