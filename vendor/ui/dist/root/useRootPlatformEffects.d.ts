import type { IPlatformService } from "@zcode/shared";
import { type WindowTabState } from "@/store/tabStore.js";
export declare function useRootPlatformEffects({ initialWorkspaceAbsPath, initialWorkspaceIdentity, initialWorkspacePurpose, initialTaskId, canBootstrapInitialWorkspace, addTab, setIsBootstrappingInitialWorkspace, platform, activateTabByPath, startDraftInWorkspace, startNewTaskFromActiveWorkspace, openWorkspace, openWorkspacePath, setWorkspaceActionError, allowOpenWorkspace, isDesktop, locale, tabs, activeWorkspacePath, activeWorkspaceIdentity, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, totalUnreadTaskCount, webRemoteControlFeatureEnabled, webRemoteControlSessionActive, hasCompletedFullTabRestore, intl, isRestoringOAuthSession, }: {
    initialWorkspaceAbsPath?: string;
    initialWorkspaceIdentity?: string;
    initialWorkspacePurpose?: import("@zcode/shared").WorkspacePurpose;
    initialTaskId?: string;
    canBootstrapInitialWorkspace?: boolean;
    addTab: (workspacePath: string, options?: {
        workspaceIdentity?: string;
        workspacePurpose?: import("@zcode/shared").WorkspacePurpose;
    }) => void;
    setIsBootstrappingInitialWorkspace: (value: boolean) => void;
    platform: IPlatformService;
    activateTabByPath: (workspacePath: string, options?: {
        workspaceIdentity?: string;
    }) => boolean;
    startDraftInWorkspace: (workspacePath: string, workspaceIdentity?: string) => void;
    startNewTaskFromActiveWorkspace: (source: string) => void;
    openWorkspace: () => void;
    openWorkspacePath: (workspacePath: string) => void;
    setWorkspaceActionError: (message: string | null) => void;
    allowOpenWorkspace?: boolean;
    isDesktop?: boolean;
    locale: ReturnType<typeof import("@/i18n/IntlProvider.js").useZCodeIntl>["locale"];
    tabs: WindowTabState[];
    activeWorkspacePath?: string | null;
    activeWorkspaceIdentity?: string | null;
    reconnectingRemoteWorkspaceKeys?: string[];
    remoteWorkspaceErrorByWorkspaceKey?: Record<string, string>;
    totalUnreadTaskCount: number;
    webRemoteControlFeatureEnabled?: boolean;
    webRemoteControlSessionActive?: boolean;
    hasCompletedFullTabRestore?: boolean;
    intl: ReturnType<typeof import("@/i18n/IntlProvider.js").useZCodeIntl>["intl"];
    isRestoringOAuthSession: boolean;
}): void;
//# sourceMappingURL=useRootPlatformEffects.d.ts.map