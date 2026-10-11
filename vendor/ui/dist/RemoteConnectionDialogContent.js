import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 远程连接向导的多个步骤暂集中在同一文件，避免拆分时扩大 SSH/Docker/WSL 回归面。 */
import { useState } from "react";
import { TID_REMOTE_KIND_DOCKER, TID_REMOTE_KIND_SERVER, TID_REMOTE_KIND_SSH, TID_REMOTE_KIND_WSL, } from "@zcode/shared";
import { AlertTriangleIcon, ChevronRightIcon, CloudIcon, LoaderIcon, MonitorCogIcon, ServerIcon, TerminalIcon, } from "lucide-react";
import { DirectoryBrowser } from "./DirectoryBrowser.js";
import { RemoteConnectionFields } from "./RemoteConnectionFields.js";
import { Button } from "./components/ui/button.js";
import { cn } from "./components/lib/utils.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { RemoteSyncDialogs, RemoteSyncDropdownButton, shouldShowRemoteSyncActions, } from "./settings/RemoteSyncActions.js";
export { RemoteConnectionConnectingStep } from "./remote-connection/RemoteConnectionConnectingStep.js";
function getKindIcon(kind) {
    switch (kind) {
        case "ssh":
            return ServerIcon;
        case "server":
            return CloudIcon;
        case "docker":
            return MonitorCogIcon;
        case "wsl":
            return TerminalIcon;
    }
}
export function RemoteConnectionKindStep({ kind, availableKinds, onKindChange, onCancel, onNext, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col gap-6 h-full", children: [_jsx("div", { className: "flex-1 min-h-0 grid content-start gap-3 md:grid-cols-2", children: availableKinds.map((value) => {
                    const Icon = getKindIcon(value);
                    const selected = kind === value;
                    return (_jsxs("button", { type: "button", onClick: () => onKindChange(value), onDoubleClick: () => {
                            onKindChange(value);
                            onNext();
                        }, "data-testid": value === "ssh"
                            ? TID_REMOTE_KIND_SSH
                            : value === "server"
                                ? TID_REMOTE_KIND_SERVER
                                : value === "wsl"
                                    ? TID_REMOTE_KIND_WSL
                                    : TID_REMOTE_KIND_DOCKER, className: cn("flex min-h-32 flex-col items-start gap-4 rounded-2xl border p-4 text-left transition-colors", selected
                            ? "border-border-hover bg-selected"
                            : "border-border bg-card hover:border-border-hover hover:bg-surface"), children: [_jsx("div", { className: cn("flex size-10 items-center justify-center rounded-xl border", selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background-alt text-foreground-subtle"), children: _jsx(Icon, { className: "size-5" }) }), _jsxs("div", { className: "min-w-0 space-y-1", children: [_jsx("p", { className: "text-ui-lg font-medium text-foreground", children: intl.formatMessage({ id: `remote.kind.${value}` }) }), _jsx("p", { className: "text-ui-base leading-5 text-foreground-subtle", children: intl.formatMessage({
                                            id: `remote.kind.${value}.wizardDescription`,
                                        }) })] })] }, value));
                }) }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: onCancel, children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: onNext, children: [intl.formatMessage({ id: "common.next" }), _jsx(ChevronRightIcon, { className: "size-4" })] })] })] }));
}
export function RemoteConnectionSettingsStep({ kind, host, port, username, sshAuthMethod, assetInstallMode, password, privateKeyPath, privateKeyPassphrase, wslDistro, wslUser = "", wslDistros, dockerContainer, manualDockerContainer, serverUrl, serverName, serverToken, serverWorkspacePath, dockerContainers, dockerAvailable, sshConfigAliases, sshConfigAliasesLoading, sshConfigAliasesError, selectedSshConfigAlias, currentRuntimeOptionsLoading, currentRuntimeOptionsError, remoteWorkspaceSessions = [], validationMessage, loading, onBack, onHostChange, onPortChange, onUsernameChange, onSshAuthMethodChange, onAssetInstallModeChange, onPasswordChange, onPrivateKeyPathChange, onPrivateKeyPassphraseChange, onWslDistroChange, onWslUserChange, onDockerContainerChange, onManualDockerContainerChange, onServerUrlChange, onServerNameChange, onServerTokenChange, onServerWorkspacePathChange, onDockerContainersRefresh, onApplySshConfigAlias, onClearSelectedSshConfigAlias, onConnect, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col gap-6 h-full", children: [_jsxs("div", { "data-testid": "remote-connection-settings-scroll", 
                // SSH 配置项增多时，表单内容以前没有自己的滚动边界，会继续绘制到下方按钮区域。
                // 这里把中间内容区限定为可滚动区域，让 footer 始终占据独立空间，不遮挡最后几项配置。
                className: "flex-1 min-h-0 space-y-4 overflow-y-auto pr-1", children: [currentRuntimeOptionsError ? (_jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-warning bg-warning px-4 py-3 text-ui-base text-warning-foreground", children: [_jsx(AlertTriangleIcon, { className: "mt-0.5 size-4 shrink-0" }), _jsx("span", { children: intl.formatMessage({ id: "remote.optionsLoadFailed" }) })] })) : null, _jsx(RemoteConnectionFields, { kind: kind, host: host, port: port, username: username, sshAuthMethod: sshAuthMethod, assetInstallMode: assetInstallMode, password: password, privateKeyPath: privateKeyPath, privateKeyPassphrase: privateKeyPassphrase, wslDistro: wslDistro, wslUser: wslUser, wslDistros: wslDistros, dockerContainer: dockerContainer, manualDockerContainer: manualDockerContainer, serverUrl: serverUrl, serverName: serverName, serverToken: serverToken, serverWorkspacePath: serverWorkspacePath, dockerContainers: dockerContainers, dockerAvailable: dockerAvailable, sshConfigAliases: sshConfigAliases, sshConfigAliasesLoading: sshConfigAliasesLoading, sshConfigAliasesError: sshConfigAliasesError, selectedSshConfigAlias: selectedSshConfigAlias, runtimeOptionsLoading: currentRuntimeOptionsLoading, remoteWorkspaceSessions: remoteWorkspaceSessions, applySshConfigAlias: onApplySshConfigAlias, clearSelectedSshConfigAlias: onClearSelectedSshConfigAlias, setHost: onHostChange, setPort: onPortChange, setUsername: onUsernameChange, setSshAuthMethod: onSshAuthMethodChange, setAssetInstallMode: onAssetInstallModeChange, setPassword: onPasswordChange, setPrivateKeyPath: onPrivateKeyPathChange, setPrivateKeyPassphrase: onPrivateKeyPassphraseChange, setWslDistro: onWslDistroChange, setWslUser: onWslUserChange, setDockerContainer: onDockerContainerChange, setManualDockerContainer: onManualDockerContainerChange, setServerUrl: onServerUrlChange, setServerName: onServerNameChange, setServerToken: onServerTokenChange, setServerWorkspacePath: onServerWorkspacePathChange, refreshDockerContainers: onDockerContainersRefresh })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [validationMessage ? (_jsxs("div", { className: "flex flex-1 min-w-0 items-center gap-2", children: [_jsx(AlertTriangleIcon, { className: "size-4 shrink-0 text-warning" }), _jsx("span", { className: "text-warning", children: validationMessage })] })) : null, _jsxs("div", { className: "flex shrink-0 justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: onBack, disabled: loading, children: intl.formatMessage({ id: "common.back" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: onConnect, disabled: loading, children: loading ? (_jsxs(_Fragment, { children: [_jsx(LoaderIcon, { className: "size-4 animate-spin" }), intl.formatMessage({ id: "remote.connecting" })] })) : (intl.formatMessage({ id: "remote.startConnection" })) })] })] })] }));
}
export function RemoteConnectionDirectoryStep({ services, remoteTarget, localSkillSyncService, remoteSkillSyncService, localMcpSyncService, remoteMcpSyncService, localPluginSyncService, remotePluginSyncService, localZCodeAgentService, remoteZCodeAgentService, localWorkspacePath, selecting = false, onSelect, onBack, onCancel, onSkillsSynced, onMcpSynced, onPluginsSynced, }) {
    const { intl } = useZCodeIntl();
    const [selectedPath, setSelectedPath] = useState("");
    const [remoteSkillSyncOpen, setRemoteSkillSyncOpen] = useState(false);
    const [remoteMcpSyncOpen, setRemoteMcpSyncOpen] = useState(false);
    const [remotePluginSyncOpen, setRemotePluginSyncOpen] = useState(false);
    const canShowRemoteSyncActions = shouldShowRemoteSyncActions({
        remoteSessionId: remoteTarget ? "directory-step" : null,
        remoteTarget,
        clientMode: "desktop-continuous",
        hasLocalSourceService: Boolean(localSkillSyncService || localMcpSyncService || localPluginSyncService),
    });
    const canSyncRemoteSkills = Boolean(canShowRemoteSyncActions && localSkillSyncService && remoteSkillSyncService);
    const canSyncRemoteMcp = Boolean(canShowRemoteSyncActions && localMcpSyncService && remoteMcpSyncService);
    const canSyncRemotePlugins = Boolean(canShowRemoteSyncActions && localPluginSyncService && remotePluginSyncService);
    if (!services) {
        return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col gap-6 h-full", children: [_jsxs("div", { className: "flex min-h-[22rem] flex-1 items-center justify-center rounded-2xl border border-border bg-card text-ui-base text-foreground-subtle", children: [_jsx(LoaderIcon, { className: "mr-2 size-4 animate-spin" }), intl.formatMessage({ id: "common.loading" })] }), _jsx("div", { className: "flex justify-end gap-3", children: _jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 w-32", onClick: onBack, children: intl.formatMessage({ id: "common.back" }) }) })] }));
    }
    return (_jsxs("div", { className: "flex min-h-0 flex-1 flex-col gap-6 h-full", "aria-busy": selecting, children: [_jsxs("div", { className: "flex flex-col flex-1 min-h-0 space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-success bg-success px-4 py-3 text-ui-base text-success-foreground", children: [_jsx("span", { children: intl.formatMessage({ id: "remote.success" }) }), _jsx(RemoteSyncDropdownButton, { canSyncSkills: canSyncRemoteSkills, canSyncMcp: canSyncRemoteMcp, canSyncPlugins: canSyncRemotePlugins, mcpDisabled: !selectedPath.trim(), onOpenSkillSync: () => setRemoteSkillSyncOpen(true), onOpenMcpSync: () => setRemoteMcpSyncOpen(true), onOpenPluginSync: () => setRemotePluginSyncOpen(true) })] }), _jsx("div", { className: cn("min-h-0 flex flex-1 overflow-hidden", selecting ? "pointer-events-none opacity-70" : ""), children: _jsx(DirectoryBrowser, { services: services, embedded: true, onSelect: onSelect, onCancel: onCancel, onPathChange: setSelectedPath }) })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", className: "h-10 min-w-0 px-5", onClick: onBack, disabled: selecting, children: intl.formatMessage({ id: "common.back" }) }), _jsx(Button, { type: "button", size: "lg", className: "h-10 min-w-0 px-5", onClick: () => selectedPath && !selecting && onSelect(selectedPath), disabled: !selectedPath || selecting, children: selecting ? (_jsxs(_Fragment, { children: [_jsx(LoaderIcon, { className: "size-4 animate-spin" }), intl.formatMessage({ id: "common.loading" })] })) : (intl.formatMessage({ id: "directoryBrowser.selectDir" })) })] }), _jsx(RemoteSyncDialogs, { canSyncSkills: canSyncRemoteSkills, canSyncMcp: canSyncRemoteMcp, canSyncPlugins: canSyncRemotePlugins, skillOpen: remoteSkillSyncOpen, mcpOpen: remoteMcpSyncOpen, pluginOpen: remotePluginSyncOpen, onSkillOpenChange: setRemoteSkillSyncOpen, onMcpOpenChange: setRemoteMcpSyncOpen, onPluginOpenChange: setRemotePluginSyncOpen, localSkillSyncService: localSkillSyncService, remoteSkillSyncService: remoteSkillSyncService, localMcpSyncService: localMcpSyncService, remoteMcpSyncService: remoteMcpSyncService, localPluginSyncService: localPluginSyncService, remotePluginSyncService: remotePluginSyncService, localZCodeAgentService: localZCodeAgentService, remoteZCodeAgentService: remoteZCodeAgentService, remoteTarget: remoteTarget, skillWorkspacePath: "", mcpWorkspacePath: selectedPath.trim(), pluginWorkspacePath: selectedPath.trim(), pluginLocalWorkspacePath: localWorkspacePath, mcpLocalWorkspacePath: localWorkspacePath, onSkillsSynced: async () => {
                    await onSkillsSynced?.();
                }, onMcpSynced: async () => {
                    await onMcpSynced?.();
                }, onPluginsSynced: async () => {
                    await onPluginsSynced?.();
                } })] }));
}
//# sourceMappingURL=RemoteConnectionDialogContent.js.map