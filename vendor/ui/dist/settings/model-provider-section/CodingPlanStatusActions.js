import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodingPlanEntryButton } from "../../settings/CodingPlanEntryButton.js";
import { ArrowLeftIcon, Loader2Icon, RocketIcon } from "lucide-react";
import { cn } from "../../components/lib/utils.js";
import { Button } from "../../components/ui/button.js";
import { CodingPlanBillingDiscountBadgePill, CodingPlanBillingDiscountInfoDialog, } from "../../CodingPlanBillingDiscount.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
export function CodingPlanStatusActions({ providerName, isDisconnected, isUnavailable, isPurchased, loginLoading, loginButtonId, loginVisible, canDisconnectProvider, disconnectLoading, onLogin, onDisconnect, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex shrink-0 flex-wrap justify-start gap-2", children: [loginVisible && (isDisconnected || isUnavailable) && onLogin ? (_jsxs(Button, { type: "button", size: "lg", onClick: () => onLogin(), disabled: loginLoading, children: [loginLoading ? _jsx(Loader2Icon, { className: "size-3.5 animate-spin" }) : null, intl.formatMessage({ id: loginButtonId }, { provider: providerName })] })) : null, canDisconnectProvider && onDisconnect && !isPurchased ? (_jsxs(Button, { type: "button", variant: "outline", size: "lg", disabled: disconnectLoading, onClick: onDisconnect, children: [disconnectLoading ? _jsx(Loader2Icon, { className: "size-3.5 animate-spin" }) : null, intl.formatMessage({
                        id: "settings.modelProvider.codingPlan.disconnect",
                    })] })) : null] }));
}
export function CodingPlanUpgradeAction({ loginLoading, upgradePlansVisible, actionLabelId = "settings.modelProvider.codingPlan.upgrade", billingDiscountActive, billingDiscountConfig, onUpgradePlansVisibleChange, }) {
    const { intl } = useZCodeIntl();
    const billingDiscountButtonActive = billingDiscountActive === true && !upgradePlansVisible;
    const upgradeButton = (_jsxs(CodingPlanEntryButton, { bypassGate: upgradePlansVisible, type: "button", size: "lg", className: cn(billingDiscountButtonActive &&
            "button-gradient dark:bg-[#484A58] text-white hover:bg-transparent hover:opacity-90 dark:hover:bg-[#484A58] pr-[5px] rounded-full"), onClick: () => {
            // 购买/升级入口必须先打开面板，OAuth 失效恢复由面板在用户选择
            // plan/周期后处理，避免点击 Upgrade 直接跳登录导致用户看不到购买流程。
            onUpgradePlansVisibleChange(!upgradePlansVisible);
        }, disabled: loginLoading, children: [loginLoading ? (_jsx(Loader2Icon, { className: "size-3.5 animate-spin" })) : upgradePlansVisible ? (_jsx(ArrowLeftIcon, { className: "size-3.5" })) : (_jsx(RocketIcon, { className: "size-3.5" })), intl.formatMessage({
                id: upgradePlansVisible
                    ? "settings.modelProvider.codingPlan.cancelUpgrade"
                    : actionLabelId,
            }), billingDiscountButtonActive ? (_jsx(CodingPlanBillingDiscountBadgePill, { config: billingDiscountConfig, iconVisible: false, variant: "surface" })) : null] }));
    if (!billingDiscountButtonActive) {
        return upgradeButton;
    }
    return (_jsxs("div", { className: "inline-flex shrink-0 items-center gap-1", children: [upgradeButton, _jsx(CodingPlanBillingDiscountInfoDialog, { config: billingDiscountConfig })] }));
}
//# sourceMappingURL=CodingPlanStatusActions.js.map