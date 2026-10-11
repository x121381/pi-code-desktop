import type { CodingPlanCampaignDiscountDetail, CodingPlanStaticTeamProduct, EnterpriseCodingPlanCreateOrderRequest, EnterpriseCodingPlanCreateOrderResponse, EnterpriseCodingPlanDiscountDetail, EnterpriseCodingPlanOrderCalculateResponse, EnterpriseCodingPlanPendingOrder, EnterpriseCodingPlanPaymentStatus, EnterpriseCodingPlanPricingProduct, EnterpriseCodingPlanSubscribePeriod, ProviderFamilyDomain } from "@zcode/shared";
import { type CodingPlanProductDisplay } from "@/settings/model-provider-section/codingPlanProductPresentation.js";
export type EnterpriseCodingPlanProductDisplay = CodingPlanProductDisplay & {
    enterpriseProduct: EnterpriseCodingPlanPricingProduct;
    tier: EnterpriseCodingPlanPricingProduct["tier"];
    subscribeMode: EnterpriseCodingPlanPricingProduct["subscribeMode"];
    subscribePeriod: EnterpriseCodingPlanPricingProduct["subscribePeriod"];
    purchaseMethodName: string;
    organizationId?: string | null;
    organizationName?: string | null;
    projectId?: string | null;
    projectName?: string | null;
    teamProjects?: EnterpriseCodingPlanPricingProduct["teamProjects"];
    apiKeyStatus?: EnterpriseCodingPlanPricingProduct["apiKeyStatus"];
    apiKeyUnavailableReason?: EnterpriseCodingPlanPricingProduct["apiKeyUnavailableReason"];
    apiKeyUnavailableMessage?: EnterpriseCodingPlanPricingProduct["apiKeyUnavailableMessage"];
    subscribed?: boolean | null;
    dynamicPricingAvailable?: boolean;
    staticCatalogAvailable?: boolean;
    /**
     * 该企业套餐所属的 family（zai / bigmodel）。
     * 原 UI 层把 team plan items 硬编码为 bigmodelCodingPlan 派生，
     * zai family 即使有订阅也无法渲染。加 family 标记后，下游可见性函数可按
     * product.family 找到对应 family 的 codingPlanItem 和 team key 前缀。
     * 缺省 bigmodel 保持向后兼容。
     */
    family?: ProviderFamilyDomain;
};
/** 旧商品缺少 family 时只在这一规范化边界解释为 BigModel。 */
export declare function resolveEnterpriseCodingPlanProductFamily(product: Pick<EnterpriseCodingPlanProductDisplay, "family">): ProviderFamilyDomain;
export declare function buildEnterpriseCodingPlanProductList(products: EnterpriseCodingPlanPricingProduct[]): EnterpriseCodingPlanProductDisplay[];
export declare function mergeEnterpriseCodingPlanProductList(staticProducts: CodingPlanStaticTeamProduct[], pricingProducts: EnterpriseCodingPlanPricingProduct[]): EnterpriseCodingPlanProductDisplay[];
export declare function resolveEnterpriseCodingPlanProductList(staticProducts: CodingPlanStaticTeamProduct[] | undefined, pricingProducts: EnterpriseCodingPlanPricingProduct[]): EnterpriseCodingPlanProductDisplay[];
export declare function buildEnterpriseCodingPlanCalculateRequest({ product, maxSeats, duration, giveAmount, balanceDeductAmount, }: {
    product: EnterpriseCodingPlanProductDisplay;
    maxSeats: number;
    duration: number;
    giveAmount?: number;
    balanceDeductAmount?: number;
}): {
    productId: string;
    maxSeats: number;
    subscribePeriod: EnterpriseCodingPlanSubscribePeriod;
    subscribeMode: import("@zcode/shared").EnterpriseCodingPlanSubscribeMode;
    duration: number | undefined;
    giveAmount: number;
    balanceDeductAmount: number;
};
export declare function buildEnterpriseCodingPlanCreateOrderRequest({ product, maxSeats, duration, estimate, giveAmount, balanceDeductAmount, }: {
    product: EnterpriseCodingPlanProductDisplay;
    maxSeats: number;
    duration: number;
    giveAmount?: number;
    balanceDeductAmount?: number;
    estimate: Pick<EnterpriseCodingPlanOrderCalculateResponse, "totalOriginalAmount" | "totalPayAmount" | "thirdPayAmount">;
}): EnterpriseCodingPlanCreateOrderRequest;
export declare function buildEnterpriseCodingPlanPaymentContent(order: Pick<EnterpriseCodingPlanCreateOrderResponse, "alipayJumpSchema" | "payUrl">): string;
export declare function isEnterpriseCodingPlanThirdPartyPaymentRequired(order: Pick<EnterpriseCodingPlanCreateOrderResponse, "alipayJumpSchema" | "payUrl" | "thirdPayAmount">): boolean;
export declare function buildEnterpriseCodingPlanEstimateFromPendingOrder(order: EnterpriseCodingPlanPendingOrder): EnterpriseCodingPlanOrderCalculateResponse;
export declare function buildEnterpriseCodingPlanEstimateFromOrderResponse(order: EnterpriseCodingPlanCreateOrderResponse): EnterpriseCodingPlanOrderCalculateResponse;
export declare function buildEnterpriseCodingPlanCampaignDiscountDetails({ campaignDiscountAmount, discountDetails, pricingCampaignDiscountDetails, }: {
    campaignDiscountAmount?: number;
    discountDetails?: EnterpriseCodingPlanDiscountDetail[];
    pricingCampaignDiscountDetails?: CodingPlanCampaignDiscountDetail[];
}): CodingPlanCampaignDiscountDetail[];
export declare function calculateEnterpriseCodingPlanPricingDiscountAmount({ product, maxSeats, duration, }: {
    product: EnterpriseCodingPlanProductDisplay;
    maxSeats: number;
    duration: number;
}): number | undefined;
export declare function isEnterpriseCodingPlanPaymentSuccessStatus(status: EnterpriseCodingPlanPaymentStatus): boolean;
export declare function isEnterpriseCodingPlanPaymentFailureStatus(status: EnterpriseCodingPlanPaymentStatus): boolean;
export declare function getEnterpriseCodingPlanFailureStatuses(): string[];
//# sourceMappingURL=enterpriseCodingPlanProducts.d.ts.map