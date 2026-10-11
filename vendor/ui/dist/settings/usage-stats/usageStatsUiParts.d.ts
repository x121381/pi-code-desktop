import type { AppUsageRange } from "@zcode/shared";
import { Flame } from "lucide-react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare const RANGE_OPTIONS: AppUsageRange[];
export declare const USAGE_STATS_TABS_LIST_CLASS = "flex h-7 rounded-full bg-surface p-0.5 group-data-horizontal/tabs:h-7";
export declare const USAGE_STATS_TABS_TRIGGER_CLASS = "h-6 flex-none justify-center rounded-full border-transparent bg-transparent px-2.5 py-0 text-ui-sm font-medium text-foreground-subtle data-active:border-transparent data-active:bg-background data-active:text-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-background";
export declare function formatCompactNumber(locale: string, value: number): string;
export declare function formatCompactTokenUsage(locale: string, value: number): string;
export declare function formatSummaryCompactTokenUsage(locale: string, value: number): string;
export declare function formatPercent(locale: string, value: number): string;
export declare function formatDay(locale: string, dateKey: string | null): string;
export declare function formatFullDay(locale: string, dateKey: string | null): string;
export declare function formatMonth(locale: string, dateKey: string): string;
export declare function resolveModelLabel(intl: ReturnType<typeof useZCodeIntl>["intl"], modelId: string | null): string;
export declare function UsageMetricCard({ icon: Icon, label, value, helper, helperPlacement, valueSize, }: {
    icon: typeof Flame;
    label: string;
    value: string;
    helper?: string;
    helperPlacement?: "below" | "inline";
    valueSize?: "sm" | "base" | "lg" | "xl";
}): import("react/jsx-runtime").JSX.Element;
export declare function UsageEmptyState({ title, description, }: {
    title: string;
    description: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=usageStatsUiParts.d.ts.map