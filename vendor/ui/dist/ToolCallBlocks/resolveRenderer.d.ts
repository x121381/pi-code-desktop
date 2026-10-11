import { FallbackToolCallBlock } from "@/ToolCallBlocks/renderers/fallback.js";
import { CuaGroupToolCallBlock } from "@/ToolCallBlocks/renderers/cua-group.js";
import { McpToolCallBlock } from "@/ToolCallBlocks/renderers/mcp.js";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export declare function resolveToolCallRenderer(context: ToolCallBlockRenderContext): typeof McpToolCallBlock | typeof FallbackToolCallBlock | typeof CuaGroupToolCallBlock;
//# sourceMappingURL=resolveRenderer.d.ts.map