import type { ZCodeTaskPersistStatus, ZCodeTaskRuntimeStatus } from "@zcode/shared";
interface TaskRestoreTimestampedMessageLike {
    role: "user" | "assistant";
    timestamp: number;
}
interface ResolveTaskRuntimeStatusAfterRestoreOptions {
    persistedStatus?: ZCodeTaskPersistStatus;
    persistedUpdatedAt?: number;
    latestUserMessageTimestamp?: number | null;
    runtimeMainActive?: boolean;
}
interface ShouldShowTaskConfigLoadingOnSwitchParams {
    previousTaskId: string | null;
    nextTaskId: string | null;
}
export declare function shouldKeepTaskStreamingDuringRestore(taskStatus: ZCodeTaskRuntimeStatus): boolean;
export declare function shouldShowTaskConfigLoadingOnSwitch(params: ShouldShowTaskConfigLoadingOnSwitchParams): boolean;
export declare function getLatestTaskUserMessageTimestamp(messages: readonly TaskRestoreTimestampedMessageLike[]): number | null;
export declare function resolveTaskRuntimeStatusAfterRestore(taskStatus: ZCodeTaskRuntimeStatus, hasRestoredSession: boolean, options?: ResolveTaskRuntimeStatusAfterRestoreOptions): ZCodeTaskRuntimeStatus;
export {};
//# sourceMappingURL=taskRestoreRuntime.d.ts.map