import type { UsageEntitlementSnapshot, UsageQuotaLimit } from "@zcode/shared";
export declare function normalizeQuotaModel(value: string): string;
export declare function bucketMatchesModel(bucket: UsageQuotaLimit, modelId: string): boolean;
export declare function getActiveModelBuckets(snapshot: UsageEntitlementSnapshot, now?: number): UsageQuotaLimit[];
export declare function bucketRemainingRatio(bucket: UsageQuotaLimit): number | null;
export declare function allBucketsExhausted(buckets: UsageQuotaLimit[]): boolean;
export declare function bucketReminderKey(bucket: UsageQuotaLimit): string | null;
//# sourceMappingURL=startPlanQuotaBuckets.d.ts.map