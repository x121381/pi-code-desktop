import type { ZCodeProvider, ZCodeTaskRuntimeStatus } from "@zcode/shared";
export declare function hasBusyTaskInWorkspaceProvider(selectedProvider: ZCodeProvider, taskRuntimeByTaskId: Record<string, {
    status: ZCodeTaskRuntimeStatus;
    provider?: ZCodeProvider;
}>, optimisticTaskMetaByTaskId: Record<string, {
    provider?: ZCodeProvider;
}>, taskListCache?: Array<{
    taskId: string;
    provider?: ZCodeProvider;
}> | null, activeTaskId?: string | null): boolean;
//# sourceMappingURL=workspaceBusyTaskLock.d.ts.map