import type { ComponentProps } from "react";
type MarkdownTableNodeProp = {
    node?: unknown;
};
export type MarkdownTableRows = string[][];
type MarkdownTableFrameDistances = {
    leftDistance: number;
    maxLeftOffset: number;
    scrollbarWidth: number;
    rightDistance: number;
    maxViewportWidth: number;
};
type MarkdownTableVirtualScrollbarMetrics = {
    contentWidth: number;
    thumbLeft: number;
    thumbWidth: number;
};
export declare function buildMarkdownTableText(rows: MarkdownTableRows): string;
export declare function buildCsvTableText(rows: MarkdownTableRows): string;
export declare function resolveMarkdownTableStickyScrollbarMode({ stickyScrollbarDisabled, viewportHeight, dockHeight, tableHeight, }: {
    stickyScrollbarDisabled: boolean;
    viewportHeight: number;
    dockHeight: number;
    tableHeight: number;
}): boolean;
export declare function resolveMarkdownTableStickyScrollbarOffset({ frameTop, frameBottom, scrollbarHeight, viewportBottom, }: {
    frameTop: number;
    frameBottom: number;
    scrollbarHeight: number;
    viewportBottom: number;
}): number;
export declare function resolveMarkdownTableFrameDistances({ frameWidth, frameLeft, frameRight, rootLeft, rootRight, leftInset, rightInset, }: {
    frameWidth: number;
    frameLeft: number;
    frameRight: number;
    rootLeft: number;
    rootRight: number;
    leftInset?: number;
    rightInset?: number;
}): MarkdownTableFrameDistances;
export declare function resolveMarkdownTableVirtualScrollbarMetrics({ scrollLeft, scrollMax, tableWidth, trackWidth, }: {
    scrollLeft: number;
    scrollMax: number;
    tableWidth: number;
    trackWidth: number;
}): MarkdownTableVirtualScrollbarMetrics;
export declare function resolveMarkdownTableVirtualScrollMax({ tableWidth, trackWidth, }: {
    tableWidth: number;
    trackWidth: number;
}): number;
export type MarkdownTableProps = ComponentProps<"table"> & MarkdownTableNodeProp;
export declare function MarkdownTable({ className, children, node: _node, ...props }: MarkdownTableProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownTableHeaderProps = ComponentProps<"thead"> & MarkdownTableNodeProp;
export declare function MarkdownTableHeader({ className, node: _node, ...props }: MarkdownTableHeaderProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownTableBodyProps = ComponentProps<"tbody"> & MarkdownTableNodeProp;
export declare function MarkdownTableBody({ className, node: _node, ...props }: MarkdownTableBodyProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownTableRowProps = ComponentProps<"tr"> & MarkdownTableNodeProp;
export declare function MarkdownTableRow({ className, node: _node, ...props }: MarkdownTableRowProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownTableHeadProps = ComponentProps<"th"> & MarkdownTableNodeProp;
export declare function MarkdownTableHead({ className, node: _node, ...props }: MarkdownTableHeadProps): import("react/jsx-runtime").JSX.Element;
export type MarkdownTableCellProps = ComponentProps<"td"> & MarkdownTableNodeProp;
export declare function MarkdownTableCell({ className, node: _node, ...props }: MarkdownTableCellProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=markdown-table.d.ts.map