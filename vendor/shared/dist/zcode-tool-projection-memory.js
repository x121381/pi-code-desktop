export function createZCodeToolProjectionMemory() {
    return {
        completeToolInputById: new Map(),
        streamingToolInputById: new Map(),
        toolNameById: new Map(),
    };
}
export function ensureZCodeToolProjectionMemory(memory) {
    memory.completeToolInputById ??= new Map();
    memory.streamingToolInputById ??= new Map();
    memory.toolNameById ??= new Map();
    return memory;
}
export function resolveZCodeToolProjectionMetadata(payload, toolId, memory) {
    const toolName = readNonEmptyString(payload.toolName) ?? memory.toolNameById?.get(toolId);
    if (toolName) {
        memory.toolNameById?.set(toolId, toolName);
    }
    if ("input" in payload) {
        return {
            hasInput: payload.input !== undefined,
            input: payload.input,
            toolName,
        };
    }
    if (memory.completeToolInputById?.has(toolId)) {
        return {
            hasInput: true,
            input: memory.completeToolInputById.get(toolId),
            toolName,
        };
    }
    return {
        hasInput: false,
        toolName,
    };
}
export function finalizeZCodeToolProjectionInput(toolId, input, memory) {
    memory.completeToolInputById ??= new Map();
    memory.completeToolInputById.set(toolId, input);
    const streamingState = memory.streamingToolInputById?.get(toolId);
    if (streamingState) {
        streamingState.lastPreviewRawInputLength = streamingState.rawInput.length;
        streamingState.rawInput = "";
    }
}
export function forgetZCodeToolProjectionMetadata(toolId, memory) {
    memory.completeToolInputById?.delete(toolId);
    memory.streamingToolInputById?.delete(toolId);
    memory.toolNameById?.delete(toolId);
}
function readNonEmptyString(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
//# sourceMappingURL=zcode-tool-projection-memory.js.map