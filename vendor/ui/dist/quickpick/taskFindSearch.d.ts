import type { ZCodeTaskMeta } from "@zcode/shared";
type TaskFindScope = "conversation" | "changes";
interface TaskFindEntry {
    task: ZCodeTaskMeta;
    searchText: string;
}
interface TaskFindState {
    matches: TaskFindEntry[];
    activeTaskId: string | null;
    currentIndex: number;
    total: number;
}
export declare function createTaskFindEntries(tasks: readonly ZCodeTaskMeta[], scope: TaskFindScope): TaskFindEntry[];
export declare function getTaskFindState(entries: readonly TaskFindEntry[], query: string, preferredTaskId: string | null): TaskFindState;
export declare function moveTaskFindSelection(state: TaskFindState, direction: "previous" | "next"): string | null;
export {};
//# sourceMappingURL=taskFindSearch.d.ts.map