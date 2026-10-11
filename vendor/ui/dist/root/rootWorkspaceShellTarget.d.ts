interface WorkspaceShellTargetTab {
    workspacePath: string;
    remoteSessionId?: string;
    workspaceIdentity?: string;
}
export interface RootWorkspaceShellTarget {
    workspaceShellPath: string | null;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}
export declare function resolveRootWorkspaceShellTarget({ activeWorkspaceTab, activeWorkspacePath, activeWorkspaceIdentity, workspaceTabs, }: {
    activeWorkspaceTab: WorkspaceShellTargetTab | null;
    activeWorkspacePath: string | null;
    activeWorkspaceIdentity: string | null;
    /** 当前窗口全部 workspace tab；Settings 等非 workspace tab 激活时用来找回被覆盖的那个 tab。 */
    workspaceTabs: readonly WorkspaceShellTargetTab[];
}): RootWorkspaceShellTarget;
export {};
//# sourceMappingURL=rootWorkspaceShellTarget.d.ts.map