import { BIGMODEL_PROVIDER_ID, ZAI_PROVIDER_ID } from "@zcode/shared";
export type AccountApiProviderId = typeof BIGMODEL_PROVIDER_ID | typeof ZAI_PROVIDER_ID;
export interface RemoteEnvelope<T> {
    code?: number;
    data?: T;
}
export interface RemoteProjectInfo {
    projectId?: string;
    projectName?: string;
    projectType?: number | string | null;
}
export interface RemoteOrganizationInfo {
    organizationId?: string;
    organizationName?: string;
    projects?: RemoteProjectInfo[];
}
export interface RemoteCustomerInfo {
    organizations?: RemoteOrganizationInfo[];
}
export interface RemoteApiKeySummary {
    apiKey?: string;
    keyType?: number | null;
    name?: string;
}
export interface RemoteApiKeySecret {
    secretKey?: string;
}
export declare const DEFAULT_ORG_NAME = "\u9ED8\u8BA4\u673A\u6784";
export declare const DEFAULT_PROJECT_NAME = "\u9ED8\u8BA4\u9879\u76EE";
export declare const ZCODE_API_KEY_NAME = "zcode-api-key";
//# sourceMappingURL=accountProviderApiTypes.d.ts.map