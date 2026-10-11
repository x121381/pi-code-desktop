interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare const WORKSPACE_EXPANSION_STORAGE_KEY = "zcode-workspace-expansion";
export type WorkspaceExpansionState = Record<string, boolean>;
export declare function readWorkspaceExpansionState(storage?: StorageLike | null): WorkspaceExpansionState;
export declare function persistWorkspaceExpandedPreference(workspacePath: string, expanded: boolean, storage?: StorageLike | null): void;
export declare function resolveExpandedWorkspacePaths(workspacePaths: readonly string[], expansionState: WorkspaceExpansionState): Set<string>;
export {};
//# sourceMappingURL=workspaceExpansionPreference.d.ts.map