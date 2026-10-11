import type { UsageEntitlementSnapshot } from "@zcode/shared";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export interface ChatStartPlanBalanceConfig {
    loading: boolean;
    /** hover 打开 context 面板时发起的静默 access 刷新（与 Coding Plan 段 onAccess 语义一致）。 */
    onAccess?: () => Promise<void> | void;
    onUpgradeClick?: () => void;
    /** hover 触发的本次刷新 promise 进行中；静默刷新不置 entitlement.loading，spinner 需要跟随它。 */
    refreshing?: boolean;
    snapshot: UsageEntitlementSnapshot | null;
}
export declare function hasChatStartPlanBalance(config: ChatStartPlanBalanceConfig | undefined): boolean;
export declare function ChatStartPlanBalancePanel({ config, intl, locale, separated, }: {
    config: ChatStartPlanBalanceConfig;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    locale: string;
    separated?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=StartPlanContextBalance.d.ts.map