import { getLatestAssistantContentPart, } from "./assistant-message-parts.js";
function buildFallbackAssistantParts({ content, thought, toolCalls, }) {
    const rootToolCalls = (toolCalls ?? []).filter((toolCall) => {
        const parentToolUseId = toolCall.parentToolUseId ?? null;
        return (!parentToolUseId ||
            parentToolUseId === toolCall.toolId ||
            !(toolCalls ?? []).some((candidate) => candidate.toolId === parentToolUseId));
    });
    return [
        ...(thought ? [{ type: "thought", content: thought }] : []),
        ...rootToolCalls.map((toolCall) => ({
            type: "tool-call",
            toolId: toolCall.toolId,
        })),
        ...(content ? [{ type: "content", content }] : []),
    ];
}
export function buildZCodeAssistantPresentation({ content, thought, toolCalls = [], parts, streaming = false, interrupted = false, settling = false, }) {
    const messageParts = parts && parts.length > 0
        ? [...parts]
        : buildFallbackAssistantParts({ content, thought, toolCalls });
    const toolCallById = new Map(toolCalls.map((toolCall) => [toolCall.toolId, toolCall]));
    const renderedToolCallIds = new Set();
    const blocks = [];
    for (const part of messageParts) {
        if (part.type === "content") {
            blocks.push({ type: "content", content: part.content });
            continue;
        }
        if (part.type === "thought") {
            blocks.push({ type: "thought", content: part.content });
            continue;
        }
        const toolCall = toolCallById.get(part.toolId);
        if (!toolCall || renderedToolCallIds.has(part.toolId)) {
            continue;
        }
        const parentToolUseId = toolCall.parentToolUseId ?? null;
        if (parentToolUseId &&
            parentToolUseId !== toolCall.toolId &&
            toolCallById.has(parentToolUseId)) {
            continue;
        }
        renderedToolCallIds.add(part.toolId);
        blocks.push({ type: "tool-call", toolCall });
    }
    const latestContentPart = streaming || interrupted || settling
        ? null
        : getLatestAssistantContentPart(blocks
            .filter((block) => block.type === "content")
            .map((block) => ({ type: "content", content: block.content })));
    let latestPart = null;
    let latestBlockIndex = -1;
    if (latestContentPart) {
        latestBlockIndex = blocks.findLastIndex((block) => block.type === "content" && block.content === latestContentPart.content);
        latestPart =
            latestBlockIndex >= 0
                ? blocks[latestBlockIndex]
                : null;
    }
    return {
        messageParts,
        blocks,
        latestPart,
        historyBlocks: blocks.filter((_, index) => index !== latestBlockIndex),
    };
}
//# sourceMappingURL=assistant-presentation.js.map