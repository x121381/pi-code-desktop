import type { ApiClient, CodingPlanRegularTpsRequest, CodingPlanUsageRequest, CodingPlanUsageSnapshot, CodingPlanResetOpportunityRequest, CodingPlanResetOpportunityResult, CodingPlanResetScopeRequest, CodingPlanResetStatusSnapshot, CodingPlanResetUseRequest, CodingPlanResetUseResult, UsageEntitlementRequest, UsageEntitlementSnapshot, UsageStatsRequest, UsageStatsSnapshot } from "@zcode/shared";
import type { ProviderFamilyDomain } from "@zcode/shared";
import type { ICredentialService } from "../../credential/credential.js";
import type { IAccountRequestAuthService } from "../../model-provider/accountRequestAuthService.js";
import { type OfficialMcpCredentialSource } from "./zcodeMcpQuotaProvider.js";
export interface UsageApiAuthorizationRequest {
    readonly preferredProviderId?: string;
    readonly requirePreferredProvider: boolean;
}
export interface UsageApiAuthorization {
    readonly authorization: string;
    readonly quotaUrl: string;
    readonly provider: ResolvedQuotaAuthorization["provider"];
}
interface BigModelUsageQuotaProviderOptions {
    apiClient: ApiClient;
    accountRequestAuthService: Pick<IAccountRequestAuthService, "resolveAccessCurrent" | "resolveCurrent" | "assertCurrent">;
    resolveApiAuthorization?: (request: UsageApiAuthorizationRequest) => Promise<UsageApiAuthorization | null>;
    credentialService?: Pick<ICredentialService, "load">;
    env?: NodeJS.ProcessEnv;
    /**
     * 官方 Server MCP 的凭证来源。缺省时 entitlement 快照的 mcpQuota 恒为 null，
     * 既有装配（含单测）无需改动即可保持原行为。
     */
    officialMcpCredentialSource?: OfficialMcpCredentialSource;
}
interface ResolvedQuotaAuthorization {
    authorization: string;
    quotaUrl: string;
    teamContext: TeamPlanContext | null;
    provider: {
        id: string;
        name: string;
    };
}
interface TeamPlanContext {
    organizationId: string;
    projectId: string;
    family: ProviderFamilyDomain;
}
export declare class BigModelUsageQuotaProvider {
    private readonly apiClient;
    private readonly accountRequestAuthService;
    private readonly resolveApiAuthorization?;
    private readonly credentialService?;
    private readonly env;
    private readonly officialMcpCredentialSource?;
    constructor(options: BigModelUsageQuotaProviderOptions);
    getSnapshot(): Promise<UsageEntitlementSnapshot>;
    getSnapshotForRequest(request?: UsageEntitlementRequest): Promise<UsageEntitlementSnapshot>;
    private resolveRequestAccountAccess;
    /**
     * 读取官方 Server MCP 额度。仅 Coding Plan provider 会发起：
     * 环境变量 key、普通 API Key provider 与 Start Plan 都没有该权益。
     */
    private fetchMcpQuota;
    private getStartPlanSnapshot;
    private resolveStartPlanAuthorization;
    getUsageStatsSnapshot(request: UsageStatsRequest): Promise<UsageStatsSnapshot>;
    getCodingPlanResetStatus(request: CodingPlanResetScopeRequest): Promise<CodingPlanResetStatusSnapshot>;
    useCodingPlanReset(request: CodingPlanResetUseRequest): Promise<CodingPlanResetUseResult>;
    requestCodingPlanResetOpportunity(request: CodingPlanResetOpportunityRequest): Promise<CodingPlanResetOpportunityResult>;
    markCodingPlanResetHistoryRead(request: CodingPlanResetScopeRequest): Promise<void>;
    private resolveCodingPlanResetAuthorization;
    getCodingPlanUsageSnapshot(request: CodingPlanUsageRequest): Promise<CodingPlanUsageSnapshot>;
    getCodingPlanRegularTps(request: CodingPlanRegularTpsRequest): Promise<number | undefined>;
    private resolveAuthorization;
    private fetchQuota;
    private fetchModelUsage;
    private fetchToolUsage;
    private fetchCreditUsageActivity;
    private fetchCreditUsageDetail;
    private fetchModelPerformanceDay;
}
export {};
//# sourceMappingURL=bigmodelUsageQuotaProvider.d.ts.map