import type { AppUsageSnapshot } from "@zcode/shared";
import type { ChartConfig } from "@/components/ui/chart.js";
interface UsageIntl {
    formatMessage: (descriptor: {
        id: string;
    }) => string;
}
export interface AppUsageModelPieSlice {
    key: string;
    label: string;
    color: string;
    totalTokens: number;
    share: number;
}
export declare function buildAppUsageModelPieChartViewModel({ intl, snapshot, }: {
    intl: UsageIntl;
    snapshot: AppUsageSnapshot;
}): {
    chartConfig: ChartConfig;
    chartData: AppUsageModelPieSlice[];
    totalModelTokens: number;
};
export {};
//# sourceMappingURL=appUsageModelPieChartViewModel.d.ts.map