import type { UsageEntitlementSubscriptionDetail } from "@zcode/shared";
import { type ReactNode } from "react";
export declare function CodingPlanStatusMeta({ renewTime, expireTime, extraAction, statusLabel, manageLabel, unlinkLabel, unlinkLoading, onManage, onUnlink, }: {
    extraAction?: ReactNode;
    statusLabel?: ReactNode;
    renewTime?: string | null;
    expireTime?: string | null;
    manageLabel?: string | null;
    unlinkLabel?: string | null;
    unlinkLoading?: boolean;
    onManage?: () => void;
    onUnlink?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function StartPlanStatusMeta({ expireTime, entitlements, hasQuota, refreshing, onRefresh, }: {
    expireTime?: string | null;
    entitlements?: UsageEntitlementSubscriptionDetail["entitlements"];
    hasQuota?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function resolveStartPlanStatusMetaState({ entitlements, hasQuota, now, }: {
    entitlements: UsageEntitlementSubscriptionDetail["entitlements"];
    hasQuota: boolean;
    now?: number;
}): "pending" | "refreshable" | "settled";
export declare function resolvePendingStartPlanEffectiveTime(entitlements: UsageEntitlementSubscriptionDetail["entitlements"], now?: number): string | null;
export declare function formatStartPlanEffectiveDate(value: string, locale: string, now?: number): string;
export declare function formatStartPlanExpireDate(value: string, locale: string, now?: number): string;
//# sourceMappingURL=CodingPlanStatusMeta.d.ts.map