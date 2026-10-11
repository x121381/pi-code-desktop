import { type ZCodeApiRetryStatus, type ZCodeConfigOption, type ZCodePermissionRequest, type ZCodeElicitationRequest, type ZCodeProvider, type ZCodeTaskRuntimeStatus, type ZCodeTaskMeta } from "@zcode/shared";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
import type { ConfigOptionsStatus, ElicitationFormDraft, ZCodeSessionStoreState, TaskUsageState } from "@/store/zcodeSessionStoreTypes.js";
type SetFn = (partial: ZCodeSessionStoreState | Partial<ZCodeSessionStoreState> | ((state: ZCodeSessionStoreState) => ZCodeSessionStoreState | Partial<ZCodeSessionStoreState>)) => void;
export declare function createTaskSlice(set: SetFn): {
    setTaskRuntimeState: (workspacePath: string, taskId: string, status: ZCodeTaskRuntimeStatus, error?: string | null, workspaceIdentity?: string, provider?: ZCodeProvider) => void;
    setTaskUsage: (workspacePath: string, taskId: string, usage: TaskUsageState | null, workspaceIdentity?: string) => void;
    setTaskContextWindow: (workspacePath: string, taskId: string, contextWindow: number | null, workspaceIdentity?: string) => void;
    setTaskApiRetryStatus: (workspacePath: string, taskId: string, apiRetry: ZCodeApiRetryStatus | null, workspaceIdentity?: string) => void;
    setTaskConfigOptions: (workspacePath: string, taskId: string, options: ZCodeConfigOption[], workspaceIdentity?: string, status?: ConfigOptionsStatus) => void;
    setTaskPermissionRequest: (workspacePath: string, taskId: string, request: ZCodePermissionRequest | null, workspaceIdentity?: string) => void;
    removeTaskPermissionRequest: (workspacePath: string, taskId: string, requestId: string, workspaceIdentity?: string) => void;
    setTaskElicitationRequest: (workspacePath: string, taskId: string, request: ZCodeElicitationRequest | null, workspaceIdentity?: string) => void;
    removeTaskElicitationRequest: (workspacePath: string, taskId: string, requestId: string, workspaceIdentity?: string) => void;
    setTaskElicitationFormDraft: (workspacePath: string, taskId: string, requestId: string, draft: ElicitationFormDraft, workspaceIdentity?: string) => void;
    removeTaskElicitationFormDraft: (workspacePath: string, taskId: string, requestId: string, workspaceIdentity?: string) => void;
    setTaskError: (workspacePath: string, taskId: string, error: ZCodeUiError | null, workspaceIdentity?: string) => void;
    initializeBackgroundTaskRuntime: (workspacePath: string, params: {
        task: ZCodeTaskMeta;
        provider: ZCodeProvider;
        activeInputId: string;
        workspaceIdentity?: string;
    }) => void;
    upsertOptimisticTaskListItem: (workspacePath: string, task: ZCodeTaskMeta, workspaceIdentity?: string) => void;
    removeOptimisticTaskListItem: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
    removeTaskState: (workspacePath: string, taskId: string, workspaceIdentity?: string) => void;
};
export {};
//# sourceMappingURL=zcodeSessionStoreTaskSlice.d.ts.map