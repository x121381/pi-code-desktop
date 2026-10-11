import type { ZCodeProvider } from "@zcode/shared";
import type { WorkspaceZCodeUIState } from "@/store/zcodeSessionStoreTypes.js";
export declare function resolveChatViewActiveTaskProvider(taskId: string | null, workspaceState: Pick<WorkspaceZCodeUIState, "selectedProvider" | "taskListCache" | "optimisticTaskListByTaskId">): ZCodeProvider;
export declare function useChatViewActiveTaskProvider(taskId: string | null, workspacePath: string, workspaceIdentity?: string): "glm";
//# sourceMappingURL=activeTaskProvider.d.ts.map