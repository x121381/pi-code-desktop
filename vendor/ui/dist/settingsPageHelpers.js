import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { TID_SETTINGS_ASK_USER_QUESTION_AUTO_RESOLUTION_SWITCH, TID_SETTINGS_NATIVE_SEARCH_SWITCH, } from "@zcode/shared";
import { useState, useCallback, useEffect } from "react";
import { TID_SETTINGS_LOCALE_SELECT_ITEM, TID_SETTINGS_LOCALE_SELECT_TRIGGER, testId, } from "@zcode/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { Switch } from "@/components/ui/switch.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { SettingsBadge, SettingsGroupCard, SettingsRow } from "@/settings/SettingsPageParts.js";
import { DataBaseDirControl } from "@/settings/DataBaseDirControl.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useOptionalServices } from "@/hooks/useServices.js";
import { ProactiveSuggestionsSetting } from "@/settings/ProactiveSuggestionsSetting.js";
import { DynamicWorkflowModeSetting } from "@/settings/DynamicWorkflowModeSetting.js";
import { normalizeInterfaceMode } from "@/lib/interfaceMode.js";
import { createSettingsPageConfig, resolveSettingsSectionForPlatform, } from "@/settings/settingsPageConfig.js";
export {};
export { createSettingsPageConfig, resolveSettingsSectionForPlatform };
const TASK_AUTO_ARCHIVE_DAY_OPTIONS = [3, 7, 14, 30];
const ZCODE_INTERACTION_BEHAVIOR_OPTIONS = ["queue", "guide"];
export function GeneralSectionContent({ localePreference, interfaceMode = "coding", setInterfaceMode = () => { }, notificationEnabled, notificationSoundEnabled, closeToTrayOnWindows, keepAwakeWhileRunning = false, desktopChromiumHardwareAccelerationEnabled = true, receivePreviewUpdates, autoDownloadAndInstallUpdates, dataBaseDir, terminalInheritSystemProfile = true, terminalFontFamily = "", integratedTerminalShell = { mode: "auto" }, integratedTerminalShellOptions = [], nativeSearchEnhancementsEnabled, httpProxy = "", httpProxyNoProxy = "", httpProxyCaCertPath = "", defaultHomeDir, isDesktop, isWindowsDesktop, isLinuxDesktop, linuxCloseToTray, showIntegratedTerminalShell = false, setLocalePreference, setNotificationEnabled, setNotificationSoundEnabled, taskAutoArchiveEnabled, taskAutoArchiveOlderThanDays, messageStreamShowReasoning, messageStreamShowTodos, toolGroupingExploreEnabled, toolGroupingTerminalEnabled, toolGroupingChangesEnabled, zcodeInteractionBehavior, askUserQuestionAutoResolutionEnabled = true, modelIoFullRetentionEnabled = false, onDataBaseDirChange, onSelectDataBaseDir, onTerminalInheritSystemProfileChange = async () => { }, onTerminalFontFamilyChange = async () => { }, onIntegratedTerminalShellChange = async () => { }, onNativeSearchEnhancementsEnabledChange, onHttpProxyChange = async () => { }, onHttpProxyNoProxyChange = async () => { }, onHttpProxyCaCertPathChange = async () => { }, onTaskAutoArchiveEnabledChange, onTaskAutoArchiveOlderThanDaysChange, onCloseToTrayOnWindowsChange, onKeepAwakeWhileRunningChange = async () => { }, onDesktopChromiumHardwareAccelerationChange = async () => { }, onReceivePreviewUpdatesChange, onAutoDownloadAndInstallUpdatesChange, onMessageStreamShowReasoningChange, onMessageStreamShowTodosChange, onToolGroupingExploreEnabledChange, onToolGroupingTerminalEnabledChange, onToolGroupingChangesEnabledChange, onZCodeInteractionBehaviorChange, onAskUserQuestionAutoResolutionEnabledChange = async () => { }, onModelIoFullRetentionEnabledChange = async () => { }, onOpenOnboardingDialog, }) {
    const { intl } = useZCodeIntl();
    const hasServices = Boolean(useOptionalServices());
    // 部分 SSR 单测会用精简 props 直接渲染本组件，新增终端设置项后旧 helper 未必同步传值。
    // 这里把运行时缺省值兜到“继承系统 profile”，避免 undefined.trim() 把无关测试打断。
    const [localTerminalFontFamily, setLocalTerminalFontFamily] = useState(terminalFontFamily);
    useEffect(() => {
        setLocalTerminalFontFamily(terminalFontFamily);
    }, [terminalFontFamily]);
    const normalizedTerminalFontFamily = localTerminalFontFamily.trim();
    const isTerminalFontFamilyDirty = normalizedTerminalFontFamily !== terminalFontFamily;
    const integratedTerminalShellValue = integratedTerminalShell.mode === "shell" ? integratedTerminalShell.id : "auto";
    const selectedIntegratedTerminalShellOption = integratedTerminalShell.mode === "shell"
        ? (integratedTerminalShellOptions.find((option) => option.id === integratedTerminalShell.id) ?? {
            dialect: integratedTerminalShell.dialect,
            id: integratedTerminalShell.id,
            label: integratedTerminalShell.label,
            path: integratedTerminalShell.path,
            source: "system",
        })
        : undefined;
    const visibleIntegratedTerminalShellOptions = selectedIntegratedTerminalShellOption
        ? [
            selectedIntegratedTerminalShellOption,
            ...integratedTerminalShellOptions.filter((option) => option.id !== selectedIntegratedTerminalShellOption.id),
        ]
        : integratedTerminalShellOptions;
    const handleTerminalFontFamilySave = useCallback(async () => {
        await onTerminalFontFamilyChange(normalizedTerminalFontFamily);
    }, [normalizedTerminalFontFamily, onTerminalFontFamilyChange]);
    const handleIntegratedTerminalShellChange = useCallback(async (value) => {
        if (value === "auto") {
            await onIntegratedTerminalShellChange({ mode: "auto" });
            return;
        }
        const option = visibleIntegratedTerminalShellOptions.find((candidate) => candidate.id === value);
        if (!option) {
            return;
        }
        await onIntegratedTerminalShellChange({
            mode: "shell",
            dialect: option.dialect,
            id: option.id,
            label: option.label,
            path: option.path,
        });
    }, [onIntegratedTerminalShellChange, visibleIntegratedTerminalShellOptions]);
    const [localHttpProxy, setLocalHttpProxy] = useState(httpProxy);
    useEffect(() => {
        setLocalHttpProxy(httpProxy);
    }, [httpProxy]);
    const normalizedHttpProxy = localHttpProxy.trim();
    const isHttpProxyDirty = normalizedHttpProxy !== httpProxy;
    const handleHttpProxySave = useCallback(async () => {
        await onHttpProxyChange(normalizedHttpProxy);
    }, [normalizedHttpProxy, onHttpProxyChange]);
    const [localHttpProxyNoProxy, setLocalHttpProxyNoProxy] = useState(httpProxyNoProxy);
    useEffect(() => {
        setLocalHttpProxyNoProxy(httpProxyNoProxy);
    }, [httpProxyNoProxy]);
    const normalizedHttpProxyNoProxy = localHttpProxyNoProxy
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
        .join(",");
    const isHttpProxyNoProxyDirty = normalizedHttpProxyNoProxy !== httpProxyNoProxy;
    const handleHttpProxyNoProxySave = useCallback(async () => {
        await onHttpProxyNoProxyChange(normalizedHttpProxyNoProxy);
    }, [normalizedHttpProxyNoProxy, onHttpProxyNoProxyChange]);
    const [localHttpProxyCaCertPath, setLocalHttpProxyCaCertPath] = useState(httpProxyCaCertPath);
    useEffect(() => {
        setLocalHttpProxyCaCertPath(httpProxyCaCertPath);
    }, [httpProxyCaCertPath]);
    const normalizedHttpProxyCaCertPath = localHttpProxyCaCertPath.trim();
    const isHttpProxyCaCertPathDirty = normalizedHttpProxyCaCertPath !== httpProxyCaCertPath;
    const handleHttpProxyCaCertPathSave = useCallback(async () => {
        await onHttpProxyCaCertPathChange(normalizedHttpProxyCaCertPath);
    }, [normalizedHttpProxyCaCertPath, onHttpProxyCaCertPathChange]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.locale" }), description: intl.formatMessage({ id: "settings.localeDescription" }), control: _jsxs(Select, { value: localePreference, onValueChange: (value) => setLocalePreference(value), children: [_jsx(SelectTrigger, { size: "lg", className: "w-[260px] min-w-0 justify-between", "data-testid": TID_SETTINGS_LOCALE_SELECT_TRIGGER, children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "system", "data-testid": testId(TID_SETTINGS_LOCALE_SELECT_ITEM, "system"), children: intl.formatMessage({ id: "settings.locale.system" }) }), _jsx(SelectItem, { value: "zh-CN", "data-testid": testId(TID_SETTINGS_LOCALE_SELECT_ITEM, "zh-CN"), children: intl.formatMessage({ id: "settings.locale.zh-CN" }) }), _jsx(SelectItem, { value: "en-US", "data-testid": testId(TID_SETTINGS_LOCALE_SELECT_ITEM, "en-US"), children: intl.formatMessage({ id: "settings.locale.en-US" }) })] })] }) }) }), _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { controlLayout: "wide", label: intl.formatMessage({ id: "settings.interfaceMode" }), description: intl.formatMessage({ id: "settings.interfaceMode.description" }), control: _jsxs(Select, { value: interfaceMode, onValueChange: (value) => setInterfaceMode(normalizeInterfaceMode(value)), children: [_jsx(SelectTrigger, { size: "lg", className: "w-full min-w-0 sm:w-64", "aria-label": intl.formatMessage({ id: "settings.interfaceMode" }), children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "coding", children: intl.formatMessage({ id: "settings.interfaceMode.coding" }) }), _jsx(SelectItem, { value: "office", children: intl.formatMessage({ id: "settings.interfaceMode.office" }) })] })] }) }), hasServices ? _jsx(ProactiveSuggestionsSetting, {}) : null] }), _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.terminalProfile" }), description: intl.formatMessage({ id: "settings.terminalProfileDescription" }), control: _jsx(Switch, { checked: terminalInheritSystemProfile, onCheckedChange: (checked) => {
                                void onTerminalInheritSystemProfileChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.terminalFontFamily" }), description: intl.formatMessage({ id: "settings.terminalFontFamilyDescription" }), control: _jsx(Button, { type: "button", size: "lg", disabled: !isTerminalFontFamilyDirty, onClick: () => void handleTerminalFontFamilySave(), children: intl.formatMessage({ id: "settings.dataBaseDirSave" }) }), detail: _jsx(Input, { size: "lg", value: localTerminalFontFamily, placeholder: intl.formatMessage({
                                id: "settings.terminalFontFamilyPlaceholder",
                            }), onChange: (event) => {
                                setLocalTerminalFontFamily(event.currentTarget.value);
                            }, onKeyDown: (event) => {
                                if (event.key === "Enter" && isTerminalFontFamilyDirty) {
                                    void handleTerminalFontFamilySave();
                                }
                            }, className: "max-w-[520px] font-mono" }) }), showIntegratedTerminalShell ? (_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.integratedTerminalShell" }), description: intl.formatMessage({
                            id: "settings.integratedTerminalShellDescription",
                        }), control: _jsxs(Select, { value: integratedTerminalShellValue, onValueChange: (value) => {
                                void handleIntegratedTerminalShellChange(value);
                            }, children: [_jsx(SelectTrigger, { size: "lg", className: "w-[260px] min-w-0 justify-between", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "auto", children: intl.formatMessage({ id: "settings.integratedTerminalShell.auto" }) }), visibleIntegratedTerminalShellOptions.map((option) => (_jsx(SelectItem, { value: option.id, children: option.label }, option.id)))] })] }) })) : null, _jsx(SettingsRow, { label: intl.formatMessage({
                            id: "settings.nativeSearchEnhancements",
                        }), description: intl.formatMessage({
                            id: "settings.nativeSearchEnhancementsDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                id: "settings.nativeSearchEnhancements",
                            }), checked: nativeSearchEnhancementsEnabled, "data-testid": TID_SETTINGS_NATIVE_SEARCH_SWITCH, onCheckedChange: (checked) => {
                                void onNativeSearchEnhancementsEnabledChange(checked);
                            } }) })] }), _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.httpProxy" }), description: intl.formatMessage({ id: "settings.httpProxyDescription" }), control: _jsx(Button, { type: "button", size: "lg", disabled: !isHttpProxyDirty, onClick: () => void handleHttpProxySave(), children: intl.formatMessage({ id: "settings.dataBaseDirSave" }) }), detail: _jsx(Input, { size: "lg", value: localHttpProxy, placeholder: intl.formatMessage({
                                id: "settings.httpProxyPlaceholder",
                            }), onChange: (event) => {
                                setLocalHttpProxy(event.currentTarget.value);
                            }, onKeyDown: (event) => {
                                if (event.key === "Enter" && isHttpProxyDirty) {
                                    void handleHttpProxySave();
                                }
                            }, className: "max-w-[520px] font-mono" }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.httpProxyNoProxy" }), description: intl.formatMessage({
                            id: "settings.httpProxyNoProxyDescription",
                        }), control: _jsx(Button, { type: "button", size: "lg", disabled: !isHttpProxyNoProxyDirty, onClick: () => void handleHttpProxyNoProxySave(), children: intl.formatMessage({ id: "settings.dataBaseDirSave" }) }), detail: _jsx(Input, { size: "lg", value: localHttpProxyNoProxy, placeholder: intl.formatMessage({
                                id: "settings.httpProxyNoProxyPlaceholder",
                            }), onChange: (event) => {
                                setLocalHttpProxyNoProxy(event.currentTarget.value);
                            }, onKeyDown: (event) => {
                                if (event.key === "Enter" && isHttpProxyNoProxyDirty) {
                                    void handleHttpProxyNoProxySave();
                                }
                            }, className: "max-w-[520px] font-mono" }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.httpProxyCaCertPath" }), description: intl.formatMessage({
                            id: "settings.httpProxyCaCertPathDescription",
                        }), control: _jsx(Button, { type: "button", size: "lg", disabled: !isHttpProxyCaCertPathDirty, onClick: () => void handleHttpProxyCaCertPathSave(), children: intl.formatMessage({ id: "settings.dataBaseDirSave" }) }), detail: _jsx(Input, { size: "lg", value: localHttpProxyCaCertPath, placeholder: intl.formatMessage({
                                id: "settings.httpProxyCaCertPathPlaceholder",
                            }), onChange: (event) => {
                                setLocalHttpProxyCaCertPath(event.currentTarget.value);
                            }, onKeyDown: (event) => {
                                if (event.key === "Enter" && isHttpProxyCaCertPathDirty) {
                                    void handleHttpProxyCaCertPathSave();
                                }
                            }, className: "max-w-[520px] font-mono" }) })] }), _jsxs(SettingsGroupCard, { children: [isDesktop ? (_jsxs(_Fragment, { children: [_jsx(SettingsRow, { label: intl.formatMessage({
                                    id: "settings.desktopChromiumHardwareAcceleration",
                                }), description: intl.formatMessage({
                                    id: "settings.desktopChromiumHardwareAccelerationDescription",
                                }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                        id: "settings.desktopChromiumHardwareAcceleration",
                                    }), checked: desktopChromiumHardwareAccelerationEnabled, onCheckedChange: (checked) => {
                                        void onDesktopChromiumHardwareAccelerationChange(checked);
                                    } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.receivePreviewUpdates" }), description: intl.formatMessage({
                                    id: "settings.receivePreviewUpdatesDescription",
                                }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.receivePreviewUpdates" }), checked: receivePreviewUpdates, onCheckedChange: (checked) => {
                                        void onReceivePreviewUpdatesChange(checked);
                                    } }) }), _jsx(SettingsRow, { label: intl.formatMessage({
                                    id: "settings.autoDownloadAndInstallUpdates",
                                }), description: intl.formatMessage({
                                    id: "settings.autoDownloadAndInstallUpdatesDescription",
                                }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                        id: "settings.autoDownloadAndInstallUpdates",
                                    }), checked: autoDownloadAndInstallUpdates, onCheckedChange: (checked) => {
                                        void onAutoDownloadAndInstallUpdatesChange(checked);
                                    } }) })] })) : null, _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.notification" }), description: intl.formatMessage({
                            id: "settings.notificationDescription",
                        }), control: _jsx(Switch, { checked: notificationEnabled, onCheckedChange: setNotificationEnabled }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.notificationSound" }), description: intl.formatMessage({
                            id: "settings.notificationSoundDescription",
                        }), control: _jsx(Switch, { checked: notificationSoundEnabled, disabled: !notificationEnabled, onCheckedChange: setNotificationSoundEnabled }) }), isWindowsDesktop || isLinuxDesktop ? (_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.closeToTrayOnWindows" }), description: linuxCloseToTray?.unavailable
                            ? linuxCloseToTray.gnomeLikeHint
                                ? `${intl.formatMessage({ id: "settings.closeToTrayUnavailable" })} ${intl.formatMessage({ id: "settings.closeToTrayGnomeHint" })}`
                                : intl.formatMessage({ id: "settings.closeToTrayUnavailable" })
                            : intl.formatMessage({
                                id: "settings.closeToTrayOnWindowsDescription",
                            }), control: _jsx(Switch, { checked: closeToTrayOnWindows, 
                            // Linux 上托盘能力未知（探测中）或确认不可用时都锁定，防止误开导致关窗失联
                            //（spec：docs/desktop/linux-close-to-tray.md）。
                            disabled: Boolean(linuxCloseToTray?.disabled), onCheckedChange: (checked) => {
                                void onCloseToTrayOnWindowsChange(checked);
                            } }) })) : null, isDesktop ? (_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.keepAwakeWhileRunning" }), description: intl.formatMessage({
                            id: "settings.keepAwakeWhileRunningDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                id: "settings.keepAwakeWhileRunning",
                            }), checked: keepAwakeWhileRunning, onCheckedChange: (checked) => {
                                void onKeepAwakeWhileRunningChange(checked);
                            } }) })) : null] }), _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.zcodeInteractionBehavior" }), description: intl.formatMessage({
                            id: "settings.zcodeInteractionBehaviorDescription",
                        }), control: _jsxs(Select, { value: zcodeInteractionBehavior, onValueChange: (value) => {
                                void onZCodeInteractionBehaviorChange(value);
                            }, children: [_jsx(SelectTrigger, { size: "lg", className: "w-[260px] min-w-0 justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: ZCODE_INTERACTION_BEHAVIOR_OPTIONS.map((behavior) => (_jsx(SelectItem, { value: behavior, children: intl.formatMessage({
                                            id: `settings.zcodeInteractionBehavior.option.${behavior}`,
                                        }) }, behavior))) })] }) }), _jsx(SettingsRow, { label: intl.formatMessage({
                            id: "settings.askUserQuestionAutoResolution",
                        }), description: intl.formatMessage({
                            id: "settings.askUserQuestionAutoResolutionDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({
                                id: "settings.askUserQuestionAutoResolution",
                            }), checked: askUserQuestionAutoResolutionEnabled, "data-testid": TID_SETTINGS_ASK_USER_QUESTION_AUTO_RESOLUTION_SWITCH, onCheckedChange: (checked) => {
                                void onAskUserQuestionAutoResolutionEnabledChange(checked);
                            } }) }), hasServices ? _jsx(DynamicWorkflowModeSetting, {}) : null, _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.modelIoFullRetention" }), description: intl.formatMessage({
                            id: "settings.modelIoFullRetentionDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.modelIoFullRetention" }), checked: modelIoFullRetentionEnabled, onCheckedChange: (checked) => {
                                void onModelIoFullRetentionEnabledChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.messageStreamShowReasoning" }), description: intl.formatMessage({
                            id: "settings.messageStreamShowReasoningDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.messageStreamShowReasoning" }), checked: messageStreamShowReasoning, onCheckedChange: (checked) => {
                                void onMessageStreamShowReasoningChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.messageStreamShowTodos" }), description: intl.formatMessage({
                            id: "settings.messageStreamShowTodosDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.messageStreamShowTodos" }), checked: messageStreamShowTodos, onCheckedChange: (checked) => {
                                void onMessageStreamShowTodosChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.toolGroupingExplore" }), description: intl.formatMessage({
                            id: "settings.toolGroupingExploreDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.toolGroupingExplore" }), checked: toolGroupingExploreEnabled, onCheckedChange: (checked) => {
                                void onToolGroupingExploreEnabledChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.toolGroupingTerminal" }), description: intl.formatMessage({
                            id: "settings.toolGroupingTerminalDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.toolGroupingTerminal" }), checked: toolGroupingTerminalEnabled, onCheckedChange: (checked) => {
                                void onToolGroupingTerminalEnabledChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.toolGroupingChanges" }), description: intl.formatMessage({
                            id: "settings.toolGroupingChangesDescription",
                        }), control: _jsx(Switch, { "aria-label": intl.formatMessage({ id: "settings.toolGroupingChanges" }), checked: toolGroupingChangesEnabled, onCheckedChange: (checked) => {
                                void onToolGroupingChangesEnabledChange(checked);
                            } }) })] }), _jsxs(SettingsGroupCard, { children: [_jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.taskAutoArchive" }), description: intl.formatMessage({
                            id: "settings.taskAutoArchiveDescription",
                        }), control: _jsx(Switch, { checked: taskAutoArchiveEnabled, onCheckedChange: (checked) => {
                                void onTaskAutoArchiveEnabledChange(checked);
                            } }) }), _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.taskAutoArchiveDays" }), description: intl.formatMessage({
                            id: "settings.taskAutoArchiveDaysDescription",
                        }), control: _jsxs(Select, { value: String(taskAutoArchiveOlderThanDays), onValueChange: (value) => {
                                void onTaskAutoArchiveOlderThanDaysChange(Number(value));
                            }, disabled: !taskAutoArchiveEnabled, children: [_jsx(SelectTrigger, { size: "lg", className: "w-[260px] min-w-0 justify-between", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: TASK_AUTO_ARCHIVE_DAY_OPTIONS.map((days) => (_jsx(SelectItem, { value: String(days), children: intl.formatMessage({
                                            id: `settings.taskAutoArchiveDays.option.${days}`,
                                        }) }, days))) })] }) })] }), _jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.dataBaseDir" }), description: intl.formatMessage({
                        id: "settings.dataBaseDirDescription",
                    }), control: _jsx(DataBaseDirControl, { dataBaseDir: dataBaseDir, defaultHomeDir: defaultHomeDir, onDataBaseDirChange: onDataBaseDirChange, onSelectDataBaseDir: onSelectDataBaseDir }) }) }), _jsx(SettingsGroupCard, { children: _jsx(SettingsRow, { label: intl.formatMessage({ id: "settings.onboarding" }), description: intl.formatMessage({
                        id: "settings.onboardingDescription",
                    }), control: _jsx(Button, { type: "button", size: "lg", variant: "outline", onClick: onOpenOnboardingDialog, children: intl.formatMessage({ id: "settings.onboardingOpen" }) }) }) })] }));
}
export function GeneralSectionHeader({ localePreference }) {
    const { intl } = useZCodeIntl();
    return (_jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: _jsx(SettingsBadge, { children: intl.formatMessage({ id: `settings.locale.${localePreference}` }) }) }));
}
//# sourceMappingURL=settingsPageHelpers.js.map