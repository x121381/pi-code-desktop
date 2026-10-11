import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import type { EnterpriseCodingPlanProductDisplay } from "@/settings/model-provider-section/enterpriseCodingPlanProducts.js";
export type PurchaseAudience = "personal" | "team";
export interface EnterpriseCodingPlanProductGroup {
    key: string;
    title: string;
    products: EnterpriseCodingPlanProductDisplay[];
}
export interface EnterpriseTierFormatOptions {
    locale: string;
    formatMessage?: EnterpriseTierMessageFormatter;
}
export type EnterpriseTierMessageFormatter = (id: string, fallback: string) => string;
export declare function formatEnterpriseTier(tier: string, options?: EnterpriseTierFormatOptions | string): string;
export declare function resolveEnterpriseTierMessageId(normalizedTier: string): string | null;
export declare function createEnterpriseTierMessageFormatter(intl: ReturnType<typeof useZCodeIntl>["intl"]): EnterpriseTierMessageFormatter;
export declare function groupEnterpriseCodingPlanProductsByTier(products: EnterpriseCodingPlanProductDisplay[], options: EnterpriseTierFormatOptions | string): EnterpriseCodingPlanProductGroup[];
//# sourceMappingURL=codingPlanEnterpriseTiers.d.ts.map