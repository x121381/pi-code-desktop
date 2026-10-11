import { type ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
export declare function resolveFileChipAvailableWidth({ boundaryRight, listLeft, trailingWidth, }: {
    boundaryRight: number;
    listLeft: number;
    trailingWidth: number;
}): number;
export declare function resolveResponsiveFileChipCount({ availableWidth, chipWidths, overflowWidth, gap, }: {
    availableWidth: number;
    chipWidths: readonly number[];
    overflowWidth: number;
    gap: number;
}): number;
export declare function ChangesGroupToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=changes-group.d.ts.map