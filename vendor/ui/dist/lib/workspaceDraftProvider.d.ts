import type { ZCodeProvider } from "@zcode/shared";
import type { WorkspaceZCodeUIState } from "@/store/zcodeSessionStore.js";
interface ResolveWorkspaceSwitchDraftProviderOptions {
    currentSelectedProvider: ZCodeProvider;
    targetWorkspacePath: string;
    targetWorkspaceIdentity?: string;
    workspaces: Record<string, WorkspaceZCodeUIState | undefined>;
}
export declare function resolveWorkspaceSwitchDraftProvider({ currentSelectedProvider, targetWorkspacePath, targetWorkspaceIdentity, workspaces, }: ResolveWorkspaceSwitchDraftProviderOptions): ZCodeProvider;
export {};
//# sourceMappingURL=workspaceDraftProvider.d.ts.map