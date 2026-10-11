import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export interface CuaErrorDetails {
    code: string;
    stateId: string | null;
    elementIndex: number | null;
    targetAppName: string | null;
    targetBundleId: string | null;
}
export declare function readCuaErrorDetails(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): CuaErrorDetails | null;
//# sourceMappingURL=cuaErrorDetails.d.ts.map