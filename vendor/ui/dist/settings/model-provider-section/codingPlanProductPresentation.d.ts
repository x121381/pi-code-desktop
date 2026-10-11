import type { CodingPlanCardCopyItem, CodingPlanProductPreviewPayment } from "@zcode/shared";
export declare function normalizeCodingPlanCardCopyItems(items: unknown): CodingPlanCardCopyItem[];
export type CodingPlanBillingPeriod = "monthly" | "quarterly" | "yearly";
export type CodingPlanPriceCurrency = "CNY" | "USD";
export type CodingPlanPriceUnit = "month" | "quarter" | "year";
export type CodingPlanProductDisplay = CodingPlanProductPreviewPayment & {
    priceCurrency?: CodingPlanPriceCurrency;
    externalPurchaseUrl?: string;
    hasPreview?: boolean;
    equity?: CodingPlanCardCopyItem[];
    descriptionItems?: CodingPlanCardCopyItem[];
};
export declare const CODING_PLAN_PERIODS: CodingPlanBillingPeriod[];
export declare const CODING_PLAN_PERIOD_LABEL_IDS: Record<CodingPlanBillingPeriod, string>;
export declare function groupProductsByPeriod(productList: CodingPlanProductDisplay[]): Record<CodingPlanBillingPeriod, CodingPlanProductDisplay[]>;
export declare function pickProductTitle(product: CodingPlanProductPreviewPayment): string;
export declare function pickProductDetails(product: CodingPlanProductPreviewPayment): string[];
export declare function pickProductPrice(product: CodingPlanProductPreviewPayment): number | null;
export declare function normalizeCodingPlanCurrency(currency: string | null | undefined): CodingPlanPriceCurrency;
export declare function formatCodingPlanAmount(amount: number, currency: string | null | undefined, locale: string): string;
export declare function inferBillingPeriod(product: CodingPlanProductPreviewPayment): CodingPlanBillingPeriod;
//# sourceMappingURL=codingPlanProductPresentation.d.ts.map