import type { CodingPlanQuotaResetDialogConfig, CodingPlanQuotaResetDialogUsageItem } from "@/components/coding-plan-quota-reset/CodingPlanQuotaResetDialog.js";
import type { useCodingPlanQuotaResetUi } from "@/hooks/useCodingPlanQuotaResetUi.js";
type CodingPlanQuotaResetUi = ReturnType<typeof useCodingPlanQuotaResetUi>;
export declare function buildCodingPlanQuotaResetDialogConfig(params: {
    fiveHourEnabled: boolean;
    resetUi: CodingPlanQuotaResetUi;
    usageItems: CodingPlanQuotaResetDialogUsageItem[];
    weekEnabled: boolean;
}): CodingPlanQuotaResetDialogConfig;
export {};
//# sourceMappingURL=buildCodingPlanQuotaResetDialogConfig.d.ts.map