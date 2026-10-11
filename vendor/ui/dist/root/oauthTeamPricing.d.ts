import type { IServiceAccessor } from "@zcode/services";
import type { EnterpriseCodingPlanPricingProduct, ProviderFamilyDomain } from "@zcode/shared";
type EnterprisePricingProductsResult = {
    status: "success";
    productList: EnterpriseCodingPlanPricingProduct[];
} | {
    status: "error";
};
export declare function getEnterprisePricingProducts(services: IServiceAccessor, domain: ProviderFamilyDomain): Promise<EnterprisePricingProductsResult>;
export declare function getEnterprisePricingProductsOrEmpty(services: IServiceAccessor, domain: ProviderFamilyDomain): Promise<EnterpriseCodingPlanPricingProduct[]>;
export {};
//# sourceMappingURL=oauthTeamPricing.d.ts.map