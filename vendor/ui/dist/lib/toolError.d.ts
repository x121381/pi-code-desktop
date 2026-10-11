import type { TaskChatToolCall as ChatToolCall } from "@/lib/taskChatMessageTypes.js";
export declare function normalizeWrappedErrorText(text: string): string;
export declare function getToolCallErrorText(toolCall: Pick<ChatToolCall, "error" | "output" | "raw" | "status">): string | undefined;
//# sourceMappingURL=toolError.d.ts.map