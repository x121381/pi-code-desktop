import type { CodingPlanModelData, CodingPlanToolData, CodingPlanUsageDetailMetric, CodingPlanUsageDetailSubject } from "@zcode/shared";
type CodingPlanLineChartSeries = Array<{
    name: string;
    values: number[];
    breakdown?: {
        cachedInput: number[];
        uncachedInput: number[];
        output: number[];
    };
}>;
export declare function buildCodingPlanModelLineChartSeries(modelDataList: CodingPlanModelData[]): CodingPlanLineChartSeries;
export declare function buildCodingPlanToolLineChartSeries(toolDataList: CodingPlanToolData[]): CodingPlanLineChartSeries;
export declare function buildCodingPlanUsageDetailLineChartSeries(params: {
    metric: CodingPlanUsageDetailMetric;
    subject: CodingPlanUsageDetailSubject;
    modelDataList: CodingPlanModelData[];
    toolDataList: CodingPlanToolData[];
}): CodingPlanLineChartSeries;
export {};
//# sourceMappingURL=codingPlanUsageChartSeries.d.ts.map