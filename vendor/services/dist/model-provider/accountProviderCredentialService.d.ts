import type { ProviderFamilyDomain, ProjectAccessTokenMaterial } from "@zcode/shared";
interface AccountProviderCredentialServiceOptions {
    readonly loadOAuthAccessToken: (family: ProviderFamilyDomain) => Promise<string | null>;
    readonly resolveProviderMaterial: (family: ProviderFamilyDomain, accessToken: string, accountIdentity: string, rejectedProjectTokenFingerprint?: string) => Promise<ProjectAccessTokenMaterial | null>;
}
interface LoadCodingPlanApiKeyInput {
    readonly providerId: string;
    readonly family: ProviderFamilyDomain;
    readonly accountIdentity: string;
    readonly forceRefresh?: boolean;
    readonly rejectedProjectTokenFingerprint?: string;
}
export interface AccountProviderCredentialService {
    loadCodingPlanApiKey(input: LoadCodingPlanApiKeyInput): Promise<string | null>;
    loadCodingPlanMaterial(input: LoadCodingPlanApiKeyInput): Promise<ProjectAccessTokenMaterial | null>;
}
/** 旧方法名兼容私有调用契约；返回值现在是请求期 Token，绝不读写长期 Key 缓存。 */
export declare function createAccountProviderCredentialService(options: AccountProviderCredentialServiceOptions): AccountProviderCredentialService;
export {};
//# sourceMappingURL=accountProviderCredentialService.d.ts.map