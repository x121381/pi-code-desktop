export type SettingsSectionId = "general" | "appearance" | "migration" | "browser" | "modelProvider" | "memory" | "plugin" | "mcp" | "skill" | "plugins" | "usage" | "subagents" | "commands" | "hooks" | "workspaceFileSearch" | "computerUse" | "automations" | "shortcuts";
export type SettingsUsageTabTarget = "app" | "codingPlan";
export type SettingsPluginTabTarget = "plugins" | "mcps" | "skills" | "commands";
export type SettingsPluginNavigationOrigin = "plugin-store";
export interface SettingsSectionIntentEventDetail {
    section: SettingsSectionId;
    pluginTab?: SettingsPluginTabTarget;
    pluginOrigin?: SettingsPluginNavigationOrigin;
    pluginScopeKey?: string;
    usageTab?: SettingsUsageTabTarget;
    modelProviderId?: string;
}
export interface SettingsModelProviderTarget {
    providerId: string;
}
export declare function isSettingsSectionEnabled(section: SettingsSectionId): boolean;
export declare function resolveSettingsSection(section: SettingsSectionId, fallbackSection?: SettingsSectionId): SettingsSectionId;
export declare function readLastSettingsSectionPreference(fallbackSection?: SettingsSectionId): SettingsSectionId;
export declare function writeLastSettingsSectionPreference(section: SettingsSectionId): void;
export declare function consumeInitialSettingsSection(fallbackSection?: SettingsSectionId): SettingsSectionId;
export declare function setPendingSettingsSection(section: SettingsSectionId): void;
export declare function setPendingSettingsUsageIntent(): void;
export declare function setPendingSettingsUsageCodingPlanIntent(): void;
export declare function setPendingSettingsPluginIntent(tab: SettingsPluginTabTarget, options?: {
    origin?: SettingsPluginNavigationOrigin;
    scopeKey?: string;
}): void;
export declare function setPendingSettingsSectionIntent(section: SettingsSectionId, options?: {
    pluginTab?: SettingsPluginTabTarget;
    pluginOrigin?: SettingsPluginNavigationOrigin;
    pluginScopeKey?: string;
    modelProviderId?: string;
    usageTab?: SettingsUsageTabTarget;
}): void;
export declare function consumePendingSettingsSection(fallbackSection?: SettingsSectionId): SettingsSectionId;
export declare function consumePendingSettingsPluginTab(): SettingsPluginTabTarget | undefined;
export declare function consumePendingSettingsPluginOrigin(): SettingsPluginNavigationOrigin | undefined;
export declare function consumePendingSettingsPluginScopeKey(): string | undefined;
export declare function clearPendingSettingsPluginScopeKey(): void;
export declare function clearPendingSettingsPluginOrigin(): void;
export declare function consumePendingSettingsUsageTab(): SettingsUsageTabTarget | undefined;
export declare function consumePendingSettingsModelProviderTarget(): SettingsModelProviderTarget | undefined;
export declare function shouldFallbackSettingsUsageTabToApp({ activeTab, checkingCodingPlanTab, loadingModelProviders, showCodingPlanTab, }: {
    activeTab: SettingsUsageTabTarget;
    checkingCodingPlanTab: boolean;
    loadingModelProviders: boolean;
    showCodingPlanTab: boolean;
}): boolean;
export declare function addPendingSettingsSectionListener(listener: (section: SettingsSectionId, detail?: SettingsSectionIntentEventDetail) => void): () => void;
//# sourceMappingURL=settingsNavigation.d.ts.map