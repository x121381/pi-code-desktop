import { BUILTIN_MODEL_PROVIDER_IDS, } from "@zcode/shared";
import { logger } from "@/logger.js";
const SIDEBAR_USAGE_CODING_PLAN_PROVIDER_STORAGE_KEY = "zcode:sidebar-usage-coding-plan-provider";
const SIDEBAR_USAGE_CODING_PLAN_PROVIDER_IDS = [
    BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan,
    BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan,
    BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan,
    BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan,
];
function isSidebarUsageCodingPlanProviderId(providerId) {
    return SIDEBAR_USAGE_CODING_PLAN_PROVIDER_IDS.includes(providerId);
}
function isSidebarUsageCodingPlanSourceId(sourceId) {
    return (isSidebarUsageCodingPlanProviderId(sourceId) ||
        sourceId?.startsWith("team:") === true);
}
function getLocalStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch (error) {
        // WebView 隐私模式或移动端远控容器可能禁用 localStorage。
        // 这里只影响 footer 的 provider 选择记忆，失败时降级为本次默认选择即可。
        logger.warn("[sidebarUsageCodingPlanProviderPreference] localStorage 不可用", {
            error: error instanceof Error ? error.message : String(error),
        });
        return null;
    }
}
export function readSidebarUsageCodingPlanProviderPreference() {
    const value = readSidebarUsageCodingPlanSourcePreference();
    return isSidebarUsageCodingPlanProviderId(value) ? value : undefined;
}
export function readSidebarUsageCodingPlanSourcePreference() {
    const storage = getLocalStorage();
    if (!storage) {
        return undefined;
    }
    try {
        const value = storage.getItem(SIDEBAR_USAGE_CODING_PLAN_PROVIDER_STORAGE_KEY);
        return isSidebarUsageCodingPlanSourceId(value) ? value : undefined;
    }
    catch (error) {
        logger.warn("[sidebarUsageCodingPlanProviderPreference] 读取偏好失败", {
            error: error instanceof Error ? error.message : String(error),
        });
        return undefined;
    }
}
export function writeSidebarUsageCodingPlanProviderPreference(providerId) {
    const storage = getLocalStorage();
    if (!storage) {
        return;
    }
    try {
        storage.setItem(SIDEBAR_USAGE_CODING_PLAN_PROVIDER_STORAGE_KEY, providerId);
    }
    catch (error) {
        logger.warn("[sidebarUsageCodingPlanProviderPreference] 写入偏好失败", {
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
//# sourceMappingURL=sidebarUsageCodingPlanProviderPreference.js.map