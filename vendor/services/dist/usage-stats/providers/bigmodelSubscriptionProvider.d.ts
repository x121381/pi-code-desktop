import type { ApiClient, ProviderFamilyDomain } from "@zcode/shared";
import { type CodingPlanEntitlement } from "#src/bigmodel/codingPlanEntitlement.js";
import { pickCurrentSubscriptionFromList } from "./bigmodelUsageQuotaMapper.js";
type SubscriptionSummary = NonNullable<ReturnType<typeof pickCurrentSubscriptionFromList>>;
export declare function fetchBigModelSubscriptionSummary(params: {
    apiClient: ApiClient;
    authorization: string;
    quotaUrl: string;
    teamContext?: {
        organizationId: string;
        projectId: string;
        family: ProviderFamilyDomain;
    } | null;
    businessToken?: string | null;
    timeoutMs: number;
}): Promise<CodingPlanEntitlement<SubscriptionSummary>>;
export {};
//# sourceMappingURL=bigmodelSubscriptionProvider.d.ts.map