import type { IPlatformService } from "@zcode/shared";
import { type WindowTabState, type WorkspaceTabState } from "@/store/tabStore.js";
export declare function collectClosedRemoteWorkspaceKeys(previousWorkspaceTabs: WorkspaceTabState[], nextWorkspaceTabs: WorkspaceTabState[]): string[];
export declare function collectClosedRemoteWorkspaceSessionIds(previousWorkspaceTabs: WorkspaceTabState[], nextWorkspaceTabs: WorkspaceTabState[], rememberedSessionIdsByWorkspaceKey: ReadonlyMap<string, string>): string[];
export declare function useRemoteWorkspaceTabLifecycle({ tabs, activeWorkspaceTab, platform, onRemoteWorkspaceTabsClosed, }: {
    tabs: WindowTabState[];
    activeWorkspaceTab: WorkspaceTabState | null;
    platform: IPlatformService;
    onRemoteWorkspaceTabsClosed?: (workspaceKeys: string[]) => void;
}): void;
//# sourceMappingURL=useRemoteWorkspaceTabLifecycle.d.ts.map