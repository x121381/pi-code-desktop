import type { ZCodeUsage } from "@zcode/shared";
import type { TaskUsageState } from "@/store/zcodeSessionStoreTypes.js";
interface TaskUsageKeyParams {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
}
interface TaskContextUsageUpdateParams extends TaskUsageKeyParams {
    used: number;
    size: number;
}
interface BuildTaskContextUsageUpdateParams {
    currentUsage: TaskUsageState | null | undefined;
    incomingUsage: TaskUsageState;
    latestUserPrompt?: string | null;
}
export declare function recordTaskContextUsageUpdate(params: TaskContextUsageUpdateParams): void;
export declare function buildTaskContextUsageFromUsageUpdate(params: BuildTaskContextUsageUpdateParams): TaskUsageState;
export declare function buildPromptCompletionUsageFallback(params: TaskUsageKeyParams & {
    currentUsage: TaskUsageState | null | undefined;
    currentContextWindow?: number | null;
    usage?: ZCodeUsage;
}): TaskUsageState | null;
export declare function resetTaskContextUsageUpdateRecordsForTest(): void;
export {};
//# sourceMappingURL=zcodeTaskUsageFallback.d.ts.map