import type { CodingPlanUsageGranularity } from "@zcode/shared";
export declare function CodingPlanUsageLineChart({ xTime, granularity, series, emptyDescription, valueKind, showLegend, }: {
    xTime: string[];
    granularity: CodingPlanUsageGranularity;
    series: Array<{
        name: string;
        values: number[];
    }>;
    emptyDescription: string;
    valueKind?: "count" | "credit" | "speed" | "token";
    showLegend?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanUsageLineChart.d.ts.map