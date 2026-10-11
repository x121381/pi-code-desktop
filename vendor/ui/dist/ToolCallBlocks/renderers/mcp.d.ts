import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
interface McpToolPresentation {
    kind: "mcp_tool";
    serverName?: string;
    toolName: string;
    description?: string;
}
export declare function readMcpToolPresentation(context: Pick<ToolCallBlockRenderContext, "toolCallNode">): McpToolPresentation | null;
export declare function formatMcpIdentifier(value: string): string;
export declare function formatMcpServerLabel(value: string): string;
export declare function formatMcpToolLabel(toolName: string, serverLabel: string): string;
export declare function McpToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=mcp.d.ts.map