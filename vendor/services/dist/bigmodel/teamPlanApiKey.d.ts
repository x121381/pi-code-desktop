import { type ApiClient } from "@zcode/shared";
export interface BigModelTeamPlanBizContext {
    organizationId: string;
    projectId: string;
}
export interface BigModelTeamPlanApiKeySummary {
    apiKey?: string | null;
    keyType?: number | null;
    name?: string | null;
}
export type BigModelTeamPlanApiKeyEnsureStatus = "existing" | "created" | "missing";
export interface BigModelTeamPlanApiKeyEnsureResult {
    apiKey: BigModelTeamPlanApiKeySummary | null;
    diagnostics: BigModelTeamPlanApiKeyEnsureDiagnostics;
    status: BigModelTeamPlanApiKeyEnsureStatus;
}
export interface BigModelTeamPlanApiKeyEnsureDiagnostics {
    create?: BigModelBizEnvelopeDiagnostics & {
        dataHasApiKey: boolean;
        dataKeyType: number | null;
        dataName: string | null;
    };
    list: BigModelBizEnvelopeDiagnostics & {
        apiKeyCount: number;
        usableApiKeyCount: number;
    };
}
export interface BigModelBizEnvelopeDiagnostics {
    code: number | null;
    msg: string | null;
    success: boolean | null;
}
export declare function createBigModelBizHeaders(authorization: string, teamContext?: BigModelTeamPlanBizContext | null): Record<string, string>;
export declare function ensureBigModelTeamPlanProjectApiKey(params: {
    apiClient: ApiClient;
    authorization: string;
    host: string;
    teamContext: BigModelTeamPlanBizContext;
    timeoutMs: number;
}): Promise<BigModelTeamPlanApiKeySummary | null>;
export declare function ensureBigModelTeamPlanProjectApiKeyWithStatus(params: {
    apiClient: ApiClient;
    authorization: string;
    host: string;
    teamContext: BigModelTeamPlanBizContext;
    timeoutMs: number;
}): Promise<BigModelTeamPlanApiKeyEnsureResult>;
//# sourceMappingURL=teamPlanApiKey.d.ts.map