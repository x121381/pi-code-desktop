import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * `metrics` 预置渲染器：一排瓦片，每块显示**最后一条带该字段**的条目里的值。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的瓦片行，横向排，只有值和标签；
 * - 全尺寸：`workflow-artifact` tab 里的网格，值更大、带单位。
 */
import { memo, useMemo } from "react";
import { applyArtifactItems, } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { PresetEmpty, PresetHeading, REVEAL_ANIMATION_CLASS, } from "@/app-shell/workflow-artifacts/presets/parts.js";
import { cn } from "@/components/lib/utils.js";
/** 还没有值的瓦片。用破折号而不是 0——「没测到」和「测出来是 0」不是一回事。 */
const EMPTY_VALUE = "—";
function MetricTile({ tile, compact }) {
    return (_jsxs("div", { className: cn("flex min-w-0 flex-col gap-0.5", compact ? "" : "rounded-lg border border-border bg-surface px-3 py-2"), "data-testid": "artifact-metric-tile", "data-metric-field": tile.field, children: [_jsx("span", { className: cn("truncate text-foreground-subtlest", compact ? "text-ui-xs" : "text-ui-sm"), title: tile.label, children: tile.label }), _jsxs("span", { className: "flex min-w-0 items-baseline gap-1", children: [_jsx("span", { className: cn("truncate font-mono font-medium text-foreground tabular-nums", compact ? "text-ui-sm" : "text-ui-lg", REVEAL_ANIMATION_CLASS), "data-testid": "artifact-metric-value", title: tile.value ?? EMPTY_VALUE, children: tile.value ?? EMPTY_VALUE }, `${tile.field}:${tile.sequence ?? "none"}`), tile.unit && tile.value !== undefined ? (_jsx("span", { className: cn("shrink-0 text-foreground-subtle", compact ? "text-ui-xs" : "text-ui-sm"), children: tile.unit })) : null] })] }));
}
export const ArtifactMetrics = memo(function ArtifactMetrics({ spec, items, compact = false, labels, className, }) {
    const model = useMemo(() => applyArtifactItems("metrics", spec, items), [spec, items]);
    const hasAnyValue = model.metrics.some((tile) => tile.value !== undefined);
    if (!hasAnyValue) {
        return (_jsxs("div", { className: className, children: [compact ? null : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title })), _jsx(PresetEmpty, { compact: compact, label: labels.empty })] }));
    }
    return (_jsxs("div", { className: className, "data-testid": "artifact-metrics", children: [compact ? null : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title })), _jsx("div", { className: cn("grid gap-2", compact
                    ? "grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]"
                    : "grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"), children: model.metrics.map((tile) => (_jsx(MetricTile, { compact: compact, tile: tile }, tile.field))) })] }));
});
//# sourceMappingURL=ArtifactMetrics.js.map