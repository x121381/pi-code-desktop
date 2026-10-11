import { type UsageEntitlementSubscriptionDetail, type UsageQuotaLimit, type ZCodeAccountAccess, type ZCodeProviderAccountAccess } from "@zcode/shared";
import { type CodingPlanFunnelContext } from "@/lib/codingPlanFunnelTelemetry.js";
import { type CodingPlanStatus, type CodingPlanProviderId, type TeamPlanAvailabilityReason } from "./constants.js";
import type { CodingPlanStatusPanelViewState } from "./codingPlanStatusPanelViewState.js";
import type { CodingPlanLoginOptions } from "./codingPlanPricingCards.js";
import type { PurchaseAudience } from "./codingPlanEnterpriseTiers.js";
export declare function ModelProviderLoadingCard({ loadingLabel }: {
    loadingLabel: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function PresetProviderPlaceholderCard({ displayName, messageId, }: {
    displayName: string;
    messageId?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function CodingPlanStatusPanel({ providerId, providerName, status, viewState, loginLoading, disconnectLoading, purchaseUrl, planLevel, inactivePlanTitle, subscriptionRenewTime, subscriptionExpireTime, subscriptionDetails, quotaLimits, mcpQuotaLimit, authError, onOpenRegistration, onLogin, onRetry, reloginOnFailure, onOpenPurchase, onDisconnect, onOpenUpgradePlans, purchaseInitialAudience, loginActionPlacement, loginActionVisible, usageDetailsVisible, upgradeActionVisible, upgradePlansVisible: controlledUpgradePlansVisible, onUpgradePlansVisibleChange, startPlanPreviewVisible, statusLabelId, statusMessage, teamPlanAvailabilityReason, quotaResetSourceKey, quotaResetAccountAccess, onQuotaResetEntitlementRefresh, }: {
    providerId: CodingPlanProviderId;
    providerName: string;
    status: CodingPlanStatus;
    viewState?: CodingPlanStatusPanelViewState;
    loginLoading?: boolean;
    disconnectLoading?: boolean;
    purchaseUrl?: string;
    planLevel?: string | null;
    inactivePlanTitle?: string | null;
    subscriptionRenewTime?: string | null;
    subscriptionExpireTime?: string | null;
    subscriptionDetails?: UsageEntitlementSubscriptionDetail[];
    quotaLimits?: UsageQuotaLimit[];
    /** 官方 Server MCP 额度（服务端下发的总额度）。不在 quota.limits[] 里，由 nav item 单独透传。 */
    mcpQuotaLimit?: UsageQuotaLimit | null;
    authError?: string | null;
    onOpenRegistration?: () => void;
    onLogin?: (options?: CodingPlanLoginOptions) => number | void | Promise<void>;
    /** 凭据获取失败提供主动重新登录，不据此自动退出账号。 */
    reloginOnFailure?: boolean;
    /** Start 套餐获取失败沿用 Host 手动刷新，不强制重新登录。 */
    onRetry?: () => void;
    onOpenPurchase?: (url: string) => void;
    onDisconnect?: () => void;
    onOpenUpgradePlans?: (options: {
        initialAudience: PurchaseAudience;
        funnelContext: CodingPlanFunnelContext | null;
    }) => void;
    /** 原生面板移除后，Team 状态卡仍须把购买对象传给统一升级入口。 */
    purchaseInitialAudience?: PurchaseAudience;
    loginActionPlacement?: "inline" | "trailing";
    loginActionVisible?: boolean;
    usageDetailsVisible?: boolean;
    upgradeActionVisible?: boolean;
    upgradePlansVisible?: boolean;
    onUpgradePlansVisibleChange?: (visible: boolean) => void;
    startPlanPreviewVisible?: boolean;
    statusLabelId?: string;
    statusMessage?: string | null;
    teamPlanAvailabilityReason?: TeamPlanAvailabilityReason;
    /** Team Plan 必须传完整连接 key，避免与同 provider 的个人套餐共享重置状态。 */
    quotaResetSourceKey?: string;
    quotaResetAccountAccess?: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    onQuotaResetEntitlementRefresh?: () => void | Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
export declare function hasStartPlanEntitlementQuota(entitlements: UsageEntitlementSubscriptionDetail["entitlements"], limits: readonly UsageQuotaLimit[]): boolean;
export declare function resolveCodingPlanStatusCardTitle({ isPurchased, isUnavailable, isStartPlanProvider, inactivePlanTitle, rawPlanLevel, displayPlanLevel, startPlanTitle, codingPlanTitle, }: {
    isPurchased: boolean;
    isUnavailable?: boolean;
    isStartPlanProvider: boolean;
    inactivePlanTitle?: string | null;
    rawPlanLevel: string;
    displayPlanLevel: string;
    startPlanTitle: string;
    codingPlanTitle: string;
}): string;
//# sourceMappingURL=StatusCards.d.ts.map