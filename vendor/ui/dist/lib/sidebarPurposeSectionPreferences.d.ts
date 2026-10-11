interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export interface SidebarPurposeSectionPreferences {
    projectsExpanded: boolean;
    conversationsExpanded: boolean;
    sectionOrder: SidebarPurposeSectionId[];
}
export declare const SIDEBAR_PURPOSE_SECTION_IDS: readonly ["projects", "conversations"];
export type SidebarPurposeSectionId = (typeof SIDEBAR_PURPOSE_SECTION_IDS)[number];
export declare const SIDEBAR_PURPOSE_SECTION_PREFERENCES_STORAGE_KEY = "zcode-sidebar-purpose-section-preferences";
export declare function reorderSidebarPurposeSections(sectionOrder: readonly SidebarPurposeSectionId[], activeSectionId: string, overSectionId: string): SidebarPurposeSectionId[];
export declare function readSidebarPurposeSectionPreferences(storage?: StorageLike | null): SidebarPurposeSectionPreferences;
export declare function persistSidebarPurposeSectionPreferences(preferences: SidebarPurposeSectionPreferences, storage?: StorageLike | null): void;
export {};
//# sourceMappingURL=sidebarPurposeSectionPreferences.d.ts.map