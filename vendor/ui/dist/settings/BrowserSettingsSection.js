import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- Browser Plugin、Chrome 数据导入与清理共享同一平台状态机，拆分会扩大 pending/失败回收边界。 */
import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../components/ui/alert-dialog.js";
import { Switch } from "../components/ui/switch.js";
import { toast } from "../components/ui/toast.js";
import { usePlatform } from "../hooks/usePlatform.js";
import { useServices } from "../hooks/useServices.js";
import { useZCodeSessionService } from "../hooks/useZCodeSessionService.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { invalidateDeferredDraftSessionForSkillChange } from "../lib/zcodeDraftSkillInvalidation.js";
import { logger } from "../logger.js";
import { startUserAction } from "../lib/userActionTelemetry.js";
import { SettingsGroupCard, SettingsRow } from "../settings/SettingsPageParts.js";
import { usePluginManagementStore } from "../store/pluginManagementStore.js";
import { useSkillStore } from "../store/skillStore.js";
import { formatImportSummary } from "./browserImportSummary.js";
const OFFICIAL_BROWSER_USE_PLUGIN_ID = "browser-use@zcode-plugins-official";
function BrowserOperationButton({ children, disabled, operation, pendingOperation, variant = "outline", onClick, }) {
    const pending = pendingOperation === operation;
    return (_jsxs(Button, { type: "button", size: "lg", variant: variant, disabled: disabled || pendingOperation !== null, onClick: onClick, className: "min-w-24", children: [pending ? _jsx(LoaderCircle, { className: "size-4 animate-spin", "aria-hidden": "true" }) : null, children] }));
}
export function BrowserSettingsSection({ isDesktop, isWindowsDesktop = false, workspacePath, workspaceIdentity, embeddedBrowserAllowInsecureCertificates = false, onEmbeddedBrowserAllowInsecureCertificatesChange = async () => { }, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const { pluginManagementService, skillsService } = useServices();
    const zcodeSessionService = useZCodeSessionService(workspacePath ?? undefined, undefined, workspaceIdentity);
    const browserUsePlugin = usePluginManagementStore((state) => state.plugins.find((plugin) => plugin.id === OFFICIAL_BROWSER_USE_PLUGIN_ID));
    const loading = usePluginManagementStore((state) => state.loading);
    const pluginError = usePluginManagementStore((state) => state.error);
    const togglingPluginId = usePluginManagementStore((state) => state.togglingPluginId);
    const initializePlugins = usePluginManagementStore((state) => state.initialize);
    const setPluginEnabled = usePluginManagementStore((state) => state.setEnabled);
    const refreshSkills = useSkillStore((state) => state.refresh);
    const skillStoreWorkspacePath = useSkillStore((state) => state.workspacePath);
    const skillStoreWorkspaceIdentity = useSkillStore((state) => state.workspaceIdentity);
    const [pendingOperation, setPendingOperation] = useState(null);
    const [confirmClearAll, setConfirmClearAll] = useState(false);
    const [lastImportResult, setLastImportResult] = useState(null);
    const normalizedWorkspaceIdentity = workspaceIdentity?.trim() || null;
    const nativeActionsAvailable = isDesktop &&
        typeof platform.importChromeBrowserData === "function" &&
        typeof platform.clearEmbeddedBrowserData === "function";
    useEffect(() => {
        if (!workspacePath)
            return;
        void initializePlugins({
            workspacePath,
            workspaceIdentity,
            pluginService: pluginManagementService,
        });
    }, [initializePlugins, pluginManagementService, workspaceIdentity, workspacePath]);
    const refreshAfterPluginChange = useCallback(async () => {
        await invalidateDeferredDraftSessionForSkillChange({
            zcodeSessionService,
            workspacePath,
            workspaceIdentity: normalizedWorkspaceIdentity ?? undefined,
            reason: "settings-browser-use-plugin-enabled",
        });
        if (workspacePath &&
            skillStoreWorkspacePath === workspacePath &&
            skillStoreWorkspaceIdentity === normalizedWorkspaceIdentity) {
            await refreshSkills(skillsService, normalizedWorkspaceIdentity ?? undefined);
        }
    }, [
        normalizedWorkspaceIdentity,
        refreshSkills,
        skillStoreWorkspaceIdentity,
        skillStoreWorkspacePath,
        skillsService,
        workspacePath,
        zcodeSessionService,
    ]);
    const handleBrowserEnabledChange = useCallback(async (enabled) => {
        const trace = startUserAction({
            featureId: "settings.browser",
            action: "toggle_browser_use",
            trigger: "switch",
        });
        try {
            await setPluginEnabled(OFFICIAL_BROWSER_USE_PLUGIN_ID, enabled, pluginManagementService);
            const refreshedPlugin = usePluginManagementStore
                .getState()
                .plugins.find((plugin) => plugin.id === OFFICIAL_BROWSER_USE_PLUGIN_ID);
            if (refreshedPlugin?.enabled === enabled) {
                await refreshAfterPluginChange();
                toast(intl.formatMessage({
                    id: enabled
                        ? "settings.browser.control.enabledToast"
                        : "settings.browser.control.disabledToast",
                }));
            }
            trace.complete({
                resultSource: "platform_result",
                stateAfter: enabled ? "enabled" : "disabled",
            });
        }
        catch (error) {
            trace.fail({ failureStage: "plugin_update" });
            throw error;
        }
    }, [intl, pluginManagementService, refreshAfterPluginChange, setPluginEnabled]);
    const handleImport = useCallback(async () => {
        if (!platform.importChromeBrowserData)
            return;
        setPendingOperation("import");
        const trace = startUserAction({
            featureId: "settings.browser",
            action: "import_browser_data",
            trigger: "button",
        });
        try {
            const result = await platform.importChromeBrowserData();
            trace.complete({ resultSource: "platform_result" });
            setLastImportResult(result);
            toast(formatImportSummary(result, intl.formatMessage), {
                durationMs: 5000,
            });
        }
        catch (error) {
            trace.fail({ failureStage: "browser_data_import" });
            logger.error("[browser-settings] 导入 Chrome 数据失败", {
                error: error instanceof Error ? error.message : String(error),
            });
            toast(intl.formatMessage({ id: "settings.browser.import.failed" }));
        }
        finally {
            setPendingOperation(null);
        }
    }, [intl, platform]);
    const handleClear = useCallback(async (mode) => {
        if (!platform.clearEmbeddedBrowserData)
            return;
        setPendingOperation(mode === "cache" ? "clear-cache" : "clear-all");
        const trace = startUserAction({
            featureId: "settings.browser",
            action: mode === "cache" ? "clear_cache" : "clear_all_data",
            trigger: "button",
        });
        try {
            const result = await platform.clearEmbeddedBrowserData(mode);
            trace.complete({ resultSource: "platform_result" });
            toast(intl.formatMessage({
                id: result.success
                    ? mode === "cache"
                        ? "settings.browser.clearCache.success"
                        : "settings.browser.clearAll.success"
                    : "settings.browser.clear.failed",
            }));
        }
        catch (error) {
            trace.fail({ failureStage: "browser_data_clear" });
            logger.error("[browser-settings] 清理内置浏览器数据失败", {
                error: error instanceof Error ? error.message : String(error),
                mode,
            });
            toast(intl.formatMessage({ id: "settings.browser.clear.failed" }));
        }
        finally {
            setPendingOperation(null);
            setConfirmClearAll(false);
        }
    }, [intl, platform]);
    const pluginTogglePending = togglingPluginId === OFFICIAL_BROWSER_USE_PLUGIN_ID;
    const pluginUnavailable = !workspacePath || loading || !browserUsePlugin;
    const operationDisabled = !nativeActionsAvailable;
    return (_jsxs("div", { className: "space-y-5", children: [_jsx("section", { className: "space-y-3", children: _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.browser.control.title" }), description: intl.formatMessage({
                                id: "settings.browser.control.description",
                            }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                    id: "settings.browser.control.title",
                                }), checked: browserUsePlugin?.enabled === true, disabled: pluginUnavailable || pluginTogglePending, onCheckedChange: (checked) => void handleBrowserEnabledChange(checked) }), detail: pluginError ? (_jsx("div", { className: "text-ui-base text-destructive", children: pluginError })) : undefined }), !isWindowsDesktop ? (_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.browser.import.title" }), description: intl.formatMessage({
                                id: "settings.browser.import.description",
                            }), control: _jsx(BrowserOperationButton, { operation: "import", pendingOperation: pendingOperation, disabled: operationDisabled, onClick: () => void handleImport(), children: intl.formatMessage({ id: "settings.browser.import.action" }) }), detail: lastImportResult ? (_jsx("div", { className: "text-ui-base text-foreground-subtle", children: formatImportSummary(lastImportResult, intl.formatMessage) })) : undefined })) : null] }) }), isDesktop ? (_jsxs("section", { className: "space-y-3", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: "settings.browser.security.section" }) }), _jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({
                                id: "settings.embeddedBrowserAllowInsecureCertificates",
                            }), description: intl.formatMessage({
                                id: "settings.embeddedBrowserAllowInsecureCertificatesDescription",
                            }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                    id: "settings.embeddedBrowserAllowInsecureCertificates",
                                }), checked: embeddedBrowserAllowInsecureCertificates, onCheckedChange: (checked) => {
                                    void onEmbeddedBrowserAllowInsecureCertificatesChange(checked);
                                } }) }) })] })) : null, _jsxs("section", { className: "space-y-3", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: "settings.browser.data.section" }) }), !nativeActionsAvailable ? (_jsx("div", { className: "rounded-lg border border-border bg-surface px-4 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "settings.browser.desktopOnly" }) })) : null, _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({
                                    id: "settings.browser.clearCache.title",
                                }), description: intl.formatMessage({
                                    id: "settings.browser.clearCache.description",
                                }), control: _jsx(BrowserOperationButton, { operation: "clear-cache", pendingOperation: pendingOperation, disabled: operationDisabled, onClick: () => void handleClear("cache"), children: intl.formatMessage({
                                        id: "settings.browser.clearCache.action",
                                    }) }) }), _jsx(SettingsRow, { label: intl.formatMessage({
                                    id: "settings.browser.clearAll.title",
                                }), description: intl.formatMessage({
                                    id: "settings.browser.clearAll.description",
                                }), control: _jsx(BrowserOperationButton, { operation: "clear-all", pendingOperation: pendingOperation, disabled: operationDisabled, variant: "destructive", onClick: () => setConfirmClearAll(true), children: intl.formatMessage({ id: "settings.browser.clearAll.action" }) }) })] })] }), _jsx(AlertDialog, { open: confirmClearAll, onOpenChange: setConfirmClearAll, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: intl.formatMessage({
                                        id: "settings.browser.clearAll.confirmTitle",
                                    }) }), _jsx(AlertDialogDescription, { children: intl.formatMessage({
                                        id: "settings.browser.clearAll.confirmDescription",
                                    }) })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { disabled: pendingOperation !== null, children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(AlertDialogAction, { variant: "destructive", disabled: pendingOperation !== null, onClick: (event) => {
                                        event.preventDefault();
                                        void handleClear("all");
                                    }, children: [pendingOperation === "clear-all" ? (_jsx(LoaderCircle, { className: "size-4 animate-spin", "aria-hidden": "true" })) : null, intl.formatMessage({
                                            id: "settings.browser.clearAll.confirmAction",
                                        })] })] })] }) })] }));
}
//# sourceMappingURL=BrowserSettingsSection.js.map