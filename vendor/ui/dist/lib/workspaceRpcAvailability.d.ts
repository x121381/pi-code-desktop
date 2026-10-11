interface WorkspaceRpcAvailabilityTarget {
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
    remoteTarget?: unknown;
}
export declare function isRemoteWorkspaceRpcTarget(target: WorkspaceRpcAvailabilityTarget): boolean;
export declare function shouldEnableWorkspaceRpc(target: WorkspaceRpcAvailabilityTarget): boolean;
export {};
//# sourceMappingURL=workspaceRpcAvailability.d.ts.map