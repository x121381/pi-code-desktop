import type { ZCodeTimelineMeta } from "@zcode/shared";
import type { TaskChatMessage } from "@/lib/taskChatMessageTypes.js";
export declare function isRunningGoalVerificationTimeline(timeline: ZCodeTimelineMeta | undefined): boolean;
export declare function isRunningZCodeTimeline(timeline: ZCodeTimelineMeta | undefined): boolean;
export declare function hasRunningZCodeTimeline(messages: readonly TaskChatMessage[]): boolean;
export declare function hasRunningContextCompactionTimeline(messages: readonly TaskChatMessage[]): boolean;
export declare function hasRunningGoalVerificationTimeline(messages: readonly TaskChatMessage[]): boolean;
export declare function hasRunningGoalContinuationMessage(messages: readonly TaskChatMessage[]): boolean;
export declare function hasRunningGoalRuntimeSignal(messages: readonly TaskChatMessage[]): boolean;
//# sourceMappingURL=zcodeTimelineRuntime.d.ts.map