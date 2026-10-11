import type { CodingPlanUsageGranularity } from "@zcode/shared";
export type CodingPlanBarChartSeries = {
    color?: string;
    name: string;
    values: number[];
    breakdown?: {
        cachedInput: number[];
        uncachedInput: number[];
        output: number[];
    };
};
export declare function calculateCodingPlanBarChartMaxValue(series: CodingPlanBarChartSeries[], xTimeLength: number): number;
export declare function CodingPlanUsageBarChart({ emptyDescription, granularity, series, valueKind, xTime, }: {
    emptyDescription: string;
    granularity: CodingPlanUsageGranularity;
    series: CodingPlanBarChartSeries[];
    valueKind?: "count" | "credit" | "speed" | "token";
    xTime: string[];
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanUsageBarChart.d.ts.map