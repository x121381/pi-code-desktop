export interface SmoothMetricDisplayInput {
    currentValue: number;
    elapsedMs: number;
    linesPerSecond: number;
    targetValue: number;
}
export declare function normalizeSmoothMetricTarget(value: number | string): number | null;
export declare function estimateSmoothMetricLinesPerSecond(input: {
    elapsedMs: number;
    nextTargetValue: number;
    previousLinesPerSecond: number;
    previousTargetValue: number;
}): number;
export declare function resolveNextSmoothMetricDisplay(input: SmoothMetricDisplayInput): number;
export declare function SmoothMetricValue({ active, className, metricKey, value, }: {
    active?: boolean;
    className?: string;
    metricKey?: string;
    value: number | string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=smooth-metric-value.d.ts.map