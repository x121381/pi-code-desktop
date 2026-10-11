export interface ZCodeStreamingToolInputState {
    deltaCount?: number;
    lastPreviewAt?: number;
    lastPreviewRawInputLength?: number;
    rawInput: string;
}
export interface ZCodeStreamingToolInputPreview {
    complete: boolean;
    input: unknown;
    rawInput: string;
}
export type ZCodeStreamingToolInputPreviewMode = "active-live" | "background-summary";
export declare const ZCODE_ACTIVE_STREAMING_TOOL_INPUT_EAGER_DELTA_COUNT = 1;
export declare const ZCODE_ACTIVE_STREAMING_TOOL_INPUT_PREVIEW_MIN_INTERVAL_MS = 750;
export declare const ZCODE_ACTIVE_STREAMING_TOOL_INPUT_PREVIEW_MIN_RAW_GROWTH: number;
export declare const ZCODE_FILE_STREAMING_TOOL_INPUT_PREVIEW_MIN_INTERVAL_MS = 1000;
export declare const ZCODE_ACTIVE_STREAMING_TOOL_INPUT_TIME_BUDGET_MAX_RAW_INPUT: number;
export declare function appendZCodeStreamingToolInputDelta(state: ZCodeStreamingToolInputState | undefined, delta: string): ZCodeStreamingToolInputState;
export declare function buildZCodeStreamingToolInputPreview(rawInput: string, completeInput?: unknown): ZCodeStreamingToolInputPreview;
export declare function shouldMaterializeZCodeStreamingToolInputPreview(state: ZCodeStreamingToolInputState, options?: {
    mode?: ZCodeStreamingToolInputPreviewMode;
    now?: number;
    toolName?: string;
}): boolean;
export declare function isZCodeFileStreamingToolInputPreviewTool(toolName?: string): boolean;
export declare function markZCodeStreamingToolInputPreviewMaterialized(state: ZCodeStreamingToolInputState, now?: number): void;
//# sourceMappingURL=streaming-tool-input-preview.d.ts.map