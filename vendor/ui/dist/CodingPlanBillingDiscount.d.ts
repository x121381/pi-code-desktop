import type { CodingPlanBillingDiscountConfig, CodingPlanBillingDiscountLocaleCopy, Locale } from "@zcode/shared";
import type { ICodingPlanSubscriptionService } from "@zcode/services";
export declare const CODING_PLAN_BILLING_DISCOUNT_DIALOG_CONTENT_CLASS = "max-h-[min(82vh,640px)] max-w-lg grid-rows-[auto_minmax(0,1fr)] overflow-hidden";
export declare const CODING_PLAN_BILLING_DISCOUNT_DIALOG_BODY_CLASS = "p-3 !space-y-3";
export declare function useCodingPlanBillingDiscount(): {
    active: boolean;
    config: CodingPlanBillingDiscountConfig | undefined;
    loading: boolean;
    refresh: () => Promise<void>;
};
export declare function useCodingPlanBillingDiscountFromService(service: Pick<ICodingPlanSubscriptionService, "getBillingDiscount"> | undefined): {
    active: boolean;
    config: CodingPlanBillingDiscountConfig | undefined;
    loading: boolean;
    refresh: () => Promise<void>;
};
export declare function resolveCodingPlanBillingDiscountCopy(config: CodingPlanBillingDiscountConfig | undefined, locale: Locale): CodingPlanBillingDiscountLocaleCopy;
type CodingPlanBillingDiscountBadgePillProps = {
    config?: CodingPlanBillingDiscountConfig;
    iconVisible?: boolean;
    size?: "default" | "compact";
    variant?: "gradient" | "surface" | "tag";
};
export declare function CodingPlanBillingDiscountBadgePill({ config, iconVisible, size, variant, }: CodingPlanBillingDiscountBadgePillProps): import("react/jsx-runtime").JSX.Element | null;
export declare function CodingPlanBillingDiscountBadge(props: CodingPlanBillingDiscountBadgePillProps): import("react/jsx-runtime").JSX.Element | null;
export declare function CodingPlanBillingDiscountBanner({ config, }: {
    config?: CodingPlanBillingDiscountConfig;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function CodingPlanBillingDiscountInfoDialog({ config, tone, }: {
    config?: CodingPlanBillingDiscountConfig;
    tone?: "default" | "onGradient";
}): import("react/jsx-runtime").JSX.Element | null;
export declare function clearCodingPlanBillingDiscountCacheForTest(): void;
export declare function primeCodingPlanBillingDiscountCacheForTest(config: CodingPlanBillingDiscountConfig | undefined): void;
export {};
//# sourceMappingURL=CodingPlanBillingDiscount.d.ts.map