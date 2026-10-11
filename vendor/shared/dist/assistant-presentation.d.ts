import { type ZCodeAssistantMessagePart } from "./assistant-message-parts.js";
export interface ZCodeAssistantPresentationToolCall {
    toolId: string;
    parentToolUseId?: string | null;
    kind: string;
    title?: string;
    input: unknown;
    status: string;
    output?: unknown;
    error?: string;
    raw?: unknown;
}
export type ZCodeAssistantPresentationBlock = {
    type: "content";
    content: string;
} | {
    type: "thought";
    content: string;
} | {
    type: "tool-call";
    toolCall: ZCodeAssistantPresentationToolCall;
};
export interface ZCodeAssistantPresentation {
    messageParts: ZCodeAssistantMessagePart[];
    blocks: ZCodeAssistantPresentationBlock[];
    latestPart: Extract<ZCodeAssistantPresentationBlock, {
        type: "content";
    }> | null;
    historyBlocks: ZCodeAssistantPresentationBlock[];
}
export interface BuildZCodeAssistantPresentationOptions {
    content: string;
    thought?: string;
    toolCalls?: readonly ZCodeAssistantPresentationToolCall[];
    parts?: readonly ZCodeAssistantMessagePart[];
    streaming?: boolean;
    interrupted?: boolean;
    settling?: boolean;
}
export declare function buildZCodeAssistantPresentation({ content, thought, toolCalls, parts, streaming, interrupted, settling, }: BuildZCodeAssistantPresentationOptions): ZCodeAssistantPresentation;
//# sourceMappingURL=assistant-presentation.d.ts.map