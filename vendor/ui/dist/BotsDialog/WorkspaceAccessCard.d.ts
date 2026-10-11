import type { BotConfig, BotWorkspaceRef } from "@zcode/shared";
export declare function WorkspaceAccessCard({ bot, workspaceRefs, currentWorkspace, loading, onPatchAllowedWorkspaces, onToggleWorkspaceAccess, }: {
    bot: BotConfig;
    workspaceRefs: BotWorkspaceRef[];
    currentWorkspace: BotWorkspaceRef;
    loading: boolean;
    onPatchAllowedWorkspaces: (allowedWorkspaces: string[]) => Promise<void>;
    onToggleWorkspaceAccess: (workspaceId: string, checked: boolean) => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceAccessCard.d.ts.map