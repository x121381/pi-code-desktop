import type { ZCodePermissionRequest, ZCodeStreamEvent, ZCodeTaskChangeSummary, Locale } from "@zcode/shared";
export interface BotReplyToolCallState {
    toolId: string;
    parentToolUseId?: string | null;
    title?: string;
    kind?: string;
    input?: unknown;
    output?: unknown;
    status?: "pending" | "in_progress" | "completed" | "failed" | "denied" | "stopped";
    error?: string;
    raw?: unknown;
}
interface BotReplyFormatOptions {
    workspacePath?: string;
    locale?: Locale;
}
export type BotAssistantReplyBlock = {
    type: "content";
    content: string;
} | {
    type: "tool-call";
    toolCall: BotReplyToolCallState;
} | {
    type: "change-summary";
    changeSummary: ZCodeTaskChangeSummary;
};
export declare function formatBotToolCallSummaryLine(toolCall: BotReplyToolCallState, options?: BotReplyFormatOptions): string;
export declare function extractBotAssistantResponseMessages(buffer: string, force?: boolean): {
    messages: string[];
    rest: string;
};
export declare function formatBotToolCallReply(toolCall: BotReplyToolCallState, options?: BotReplyFormatOptions): string;
export declare function formatBotPermissionRequestSummary(request: Pick<ZCodePermissionRequest, "title" | "description" | "kind" | "raw">, options?: BotReplyFormatOptions): string;
export declare function isBotToolCallReplyTerminal(status?: BotReplyToolCallState["status"]): boolean;
export declare function updateBotReplyToolCalls(toolCalls: Map<string, BotReplyToolCallState>, event: ZCodeStreamEvent): void;
export declare function formatBotAssistantReplyBlocks(blocks: readonly BotAssistantReplyBlock[], options?: BotReplyFormatOptions): string[];
export {};
//# sourceMappingURL=replyFormatter.d.ts.map