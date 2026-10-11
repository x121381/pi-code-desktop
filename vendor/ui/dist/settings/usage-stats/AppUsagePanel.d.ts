import type { AppUsageSnapshot } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare function AppUsagePanel(): import("react/jsx-runtime").JSX.Element;
export declare function AppUsageLifetimeSummaryStrip({ snapshot }: {
    snapshot: AppUsageSnapshot | null;
}): import("react/jsx-runtime").JSX.Element;
export declare function formatAppUsageDuration(durationMs: number, intl: ReturnType<typeof useZCodeIntl>["intl"]): string;
//# sourceMappingURL=AppUsagePanel.d.ts.map