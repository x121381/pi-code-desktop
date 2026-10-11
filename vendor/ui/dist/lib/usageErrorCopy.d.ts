import type { IntlInstance } from "@/i18n/IntlProvider.js";
type UsageErrorSurface = "chatPlan" | "entitlement" | "stats";
export declare function isUsageTeamPlanBusinessError(error: string | null | undefined): boolean;
export declare function isUsageCredentialError(error: string | null | undefined): boolean;
export declare function formatUsageErrorMessage(intl: IntlInstance, surface: UsageErrorSurface, error: string | null | undefined): string;
export {};
//# sourceMappingURL=usageErrorCopy.d.ts.map