import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export interface CuaAccessRow {
    labelId: string;
    value: string;
    status?: boolean;
}
export interface CuaAccessDetails {
    ready: boolean;
    permissionRows: CuaAccessRow[];
    environmentRows: CuaAccessRow[];
}
export declare function buildCuaAccessDetails(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"], formatValue: (id: string) => string): CuaAccessDetails;
//# sourceMappingURL=cuaAccessDetails.d.ts.map