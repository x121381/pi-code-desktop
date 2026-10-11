import type { BrowserStorageLike } from "@/lib/browserEnvironment.js";
export declare const GROUPED_TASK_COLLAPSED_GROUPS_STORAGE_KEY = "zcode-grouped-task-collapsed-groups";
export type GroupedTaskCollapsedGroupState = Record<string, true>;
export declare function readGroupedTaskCollapsedGroupIds(storage?: BrowserStorageLike | null): Set<string>;
export declare function persistGroupedTaskCollapsedGroupIds(collapsedGroupIds: ReadonlySet<string>, storage?: BrowserStorageLike | null): void;
//# sourceMappingURL=groupedTaskExpansionPreference.d.ts.map