export type TaskNavigationWorkspaceResult = {
    accepted: true;
    openedLocalTab: boolean;
} | {
    accepted: false;
    reason: "remote_attachment_missing";
};
export declare function ensureTaskNavigationWorkspace(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    addLocalWorkspaceTab: (workspacePath: string) => void;
}): TaskNavigationWorkspaceResult;
//# sourceMappingURL=taskNavigationWorkspace.d.ts.map