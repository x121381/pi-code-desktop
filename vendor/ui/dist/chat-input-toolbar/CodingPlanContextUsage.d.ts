import { type CodingPlanResetType } from "@zcode/shared";
import { type CodingPlanUsageRemainingEntitlement, type CodingPlanUsageAvailableProvider } from "@/CodingPlanUsageRemainingPanel.js";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
import type { SidebarUsageCodingPlanSourceId } from "@/lib/sidebarUsageCodingPlanProviderPreference.js";
export type ChatCodingPlanUsageRemainingConfig = {
    availableProviders: CodingPlanUsageAvailableProvider[];
    entitlements: CodingPlanUsageRemainingEntitlement[];
    onAccess?: () => Promise<void> | void;
    refreshing?: boolean;
    modelProvidersLoading: boolean;
    onEntitlementRefresh?: () => void | Promise<void>;
    onProviderChange?: (providerId: SidebarUsageCodingPlanSourceId) => void;
    onUsageClick?: () => void;
    selectedProviderId?: SidebarUsageCodingPlanSourceId;
};
/** Composer 触发器 hover 展开面板后要求补播撒花的自动完成 used_at,按重置类型定位到对应额度条。
 *  五小时与周额度可能各自 arm,因此按类型分别记录,互不覆盖。 */
export type CodingPlanQuotaResetAutoConfettiArms = Record<CodingPlanResetType, number | null>;
export declare function hasChatCodingPlanUsageRemaining(config: ChatCodingPlanUsageRemainingConfig): boolean;
export declare function shouldShowContextQuotaResetTime({ availableWidth, contentWidth, }: {
    availableWidth: number;
    contentWidth: number;
}): boolean;
export declare function ChatCodingPlanUsageRemainingPanel({ config, intl, locale, quotaResetDialogOpen, separated, autoCelebrateArm, onAutoCelebrated, onQuotaResetDialogOpenChange, }: {
    config: ChatCodingPlanUsageRemainingConfig;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    locale: string;
    quotaResetDialogOpen?: boolean;
    separated?: boolean;
    /** 自动/运营完成后,由 Composer 触发器在 hover 展开面板时要求补播撒花的自动完成 used_at(按类型)。 */
    autoCelebrateArm?: CodingPlanQuotaResetAutoConfettiArms | null;
    onAutoCelebrated?: (completedAt: number) => void;
    onQuotaResetDialogOpenChange?: (open: boolean) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CodingPlanContextUsage.d.ts.map