import type { ApiClient } from "@zcode/shared";
export interface ZaiStartPlanPlan {
    user_plan_id?: string;
    plan_id?: string;
    name?: string;
    status?: string;
    starts_at?: number | string | null;
    ends_at?: number | string | null;
    entitlements?: Array<{
        entitlement_id?: string | null;
        show_name?: string | null;
        period?: string | null;
        effective_at?: number | string | null;
    }>;
}
export interface ZaiStartPlanBalanceEnvelope {
    code?: number;
    success?: boolean;
    msg?: string;
    data?: {
        server_time?: number;
        plans?: ZaiStartPlanPlan[];
        balances?: Array<{
            bucket_id?: string;
            user_plan_id?: string;
            plan_id?: string;
            entitlement_id?: string;
            show_name?: string;
            meter?: string;
            unit_type?: string;
            capabilities?: string[];
            total_units?: number | string | null;
            used_units?: number | string | null;
            reserved_units?: number | string | null;
            remaining_units?: number | string | null;
            available_units?: number | string | null;
            period_start?: number | string | null;
            period_end?: number | string | null;
            expires_at?: number | string | null;
        }>;
    };
}
export declare function buildZaiStartPlanBalanceUrl(): string;
export declare function fetchZaiStartPlanBalanceEnvelope(apiClient: ApiClient, authorization: string, invalidateCache?: boolean): Promise<ZaiStartPlanBalanceEnvelope>;
export declare function resolveZaiStartPlanBalanceModelIds(payload: ZaiStartPlanBalanceEnvelope): string[];
//# sourceMappingURL=zaiStartPlanBilling.d.ts.map