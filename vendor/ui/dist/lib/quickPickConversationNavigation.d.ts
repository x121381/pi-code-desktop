import type { ZCodeTaskMeta } from "@zcode/shared";
import type { CachedTaskListResult, TaskEntityKey } from "@/lib/taskQueryCache.js";
interface QuickPickConversationNavigationState {
    canSelectPreviousConversation: boolean;
    canSelectNextConversation: boolean;
    previousTaskId: string | null;
    nextTaskId: string | null;
}
export declare function resolveQuickPickConversationNavigation(params: {
    taskIds: readonly string[];
    activeTaskId: string | null;
}): QuickPickConversationNavigationState;
export declare function selectQuickPickConversationTaskIds(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    resultsByQueryKey: Record<string, CachedTaskListResult>;
    taskMetaByEntityKey: Record<TaskEntityKey, ZCodeTaskMeta>;
    fallbackTaskIds: readonly string[];
}): string[];
export {};
//# sourceMappingURL=quickPickConversationNavigation.d.ts.map