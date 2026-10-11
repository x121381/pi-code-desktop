import { useCallback, useEffect, useRef, useState } from "react";
import { resolveProviderAvailabilityState } from "@/lib/modelProviderAvailability.js";
import { logger } from "@/logger.js";
export function useProviderAvailabilityLoginEntryGuard({ enabled = true, user, isRestoringOAuthSession, providerFamilyDomain, modelSelectionView, modelSelectionError, refreshProviderState, readModelSelectionView, setLoginEntryOpen, }) {
    const [startupCheckCompleted, setStartupCheckCompleted] = useState(!enabled);
    const startupCheckCompletedRef = useRef(false);
    const providerAvailabilityHydrated = modelSelectionView !== null;
    const syncLoginEntryWithProviderAvailability = useCallback(async (options) => {
        if (!enabled) {
            return {
                hasUsableProvider: true,
                providerCount: modelSelectionView?.providers.length ?? 0,
                shouldOpenLoginEntry: false,
            };
        }
        if (options.forceRefresh) {
            await refreshProviderState();
        }
        const refreshedView = options.forceRefresh
            ? await readModelSelectionView()
            : modelSelectionView;
        const availability = resolveProviderAvailabilityState({ modelSelectionView: refreshedView });
        const { hasUsableProvider, providerCount } = availability;
        const shouldOpenLoginEntry = !providerFamilyDomain || (!user && !hasUsableProvider);
        // 未登录且没有可用模型配置时必须引导用户连接账号或填写 API Key。
        // 启动检查、API Key 设置回流等入口统一走这里，避免各处复制判断后语义分叉。
        logger.info("[Root] provider 可用性登录入口守卫完成检查", {
            reason: options.reason,
            source: availability.source,
            providerCount,
            hasUsableProvider,
            hasUser: Boolean(user),
            hasProviderFamilyDomain: Boolean(providerFamilyDomain),
            shouldOpenLoginEntry,
        });
        setLoginEntryOpen(shouldOpenLoginEntry);
        return {
            hasUsableProvider,
            providerCount,
            shouldOpenLoginEntry,
        };
    }, [
        enabled,
        modelSelectionView,
        providerFamilyDomain,
        refreshProviderState,
        readModelSelectionView,
        setLoginEntryOpen,
        user,
    ]);
    useEffect(() => {
        if (!enabled) {
            startupCheckCompletedRef.current = true;
            setStartupCheckCompleted(true);
            return;
        }
        if (modelSelectionError) {
            // 首次读取失败不能伪装成“没有 Provider”，也不能让启动门禁永久停在 loading。
            logger.error("[Root] provider 可用性读取失败，结束启动门禁等待", modelSelectionError);
            startupCheckCompletedRef.current = true;
            setStartupCheckCompleted(true);
            return;
        }
        if (startupCheckCompletedRef.current ||
            isRestoringOAuthSession ||
            !providerAvailabilityHydrated) {
            return;
        }
        startupCheckCompletedRef.current = true;
        void syncLoginEntryWithProviderAvailability({
            reason: "startup",
        }).finally(() => {
            setStartupCheckCompleted(true);
        });
    }, [
        enabled,
        isRestoringOAuthSession,
        modelSelectionError,
        providerAvailabilityHydrated,
        syncLoginEntryWithProviderAvailability,
    ]);
    return {
        startupCheckCompleted,
        syncLoginEntryWithProviderAvailability,
    };
}
//# sourceMappingURL=useProviderAvailabilityLoginEntryGuard.js.map