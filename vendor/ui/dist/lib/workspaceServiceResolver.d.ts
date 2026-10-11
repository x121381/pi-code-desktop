import type { IServiceAccessor } from "@zcode/services";
interface WorkspaceServiceTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    remoteTarget?: unknown;
}
export interface WorkspaceServiceResolverState<TServices = IServiceAccessor> {
    sessionsById: Record<string, {
        services: TServices;
    }>;
    sessionIdByWorkspaceIdentity: Record<string, string>;
    sessionIdByWorkspacePath: Record<string, string>;
}
interface ResolvedWorkspaceServices {
    services: IServiceAccessor;
    remoteSessionId?: string;
    isRemoteWorkspace: boolean;
}
export declare function resolveWorkspaceRemoteSessionId<TServices>(target: WorkspaceServiceTarget, state: WorkspaceServiceResolverState<TServices>): string | undefined;
export declare function isRemoteWorkspaceTarget(target: WorkspaceServiceTarget, resolvedRemoteSessionId?: string): boolean;
export declare function resolveWorkspaceServices(target: WorkspaceServiceTarget, baseServices: IServiceAccessor, state: WorkspaceServiceResolverState): ResolvedWorkspaceServices | null;
export declare function buildWorkspaceServiceLookup(workspaceTabs: WorkspaceServiceTarget[], baseServices: IServiceAccessor, state: WorkspaceServiceResolverState): Map<string, ResolvedWorkspaceServices>;
export {};
//# sourceMappingURL=workspaceServiceResolver.d.ts.map