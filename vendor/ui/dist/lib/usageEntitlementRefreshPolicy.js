import { isStartPlanModelProviderId } from "@zcode/shared";
export const USAGE_ENTITLEMENT_ACCESS_REFRESH_MS = 60_000;
const USAGE_ENTITLEMENT_ERROR_BACKOFF_MS = [30_000, 60_000, 120_000, 300_000];
const entitlementSharedSnapshots = new WeakMap();
const entitlementSubscribers = new WeakMap();
const entitlementFailureBackoff = new WeakMap();
const entitlementAccessRequests = new WeakMap();
// 购买使同一身份的所有旧请求失效，不能仅依赖单个 hook 的 requestVersion。
const entitlementGenerations = new WeakMap();
export function beginSharedEntitlementRequest(params) {
    let generations = entitlementGenerations.get(params.usageStatsService);
    if (!generations) {
        generations = new Map();
        entitlementGenerations.set(params.usageStatsService, generations);
    }
    const generation = (generations.get(params.freshnessKey) ?? 0) + (params.invalidate ? 1 : 0);
    generations.set(params.freshnessKey, generation);
    return {
        requestKey: JSON.stringify([params.freshnessKey, generation]),
        isCurrent: () => generations.get(params.freshnessKey) === generation,
    };
}
function getAccessRequestMap(usageStatsService) {
    let requests = entitlementAccessRequests.get(usageStatsService);
    if (!requests) {
        requests = new Map();
        entitlementAccessRequests.set(usageStatsService, requests);
    }
    return requests;
}
export function shouldDeferSharedEntitlementAccess(params) {
    const requestedAt = getAccessRequestMap(params.usageStatsService).get(params.freshnessKey);
    return (requestedAt !== undefined && params.now - requestedAt < USAGE_ENTITLEMENT_ACCESS_REFRESH_MS);
}
export function recordSharedEntitlementAccess(params) {
    getAccessRequestMap(params.usageStatsService).set(params.freshnessKey, params.now);
}
export function buildEntitlementRequestKey(options) {
    return JSON.stringify({
        ...(options.invalidateBalanceCache ? { invalidateBalanceCache: true } : {}),
        includeSubscription: options.includeSubscription,
        preferredProviderId: options.preferredProviderId ?? "",
        accountAccess: options.accountAccess ?? null,
        allowDisabledPreferredProvider: options.allowDisabledPreferredProvider,
        requirePreferredProvider: options.requirePreferredProvider,
        allowEnvApiKey: options.allowEnvApiKey ?? null,
    });
}
export function buildEntitlementFreshnessKey(params) {
    return JSON.stringify({
        cacheKey: params.cacheKey,
        request: JSON.parse(buildEntitlementRequestKey(params.options)),
    });
}
function getSharedSnapshotMap(usageStatsService) {
    let snapshots = entitlementSharedSnapshots.get(usageStatsService);
    if (!snapshots) {
        snapshots = new Map();
        entitlementSharedSnapshots.set(usageStatsService, snapshots);
    }
    return snapshots;
}
function getFailureBackoffMap(usageStatsService) {
    let failures = entitlementFailureBackoff.get(usageStatsService);
    if (!failures) {
        failures = new Map();
        entitlementFailureBackoff.set(usageStatsService, failures);
    }
    return failures;
}
export function readSharedEntitlementSnapshot(params) {
    return getSharedSnapshotMap(params.usageStatsService).get(params.freshnessKey)?.snapshot ?? null;
}
export function publishSharedEntitlementSnapshot(params) {
    getSharedSnapshotMap(params.usageStatsService).set(params.freshnessKey, {
        failureCount: 0,
        nextAllowedAt: 0,
        snapshot: params.snapshot,
        updatedAt: Date.now(),
    });
    getFailureBackoffMap(params.usageStatsService).delete(params.freshnessKey);
    const listeners = entitlementSubscribers.get(params.usageStatsService)?.get(params.freshnessKey);
    if (!listeners) {
        return;
    }
    for (const listener of listeners) {
        listener(params.snapshot);
    }
}
export function recordSharedEntitlementFailure(params) {
    const snapshots = getSharedSnapshotMap(params.usageStatsService);
    const failures = getFailureBackoffMap(params.usageStatsService);
    const current = snapshots.get(params.freshnessKey);
    const previousFailureCount = current?.failureCount ?? failures.get(params.freshnessKey)?.failureCount ?? 0;
    const failureCount = previousFailureCount + 1;
    const backoffMs = USAGE_ENTITLEMENT_ERROR_BACKOFF_MS[Math.min(failureCount - 1, USAGE_ENTITLEMENT_ERROR_BACKOFF_MS.length - 1)] ?? USAGE_ENTITLEMENT_ERROR_BACKOFF_MS[USAGE_ENTITLEMENT_ERROR_BACKOFF_MS.length - 1];
    const nextAllowedAt = Date.now() + backoffMs;
    failures.set(params.freshnessKey, {
        failureCount,
        nextAllowedAt,
    });
    // 查询失败也是共享事实；否则设置页失败后，推荐入口仍认为旧余额查询成功。
    for (const listener of entitlementSubscribers
        .get(params.usageStatsService)
        ?.get(params.freshnessKey) ?? []) {
        listener(current?.snapshot ?? null, "usage_entitlement_refresh_failed");
    }
    if (!current) {
        return;
    }
    snapshots.set(params.freshnessKey, {
        ...current,
        failureCount,
        nextAllowedAt,
    });
}
export function subscribeSharedEntitlementSnapshot(params) {
    let serviceSubscribers = entitlementSubscribers.get(params.usageStatsService);
    if (!serviceSubscribers) {
        serviceSubscribers = new Map();
        entitlementSubscribers.set(params.usageStatsService, serviceSubscribers);
    }
    let listeners = serviceSubscribers.get(params.freshnessKey);
    if (!listeners) {
        listeners = new Set();
        serviceSubscribers.set(params.freshnessKey, listeners);
    }
    listeners.add(params.listener);
    return () => {
        listeners?.delete(params.listener);
        if (listeners?.size === 0) {
            serviceSubscribers?.delete(params.freshnessKey);
        }
        if (serviceSubscribers?.size === 0) {
            entitlementSubscribers.delete(params.usageStatsService);
        }
    };
}
export function shouldUseSharedEntitlementSnapshot(params) {
    const record = getSharedSnapshotMap(params.usageStatsService).get(params.freshnessKey);
    if (!record) {
        return null;
    }
    if (record.failureCount > 0)
        return null;
    if (params.now - record.updatedAt <= params.intervalMs) {
        return record.snapshot;
    }
    return null;
}
export function hasSharedEntitlementFailure(params) {
    return getFailureBackoffMap(params.usageStatsService).has(params.freshnessKey);
}
export function shouldDeferSharedEntitlementRefresh(params) {
    const failure = getFailureBackoffMap(params.usageStatsService).get(params.freshnessKey);
    return Boolean(failure && failure.nextAllowedAt > params.now);
}
export function getUsageEntitlementScheduleState(snapshot) {
    if (!snapshot) {
        return "unknown";
    }
    const hasEntitlement = Boolean(snapshot.subscription?.details.length ||
        (isStartPlanModelProviderId(snapshot.provider?.id ?? "") && snapshot.remaining));
    if (hasEntitlement && snapshot.unavailableReason !== "no_plan") {
        return "active";
    }
    if (snapshot.unavailableReason === "no_plan") {
        return "none";
    }
    if (snapshot.unavailableReason) {
        return "unavailable";
    }
    return "unknown";
}
//# sourceMappingURL=usageEntitlementRefreshPolicy.js.map