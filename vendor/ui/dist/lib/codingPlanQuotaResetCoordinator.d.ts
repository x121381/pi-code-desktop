import type { IUsageStatsService } from "@zcode/services";
import type { CodingPlanResetOpportunityResult, CodingPlanResetScopeRequest } from "@zcode/shared";
type RefreshCallback = () => unknown | Promise<unknown>;
interface CoordinatorParams {
    service: IUsageStatsService;
    authSessionSeq: number;
    scope: CodingPlanResetScopeRequest;
}
interface PollingSubscriptionParams extends CoordinatorParams {
    refresh: RefreshCallback;
}
export declare function subscribeCodingPlanQuotaResetPolling(params: PollingSubscriptionParams): () => void;
export declare function requestCodingPlanResetOpportunityWhenDue(params: CoordinatorParams): Promise<CodingPlanResetOpportunityResult | null>;
export {};
//# sourceMappingURL=codingPlanQuotaResetCoordinator.d.ts.map