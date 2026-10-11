import type { ToolCallBlockRenderContext } from "../shared.js";
export type ReadSummary = {
    path: string;
    fileName: string;
    filePath: string | null;
    fileIconSrc: string;
    entryType: "file" | "directory";
};
export declare function buildReadSummary(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): ReadSummary | null;
export declare function ReadFileChip({ summary, clickable, onClick, }: {
    summary: ReadSummary;
    clickable: boolean;
    onClick?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ReadToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=read.d.ts.map