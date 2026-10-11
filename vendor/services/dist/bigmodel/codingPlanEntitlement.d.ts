import type { ApiClient } from "@zcode/shared";
import { z } from "zod";
import type { BigModelTeamPlanBizContext } from "#src/bigmodel/teamPlanApiKey.js";
declare const personalSchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    status: z.ZodString;
    inCurrentPeriod: z.ZodBoolean;
    autoRenew: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodBoolean]>>;
    nextRenewTime: z.ZodOptional<z.ZodString>;
    valid: z.ZodOptional<z.ZodString>;
    billingCycle: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const teamSchema: z.ZodObject<{
    hasSubscription: z.ZodBoolean;
    status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    memberGrantStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    productId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    productName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subscribeEndTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subscribePeriod: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PersonalCodingPlanSubscription = z.infer<typeof personalSchema>;
export type TeamCodingPlanSubscription = z.infer<typeof teamSchema>;
export type CodingPlanEntitlement<T> = {
    kind: "available";
    subscription: T;
} | {
    kind: "unavailable";
    reason?: "expired" | "unassigned";
} | {
    kind: "unknown";
};
export declare function isActivePersonalCodingPlan(subscription: {
    productId?: string;
    productName?: string;
    status?: string;
    inCurrentPeriod?: boolean;
}): boolean;
export declare function fetchPersonalCodingPlanEntitlement(params: {
    apiClient: ApiClient;
    authorization: string;
    url: string;
    timeoutMs: number;
}): Promise<CodingPlanEntitlement<PersonalCodingPlanSubscription>>;
export declare function fetchTeamCodingPlanEntitlement(params: {
    apiClient: ApiClient;
    authorization: string;
    host: string;
    teamContext: BigModelTeamPlanBizContext;
    timeoutMs: number;
}): Promise<CodingPlanEntitlement<TeamCodingPlanSubscription>>;
export {};
//# sourceMappingURL=codingPlanEntitlement.d.ts.map