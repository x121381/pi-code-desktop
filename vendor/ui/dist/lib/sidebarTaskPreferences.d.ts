import type { BrowserStorageLike } from "@/lib/browserEnvironment.js";
export type SidebarTaskOrganizeBy = "grouped" | "project" | "chronological";
export type SidebarTaskSortBy = "created" | "updated";
interface SidebarTaskPreferences {
    organizeBy: SidebarTaskOrganizeBy;
    sortBy: SidebarTaskSortBy;
}
export declare const SIDEBAR_TASK_PREFERENCES_STORAGE_KEY = "zcode-sidebar-task-preferences";
export declare function readSidebarTaskPreferences(storage?: BrowserStorageLike | null): SidebarTaskPreferences;
export declare function persistSidebarTaskPreferences(preferences: SidebarTaskPreferences, storage?: BrowserStorageLike | null): void;
export {};
//# sourceMappingURL=sidebarTaskPreferences.d.ts.map