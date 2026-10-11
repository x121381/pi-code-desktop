import { type ZCodeBackgroundTaskControlItem } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare function formatBackgroundTaskElapsedLabel(elapsedMs: number, formatMessage: ReturnType<typeof useZCodeIntl>["intl"]["formatMessage"]): string;
export declare function BackgroundTaskElapsedLabel({ className, job, now, }: {
    className?: string;
    job: ZCodeBackgroundTaskControlItem;
    now?: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BackgroundTaskElapsedLabel.d.ts.map