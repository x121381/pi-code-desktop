export type ZCodeAssistantMessagePart = {
    type: "content";
    content: string;
} | {
    type: "thought";
    content: string;
} | {
    type: "tool-call";
    toolId: string;
};
export declare function appendAssistantMessagePart(parts: readonly ZCodeAssistantMessagePart[] | undefined, nextPart: ZCodeAssistantMessagePart): ZCodeAssistantMessagePart[];
export declare function getLatestAssistantContentPart(parts: readonly ZCodeAssistantMessagePart[]): {
    type: "content";
    content: string;
} | null;
export declare function getLatestAssistantContentText(parts: readonly ZCodeAssistantMessagePart[]): string;
//# sourceMappingURL=assistant-message-parts.d.ts.map