import type { CodingPlanBillingDiscountConfig } from "@zcode/shared";
import type { CodingPlanLoginOptions } from "./codingPlanPricingCards.js";
export declare function CodingPlanStatusActions({ providerName, isDisconnected, isUnavailable, isPurchased, loginLoading, loginButtonId, loginVisible, canDisconnectProvider, disconnectLoading, onLogin, onDisconnect, }: {
    providerName: string;
    isDisconnected: boolean;
    isUnavailable: boolean;
    isPurchased: boolean;
    loginLoading?: boolean;
    loginButtonId: string;
    loginVisible: boolean;
    canDisconnectProvider: boolean;
    disconnectLoading?: boolean;
    onLogin?: (options?: CodingPlanLoginOptions) => void;
    onDisconnect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CodingPlanUpgradeAction({ loginLoading, upgradePlansVisible, actionLabelId, billingDiscountActive, billingDiscountConfig, onUpgradePlansVisibleChange, }: {
    loginLoading?: boolean;
    upgradePlansVisible: boolean;
    actionLabelId?: string;
    billingDiscountActive?: boolean;
    billingDiscountConfig?: CodingPlanBillingDiscountConfig;
    onUpgradePlansVisibleChange: (visible: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CodingPlanStatusActions.d.ts.map