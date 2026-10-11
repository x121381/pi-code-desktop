import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { RemoteMcpSyncDialog } from "@/settings/RemoteMcpSyncDialog.js";
import { RemotePluginSyncDialog } from "@/settings/RemotePluginSyncDialog.js";
import { RemoteSkillSyncDialog } from "@/settings/RemoteSkillSyncDialog.js";
export const REMOTE_SYNC_PREFLIGHT_TIMEOUT_MS = 15_000;
export class RemoteSyncPreflightTimeoutError extends Error {
    timeoutMs;
    constructor(timeoutMs) {
        super(`Remote sync preflight timed out after ${timeoutMs}ms`);
        this.timeoutMs = timeoutMs;
        this.name = "RemoteSyncPreflightTimeoutError";
    }
}
export function isRemoteSyncPreflightTimeoutError(error) {
    return error instanceof RemoteSyncPreflightTimeoutError;
}
export function shouldShowRemoteSyncActions(params) {
    if (params.clientMode === "web-remote-replayable") {
        return false;
    }
    if (params.hasLocalSourceService === false) {
        return false;
    }
    return Boolean(params.remoteSessionId?.trim() &&
        (params.remoteTarget?.kind === "ssh" || params.remoteTarget?.kind === "wsl"));
}
export function shouldStartRemoteSyncOperation(params) {
    return !params.inFlight && params.selectedCount > 0;
}
export function useRemoteSyncDialogIntent(params) {
    const [openedTargetKey, setOpenedTargetKey] = useState(null);
    const open = params.rpcReady &&
        params.targetKey.length > 0 &&
        openedTargetKey === params.targetKey;
    useEffect(() => {
        // 弹窗 open 曾只绑定 PluginList 组件生命周期，远端断连或切换目标时
        // Dialog 虽被卸载，用户意图仍会残留并在重连后自动恢复。
        setOpenedTargetKey(null);
    }, [params.targetKey]);
    useEffect(() => {
        if (!params.rpcReady) {
            setOpenedTargetKey(null);
        }
    }, [params.rpcReady]);
    const setOpen = useCallback((nextOpen) => {
        setOpenedTargetKey(nextOpen && params.rpcReady && params.targetKey.length > 0
            ? params.targetKey
            : null);
    }, [params.rpcReady, params.targetKey]);
    return { open, setOpen };
}
export async function runRemoteSyncPreflightWithTimeout(operation, timeoutMs = REMOTE_SYNC_PREFLIGHT_TIMEOUT_MS) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new RemoteSyncPreflightTimeoutError(timeoutMs));
        }, timeoutMs);
    });
    try {
        return await Promise.race([operation(), timeout]);
    }
    finally {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
    }
}
export function RemoteSyncMenuItems({ canSyncSkills, canSyncMcp, canSyncPlugins = false, onOpenSkillSync, onOpenMcpSync, onOpenPluginSync, stopMouseDownPropagation = false, mcpDisabled = false, }) {
    const { intl } = useZCodeIntl();
    const handleMouseDown = stopMouseDownPropagation
        ? (event) => {
            event.stopPropagation();
        }
        : undefined;
    return (_jsxs(_Fragment, { children: [canSyncSkills ? (_jsxs(DropdownMenuItem, { onMouseDown: handleMouseDown, onSelect: onOpenSkillSync, children: [_jsx(UploadCloud, { className: "size-3.5" }), intl.formatMessage({ id: "settings.skills.remoteSync.open" })] })) : null, canSyncMcp ? (_jsxs(DropdownMenuItem, { disabled: mcpDisabled, onMouseDown: handleMouseDown, onSelect: onOpenMcpSync, children: [_jsx(UploadCloud, { className: "size-3.5" }), intl.formatMessage({ id: "settings.mcp.remoteSync.open" })] })) : null, canSyncPlugins ? (_jsxs(DropdownMenuItem, { onMouseDown: handleMouseDown, onSelect: onOpenPluginSync, children: [_jsx(UploadCloud, { className: "size-3.5" }), intl.formatMessage({ id: "settings.plugins.remoteSync.open" })] })) : null] }));
}
export function RemoteSyncDropdownButton({ canSyncSkills, canSyncMcp, canSyncPlugins = false, mcpDisabled = false, onOpenSkillSync, onOpenMcpSync, onOpenPluginSync, }) {
    const { intl } = useZCodeIntl();
    if (!canSyncSkills && !canSyncMcp && !canSyncPlugins) {
        return null;
    }
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "secondary", size: "sm", className: "gap-1", children: [_jsx(UploadCloud, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "settings.remoteSync.open" }), _jsx(ChevronDown, { className: "size-3.5 text-foreground-subtle", "aria-hidden": "true" })] }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-40", children: _jsx(RemoteSyncMenuItems, { canSyncSkills: canSyncSkills, canSyncMcp: canSyncMcp, canSyncPlugins: canSyncPlugins, mcpDisabled: mcpDisabled, onOpenSkillSync: onOpenSkillSync, onOpenMcpSync: onOpenMcpSync, onOpenPluginSync: onOpenPluginSync }) })] }));
}
export function RemoteSyncDialogs({ canSyncSkills, canSyncMcp, canSyncPlugins = false, skillOpen, mcpOpen, pluginOpen = false, onSkillOpenChange, onMcpOpenChange, onPluginOpenChange, localSkillSyncService, remoteSkillSyncService, localMcpSyncService, remoteMcpSyncService, localPluginSyncService, remotePluginSyncService, localZCodeAgentService, remoteZCodeAgentService, remoteTarget, skillWorkspacePath, mcpWorkspacePath, pluginWorkspacePath, pluginLocalWorkspacePath, mcpLocalWorkspacePath, workspaceIdentity, onSkillsSynced, onMcpSynced, onPluginsSynced, }) {
    const skillDialogProps = canSyncSkills &&
        skillOpen &&
        remoteTarget &&
        localSkillSyncService &&
        remoteSkillSyncService
        ? {
            localSkillSyncService,
            remoteSkillSyncService,
            remoteTarget,
        }
        : null;
    const mcpDialogProps = canSyncMcp &&
        mcpOpen &&
        remoteTarget &&
        localMcpSyncService &&
        remoteMcpSyncService
        ? {
            localMcpSyncService,
            remoteMcpSyncService,
            remoteTarget,
        }
        : null;
    const pluginDialogProps = canSyncPlugins &&
        pluginOpen &&
        remoteTarget &&
        localPluginSyncService &&
        remotePluginSyncService
        ? {
            localPluginSyncService,
            remotePluginSyncService,
            remoteTarget,
        }
        : null;
    return (_jsxs(_Fragment, { children: [skillDialogProps ? (_jsx(RemoteSkillSyncDialog, { open: skillOpen, onOpenChange: onSkillOpenChange, localSkillSyncService: skillDialogProps.localSkillSyncService, remoteSkillSyncService: skillDialogProps.remoteSkillSyncService, remoteTarget: skillDialogProps.remoteTarget, workspacePath: skillWorkspacePath, workspaceIdentity: workspaceIdentity, onSynced: onSkillsSynced })) : null, mcpDialogProps ? (_jsx(RemoteMcpSyncDialog, { open: mcpOpen, onOpenChange: onMcpOpenChange, localMcpSyncService: mcpDialogProps.localMcpSyncService, remoteMcpSyncService: mcpDialogProps.remoteMcpSyncService, remoteTarget: mcpDialogProps.remoteTarget, workspacePath: mcpWorkspacePath, localWorkspacePath: mcpLocalWorkspacePath, onSynced: onMcpSynced })) : null, pluginDialogProps ? (_jsx(RemotePluginSyncDialog, { open: pluginOpen, onOpenChange: onPluginOpenChange ?? (() => { }), localPluginSyncService: pluginDialogProps.localPluginSyncService, remotePluginSyncService: pluginDialogProps.remotePluginSyncService, localZCodeAgentService: localZCodeAgentService, remoteZCodeAgentService: remoteZCodeAgentService, remoteTarget: pluginDialogProps.remoteTarget, localWorkspacePath: pluginLocalWorkspacePath, workspacePath: pluginWorkspacePath ?? mcpWorkspacePath, workspaceIdentity: workspaceIdentity, onSynced: onPluginsSynced ?? (() => { }) })) : null] }));
}
//# sourceMappingURL=RemoteSyncActions.js.map