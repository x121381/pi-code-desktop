import { ProjectAccessTokenClient, type ProjectAccessTokenMaterial } from "@zcode/shared";
import { type AccountApiProviderId, type RemoteCustomerInfo } from "./accountProviderApiTypes.js";
export declare function pickOrgAndProject(customerInfo: RemoteCustomerInfo): {
    organizationId: string;
    projectId: string;
} | null;
export declare class AccountProviderApiKeyResolver {
    readonly tokenClient: ProjectAccessTokenClient;
    constructor(fetchRemoteData: <T>(url: string, init: RequestInit) => Promise<T | null>, tokenClient?: ProjectAccessTokenClient);
    resolveProviderApiKey(...args: Parameters<AccountProviderApiKeyResolver["resolveProviderMaterial"]>): Promise<string>;
    resolveProviderMaterial(provider: AccountApiProviderId, accessToken: string, accountIdentity?: string, rejectedProjectTokenFingerprint?: string): Promise<ProjectAccessTokenMaterial>;
}
//# sourceMappingURL=accountProviderApiKeyResolver.d.ts.map