interface WorkspaceHomePathParams {
    workspacePath: string;
    workspaceIdentity?: string | null;
    remoteSessionId?: string | null;
}
export declare function buildWorkspaceHomeCacheKey(params: WorkspaceHomePathParams): string;
export declare function resetWorkspaceHomePathCacheForTests(): void;
export declare function useWorkspaceHomePath(params: WorkspaceHomePathParams): string | undefined;
export {};
//# sourceMappingURL=useWorkspaceHomePath.d.ts.map