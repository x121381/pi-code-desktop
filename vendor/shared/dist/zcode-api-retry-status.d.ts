import type { ZCodeApiRetryStatus } from "./zcode-task-types-core.js";
export declare function normalizeZCodeApiRetryStatus(value: unknown): ZCodeApiRetryStatus | null | undefined;
export declare function zcodeApiRetryFromModelNetworkStatusPayload(payload: Record<string, unknown>): ZCodeApiRetryStatus | null | undefined;
export declare function isZCodeModelRetryRecoveryProgressPayload(payload: Record<string, unknown>): boolean;
export declare function zcodeApiRetryFromStreamRecoveryPayload(value: unknown): ZCodeApiRetryStatus | undefined;
//# sourceMappingURL=zcode-api-retry-status.d.ts.map