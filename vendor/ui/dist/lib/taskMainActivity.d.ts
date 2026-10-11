import type { ZCodeStreamEvent, ZCodeTaskRuntimeStatus } from "@zcode/shared";
import type { TaskChatMessage } from "@/lib/taskChatMessageTypes.js";
type TaskStreamMirrorBatchEvent = Extract<ZCodeStreamEvent, {
    type: "task_stream_mirror_batch";
}>;
type TaskStreamMirrorOp = TaskStreamMirrorBatchEvent["ops"][number];
export declare function shouldMarkMainActiveFromStreamMirrorOps(ops: readonly TaskStreamMirrorOp[]): boolean;
export declare function shouldMarkMainActiveFromStreamEvent(event: ZCodeStreamEvent): boolean;
export declare function hasForegroundStreamingAssistantMessage(messages: readonly TaskChatMessage[]): boolean;
export declare function hasForegroundActivityFromMessages(messages: readonly TaskChatMessage[]): boolean;
export declare function isMainActivityRuntimeBusy(params: {
    currentStatus?: "idle" | "submitting" | "streaming" | "error";
    runtimeState?: {
        activeInputId?: unknown;
        status: ZCodeTaskRuntimeStatus;
    } | null;
    isMainActive: boolean;
    hasForegroundActivity?: boolean;
}): boolean;
export {};
//# sourceMappingURL=taskMainActivity.d.ts.map