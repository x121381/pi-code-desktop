import { ProjectAccessTokenClient, type ApiClient, type ProjectAccessTokenMaterial, type ZCodeAccountAccess } from "@zcode/shared";
import type { ICredentialService } from "#src/credential/credential.js";
interface TeamPlanRequestKeyDependencies {
    readonly apiClient: ApiClient;
    readonly tokenClient?: ProjectAccessTokenClient;
    readonly accountIdentity?: string;
    readonly rejectedProjectTokenFingerprint?: string;
    readonly credentialService?: Pick<ICredentialService, "load">;
    readonly access: Extract<ZCodeAccountAccess, {
        planKind: "team-coding-plan";
    }>;
}
export declare function resolveAccountTeamPlanRuntimeApiKey(params: TeamPlanRequestKeyDependencies): Promise<string | null>;
export declare function resolveAccountTeamPlanRuntimeMaterial(params: TeamPlanRequestKeyDependencies): Promise<ProjectAccessTokenMaterial | null>;
export {};
//# sourceMappingURL=accountProviderTeamPlanRequestKey.d.ts.map