import { Settings, Sun } from "lucide-react";
import { type SettingsSectionId } from "@/lib/settingsNavigation.js";
import type { Theme } from "@/useTheme.js";
export declare const THEME_MODES: Array<{
    mode: Theme;
    icon: typeof Sun;
}>;
export type SettingsSectionGroupId = "basics" | "agentCapabilities" | "dataAndStats";
interface SettingsSectionDefinition {
    id: SettingsSectionId;
    icon: typeof Settings;
    titleId: string;
    contentTitleId?: string;
    titleBadgeId?: string;
    groupId: SettingsSectionGroupId;
}
export declare const SETTINGS_SECTIONS: SettingsSectionDefinition[];
export interface SettingsPageConfigOptions {
    isDesktop?: boolean;
    isMacDesktop?: boolean;
    isWindowsDesktop?: boolean;
}
export declare function createSettingsPageConfig({ isDesktop, isMacDesktop, isWindowsDesktop, }?: SettingsPageConfigOptions): {
    settingsSectionGroups: {
        sections: SettingsSectionDefinition[];
        id: SettingsSectionGroupId;
        titleId: string;
    }[];
    settingsSections: SettingsSectionDefinition[];
};
export declare function resolveSettingsSectionForPlatform(section: SettingsSectionId, visibleSections: ReadonlyArray<Pick<SettingsSectionDefinition, "id">>, fallbackSection?: SettingsSectionId): SettingsSectionId;
export type { SettingsSectionId };
//# sourceMappingURL=settingsPageConfig.d.ts.map