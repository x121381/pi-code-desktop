import type { ReactNode } from "react";
import type { StartPlanPreviewConfig } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export interface StartPlanEntitlementSummary {
    grantUnitsLabel: string;
    detailsDescription: string;
    unitLabel: string;
}
export declare function StartPlanCard({ preview, actions, }: {
    preview: StartPlanPreviewConfig;
    actions?: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function resolveStartPlanEntitlementSummary(preview: StartPlanPreviewConfig, intl: ReturnType<typeof useZCodeIntl>["intl"], locale: string): StartPlanEntitlementSummary | null;
//# sourceMappingURL=StartPlanCard.d.ts.map