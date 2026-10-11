import type { TaskChatToolCall } from "@/lib/taskChatMessageTypes.js";
export interface TaskChatToolCallTreeNode {
    toolCall: TaskChatToolCall;
    childToolCalls: TaskChatToolCallTreeNode[];
}
export declare function areTaskChatToolCallsRenderEqual(left: TaskChatToolCall, right: TaskChatToolCall): boolean;
export declare function buildToolCallTree(toolCalls?: readonly TaskChatToolCall[]): TaskChatToolCallTreeNode[];
export declare function reconcileToolCallTree(toolCalls?: readonly TaskChatToolCall[], previousTree?: readonly TaskChatToolCallTreeNode[]): TaskChatToolCallTreeNode[];
//# sourceMappingURL=toolCallTree.d.ts.map