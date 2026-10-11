import type { TaskChatToolCall } from "@/lib/taskChatMessageTypes.js";
interface ToolCallDisplayIdentityFields {
    kind?: string | null;
    title?: string | null;
    toolName?: string | null;
}
interface MergeToolCallDisplayIdentityOptions {
    fallbackKind?: string | null;
}
interface MergedToolCallDisplayIdentityFields {
    kind?: string;
    title?: string;
    toolName?: string;
}
export declare function mergeToolCallDisplayIdentityFields(preferred: ToolCallDisplayIdentityFields, fallback?: ToolCallDisplayIdentityFields, options?: MergeToolCallDisplayIdentityOptions): MergedToolCallDisplayIdentityFields;
export declare function normalizeToolCallDisplayIdentity(toolCall: TaskChatToolCall): TaskChatToolCall;
export declare function normalizeToolCallDisplayIdentities(toolCalls: readonly TaskChatToolCall[] | undefined): TaskChatToolCall[] | undefined;
export {};
//# sourceMappingURL=zcodeToolCallDisplayIdentity.d.ts.map