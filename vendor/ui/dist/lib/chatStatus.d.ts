import type { ZCodeTaskRuntimeStatus, ZCodeWorkspaceInitStatus } from "@zcode/shared";
type ChatComposerStatus = "idle" | "submitting" | "streaming" | "error";
export declare function deriveChatComposerStatusFromTaskRuntime(taskStatus: ZCodeTaskRuntimeStatus): ChatComposerStatus;
export declare function isChatComposerEditingDisabled(status: ChatComposerStatus): boolean;
export declare function isChatComposerSubmissionBlocked(status: ChatComposerStatus): status is "submitting";
export declare function shouldShowChatSubmitSpinner(status: ChatComposerStatus): status is "submitting";
export declare function isChatTaskRunning(taskStatus: ZCodeTaskRuntimeStatus): taskStatus is "creating" | "restoring" | "streaming";
export declare function deriveChatTaskStatusForMainActivity(taskStatus: ZCodeTaskRuntimeStatus, isMainActive: boolean): ZCodeTaskRuntimeStatus;
export declare function canForkFromTaskRuntimeStatus(taskStatus: ZCodeTaskRuntimeStatus): taskStatus is "idle" | "ready" | "completed";
export declare function shouldShowChatThinkingShimmer(taskStatus: ZCodeTaskRuntimeStatus): taskStatus is "creating" | "streaming";
export declare function getChatSubmitLabelId(status: ChatComposerStatus, workspaceInitStatus: ZCodeWorkspaceInitStatus, taskStatus: ZCodeTaskRuntimeStatus): "chat.send" | "chat.preparing";
export {};
//# sourceMappingURL=chatStatus.d.ts.map