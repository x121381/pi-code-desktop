import type { ZCodeTaskMeta } from "@zcode/shared";
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare function readTaskOrder(workspacePath: string, storage?: StorageLike | null): string[];
export declare function persistTaskOrder(workspacePath: string, taskIds: readonly string[], storage?: StorageLike | null): void;
export declare function pruneTaskOrder(taskOrder: readonly string[], tasks: readonly ZCodeTaskMeta[]): string[];
export declare function sortTasksByOrder(tasks: readonly ZCodeTaskMeta[], taskOrder: readonly string[]): ZCodeTaskMeta[];
export {};
//# sourceMappingURL=taskOrderPreference.d.ts.map