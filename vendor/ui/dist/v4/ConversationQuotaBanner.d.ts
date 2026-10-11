import type { CodingPlanBillingDiscountConfig } from "@zcode/shared";
import type { SessionQuotaBannerState } from "@/v4/sessionQuotaBannerState.js";
export declare function ConversationQuotaBanner({ state, billingDiscountActive, billingDiscountConfig, upgradeActionLabelId, onUpgrade, onDismiss, onShown, }: {
    state: SessionQuotaBannerState;
    billingDiscountActive?: boolean;
    billingDiscountConfig?: CodingPlanBillingDiscountConfig;
    upgradeActionLabelId?: string;
    onUpgrade?: () => void;
    onDismiss: () => void;
    onShown?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationQuotaBanner.d.ts.map