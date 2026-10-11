import { type AppSettings, type IPlatformService, type RemoteTarget, type UserInfo, type ZCodeTaskClientMode } from "@zcode/shared";
import type { IServiceAccessor } from "@zcode/services";
import type { CreateTaskRequest } from "@/app-shell/types.js";
import { type TabStore, type TabStoreState } from "@/store/tabStore.js";
import type { RootProps } from "@/root/types.js";
import type { WorkbenchNewTaskTarget } from "@/v4/workbenchNewTaskTarget.js";
export interface OpenRemoteConnectionPreference {
    preferredKind?: RemoteTarget["kind"];
    preferredWslDistro?: string;
}
/** 新任务落点：identity 缺省一律归一化为 null，供只读校验、focus/addTab 统一消费。 */
export interface NewTaskTargetResolution {
    workspacePath: string;
    workspaceIdentity: string | null;
}
/**
 * 解析新任务落点：请求显式带 targetWorkspace 时（跨项目发起已保存工作流）直接采用它，不再询问 workbench 焦点；
 * 否则惰性回退到 resolveWorkbenchNewTaskTarget。identity 缺省归一化为 null。
 */
export declare function resolveNewTaskTargetFromRequest(request: CreateTaskRequest | undefined, resolveFallback: () => WorkbenchNewTaskTarget | null): NewTaskTargetResolution | null;
export declare function useRootWorkspaceActions({ intl, platform, services, tabStoreApi, addTab, activeWorkspacePath, activeWorkspaceIdentity, supportsSettings, allowOpenWorkspace, preferDirectoryBrowser, openDirectoryBrowser, refreshProviderState, updateAppSettings, setOAuthError, setUser, onProviderFamilyDomainClearedAfterLogout, userId, onOpenRemoteConnection, workbenchGroupClientMode, }: {
    intl: ReturnType<typeof import("@/i18n/IntlProvider.js").useZCodeIntl>["intl"];
    platform: IPlatformService;
    services: IServiceAccessor;
    tabStoreApi: TabStore;
    addTab: TabStoreState["addTab"];
    activeWorkspacePath: string | null;
    activeWorkspaceIdentity: string | null;
    supportsSettings: boolean;
    allowOpenWorkspace: NonNullable<RootProps["allowOpenWorkspace"]>;
    preferDirectoryBrowser: boolean;
    openDirectoryBrowser?: () => void;
    refreshProviderState: () => Promise<void>;
    updateAppSettings: (patch: Partial<AppSettings>) => Promise<void>;
    setOAuthError: (error: string | null) => void;
    setUser: (user: UserInfo | null) => void;
    onProviderFamilyDomainClearedAfterLogout?: () => void;
    userId?: string;
    onOpenRemoteConnection?: (preference?: OpenRemoteConnectionPreference) => void;
    workbenchGroupClientMode?: ZCodeTaskClientMode;
}): {
    workspaceActionError: string | null;
    setWorkspaceActionError: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    startDraftInWorkspace: (workspacePath: string, workspaceIdentity?: string) => void;
    startNewTaskFromActiveWorkspace: (source: string, request?: CreateTaskRequest) => void;
    handleLogout: () => Promise<void>;
    handleSelectProject: (path: string) => Promise<void>;
    handleSelectConversationWorkspace: (path: string) => void;
    handleResolveConversationWorkspace: () => Promise<string>;
    handleEnsureConversationWorkspace: () => Promise<string>;
    handleCreateConversationTask: () => Promise<void>;
    handleOpenWorkspace: () => void;
    handleOpenFolderFromWorkspaceMenu: () => void;
    handleCreateScratchWorkspace: (name: string) => Promise<string | null>;
    handleCreateTask: (request?: CreateTaskRequest) => void;
    handleBackFromSettings: () => void;
};
//# sourceMappingURL=useRootWorkspaceActions.d.ts.map