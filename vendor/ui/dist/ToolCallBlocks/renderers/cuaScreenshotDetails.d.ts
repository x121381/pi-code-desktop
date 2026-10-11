import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export interface CuaScreenshotDetails {
    dataUrl: string | null;
    width: number | null;
    height: number | null;
    mimeType: string | null;
    fullScreen: boolean;
    zoom: boolean;
    region: string | null;
    clamped: boolean;
}
export declare function buildCuaScreenshotDetails(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): CuaScreenshotDetails;
//# sourceMappingURL=cuaScreenshotDetails.d.ts.map