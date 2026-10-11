import { type IPlatformService, type ZCodeTaskNetworkDebugStatus } from "@zcode/shared";
export declare const PLAN_USAGE_ARMS_GROUP = "plan_usage";
export declare const PLAN_USAGE_ARMS_EVENT_REQUEST = "plan_request";
export declare const PLAN_USAGE_ARMS_EVENT_TTFT = "plan_ttft";
export type PlanUsageRequestStatus = "accepted" | "queued" | "started" | "completed" | "failed" | "retry_scheduled" | "stream_stalled";
type ArmsReporter = Pick<IPlatformService, "reportArmsCustomEvent">;
export declare function reportPlanUsageRequestToArms(reporter: ArmsReporter | null | undefined, params: {
    providerId?: string | null;
    modelName?: string | null;
    askMode?: string | null;
    requestStatus?: PlanUsageRequestStatus;
    properties?: Record<string, string | number | boolean | undefined>;
}): void;
export declare function reportPlanUsageModelRequestStartedToArms(reporter: ArmsReporter | null | undefined, event: ZCodeTaskNetworkDebugStatus): void;
export declare function reportPlanUsageTtftToArms(reporter: ArmsReporter | null | undefined, params: {
    providerId?: string | null;
    modelName?: string | null;
    askMode?: string | null;
    ttftMs: number;
}): void;
export {};
//# sourceMappingURL=planUsageArmsTelemetry.d.ts.map