import type { IntegratedTerminalShellOption, IntegratedTerminalShellSelection, LocalePreference, ZCodeInteractionBehavior } from "@zcode/shared";
import type { IPlatformService } from "@zcode/shared";
import { type InterfaceMode } from "@/lib/interfaceMode.js";
import { createSettingsPageConfig, resolveSettingsSectionForPlatform, type SettingsSectionId } from "@/settings/settingsPageConfig.js";
export type { Locale, LocalePreference } from "@zcode/shared";
export { type SettingsSectionId };
export { createSettingsPageConfig, resolveSettingsSectionForPlatform };
export declare function GeneralSectionContent({ localePreference, interfaceMode, setInterfaceMode, notificationEnabled, notificationSoundEnabled, closeToTrayOnWindows, keepAwakeWhileRunning, desktopChromiumHardwareAccelerationEnabled, receivePreviewUpdates, autoDownloadAndInstallUpdates, dataBaseDir, terminalInheritSystemProfile, terminalFontFamily, integratedTerminalShell, integratedTerminalShellOptions, nativeSearchEnhancementsEnabled, httpProxy, httpProxyNoProxy, httpProxyCaCertPath, defaultHomeDir, isDesktop, isWindowsDesktop, isLinuxDesktop, linuxCloseToTray, showIntegratedTerminalShell, setLocalePreference, setNotificationEnabled, setNotificationSoundEnabled, taskAutoArchiveEnabled, taskAutoArchiveOlderThanDays, messageStreamShowReasoning, messageStreamShowTodos, toolGroupingExploreEnabled, toolGroupingTerminalEnabled, toolGroupingChangesEnabled, zcodeInteractionBehavior, askUserQuestionAutoResolutionEnabled, modelIoFullRetentionEnabled, onDataBaseDirChange, onSelectDataBaseDir, onTerminalInheritSystemProfileChange, onTerminalFontFamilyChange, onIntegratedTerminalShellChange, onNativeSearchEnhancementsEnabledChange, onHttpProxyChange, onHttpProxyNoProxyChange, onHttpProxyCaCertPathChange, onTaskAutoArchiveEnabledChange, onTaskAutoArchiveOlderThanDaysChange, onCloseToTrayOnWindowsChange, onKeepAwakeWhileRunningChange, onDesktopChromiumHardwareAccelerationChange, onReceivePreviewUpdatesChange, onAutoDownloadAndInstallUpdatesChange, onMessageStreamShowReasoningChange, onMessageStreamShowTodosChange, onToolGroupingExploreEnabledChange, onToolGroupingTerminalEnabledChange, onToolGroupingChangesEnabledChange, onZCodeInteractionBehaviorChange, onAskUserQuestionAutoResolutionEnabledChange, onModelIoFullRetentionEnabledChange, onOpenOnboardingDialog, }: {
    localePreference: LocalePreference;
    interfaceMode?: InterfaceMode;
    setInterfaceMode?: (mode: InterfaceMode) => void;
    notificationEnabled: boolean;
    notificationSoundEnabled: boolean;
    closeToTrayOnWindows: boolean;
    keepAwakeWhileRunning?: boolean;
    desktopChromiumHardwareAccelerationEnabled?: boolean;
    receivePreviewUpdates: boolean;
    autoDownloadAndInstallUpdates: boolean;
    dataBaseDir: string;
    terminalInheritSystemProfile: boolean;
    terminalFontFamily: string;
    integratedTerminalShell?: IntegratedTerminalShellSelection;
    integratedTerminalShellOptions?: IntegratedTerminalShellOption[];
    nativeSearchEnhancementsEnabled: boolean;
    httpProxy?: string;
    httpProxyNoProxy?: string;
    httpProxyCaCertPath?: string;
    defaultHomeDir: string;
    isDesktop?: boolean;
    isWindowsDesktop?: boolean;
    /** Linux 桌面端（isDesktop 且非 win/mac）；关闭驻留托盘设置在 Linux 上按能力自适应展示 */
    isLinuxDesktop?: boolean;
    /** Linux 关闭驻留托盘能力状态（spec：docs/desktop/linux-close-to-tray.md）；Windows 不传 */
    linuxCloseToTray?: {
        /** 能力探测中或确认不可用，开关锁定 */
        disabled: boolean;
        /** 确认不可用（描述文案切换为"未提供系统托盘"） */
        unavailable: boolean;
        /** GNOME 系桌面且无托盘（追加 AppIndicator 扩展安装提示） */
        gnomeLikeHint: boolean;
    };
    showIntegratedTerminalShell?: boolean;
    platform?: IPlatformService;
    setLocalePreference: (locale: LocalePreference) => void;
    setNotificationEnabled: (enabled: boolean) => void;
    setNotificationSoundEnabled: (enabled: boolean) => void;
    taskAutoArchiveEnabled: boolean;
    taskAutoArchiveOlderThanDays: number;
    messageStreamShowReasoning: boolean;
    messageStreamShowTodos: boolean;
    toolGroupingExploreEnabled: boolean;
    toolGroupingTerminalEnabled: boolean;
    toolGroupingChangesEnabled: boolean;
    zcodeInteractionBehavior: ZCodeInteractionBehavior;
    askUserQuestionAutoResolutionEnabled?: boolean;
    modelIoFullRetentionEnabled?: boolean;
    onDataBaseDirChange: (dir: string) => Promise<void>;
    onSelectDataBaseDir: () => Promise<string | null>;
    onTerminalInheritSystemProfileChange: (enabled: boolean) => Promise<void>;
    onTerminalFontFamilyChange: (fontFamily: string) => Promise<void>;
    onIntegratedTerminalShellChange?: (selection: IntegratedTerminalShellSelection) => Promise<void>;
    onNativeSearchEnhancementsEnabledChange: (enabled: boolean) => Promise<void>;
    onHttpProxyChange?: (httpProxy: string) => Promise<void>;
    onHttpProxyNoProxyChange?: (noProxy: string) => Promise<void>;
    onHttpProxyCaCertPathChange?: (caCertPath: string) => Promise<void>;
    onTaskAutoArchiveEnabledChange: (enabled: boolean) => Promise<void>;
    onTaskAutoArchiveOlderThanDaysChange: (days: number) => Promise<void>;
    onCloseToTrayOnWindowsChange: (enabled: boolean) => Promise<void>;
    onKeepAwakeWhileRunningChange?: (enabled: boolean) => Promise<void>;
    onDesktopChromiumHardwareAccelerationChange?: (enabled: boolean) => Promise<void>;
    onReceivePreviewUpdatesChange: (enabled: boolean) => Promise<void>;
    onAutoDownloadAndInstallUpdatesChange: (enabled: boolean) => Promise<void>;
    onMessageStreamShowReasoningChange: (enabled: boolean) => Promise<void>;
    onMessageStreamShowTodosChange: (enabled: boolean) => Promise<void>;
    onToolGroupingExploreEnabledChange: (enabled: boolean) => Promise<void>;
    onToolGroupingTerminalEnabledChange: (enabled: boolean) => Promise<void>;
    onToolGroupingChangesEnabledChange: (enabled: boolean) => Promise<void>;
    onZCodeInteractionBehaviorChange: (behavior: ZCodeInteractionBehavior) => Promise<void>;
    onAskUserQuestionAutoResolutionEnabledChange?: (enabled: boolean) => Promise<void>;
    onModelIoFullRetentionEnabledChange?: (enabled: boolean) => Promise<void>;
    onOpenOnboardingDialog: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function GeneralSectionHeader({ localePreference }: {
    localePreference: LocalePreference;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=settingsPageHelpers.d.ts.map