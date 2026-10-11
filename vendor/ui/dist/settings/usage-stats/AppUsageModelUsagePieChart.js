import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { buildAppUsageModelPieChartViewModel, } from "../../settings/usage-stats/appUsageModelPieChartViewModel.js";
import { UsageEmptyState, formatCompactTokenUsage, formatPercent, } from "../../settings/usage-stats/usageStatsUiParts.js";
const APP_USAGE_MODEL_PIE_CHART_MARGIN = {
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
};
export function AppUsageModelUsagePieChart({ snapshot }) {
    const { intl, locale } = useZCodeIntl();
    const { chartConfig, chartData, totalModelTokens } = useMemo(
    // Recharts 会镜像 data/config props 到内部 store；稳定饼图数据可避免设置页刷新时重复派发。
    () => buildAppUsageModelPieChartViewModel({ intl, snapshot }), [intl, snapshot]);
    const tokenUnit = intl.formatMessage({ id: "settings.usage.tokenUnit" });
    const formatTooltipItem = useCallback((value, _name, item) => {
        const slice = item.payload;
        const totalTokens = typeof value === "number" ? value : (slice?.totalTokens ?? 0);
        const share = slice?.share ?? 0;
        return (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-2 shrink-0 self-center rounded-full", style: { backgroundColor: item.color ?? slice?.color } }), _jsxs("div", { className: "grid min-w-0 flex-1 gap-1", children: [_jsx("div", { className: "truncate text-foreground-subtle", children: slice?.label ?? String(_name) }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("span", { className: "flex items-baseline gap-1 text-foreground", children: [_jsx("span", { className: "font-mono font-medium tabular-nums", children: formatCompactTokenUsage(locale, totalTokens) }), _jsx("span", { className: "text-foreground-subtle", children: tokenUnit })] }), _jsx("span", { className: "font-mono text-foreground-subtle tabular-nums", children: formatPercent(locale, share) })] })] })] }));
    }, [locale, tokenUnit]);
    const tooltipContent = useMemo(() => _jsx(ChartTooltipContent, { hideLabel: true, indicator: "line", formatter: formatTooltipItem }), [formatTooltipItem]);
    return (_jsxs("section", { className: "space-y-3 rounded-xl bg-surface p-4", children: [_jsx("h3", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.usage.modelChartTitle" }) }), totalModelTokens <= 0 ? (_jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.emptyTitle" }), description: intl.formatMessage({
                    id: "settings.usage.emptyDescription",
                }) })) : (_jsxs("div", { className: "grid gap-4 px-3 py-3 md:grid-cols-2", children: [_jsxs("div", { className: "relative mx-auto h-56 w-full max-w-64 self-center md:h-64 md:max-w-72", children: [_jsx(ChartContainer, { config: chartConfig, className: "relative z-20 h-56 w-full md:h-64", children: _jsxs(PieChart, { accessibilityLayer: true, margin: APP_USAGE_MODEL_PIE_CHART_MARGIN, children: [_jsx(ChartTooltip, { cursor: false, content: tooltipContent }), _jsx(Pie, { data: chartData, dataKey: "totalTokens", nameKey: "key", innerRadius: "56%", outerRadius: "86%", paddingAngle: chartData.length > 1 ? 2 : 0, stroke: "var(--color-surface)", strokeWidth: 2, children: chartData.map((slice) => (_jsx(Cell, { fill: `var(--color-${slice.key})` }, slice.key))) })] }) }), _jsxs("div", { className: "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center", children: [_jsx("div", { className: "max-w-full truncate text-ui-sm font-semibold text-foreground", children: formatCompactTokenUsage(locale, totalModelTokens) }), _jsx("div", { className: "max-w-full truncate text-ui-sm text-foreground-subtle", children: tokenUnit })] })] }), _jsx("div", { className: "min-w-0 self-center", role: "list", children: chartData.map((slice) => (_jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border-b border-border/70 py-2 last:border-b-0", role: "listitem", children: [_jsx("span", { className: "size-2.5 shrink-0 rounded-sm", style: { backgroundColor: slice.color } }), _jsx("span", { className: "min-w-0 truncate font-mono text-ui-sm text-foreground", children: slice.label }), _jsx("span", { className: "font-mono text-ui-sm text-foreground-subtle tabular-nums", children: formatPercent(locale, slice.share) }), _jsxs("span", { className: "col-start-2 min-w-0 truncate text-ui-sm text-foreground-subtle", children: [formatCompactTokenUsage(locale, slice.totalTokens), " ", tokenUnit] })] }, slice.key))) })] }))] }));
}
//# sourceMappingURL=AppUsageModelUsagePieChart.js.map