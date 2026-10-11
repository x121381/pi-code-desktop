import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export declare function readCuaResultBundleId(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): string | null;
export declare function readCuaResultAppBundlePath(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): string | null;
export declare function readCuaInputApp(input: unknown): Record<string, unknown> | null;
export declare function readCuaResultListCount(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): number | null;
export declare function readCuaActionTargetName(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): string | null;
export declare function readCuaResultState(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): Record<string, unknown> | null;
export declare function readCuaAppName(input: unknown, result: Record<string, unknown> | null): string | null;
//# sourceMappingURL=cuaResultState.d.ts.map