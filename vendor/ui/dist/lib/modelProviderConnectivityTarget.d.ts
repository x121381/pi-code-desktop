interface ConnectivityWorkspaceTab {
    workspacePath: string;
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
    remoteTarget?: unknown;
    localWorkspacePath?: string | null;
}
/**
 * Provider Settings 属于本地 Environment；连通性探测需要 cwd 时，只能选择本地 workspace。
 * 远程 tab 的 workspacePath 是远端文件系统路径，不能直接交给 Local Host。
 */
export declare function resolveModelProviderConnectivityWorkspacePath(params: {
    activeWorkspacePath?: string | null;
    activeWorkspaceIdentity?: string | null;
    activeWorkspaceTab?: ConnectivityWorkspaceTab | null;
    workspaceTabs: readonly ConnectivityWorkspaceTab[];
}): string;
export {};
//# sourceMappingURL=modelProviderConnectivityTarget.d.ts.map