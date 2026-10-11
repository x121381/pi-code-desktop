interface WorkspaceTabIdentityLike {
    workspacePath: string;
    remoteSessionId?: string;
    workspaceIdentity?: string;
}
interface WorkspaceTabMatchOptions {
    remoteSessionId?: string;
    workspaceIdentity?: string;
}
export declare function isSameWorkspaceTab(tab: WorkspaceTabIdentityLike, workspacePath: string, options?: WorkspaceTabMatchOptions): boolean;
export {};
//# sourceMappingURL=tabWorkspaceIdentity.d.ts.map