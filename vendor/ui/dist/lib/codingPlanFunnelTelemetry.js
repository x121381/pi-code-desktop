import { BIGMODEL_PROVIDER_ID, BUILTIN_MODEL_PROVIDER_IDS, isZaiCodingPlanProviderId, ZAI_PROVIDER_ID, } from "@zcode/shared";
import { logger } from "../logger.js";
import { reportAppTelemetryEvent } from "../lib/appTelemetry.js";
export function createPurchaseFunnelId() {
    return globalThis.crypto?.randomUUID?.() ?? createFallbackFunnelId();
}
export function createCodingPlanFunnelContext(params) {
    const providerFamily = resolveCodingPlanProviderFamily(params.providerId);
    return {
        purchaseFunnelId: createPurchaseFunnelId(),
        upgradeSource: params.upgradeSource,
        eventRegion: params.eventRegion,
        eventText: params.eventText,
        entryPlanStatus: params.entryPlanState?.entryPlanStatus ?? "unknown",
        entryPlanLevel: params.entryPlanState?.entryPlanLevel ?? "",
        // 入口卡片不是已购套餐全集；只由 Provider 在查询完整后填入权威快照。
        entryPlanList: "",
        purchaseAudience: params.purchaseAudience ?? "",
        providerFamily,
        channel: resolveCodingPlanChannel(providerFamily),
    };
}
export function createIdleTimeCodingPlanFunnelContext(params) {
    return createCodingPlanFunnelContext({
        providerId: params.providerId,
        upgradeSource: "session_idle_time",
        eventRegion: "app.session",
        eventText: params.eventText,
        entryPlanState: params.entryPlanState,
        purchaseAudience: "personal",
    });
}
export function resolveCodingPlanEntryPlanState(params) {
    const rawPlanLevel = params.planLevel?.trim() ?? "";
    const snapshotLevel = params.snapshot?.subscription?.details?.[0]?.productName?.trim() ||
        params.snapshot?.subscription?.details?.[0]?.productId?.trim() ||
        params.snapshot?.quota?.level?.trim() ||
        "";
    const entryPlanLevel = rawPlanLevel || snapshotLevel;
    if (params.snapshot) {
        if (params.snapshot.unavailableReason === "no_plan") {
            return { entryPlanStatus: "no_plan", entryPlanLevel: "" };
        }
        if (params.snapshot.subscription?.details.length) {
            return {
                entryPlanStatus: isStartPlanLevel(entryPlanLevel) ? "start_plan" : "coding_plan",
                entryPlanLevel,
            };
        }
    }
    if (params.displayStatus === "notPurchased") {
        return { entryPlanStatus: "no_plan", entryPlanLevel: "" };
    }
    if (params.displayStatus === "purchased") {
        return {
            entryPlanStatus: isStartPlanLevel(entryPlanLevel) ? "start_plan" : "coding_plan",
            entryPlanLevel,
        };
    }
    if (params.providerId && isStartPlanProviderId(params.providerId) && entryPlanLevel) {
        return { entryPlanStatus: "start_plan", entryPlanLevel };
    }
    return { entryPlanStatus: "unknown", entryPlanLevel: "" };
}
export function resolveCodingPlanEntryPlanStateFromProviderSettings(view) {
    if (!view) {
        return resolveCodingPlanEntryPlanState({});
    }
    const accountProviders = view.providers.filter((provider) => provider.effectiveConfig.access?.type === "zhipu-account" &&
        provider.effectiveConfig.access.entitled === true);
    const codingPlanProvider = accountProviders.find((provider) => provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan ||
        provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan ||
        // Team 同样持有 Coding Plan；不能用包含 Start 的宽泛 helper 判断套餐。
        provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan ||
        provider.providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan);
    if (codingPlanProvider) {
        return resolveCodingPlanEntryPlanState({
            displayStatus: "purchased",
            providerId: codingPlanProvider.providerId,
        });
    }
    const startPlanProvider = accountProviders.find((provider) => isStartPlanProviderId(provider.providerId));
    if (startPlanProvider) {
        return resolveCodingPlanEntryPlanState({
            displayStatus: "purchased",
            providerId: startPlanProvider.providerId,
            planLevel: "start",
        });
    }
    return resolveCodingPlanEntryPlanState({ displayStatus: "notPurchased" });
}
export function reportCodingPlanUpgradeClick(platform, context) {
    if (!platform || !context) {
        return;
    }
    void reportAppTelemetryEvent(platform, {
        eventType: "ck",
        eventRegion: context.eventRegion,
        elementName: "coding_plan_upgrade_ck",
        eventText: context.eventText,
        eventExtraDetail: buildFunnelBaseDetail(context),
    }, "codingPlanFunnelTelemetry");
}
export function buildFunnelBaseDetail(context) {
    return stringifyDetail({
        purchase_funnel_id: context.purchaseFunnelId,
        upgrade_source: context.upgradeSource,
        entry_plan_status: context.entryPlanStatus,
        entry_plan_level: context.entryPlanLevel,
        entry_plan_list: context.entryPlanList,
        purchase_audience: context.purchaseAudience,
        provider_family: context.providerFamily,
        channel: context.channel,
    });
}
export function resolveCodingPlanProviderFamily(providerId) {
    if (providerId === BIGMODEL_PROVIDER_ID ||
        providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan ||
        providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan ||
        providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan) {
        return "bigmodel";
    }
    if (providerId === ZAI_PROVIDER_ID || isZaiCodingPlanProviderId(providerId)) {
        return "zai";
    }
    return "unknown";
}
export function resolveCodingPlanChannel(providerFamily) {
    return { bigmodel: "MaaS", zai: "Z_AI", unknown: "" }[providerFamily];
}
export function stringifyDetail(detail) {
    return Object.fromEntries(Object.entries(detail).map(([key, value]) => [
        key,
        value === undefined || value === null ? "" : String(value),
    ]));
}
function isStartPlanProviderId(providerId) {
    return (providerId === BUILTIN_MODEL_PROVIDER_IDS.zaiStartPlan ||
        providerId === BUILTIN_MODEL_PROVIDER_IDS.bigmodelStartPlan);
}
function isStartPlanLevel(value) {
    return /\bstart\b/i.test(value.trim());
}
function createFallbackFunnelId() {
    logger.warn("[codingPlanFunnelTelemetry] crypto.randomUUID unavailable, using fallback id");
    return `funnel_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
//# sourceMappingURL=codingPlanFunnelTelemetry.js.map