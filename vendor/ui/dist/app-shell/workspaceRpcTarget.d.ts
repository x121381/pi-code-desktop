interface AppWorkspaceRpcTarget {
    workspaceIdentity?: string;
    remoteSessionId?: string;
    remoteTarget?: unknown;
}
export declare function resolveAppWorkspaceRpcTarget({ activeTarget, explicitWorkspaceIdentity, explicitRemoteSessionId, }: {
    activeTarget: AppWorkspaceRpcTarget;
    explicitWorkspaceIdentity?: string;
    explicitRemoteSessionId?: string;
}): AppWorkspaceRpcTarget;
export {};
//# sourceMappingURL=workspaceRpcTarget.d.ts.map