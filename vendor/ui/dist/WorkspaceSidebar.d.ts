import type { RemoteTarget, UserInfo } from "@zcode/shared";
import type { Theme } from "@/useTheme.js";
import type { RemoteConnectionLogEntry } from "@/hooks/useRemoteConnectionLogs.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { CreateTaskRequest } from "@/app-shell/types.js";
export { applyWorkspaceTriggerSelection } from "@/WorkspaceSidebar/workspaceSidebarSelection.js";
export { WorkspaceSidebarCollapsedRail } from "@/WorkspaceSidebar/WorkspaceSidebarCollapsedRail.js";
interface SidebarFileTreeTarget {
    workspacePath: string;
    workspaceName: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    revealPath?: string;
    temporaryExternalDirectory?: boolean;
}
export interface SidebarFileTreeOpenRequest {
    id: number;
    target: SidebarFileTreeTarget;
}
export declare const WorkspaceSidebar: import("react").MemoExoticComponent<({ workspacePath, workspaceRemoteSessionId, activePreviewPath, onSelectTask, onStartDraftInWorkspace, onOpenCodeViewer, onOpenBrowserUrl, fileTreeOpenRequest, onCreateTask, onCreateConversationTask, onOpenFolderFromWorkspaceMenu, onOpenRemoteWorkspace, webRemoteControlWorkspaceSwitcher, theme, onConnectRemote: _onConnectRemote, onSelectRemoteProject: _onSelectRemoteProject, onCancelRemoteProject: _onCancelRemoteProject, onReconnectRemoteWorkspace, onLogout, onLogin, user, reconnectingRemoteWorkspaceKeys, remoteWorkspaceErrorByWorkspaceKey, reconnectingRemoteWorkspaceLogsByWorkspaceKey, isDesktop, isWebRemoteControl, isMacDesktop: _isMacDesktop, isWindowsDesktop, isSidebarVisible: _isSidebarVisible, onToggleSidebar: _onToggleSidebar, toggleSidebarShortcutLabel: _toggleSidebarShortcutLabel, canGoBack: _canGoBack, canGoForward: _canGoForward, onGoBack: _onGoBack, onGoForward: _onGoForward, goBackShortcutLabel: _goBackShortcutLabel, goForwardShortcutLabel: _goForwardShortcutLabel, onOpenCommandCenter, onOpenAutomations, onOpenPluginStore, automationsActive, pluginStoreActive, onFileTreeOpenChange, onWebRemoteTaskOpen, onWebRemoteTaskSwitchingChange, }: {
    workspacePath: string;
    workspaceRemoteSessionId?: string;
    activePreviewPath?: string | null;
    onSelectTask: (targetWorkspacePath: string, taskId: string, targetWorkspaceIdentity?: string, targetRemoteSessionId?: string, expectedUnreadAt?: number) => void;
    onStartDraftInWorkspace: (targetWorkspacePath: string, targetWorkspaceIdentity?: string) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenBrowserUrl?: (url: string) => void;
    fileTreeOpenRequest?: SidebarFileTreeOpenRequest | null;
    onCreateTask: (request?: CreateTaskRequest) => void;
    onCreateConversationTask: () => void;
    onOpenFolderFromWorkspaceMenu: () => void;
    onOpenRemoteWorkspace?: () => void;
    webRemoteControlWorkspaceSwitcher?: import("@/root/types.js").WebRemoteControlWorkspaceSwitcherApi;
    theme: Theme;
    onConnectRemote: (options: RemoteTarget, requestId?: string) => Promise<string>;
    onSelectRemoteProject: (sessionId: string, path: string, localWorkspacePath?: string) => Promise<void>;
    onCancelRemoteProject: (sessionId: string) => Promise<void>;
    onReconnectRemoteWorkspace: (workspaceKey: string) => Promise<void>;
    onLogout?: () => void;
    onLogin?: () => void;
    user?: UserInfo | null;
    reconnectingRemoteWorkspaceKeys: string[];
    remoteWorkspaceErrorByWorkspaceKey: Record<string, string>;
    reconnectingRemoteWorkspaceLogsByWorkspaceKey?: Record<string, RemoteConnectionLogEntry[]>;
    isDesktop?: boolean;
    isWebRemoteControl?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
    isSidebarVisible?: boolean;
    onToggleSidebar?: () => void;
    toggleSidebarShortcutLabel?: string;
    canGoBack?: boolean;
    canGoForward?: boolean;
    onGoBack?: () => void;
    onGoForward?: () => void;
    goBackShortcutLabel?: string;
    goForwardShortcutLabel?: string;
    onOpenCommandCenter: () => void;
    onOpenAutomations?: () => void;
    onOpenPluginStore?: () => void;
    automationsActive?: boolean;
    pluginStoreActive?: boolean;
    onFileTreeOpenChange?: (open: boolean) => void;
    onWebRemoteTaskOpen?: (options: {
        crossWorkspace: boolean;
    }) => void;
    onWebRemoteTaskSwitchingChange?: (switching: boolean) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkspaceSidebar.d.ts.map