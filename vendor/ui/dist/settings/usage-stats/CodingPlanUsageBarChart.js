import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "../../components/ui/chart.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { UsageEmptyState, formatCompactNumber, formatCompactTokenUsage, } from "../../settings/usage-stats/usageStatsUiParts.js";
const CODING_PLAN_BAR_CHART_MARGIN = { top: 8, right: 24, left: 24 };
const CODING_PLAN_BAR_CHART_MAX_BAR_SIZE = 24;
const BAR_COLORS = [
    "var(--color-usage-chart-1)",
    "var(--color-usage-chart-2)",
    "var(--color-usage-chart-3)",
    "var(--color-usage-chart-4)",
    "var(--color-usage-chart-5)",
    "var(--color-usage-chart-6)",
];
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
function hasBreakdownValues(series) {
    const breakdown = series.breakdown;
    if (!breakdown) {
        return false;
    }
    return [...breakdown.cachedInput, ...breakdown.uncachedInput, ...breakdown.output].some((value) => value > 0);
}
function getModelColor(index, seriesColor) {
    return seriesColor ?? BAR_COLORS[index % BAR_COLORS.length] ?? BAR_COLORS[0];
}
function getModelBreakdownColor(modelColor, kind) {
    if (kind === "cachedInput") {
        return `color-mix(in srgb, ${modelColor} 88%, black 12%)`;
    }
    if (kind === "uncachedInput") {
        return modelColor;
    }
    return `color-mix(in srgb, ${modelColor} 58%, white 42%)`;
}
function buildBarKeys({ intl, series, }) {
    return series.flatMap((item, index) => {
        const stackId = `series${index}`;
        const modelColor = getModelColor(index, item.color);
        if (!hasBreakdownValues(item)) {
            return [
                {
                    color: modelColor,
                    key: `${stackId}_total`,
                    label: item.name,
                    radius: [4, 4, 0, 0],
                },
            ];
        }
        return [
            {
                color: getModelBreakdownColor(modelColor, "cachedInput"),
                key: `${stackId}_cachedInput`,
                label: `${item.name}${intl.formatMessage({
                    id: "settings.usage.modelChart.cachedInput",
                })}`,
                radius: [0, 0, 0, 0],
                stackId,
            },
            {
                color: getModelBreakdownColor(modelColor, "uncachedInput"),
                key: `${stackId}_uncachedInput`,
                label: `${item.name}${intl.formatMessage({
                    id: "settings.usage.modelChart.uncachedInput",
                })}`,
                radius: [0, 0, 0, 0],
                stackId,
            },
            {
                color: getModelBreakdownColor(modelColor, "output"),
                key: `${stackId}_output`,
                label: `${item.name}${intl.formatMessage({
                    id: "settings.usage.modelChart.output",
                })}`,
                radius: [4, 4, 0, 0],
                stackId,
            },
        ];
    });
}
function buildChartData({ granularity, locale, series, xTime, }) {
    return xTime.map((time, dateIndex) => {
        const row = {
            label: formatChartTime(locale, time, granularity),
            time,
            total: 0,
        };
        series.forEach((item, seriesIndex) => {
            const stackId = `series${seriesIndex}`;
            if (hasBreakdownValues(item)) {
                const cachedInput = item.breakdown?.cachedInput[dateIndex] ?? 0;
                const uncachedInput = item.breakdown?.uncachedInput[dateIndex] ?? 0;
                const output = item.breakdown?.output[dateIndex] ?? 0;
                row[`${stackId}_cachedInput`] = cachedInput;
                row[`${stackId}_uncachedInput`] = uncachedInput;
                row[`${stackId}_output`] = output;
                row.total += cachedInput + uncachedInput + output;
            }
            else {
                const total = item.values[dateIndex] ?? 0;
                row[`${stackId}_total`] = total;
                row.total += total;
            }
        });
        return row;
    });
}
export function calculateCodingPlanBarChartMaxValue(series, xTimeLength) {
    let maxValue = 0;
    for (let dateIndex = 0; dateIndex < xTimeLength; dateIndex++) {
        for (const item of series) {
            const value = hasBreakdownValues(item)
                ? (item.breakdown?.cachedInput[dateIndex] ?? 0) +
                    (item.breakdown?.uncachedInput[dateIndex] ?? 0) +
                    (item.breakdown?.output[dateIndex] ?? 0)
                : (item.values[dateIndex] ?? 0);
            maxValue = Math.max(maxValue, value);
        }
    }
    return maxValue;
}
function CodingPlanBarTooltipContent(props) {
    const filteredPayload = useMemo(() => (props.payload ?? []).filter((item) => {
        const value = typeof item.value === "number" ? item.value : Number(item.value);
        return Number.isFinite(value) && value > 0;
    }), [props.payload]);
    if (!props.active || filteredPayload.length === 0) {
        return null;
    }
    return _jsx(ChartTooltipContent, { ...props, payload: filteredPayload });
}
export function CodingPlanUsageBarChart({ emptyDescription, granularity, series, valueKind = "count", xTime, }) {
    const { intl, locale } = useZCodeIntl();
    const tokenUnit = intl.formatMessage({ id: "settings.usage.tokenUnit" });
    const creditUnit = intl.formatMessage({ id: "settings.usage.creditUnit" });
    const visibleSeries = useMemo(() => series.slice(0, 6), [series]);
    const barKeys = useMemo(() => buildBarKeys({ intl, series: visibleSeries }), [intl, visibleSeries]);
    const chartConfig = useMemo(() => barKeys.reduce((config, item) => {
        config[item.key] = {
            label: item.label,
            color: item.color,
        };
        return config;
    }, {}), [barKeys]);
    const chartData = useMemo(() => buildChartData({ granularity, locale, series: visibleSeries, xTime }), [granularity, locale, visibleSeries, xTime]);
    const maxValue = useMemo(
    // tooltip 的总量是当天所有模型合计，但柱子是按模型并排展示。
    // Y 轴如果用合计值做 domain，会把每根并排柱压矮，导致图表上方空白过多。
    () => calculateCodingPlanBarChartMaxValue(visibleSeries, xTime.length), [visibleSeries, xTime.length]);
    const shouldShowAxisLabel = useCallback((value, index) => (shouldShowXAxisLabel(index, chartData.length) ? value : ""), [chartData.length]);
    const formatTooltipValue = useCallback((value, name, item) => {
        const tooltipItem = item;
        const indicatorColor = typeof tooltipItem.color === "string" ? tooltipItem.color : "var(--color-border)";
        return (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-2 shrink-0 self-center rounded-full", style: { backgroundColor: indicatorColor } }), _jsx("span", { className: "min-w-0 flex-1 truncate text-foreground-subtle", children: String(name) }), _jsxs("span", { className: "flex shrink-0 items-baseline gap-1 text-foreground", children: [_jsx("span", { className: "font-mono font-medium tabular-nums", children: typeof value === "number"
                                ? valueKind === "token"
                                    ? formatCompactTokenUsage(locale, value)
                                    : formatCompactNumber(locale, value)
                                : String(value) }), typeof value === "number" && valueKind === "token" ? (_jsx("span", { className: "text-foreground-subtle", children: tokenUnit })) : typeof value === "number" && valueKind === "credit" ? (_jsx("span", { className: "text-foreground-subtle", children: creditUnit })) : typeof value === "number" && valueKind === "speed" ? (_jsx("span", { className: "text-foreground-subtle", children: "tokens/s" })) : null] })] }));
    }, [creditUnit, locale, tokenUnit, valueKind]);
    const formatTooltipLabel = useCallback((_, payload) => {
        const row = payload[0]?.payload;
        const total = typeof row?.total === "number" ? row.total : 0;
        const formattedTotal = valueKind === "token"
            ? formatCompactTokenUsage(locale, total)
            : formatCompactNumber(locale, total);
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-foreground-subtle", children: row?.label ?? "" }), _jsxs("div", { className: "mt-3 flex items-center justify-between gap-8 text-foreground", children: [_jsxs("span", { children: [intl.formatMessage({
                                    id: "settings.usage.codingPlanLegendTotal",
                                }), ":"] }), _jsxs("span", { className: "flex items-baseline gap-1", children: [_jsx("span", { className: "font-mono font-medium tabular-nums", children: formattedTotal }), valueKind === "token" ? (_jsx("span", { className: "text-foreground-subtle", children: tokenUnit })) : valueKind === "credit" ? (_jsx("span", { className: "text-foreground-subtle", children: creditUnit })) : null] })] }), _jsx("div", { className: "mt-3 border-t border-border" })] }));
    }, [creditUnit, intl, locale, tokenUnit, valueKind]);
    const tooltipContent = useMemo(() => (_jsx(CodingPlanBarTooltipContent, { className: "max-w-96 min-w-72", indicator: "dot", labelFormatter: formatTooltipLabel, formatter: formatTooltipValue })), [formatTooltipLabel, formatTooltipValue]);
    if (visibleSeries.length === 0 || xTime.length === 0 || maxValue <= 0) {
        return (_jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.emptyTitle" }), description: emptyDescription }));
    }
    return (_jsx("div", { className: "px-3 py-3", children: _jsx(ChartContainer, { config: chartConfig, className: "h-64 w-full", children: _jsxs(BarChart, { accessibilityLayer: true, data: chartData, margin: CODING_PLAN_BAR_CHART_MARGIN, children: [_jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, interval: 0, minTickGap: 0, tickMargin: 8, tickFormatter: shouldShowAxisLabel }), _jsx(YAxis, { hide: true, domain: [0, maxValue] }), _jsx(ChartTooltip, { cursor: false, content: tooltipContent }), barKeys.map((item) => (_jsx(Bar, { dataKey: item.key, fill: `var(--color-${item.key})`, 
                        // Recharts 默认把 dataKey 当 tooltip name，导致堆叠段展示
                        // series0_cachedInput 这类内部字段。这里显式传产品文案给 tooltip formatter。
                        name: item.label, maxBarSize: CODING_PLAN_BAR_CHART_MAX_BAR_SIZE, radius: item.radius, stackId: item.stackId }, item.key)))] }) }) }));
}
//# sourceMappingURL=CodingPlanUsageBarChart.js.map