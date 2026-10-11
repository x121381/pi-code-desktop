import type { AppUsageSnapshot } from "@zcode/shared";
import { type ChartConfig } from "@/components/ui/chart.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare const APP_USAGE_TREND_CHART_MARGIN: {
    readonly top: 8;
    readonly right: 24;
    readonly left: 24;
};
type DailyModelChartRow = {
    label: string;
    tooltipLabel: string;
    total: number;
} & Record<string, number | string>;
type UsageIntl = ReturnType<typeof useZCodeIntl>["intl"];
export declare function filterDailyModelTooltipPayload<T extends {
    value?: unknown;
}>(payload: readonly T[] | undefined): T[];
export declare function resolveDailyModelTooltipTokenParts(locale: string, value: unknown, tokenUnit: string): {
    number: string;
    unit: string;
};
export declare function buildAppUsageDailyModelChartViewModel({ intl, locale, snapshot, }: {
    intl: UsageIntl;
    locale: string;
    snapshot: AppUsageSnapshot;
}): {
    topModels: {
        modelId: string | null;
        totalTokens: number;
        inputTokens: number;
        outputTokens: number;
        requestCount: number;
        share: number;
    }[];
    modelKeys: {
        modelId: string | null;
        key: string;
        color: string;
        label: string;
    }[];
    chartConfig: ChartConfig;
    chartData: DailyModelChartRow[];
    maxTokens: number;
};
export declare function AppUsageDailyModelTrendChart({ snapshot }: {
    snapshot: AppUsageSnapshot;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AppUsageDailyModelTrendChart.d.ts.map