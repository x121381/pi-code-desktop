import { jsx as _jsx } from "react/jsx-runtime";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { cn } from "@/components/lib/utils.js";
const HEATMAP_LEVEL_STYLES = [
    "var(--color-usage-heatmap-0)",
    "var(--color-usage-heatmap-1)",
    "var(--color-usage-heatmap-2)",
    "var(--color-usage-heatmap-3)",
    "var(--color-usage-heatmap-4)",
];
function getHeatmapCellStyle(level) {
    return {
        backgroundColor: HEATMAP_LEVEL_STYLES[level] ?? HEATMAP_LEVEL_STYLES[0],
    };
}
export function HeatmapColumn({ column, mode, }) {
    const node = (_jsx("div", { className: cn("flex min-w-0 flex-col gap-1", mode !== "daily" && "group/usage-heatmap-column"), children: column.cells.map((cell) => (_jsx(HeatmapCell, { cell: cell }, cell.key))) }));
    if (!column.tooltipTitle) {
        return node;
    }
    return _jsx(ControlHintTooltip, { title: column.tooltipTitle, children: node });
}
function HeatmapCell({ cell }) {
    const node = (_jsx("div", { className: cn("aspect-square w-full min-w-0 rounded-[4px] border transition-transform hover:scale-110 hover:border-border-hover", cell.hasUsage ? "border-border" : "border-transparent", cell.columnHover && "group-hover/usage-heatmap-column:border-border-hover"), style: getHeatmapCellStyle(cell.level) }));
    if (cell.tooltipTitle) {
        return _jsx(ControlHintTooltip, { title: cell.tooltipTitle, children: node });
    }
    return node;
}
//# sourceMappingURL=UsageHeatmapCells.js.map