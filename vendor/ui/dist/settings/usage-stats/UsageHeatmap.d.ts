import type { AppUsageHeatmapWeek } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
type HeatmapCountMetric = "turns" | "tools";
export declare function UsageHeatmap({ locale, intl, weeks, countMetric, }: {
    locale: string;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    weeks: AppUsageHeatmapWeek[];
    /** Coding Plan 远端只提供 mcpCalls；App Usage 才提供真实消息轮数。 */
    countMetric?: HeatmapCountMetric;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=UsageHeatmap.d.ts.map