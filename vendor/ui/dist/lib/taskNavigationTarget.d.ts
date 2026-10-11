import type { ZCodeTaskMeta } from "@zcode/shared";
import type { TaskNavEntry } from "@/lib/taskNavigationHistory.js";
import type { TaskEntityKey } from "@/lib/taskQueryCache.js";
export declare function taskNavigationTargetExists(params: {
    entry: TaskNavEntry;
    visibleTasks: readonly Pick<ZCodeTaskMeta, "taskId">[];
    taskMetaByEntityKey: Record<TaskEntityKey, ZCodeTaskMeta>;
}): boolean;
//# sourceMappingURL=taskNavigationTarget.d.ts.map