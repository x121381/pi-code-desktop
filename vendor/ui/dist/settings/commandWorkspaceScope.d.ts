import type { CommandStorageLevel } from "@zcode/shared";
import type { WindowTabState, WorkspaceTabState } from "@/store/tabStore.js";
export type CommandScopeRecovery = "keep" | "fallback-user" | "close-editor";
export declare function getCommandWorkspaceTabs(tabs: readonly WindowTabState[]): WorkspaceTabState[];
export declare function resolveCommandScopeRecovery(params: {
    editing: boolean;
    scopeKey: string;
    workspaceTabs: readonly WorkspaceTabState[];
}): CommandScopeRecovery;
export declare function resolveCommandStorageTarget(scopeKey: string, workspaceTabs: readonly WorkspaceTabState[]): {
    storageLevel: CommandStorageLevel;
    workspace: WorkspaceTabState | null;
};
export declare function shouldRefreshCurrentCommandList(scopeKey: string, currentWorkspaceKey: string): boolean;
//# sourceMappingURL=commandWorkspaceScope.d.ts.map