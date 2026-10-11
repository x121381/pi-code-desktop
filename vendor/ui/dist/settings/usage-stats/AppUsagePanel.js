import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RefreshCcw } from "lucide-react";
import { Fragment, lazy, useState } from "react";
import { APP_USAGE_RANGES } from "@zcode/shared";
import { Button } from "../../components/ui/button.js";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { useAppUsageStats } from "../../hooks/useUsageStats.js";
import { UsageChartLoadBoundary } from "../../settings/usage-stats/UsageChartLoadBoundary.js";
import { UsageHeatmap } from "../../settings/usage-stats/UsageHeatmap.js";
import { UsageStatsErrorNotice } from "../../settings/usage-stats/UsageStatsErrorNotice.js";
import { USAGE_STATS_TABS_LIST_CLASS, USAGE_STATS_TABS_TRIGGER_CLASS, UsageEmptyState, formatCompactNumber, formatSummaryCompactTokenUsage, } from "../../settings/usage-stats/usageStatsUiParts.js";
// Recharts 会在模块初始化阶段触发 decimal.js-light 的 LN10 校验，
// 在 Electron Linux 容器里会阻断整个 renderer 启动。图表按需加载后，
// 普通启动和 e2e 首页不会被 Usage 页图表依赖影响，打开 Usage 时也由局部边界隔离。
const AppUsageDailyModelTrendChart = lazy(() => import("../../settings/usage-stats/AppUsageDailyModelTrendChart.js").then((module) => ({
    default: module.AppUsageDailyModelTrendChart,
})));
const AppUsageModelUsagePieChart = lazy(() => import("../../settings/usage-stats/AppUsageModelUsagePieChart.js").then((module) => ({
    default: module.AppUsageModelUsagePieChart,
})));
export function AppUsagePanel() {
    const { intl, locale } = useZCodeIntl();
    const [range, setRange] = useState("7d");
    const { snapshot: lifetimeSnapshot, refresh: refreshLifetime } = useAppUsageStats("all");
    const { snapshot, loading, error, refresh } = useAppUsageStats(range);
    if (loading && !snapshot) {
        return (_jsxs("div", { className: "space-y-5", children: [_jsx(AppUsageLifetimeSummaryStrip, { snapshot: lifetimeSnapshot }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.usage.appUsageRangeTitle" }) }), _jsx(AppUsageRangeTabs, { range: range, onRangeChange: setRange })] }), _jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.loadingTitle" }), description: intl.formatMessage({
                        id: "settings.usage.appUsageLoadingDescription",
                    }) })] }));
    }
    if (!snapshot) {
        return (_jsxs("div", { className: "space-y-5", children: [_jsx(AppUsageLifetimeSummaryStrip, { snapshot: lifetimeSnapshot }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.usage.appUsageRangeTitle" }) }), _jsx(AppUsageRangeTabs, { range: range, onRangeChange: setRange })] }), error ? _jsx(UsageStatsErrorNotice, { error: error }) : null, _jsx(UsageEmptyState, { title: intl.formatMessage({ id: "settings.usage.emptyTitle" }), description: intl.formatMessage({
                        id: "settings.usage.emptyDescription",
                    }) })] }));
    }
    return (_jsxs("div", { className: "space-y-5", children: [_jsx(AppUsageLifetimeSummaryStrip, { snapshot: lifetimeSnapshot }), lifetimeSnapshot?.heatmap.weeks.length ? (_jsx(UsageHeatmap, { locale: locale, intl: intl, weeks: lifetimeSnapshot.heatmap.weeks })) : null, _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "settings.usage.appUsageRangeTitle" }) }), _jsx(AppUsageRangeTabs, { range: range, onRangeChange: setRange })] }), error ? _jsx(UsageStatsErrorNotice, { error: error }) : null, _jsx(UsageChartLoadBoundary, { scope: "settings.usage.app-daily-model-chart", resetKeys: [snapshot.range, snapshot.generatedAt], loadingDescription: intl.formatMessage({
                    id: "settings.usage.appUsageLoadingDescription",
                }), children: _jsx(AppUsageDailyModelTrendChart, { snapshot: snapshot }) }), _jsx(UsageChartLoadBoundary, { scope: "settings.usage.app-model-pie-chart", resetKeys: [snapshot.range, snapshot.generatedAt, "model-pie"], loadingDescription: intl.formatMessage({
                    id: "settings.usage.appUsageLoadingDescription",
                }), children: _jsx(AppUsageModelUsagePieChart, { snapshot: snapshot }) }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "h-8 rounded-md bg-background", onClick: () => {
                        void Promise.all([refresh(), refreshLifetime()]);
                    }, children: [_jsx(RefreshCcw, { className: "size-3.5" }), intl.formatMessage({ id: "settings.usage.refresh" })] }) })] }));
}
export function AppUsageLifetimeSummaryStrip({ snapshot }) {
    const { intl, locale } = useZCodeIntl();
    const items = [
        {
            label: intl.formatMessage({ id: "settings.usage.lifetimeTotalTokens" }),
            value: snapshot
                ? formatSummaryCompactTokenUsage(locale, snapshot.summary.totalTokens)
                : "--",
        },
        {
            label: intl.formatMessage({ id: "settings.usage.lifetimePeakTokens" }),
            value: snapshot
                ? formatSummaryCompactTokenUsage(locale, snapshot.summary.peakDayTokens)
                : "--",
        },
        {
            label: intl.formatMessage({ id: "settings.usage.longestSession" }),
            value: snapshot ? formatAppUsageDuration(snapshot.summary.longestSessionMs, intl) : "--",
        },
        {
            label: intl.formatMessage({ id: "settings.usage.currentStreak" }),
            value: snapshot ? formatAppUsageDays(snapshot.summary.currentStreakDays, intl, locale) : "--",
        },
        {
            label: intl.formatMessage({ id: "settings.usage.longestStreak" }),
            value: snapshot ? formatAppUsageDays(snapshot.summary.longestStreakDays, intl, locale) : "--",
        },
    ];
    return (_jsx("section", { className: "flex flex-col overflow-hidden rounded-xl bg-surface sm:flex-row sm:items-center", children: items.map((item, index) => (_jsxs(Fragment, { children: [index > 0 ? (_jsx("div", { "aria-hidden": "true", className: "hidden h-7 w-px bg-border sm:block" })) : null, _jsxs("div", { className: "min-w-0 flex-1 px-4 py-3 text-center", children: [_jsx("div", { className: "truncate text-ui-lg font-medium text-foreground", children: item.value }), _jsx("div", { className: "mt-1 truncate text-ui-base text-foreground-subtle", children: item.label })] })] }, item.label))) }));
}
function formatAppUsageDays(days, intl, locale) {
    return `${formatCompactNumber(locale, days)} ${intl.formatMessage({
        id: "settings.usage.duration.day",
    })}`;
}
export function formatAppUsageDuration(durationMs, intl) {
    const totalMinutes = Math.max(0, Math.floor(durationMs / 60_000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days > 0) {
        parts.push(`${days} ${intl.formatMessage({ id: "settings.usage.duration.day" })}`);
    }
    if (hours > 0) {
        parts.push(`${hours} ${intl.formatMessage({ id: "settings.usage.duration.hour" })}`);
    }
    if (minutes > 0 || parts.length === 0) {
        parts.push(`${minutes} ${intl.formatMessage({ id: "settings.usage.duration.minute" })}`);
    }
    return parts.join(" ");
}
function AppUsageRangeTabs({ range, onRangeChange, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(Tabs, { value: range, onValueChange: (value) => onRangeChange(value), className: "shrink-0", children: _jsx(TabsList, { className: USAGE_STATS_TABS_LIST_CLASS, children: APP_USAGE_RANGES.filter((option) => option !== "all").map((option) => (_jsx(TabsTrigger, { value: option, className: USAGE_STATS_TABS_TRIGGER_CLASS, children: intl.formatMessage({ id: `settings.usage.range.${option}` }) }, option))) }) }));
}
//# sourceMappingURL=AppUsagePanel.js.map