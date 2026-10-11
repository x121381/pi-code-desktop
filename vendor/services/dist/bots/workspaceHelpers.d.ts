import { type BotConfig, type BotWorkspaceRef } from "@zcode/shared";
export declare function getWorkspaceKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function getWorkspaceLabel(workspacePath: string): string;
export declare function createWorkspaceRef(workspacePath: string, workspaceIdentity?: string): BotWorkspaceRef;
export declare function normalizeAllowedWorkspaces(allowedWorkspaces: readonly string[]): string[];
export declare function isWorkspaceAllowed(workspaceId: string, allowedWorkspaces: readonly string[]): boolean;
export declare function filterAllowedWorkspaces(workspaces: BotWorkspaceRef[], allowedWorkspaces: readonly string[]): BotWorkspaceRef[];
export declare function normalizeConfiguredAllowedWorkspaces(allowedWorkspaces: readonly string[], workspaces: readonly BotWorkspaceRef[]): string[];
export declare function firstAllowedWorkspace(workspaceRefs: BotWorkspaceRef[], bot: BotConfig): BotWorkspaceRef | null;
export declare function resolveWorkspaceByValue(workspaceRefs: BotWorkspaceRef[], value: string, allowedIds: string[]): BotWorkspaceRef | null;
//# sourceMappingURL=workspaceHelpers.d.ts.map