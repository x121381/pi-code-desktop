import { useCallback } from "react";
import { logger } from "../logger.js";
export async function refreshRootProviderState(services) {
    try {
        // Provider Runtime 统一刷新 Config、Account Source 与 Registry；Root 不再维护旧快照。
        await services.providerSettingsService.refresh("root-provider-state-refresh");
    }
    catch (error) {
        logger.error("[Root] 刷新 Provider Runtime 失败:", error);
    }
}
export function useRootProviderStateRefresh(services) {
    return useCallback(() => refreshRootProviderState(services), [services.providerSettingsService]);
}
//# sourceMappingURL=useRootProviderStateRefresh.js.map