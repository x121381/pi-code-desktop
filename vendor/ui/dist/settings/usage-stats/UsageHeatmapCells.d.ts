import type { AppUsageHeatmapCell } from "@zcode/shared";
export type TokenActivityMode = "daily" | "weekly" | "cumulative";
export interface HeatmapDisplayCell {
    key: string;
    tooltipTitle?: string;
    level: AppUsageHeatmapCell["level"];
    hasUsage: boolean;
    columnHover: boolean;
}
export interface HeatmapDisplayColumn {
    key: string;
    monthDate: string;
    tooltipTitle: string | null;
    cells: HeatmapDisplayCell[];
}
export declare function HeatmapColumn({ column, mode, }: {
    column: HeatmapDisplayColumn;
    mode: TokenActivityMode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=UsageHeatmapCells.d.ts.map