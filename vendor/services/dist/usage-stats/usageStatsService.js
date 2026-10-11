import { isCodingPlanModelProviderId } from "@zcode/shared";
import { BigModelUsageQuotaProvider, } from "./providers/bigmodelUsageQuotaProvider.js";
const CODING_PLAN_REGULAR_TPS_CACHE_MS = 5 * 60_000;
function isCodingPlanProviderId(providerId) {
    return Boolean(providerId && isCodingPlanModelProviderId(providerId));
}
export function createUsageStatsService(dependencies) {
    const quotaProvider = new BigModelUsageQuotaProvider({
        apiClient: dependencies.apiClient,
        accountRequestAuthService: dependencies.accountRequestAuthService,
        resolveApiAuthorization: dependencies.resolveApiAuthorization,
        credentialService: dependencies.credentialService,
        env: dependencies.env,
        ...(dependencies.officialMcpCredentialSource
            ? { officialMcpCredentialSource: dependencies.officialMcpCredentialSource }
            : {}),
    });
    const regularTpsCache = new Map();
    const regularTpsInFlight = new Map();
    function regularTpsCacheKey(request) {
        return JSON.stringify([
            request.preferredProviderId,
            // Team scope（organizationId/projectId）已内含在 accountAccess 里，整体入 key，
            // 避免同一 provider 下不同账号或不同团队项目共用同一条 TPS 缓存。
            request.accountAccess,
            request.timeZone ?? null,
        ]);
    }
    return {
        async getAppUsageSnapshot(request) {
            // App Usage 现读取 agent 数据库真实统计（model_usage/turn_usage/tool_usage），
            // 经 ZCode Protocol usage/stats 取回。不再读本地 session JSON 估算。
            return dependencies.zcodeAgentService.getAppUsageStats({
                range: request.range,
                timeZone: request.timeZone,
            });
        },
        async getCodingPlanUsageSnapshot(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                // Coding Plan 页面只允许预置的 Z.AI/BigModel Coding Plan 账号。
                // 普通 provider id 不能进入 monitor 链路，避免误读 API Key 或环境变量。
                throw new Error("no_bigmodel_api_key");
            }
            return quotaProvider.getCodingPlanUsageSnapshot(request);
        },
        async getCodingPlanRegularTps(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                throw new Error("no_bigmodel_api_key");
            }
            const key = regularTpsCacheKey(request);
            const cached = regularTpsCache.get(key);
            if (cached && cached.expiresAt > Date.now())
                return cached.value;
            const existing = regularTpsInFlight.get(key);
            if (existing)
                return existing;
            const requestPromise = quotaProvider
                .getCodingPlanRegularTps(request)
                .then((value) => {
                regularTpsCache.set(key, {
                    expiresAt: Date.now() + CODING_PLAN_REGULAR_TPS_CACHE_MS,
                    value,
                });
                return value;
            })
                .finally(() => {
                regularTpsInFlight.delete(key);
            });
            regularTpsInFlight.set(key, requestPromise);
            return requestPromise;
        },
        async getCodingPlanResetStatus(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                throw new Error("no_bigmodel_api_key");
            }
            return quotaProvider.getCodingPlanResetStatus(request);
        },
        async requestCodingPlanResetOpportunity(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                throw new Error("no_bigmodel_api_key");
            }
            return quotaProvider.requestCodingPlanResetOpportunity(request);
        },
        async useCodingPlanReset(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                throw new Error("no_bigmodel_api_key");
            }
            return quotaProvider.useCodingPlanReset(request);
        },
        async markCodingPlanResetHistoryRead(request) {
            if (!isCodingPlanProviderId(request.preferredProviderId)) {
                throw new Error("no_bigmodel_api_key");
            }
            await quotaProvider.markCodingPlanResetHistoryRead(request);
        },
        async getSnapshot(request) {
            // App Usage 已迁移到 getAppUsageSnapshot（agent 数据库）。getSnapshot 仅服务 Coding Plan monitor 链路。
            // 任何 monitor 失败都不能回退本地数据，保持数据源隔离。
            return quotaProvider.getUsageStatsSnapshot(request);
        },
        async getEntitlementSnapshot(request = {}) {
            return quotaProvider.getSnapshotForRequest(request);
        },
    };
}
//# sourceMappingURL=usageStatsService.js.map