export declare const WORKSPACE_TASK_PAGE_SIZE = 5;
export type WorkspaceTaskVisibleLimitByKey = Record<string, number>;
export declare function resolveVisibleWorkspaceTaskKeys(params: {
    enabled: boolean;
    expandedWorkspacePaths: ReadonlySet<string>;
    workspaces: ReadonlyArray<{
        workspacePath: string;
        workspaceIdentity?: string;
    }>;
}): Set<string>;
export declare function resolveWorkspaceTaskVisibleLimit(limits: Readonly<WorkspaceTaskVisibleLimitByKey>, workspaceKey: string, pageSize?: number): number;
export declare function increaseWorkspaceTaskVisibleLimit(limits: Readonly<WorkspaceTaskVisibleLimitByKey>, workspaceKey: string, pageSize?: number): WorkspaceTaskVisibleLimitByKey;
export declare function retainWorkspaceTaskVisibleLimits(limits: Readonly<WorkspaceTaskVisibleLimitByKey>, visibleWorkspaceKeys: ReadonlySet<string>): WorkspaceTaskVisibleLimitByKey;
//# sourceMappingURL=workspaceTaskPagination.d.ts.map