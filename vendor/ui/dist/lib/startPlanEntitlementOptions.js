import { resolveModelProviderFamilySpecByProviderId } from "@zcode/shared";
import { resolveAccountProviderInspectionAccess } from "@/lib/accountProviderAccess.js";
import { buildUsageEntitlementCacheKey } from "@/lib/usageEntitlementCache.js";
/** 设置、输入框与提交推荐复用原权益缓存；账号身份由 Account Source 的连接指纹提供。 */
export function buildStartPlanEntitlementOptions(view, providerId) {
    const inspection = resolveAccountProviderInspectionAccess(view, providerId);
    const provider = view?.providers.find((entry) => entry.providerId === providerId);
    const family = resolveModelProviderFamilySpecByProviderId(providerId);
    const fingerprint = inspection
        ? JSON.stringify([provider?.accountState?.connectionKey ?? view?.revision, inspection])
        : "";
    return {
        enabled: Boolean(inspection && family),
        preferredProviderId: providerId,
        accountAccess: family
            ? { type: "zhipu-account", family: family.id, planKind: "start-plan" }
            : undefined,
        includeSubscription: true,
        allowDisabledPreferredProvider: true,
        requirePreferredProvider: true,
        allowEnvApiKey: false,
        cacheKey: buildUsageEntitlementCacheKey({ providerId, providerFingerprint: fingerprint }),
        refreshOnMount: false,
    };
}
//# sourceMappingURL=startPlanEntitlementOptions.js.map