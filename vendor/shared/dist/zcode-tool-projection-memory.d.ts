import type { ZCodeStreamingToolInputState } from "./streaming-tool-input-preview.js";
export interface ZCodeToolProjectionMemory {
    completeToolInputById?: Map<string, unknown>;
    streamingToolInputById?: Map<string, ZCodeStreamingToolInputState>;
    toolNameById?: Map<string, string>;
}
export interface ZCodeToolProjectionMetadata {
    hasInput: boolean;
    input?: unknown;
    toolName?: string;
}
export declare function createZCodeToolProjectionMemory(): ZCodeToolProjectionMemory;
export declare function ensureZCodeToolProjectionMemory(memory: ZCodeToolProjectionMemory): ZCodeToolProjectionMemory;
export declare function resolveZCodeToolProjectionMetadata(payload: Record<string, unknown>, toolId: string, memory: ZCodeToolProjectionMemory): ZCodeToolProjectionMetadata;
export declare function finalizeZCodeToolProjectionInput(toolId: string, input: unknown, memory: ZCodeToolProjectionMemory): void;
export declare function forgetZCodeToolProjectionMetadata(toolId: string, memory: ZCodeToolProjectionMemory): void;
//# sourceMappingURL=zcode-tool-projection-memory.d.ts.map