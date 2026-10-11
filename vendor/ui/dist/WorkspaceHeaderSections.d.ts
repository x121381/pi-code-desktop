import { type RemoteTarget } from "@zcode/shared";
import type { WorkspaceHeaderState, WorkspaceHeaderTitleSectionProps } from "@/WorkspaceHeaderSections/shared.js";
export type { WorkspaceHeaderState, WorkspaceHeaderTitleSectionProps };
export { WorkspaceHeaderActionSection, type WorkspaceHeaderActionSectionProps, } from "@/WorkspaceHeaderSections/WorkspaceHeaderActionSection.js";
export declare function shouldShowRemoteSkillSyncAction(params: {
    remoteSessionId?: string | null;
    remoteTarget?: RemoteTarget | null;
    clientMode?: "desktop-continuous" | "web-remote-replayable";
    hasLocalSourceService?: boolean;
}): boolean;
export declare function WorkspaceHeaderTitleSection({ variant, readOnlyReason, workspaceAbsPath, remoteSessionId, workspaceIdentity, remoteTarget, localWorkspacePath, projectName, activeTaskTitle, activeTaskChangeSummary: _activeTaskChangeSummary, activeTaskId, activeTraceId: _activeTraceId, activeSessionId, activeTaskProvider, resolvedActiveTaskMeta, gitSummary, gitDirtyFileCount: _gitDirtyFileCount, sessionLogPath: _sessionLogPath, nativeSessionLogProvider: _nativeSessionLogProvider, nativeSessionLogPath: _nativeSessionLogPath, nativeSessionLogExists: _nativeSessionLogExists, nativeSessionLogLoading: _nativeSessionLogLoading, providerWorkspaceConfigPath: _providerWorkspaceConfigPath, providerWorkspaceConfigExists: _providerWorkspaceConfigExists, providerWorkspaceConfigLoading: _providerWorkspaceConfigLoading, reloadSessionPending, workspaceHeaderState, onRefreshGit: _onRefreshGit, isMacDesktop: _isMacDesktop, isMacFullscreen: _isMacFullscreen, isWindowsDesktop: _isWindowsDesktop, isWebRemoteControl, selectedEditor: _selectedEditor, simplifyForNarrowRemote, compact, }: WorkspaceHeaderTitleSectionProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkspaceHeaderSections.d.ts.map