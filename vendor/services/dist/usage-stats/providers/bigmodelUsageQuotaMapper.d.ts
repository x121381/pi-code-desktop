import type { UsageQuotaLimit } from "@zcode/shared";
export interface BigModelSubscriptionListEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelSubscriptionListItem[] | null;
}
export interface BigModelSubscriptionListItem {
    productId?: string;
    productName?: string;
    status?: string;
    inCurrentPeriod?: boolean;
    purchaseTime?: string;
    valid?: string;
    autoRenew?: number | boolean;
    currentRenewTime?: string;
    nextRenewTime?: string;
    billingCycle?: string;
}
export interface BigModelUsageQuotaEnvelope {
    code?: number;
    msg?: string;
    success?: boolean;
    data?: BigModelUsageQuotaPayload | null;
}
export interface BigModelUsageQuotaPayload {
    level?: string;
    limits?: BigModelUsageQuotaLimitPayload[];
}
interface BigModelUsageQuotaLimitPayload {
    type?: string;
    unit?: number;
    number?: number;
    usage?: number;
    currentValue?: number;
    remaining?: number;
    percentage?: number;
    nextResetTime?: number;
    usageDetails?: Array<{
        modelCode?: string;
        displayName?: string;
        usage?: number;
    }>;
}
export declare function normalizeLimits(limits: BigModelUsageQuotaPayload["limits"]): UsageQuotaLimit[];
export declare function pickPrimaryLimit(limits: UsageQuotaLimit[]): UsageQuotaLimit | null;
export declare function formatPlanName(level: string): string;
export declare function isNoPlanMessage(message: string): boolean;
export declare function pickCurrentSubscriptionFromList(payload: BigModelSubscriptionListItem[] | null | undefined): {
    productId: string;
    productName: string;
    billingCycle: string | null;
    renewTime: string | null;
    expireTime: string | null;
} | null;
export {};
//# sourceMappingURL=bigmodelUsageQuotaMapper.d.ts.map