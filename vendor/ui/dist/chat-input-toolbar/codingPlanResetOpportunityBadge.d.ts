import type { CodingPlanUsageRemainingState } from "@/CodingPlanUsageRemainingPanel.js";
import type { CodingPlanQuotaResetUiController } from "@/hooks/useCodingPlanQuotaResetUi.js";
export declare function resolveChatCodingPlanResetOpportunityBadge(state: CodingPlanUsageRemainingState | null, resetUi: Pick<CodingPlanQuotaResetUiController, "entry" | "opportunityVisible" | "week">): {
    count: number;
    expiresAt: number | null;
    visible: boolean;
};
//# sourceMappingURL=codingPlanResetOpportunityBadge.d.ts.map