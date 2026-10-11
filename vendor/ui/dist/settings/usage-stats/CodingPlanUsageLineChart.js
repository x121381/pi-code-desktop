import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { UsageEmptyState, formatCompactNumber, formatCompactTokenUsage, } from "@/settings/usage-stats/usageStatsUiParts.js";
const LINE_CHART_COLORS = [
    "var(--color-usage-chart-1)",
    "var(--color-usage-chart-2)",
    "var(--color-usage-chart-3)",
    "var(--color-usage-chart-4)",
    "var(--color-usage-chart-5)",
    "var(--color-usage-chart-6)",
];
// XAxis 首尾刻度以绘图区边界为中心向两侧延伸，左右安全区太小会裁掉
// System health 等折线图的首尾日期文本。
const CODING_PLAN_LINE_CHART_MARGIN = { top: 8, right: 24, left: 24 };
function getLineChartColor(index) {
    return LINE_CHART_COLORS[index % LINE_CHART_COLORS.length] ?? LINE_CHART_COLORS[0];
}
function formatChartTime(locale, value, granularity) {
    if (granularity === "hour") {
        return value.slice(0, 5);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
    }).format(date);
}
function shouldShowXAxisLabel(index, total) {
    if (total <= 14) {
        return true;
    }
    const step = total > 45 ? 7 : 5;
    return index === 0 || index === total - 1 || index % step === 0;
}
function buildChartData(locale, xTime, granularity, series) {
    return xTime.map((time, index) => {
        const row = {
            label: formatChartTime(locale, time, granularity),
            time,
        };
        for (const item of series) {
            row[item.key] = item.values[index] ?? 0;
        }
        return row;
    });
}
export function CodingPlanUsageLineChart({ xTime, granularity, series, emptyDescription, valueKind = "count", showLegend = true, }) {
    const { intl, locale } = useZCodeIntl();
    const visibleSeries = useMemo(
    // Recharts 对 series、legend、tooltip props 的引用变化很敏感。
    // 稳定派生数据，避免设置页刷新时图表内部 store 出现重复 replace 更新。
    () => series.slice(0, 6).map((item, index) => ({
        ...item,
        key: `series${index}`,
        color: getLineChartColor(index),
    })), [series]);
    const maxValue = useMemo(() => Math.max(0, ...visibleSeries.flatMap((item) => item.values)), [visibleSeries]);
    const chartConfig = useMemo(() => visibleSeries.reduce((config, item) => {
        config[item.key] = {
            label: item.name,
            color: item.color,
        };
        return config;
    }, {}), [visibleSeries]);
    const chartData = useMemo(() => buildChartData(locale, xTime, granularity, visibleSeries), [granularity, locale, visibleSeries, xTime]);
    const shouldShowAxisLabel = useCallback((value, index) => (shouldShowXAxisLabel(index, chartData.length) ? value : ""), [chartData.length]);
    const formatTooltipItem = useCallback((value, name, item) => {
        const itemName = String(name);
        const label = chartConfig[itemName]?.label ?? itemName;
        const color = item.color ?? `var(--color-${itemName})`;
        return (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-2 shrink-0 self-center rounded-full", style: { backgroundColor: color } }), _jsxs("div", { className: "flex flex-1 items-center justify-between gap-3", children: [_jsx("span", { className: "text-foreground-subtle", children: label }), _jsxs("span", { className: "flex items-baseline gap-1 text-foreground", children: [_jsx("span", { className: "font-mono font-medium tabular-nums", children: typeof value === "number"
                                        ? valueKind === "token"
                                            ? formatCompactTokenUsage(locale, value)
                                            : formatCompactNumber(locale, value)
                                        : String(value) }), typeof value === "number" && valueKind === "speed" ? (_jsx("span", { className: "text-foreground-subtle", children: "tokens/s" })) : null] })] })] }));
    }, [chartConfig, locale, valueKind]);
    const tooltipContent = useMemo(() => (_jsx(ChartTooltipContent, { indicator: "line", labelFormatter: (label) => String(label), formatter: formatTooltipItem })), [formatTooltipItem]);
    if (visibleSeries.length === 0 || xTime.length === 0 || maxValue <= 0) {
        return (_jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.emptyTitle" }), description: emptyDescription }));
    }
    return (_jsxs("div", { className: "px-3 py-3", children: [showLegend ? (_jsx("div", { className: "mb-3 flex flex-wrap items-center gap-x-3 gap-y-2", role: "list", children: visibleSeries.map((item) => (_jsxs("div", { className: "flex min-w-0 items-center gap-2 text-ui-sm", role: "listitem", children: [_jsx("span", { className: "size-2 shrink-0 self-center rounded-full", style: { backgroundColor: item.color } }), _jsx("span", { className: "truncate text-foreground-subtle", children: item.name })] }, item.key))) })) : null, _jsx(ChartContainer, { config: chartConfig, className: "h-64 w-full", children: _jsxs(LineChart, { accessibilityLayer: true, data: chartData, margin: CODING_PLAN_LINE_CHART_MARGIN, children: [_jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, interval: 0, minTickGap: 0, tickMargin: 8, tickFormatter: shouldShowAxisLabel }), _jsx(YAxis, { hide: true, domain: [0, maxValue] }), _jsx(ChartTooltip, { cursor: false, content: tooltipContent }), visibleSeries.map((item) => (_jsx(Line, { dataKey: item.key, type: "monotone", stroke: `var(--color-${item.key})`, strokeWidth: 2, dot: false }, item.key)))] }) })] }));
}
//# sourceMappingURL=CodingPlanUsageLineChart.js.map