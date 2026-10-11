import type { ZCodeTaskRuntimeStatus } from "@zcode/shared";
type ChatPlaceholderMessageKey = "chat.placeholder.newTask" | "chat.placeholder.newTaskMobile" | "chat.placeholder.followUpAsk" | "chat.placeholder.followUpQueue";
export declare function resolveChatPlaceholderKey(options: {
    hasHistoryMessages: boolean;
    isTaskProcessing: boolean;
    compactNewTask?: boolean;
}): ChatPlaceholderMessageKey;
export declare function shouldDeferChatPlaceholder(options: {
    hasBoundTask: boolean;
    taskStatus: ZCodeTaskRuntimeStatus;
}): boolean;
export {};
//# sourceMappingURL=chatPlaceholder.d.ts.map