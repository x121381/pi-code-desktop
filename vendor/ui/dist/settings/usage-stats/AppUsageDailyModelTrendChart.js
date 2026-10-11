import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "../../components/ui/chart.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { UsageEmptyState, formatCompactTokenUsage, formatDay, resolveModelLabel, } from "../../settings/usage-stats/usageStatsUiParts.js";
import { getAppUsageModelChartColor } from "../../settings/usage-stats/appUsageChartPalette.js";
// XAxis 首尾刻度以绘图区边界为中心向两侧延伸，原 8px margin 小于日期文本半宽，
// SVG 会裁掉首尾文字；左右保留 24px 安全区，让桌面端与手机 Web 端都能完整显示短日期。
export const APP_USAGE_TREND_CHART_MARGIN = {
    top: 8,
    right: 24,
    left: 24,
};
export function filterDailyModelTooltipPayload(payload) {
    // Recharts 的多序列 tooltip payload 会包含当天所有模型；
    // 0 用量模型没有可见趋势点，继续展示会误导用户以为 hover 到了有效用量。
    return (payload ?? []).filter((item) => {
        const value = typeof item.value === "number" ? item.value : Number(item.value);
        return Number.isFinite(value) && value > 0;
    });
}
export function resolveDailyModelTooltipTokenParts(locale, value, tokenUnit) {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
        return { number: String(value), unit: "" };
    }
    return {
        number: formatCompactTokenUsage(locale, numericValue),
        unit: tokenUnit,
    };
}
function shouldShowDailyChartAxisLabel(index, total) {
    if (total <= 14) {
        return true;
    }
    const step = total > 45 ? 7 : 5;
    return index === 0 || index === total - 1 || index % step === 0;
}
function createEmptyChartRow(label, tooltipLabel, modelKeys) {
    const row = {
        label,
        tooltipLabel,
        total: 0,
    };
    for (const model of modelKeys) {
        row[model.key] = 0;
    }
    return row;
}
function buildDailyModelChartData({ snapshot, locale, modelKeys, modelKeyById, }) {
    const rows = new Map();
    // App Usage 的 30d 协议结果已经是每日序列，旧 all 分桶残留把
    // 30 天按周聚合成约 5 个点，导致“最近 30 天”没有连续每日趋势。
    for (const day of snapshot.dailyModelUsage) {
        const label = formatDay(locale, day.date);
        const row = rows.get(day.date) ?? createEmptyChartRow(label, label, modelKeys);
        for (const model of day.models) {
            const key = modelKeyById.get(model.modelId ?? "__unknown__");
            if (key) {
                row[key] = Number(row[key] ?? 0) + model.totalTokens;
            }
            row.total += model.totalTokens;
        }
        rows.set(day.date, row);
    }
    return [...rows.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, row]) => row);
}
export function buildAppUsageDailyModelChartViewModel({ intl, locale, snapshot, }) {
    const topModels = snapshot.models.slice(0, 6);
    const modelKeys = topModels.map((model, index) => ({
        modelId: model.modelId,
        key: `model${index}`,
        color: getAppUsageModelChartColor(index),
        label: resolveModelLabel(intl, model.modelId),
    }));
    const modelKeyById = new Map(modelKeys.map((model) => [model.modelId ?? "__unknown__", model.key]));
    const chartConfig = modelKeys.reduce((config, model) => {
        config[model.key] = {
            label: model.label,
            color: model.color,
        };
        return config;
    }, {});
    const chartData = buildDailyModelChartData({
        snapshot,
        locale,
        modelKeys,
        modelKeyById,
    });
    let maxTokens = 0;
    // 图中是独立折线而非堆叠图，使用每日总量会把多模型之和（以及未展示模型）
    // 当作 Y 轴上限，导致实际可见曲线被压在底部；坐标范围只应跟随可见序列的单点峰值。
    for (const row of chartData) {
        for (const model of modelKeys) {
            maxTokens = Math.max(maxTokens, Number(row[model.key] ?? 0));
        }
    }
    return {
        topModels,
        modelKeys,
        chartConfig,
        chartData,
        maxTokens,
    };
}
function DailyModelChartTooltipContent(props) {
    const filteredPayload = useMemo(() => filterDailyModelTooltipPayload(props.payload), [props.payload]);
    if (!props.active || filteredPayload.length === 0) {
        return null;
    }
    return _jsx(ChartTooltipContent, { ...props, payload: filteredPayload });
}
export function AppUsageDailyModelTrendChart({ snapshot }) {
    const { intl, locale } = useZCodeIntl();
    const { topModels, modelKeys, chartConfig, chartData, maxTokens } = useMemo(
    // Recharts 3.8 会把 data / legend / graphical item props 写入内部 store。
    // 这里稳定派生数组和配置对象，避免父组件重渲染时因引用变化反复触发内部 dispatch。
    () => buildAppUsageDailyModelChartViewModel({ intl, locale, snapshot }), [intl, locale, snapshot]);
    const shouldShowAxisLabel = useCallback((_value, index) => shouldShowDailyChartAxisLabel(index, chartData.length) ? _value : "", [chartData.length]);
    const formatTooltipLabel = useCallback((_, payload) => {
        const row = payload[0]?.payload;
        const total = typeof row?.total === "number" ? row.total : 0;
        return `${row?.tooltipLabel ?? ""} - ${formatCompactTokenUsage(locale, total)} ${intl.formatMessage({
            id: "settings.usage.tokenUnit",
        })}`;
    }, [intl, locale]);
    const tokenUnit = intl.formatMessage({ id: "settings.usage.tokenUnit" });
    const formatTooltipItem = useCallback((value, name, item) => {
        const itemName = String(name);
        const label = chartConfig[itemName]?.label ?? itemName;
        const color = item.color ?? `var(--color-${itemName})`;
        const tokenValue = resolveDailyModelTooltipTokenParts(locale, value, tokenUnit);
        return (_jsxs(_Fragment, { children: [_jsx("span", { className: "size-2 shrink-0 self-center rounded-full", style: { backgroundColor: color } }), _jsxs("div", { className: "flex flex-1 items-center justify-between gap-3", children: [_jsx("span", { className: "text-foreground-subtle", children: label }), _jsxs("span", { className: "flex items-baseline gap-1 text-foreground", children: [_jsx("span", { className: "font-mono font-medium tabular-nums", children: tokenValue.number }), tokenValue.unit ? (_jsx("span", { className: "text-foreground-subtle", children: tokenValue.unit })) : null] })] })] }));
    }, [chartConfig, locale, tokenUnit]);
    const tooltipContent = useMemo(() => (_jsx(DailyModelChartTooltipContent, { indicator: "line", labelFormatter: formatTooltipLabel, formatter: formatTooltipItem })), [formatTooltipItem, formatTooltipLabel]);
    return (_jsxs("section", { className: "space-y-3 rounded-xl bg-surface p-4", children: [_jsx("h3", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.usage.dailyChartTitle" }) }), maxTokens <= 0 ? (_jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.emptyTitle" }), description: intl.formatMessage({
                    id: "settings.usage.emptyDescription",
                }) })) : (_jsxs("div", { className: "px-3 py-3", children: [_jsx("div", { className: "mb-3 flex flex-wrap items-center gap-x-3 gap-y-2", role: "list", children: topModels.map((model, index) => (_jsxs("div", { className: "flex min-w-0 items-center gap-2 text-ui-sm", role: "listitem", children: [_jsx("span", { className: "size-2.5 shrink-0 rounded-sm", style: {
                                        backgroundColor: getAppUsageModelChartColor(index),
                                    } }), _jsx("span", { className: "truncate text-foreground-subtle", children: resolveModelLabel(intl, model.modelId) })] }, model.modelId ?? "__unknown__"))) }), _jsx(ChartContainer, { config: chartConfig, className: "h-60 w-full", children: _jsxs(LineChart, { accessibilityLayer: true, data: chartData, margin: APP_USAGE_TREND_CHART_MARGIN, children: [_jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, interval: 0, minTickGap: 0, tickMargin: 8, tickFormatter: shouldShowAxisLabel }), _jsx(YAxis, { hide: true, domain: [0, maxTokens] }), _jsx(ChartTooltip, { cursor: false, content: tooltipContent }), modelKeys.map((model) => (_jsx(Line, { dataKey: model.key, type: "monotone", stroke: `var(--color-${model.key})`, strokeWidth: 2, dot: false, activeDot: { r: 4 } }, model.key)))] }) })] }))] }));
}
//# sourceMappingURL=AppUsageDailyModelTrendChart.js.map