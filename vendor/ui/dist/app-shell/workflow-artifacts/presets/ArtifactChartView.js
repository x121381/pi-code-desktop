import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * `chart` 预置渲染器的**实现**（recharts 在这个模块里，且只在这里）。
 *
 * 不要直接从 index 静态导入它：recharts 在模块初始化阶段会触发 decimal.js-light 的 LN10 校验，
 * 在 Electron Linux 容器里能阻断整个 renderer 启动（同 `AppUsagePanel.tsx` 里记下的那次修复）。
 * 对外的入口是 `ArtifactChart.tsx`，它用 `lazy()` 把这个模块推到首屏之外。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的**无轴 sparkline + 最新值**；
 * - 全尺寸：`workflow-artifact` tab 里的带轴图 + 图例 + 参考线 + tooltip。
 */
import { memo, useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, Scatter, XAxis, YAxis, } from "recharts";
import { applyArtifactItems, } from "../../../app-shell/workflow-artifacts/presets/apply.js";
import { artifactSeriesColorVar, artifactSeriesDash, artifactSeriesSymbol, ARTIFACT_CHART_MAX_SERIES, } from "../../../app-shell/workflow-artifacts/presets/palette.js";
import { fieldHeading, PresetEmpty, PresetHeading, REVEAL_ANIMATION_CLASS, } from "../../../app-shell/workflow-artifacts/presets/parts.js";
import { cn } from "../../../components/lib/utils.js";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "../../../components/ui/chart.js";
/** 点多到这个数以上就不画点了：一条挤满圆点的线比没有点更难读。 */
const MAX_VISIBLE_DOTS = 60;
const FULL_MARGIN = { top: 8, right: 16, bottom: 0, left: 0 };
const COMPACT_MARGIN = { top: 4, right: 4, bottom: 4, left: 4 };
/**
 * 新点的揭示：React key 用条目的 `sequence`（稳定），所以只有**这一帧新挂载**的点会播动画，
 * 既有的点保持同一个 DOM 节点、不重播。
 * `motion-reduce` 下类名里的 `animate-none` 直接关掉。
 */
function renderRevealDot(props) {
    const { cx, cy, payload, stroke, index } = props;
    if (typeof cx !== "number" || typeof cy !== "number") {
        return null;
    }
    const sequence = payload && typeof payload === "object" && typeof payload.sequence === "number"
        ? payload.sequence
        : index;
    return (_jsx("circle", { className: REVEAL_ANIMATION_CLASS, cx: cx, cy: cy, fill: stroke, r: 4 }, `reveal-${sequence}`));
}
function buildChartConfig(model) {
    return model.series.reduce((config, series) => {
        config[series.key] = {
            label: series.label,
            color: artifactSeriesColorVar(series.colorIndex),
        };
        return config;
    }, {});
}
function seriesMarks(model, showDots) {
    return model.series.map((series) => {
        const color = `var(--color-${series.key})`;
        if (model.type === "bar") {
            return _jsx(Bar, { dataKey: series.key, fill: color, isAnimationActive: false }, series.key);
        }
        if (model.type === "scatter") {
            return (_jsx(Scatter, { dataKey: series.key, fill: color, isAnimationActive: false, 
                // 点形是散点图上的次级编码（颜色之外的第二条身份线索），同折线的线型。
                shape: artifactSeriesSymbol(series.colorIndex) }, series.key));
        }
        return (_jsx(Line, { connectNulls: false, dataKey: series.key, dot: showDots ? renderRevealDot : false, 
            // recharts 自己的入场动画会在每次数据变化时把**整条线**重画一遍；实时增长的图里
            // 那就是每来一个点全线闪一次。这里关掉它，揭示动画只由新点的 CSS 负责。
            isAnimationActive: false, stroke: color, strokeDasharray: artifactSeriesDash(series.colorIndex), strokeWidth: 2, type: "monotone" }, series.key));
    });
}
/**
 * `memo` 的比较谓词（`true` = 跳过重渲染）。单独导出是为了能直接测——「什么时候不重画」
 * 是这张图的性能契约本身，把它藏在 memo 的第二实参里就没法钉住了。
 */
export function chartPlotPropsEqual(previous, next) {
    if (previous.compact !== next.compact) {
        return false;
    }
    const a = previous.model;
    const b = next.model;
    if (a.type !== b.type || a.scale !== b.scale || a.x.numeric !== b.x.numeric) {
        return false;
    }
    if (a.series.length !== b.series.length) {
        return false;
    }
    if (a.series.some((series, index) => series.label !== b.series[index]?.label)) {
        return false;
    }
    if (a.points.length !== b.points.length) {
        return false;
    }
    // 首尾 sequence：点数没变但整批条目被替换过（冷恢复重取）时也能认出来。
    if (a.points[0]?.sequence !== b.points[0]?.sequence) {
        return false;
    }
    if (a.points.at(-1)?.sequence !== b.points.at(-1)?.sequence) {
        return false;
    }
    if (a.baseline?.value !== b.baseline?.value) {
        return false;
    }
    return (a.domain?.xMin === b.domain?.xMin &&
        a.domain?.xMax === b.domain?.xMax &&
        a.domain?.yMin === b.domain?.yMin &&
        a.domain?.yMax === b.domain?.yMax);
}
const ArtifactChartPlot = memo(function ArtifactChartPlot({ model, compact }) {
    const config = useMemo(() => buildChartConfig(model), [model]);
    const showDots = model.points.length <= MAX_VISIBLE_DOTS;
    // 数值 x 才配数值轴；bar 天然是分类比较，一律走分类轴（band scale 才有正确的柱宽）。
    const categoricalX = model.type === "bar" || !model.x.numeric;
    const logDomain = model.scale === "log" && model.domain ? [model.domain.yMin, model.domain.yMax] : undefined;
    if (compact) {
        return (_jsx(ChartContainer, { className: "h-14 w-full", config: config, children: _jsxs(ComposedChart, { data: model.points, margin: COMPACT_MARGIN, children: [_jsx(XAxis, { dataKey: categoricalX ? "xLabel" : "x", hide: true, type: categoricalX ? "category" : "number" }), _jsx(YAxis, { hide: true, ...(logDomain ? { domain: logDomain, scale: "log" } : {}) }), seriesMarks(model, showDots && model.points.length <= 24)] }) }));
    }
    return (_jsx(ChartContainer, { className: "h-56 w-full", config: config, children: _jsxs(ComposedChart, { data: model.points, margin: FULL_MARGIN, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { axisLine: false, dataKey: categoricalX ? "xLabel" : "x", minTickGap: 16, tickLine: false, tickMargin: 8, type: categoricalX ? "category" : "number", ...(categoricalX ? {} : { domain: ["dataMin", "dataMax"] }) }), _jsx(YAxis, { axisLine: false, tickLine: false, tickMargin: 4, width: 44, ...(logDomain ? { domain: logDomain, scale: "log" } : {}) }), model.baseline ? (_jsx(ReferenceLine, { label: {
                        fill: "var(--color-foreground-subtle)",
                        fontSize: 10,
                        position: "insideTopRight",
                        value: model.baseline.label,
                    }, stroke: "var(--color-foreground-subtlest)", strokeDasharray: "4 4", y: model.baseline.value })) : null, _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { labelFormatter: (_label, payload) => {
                            const point = payload?.[0]?.payload;
                            return fieldHeading(point?.xLabel ?? "", model.x.unit);
                        } }), cursor: false }), seriesMarks(model, showDots)] }) }));
}, chartPlotPropsEqual);
/**
 * 图例。**永远在场（≥1 条序列）**，且每条除了颜色还带自己的线型与最新值——
 * 身份从不只由颜色承担（见 palette.ts 里关于色槽在色觉障碍下不两两可分的那段）。
 */
function ChartLegendRow({ model }) {
    const latest = model.points.at(-1);
    return (_jsx("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", role: "list", children: model.series.map((series) => {
            const value = latest?.[series.key];
            return (_jsxs("span", { className: "flex min-w-0 items-center gap-1.5 text-ui-sm", "data-testid": "artifact-chart-legend-item", role: "listitem", children: [_jsx("svg", { "aria-hidden": "true", className: "shrink-0", height: 8, width: 16, children: _jsx("line", { stroke: artifactSeriesColorVar(series.colorIndex), strokeDasharray: artifactSeriesDash(series.colorIndex), strokeWidth: 2, x1: 0, x2: 16, y1: 4, y2: 4 }) }), _jsx("span", { className: "truncate text-foreground-subtle", children: series.label }), typeof value === "number" ? (_jsx("span", { className: "shrink-0 font-mono text-ui-xs text-foreground tabular-nums", children: series.unit ? `${value} ${series.unit}` : String(value) })) : null] }, series.key));
        }) }));
}
/** compact 形态右侧的「最新值」——sparkline 自己不带轴，数值得由它来交代。 */
function CompactLatestValue({ model }) {
    const series = model.series[0];
    const latest = model.points.at(-1);
    const value = series && latest ? latest[series.key] : undefined;
    if (typeof value !== "number") {
        return null;
    }
    return (_jsxs("span", { className: "flex shrink-0 items-baseline gap-1", "data-testid": "artifact-chart-latest", children: [_jsx("span", { className: cn("font-mono text-ui-base font-medium text-foreground tabular-nums", REVEAL_ANIMATION_CLASS), children: value }, `latest-${latest?.sequence ?? "none"}`), series?.unit ? (_jsx("span", { className: "text-ui-xs text-foreground-subtle", children: series.unit })) : null] }));
}
export function ArtifactChartView({ spec, items, compact = false, labels, className, }) {
    const model = useMemo(() => {
        const built = applyArtifactItems("chart", spec, items);
        // 色槽只有 6 个，多出来的序列不画——循环复用颜色会让两条序列长得一模一样。
        return built.series.length > ARTIFACT_CHART_MAX_SERIES
            ? { ...built, series: built.series.slice(0, ARTIFACT_CHART_MAX_SERIES) }
            : built;
    }, [spec, items]);
    if (model.points.length === 0) {
        return (_jsxs("div", { className: className, children: [compact ? null : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title })), _jsx(PresetEmpty, { compact: compact, label: labels.empty })] }));
    }
    if (compact) {
        return (_jsxs("div", { className: cn("flex min-w-0 items-center gap-2", className), "data-testid": "artifact-chart-compact", children: [_jsx("div", { className: "min-w-0 flex-1", children: _jsx(ArtifactChartPlot, { compact: true, model: model }) }), _jsx(CompactLatestValue, { model: model })] }));
    }
    return (_jsxs("div", { className: cn("min-w-0", className), "data-testid": "artifact-chart", children: [_jsx(PresetHeading, { className: "mb-2", description: spec.description, title: spec.title }), _jsx("div", { className: "mb-2", children: _jsx(ChartLegendRow, { model: model }) }), _jsx(ArtifactChartPlot, { compact: false, model: model }), _jsx("div", { className: "mt-1 text-center text-ui-xs text-foreground-subtlest", children: fieldHeading(model.x.label, model.x.unit) })] }));
}
export default ArtifactChartView;
//# sourceMappingURL=ArtifactChartView.js.map