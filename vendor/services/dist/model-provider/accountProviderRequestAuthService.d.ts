import type { RequestVerificationReason } from "@zcode/shared";
import { type OAuthProviderId, type ProviderFamilyDomain, type ProjectAccessTokenMaterial, type ZCodeAccountAccess, type ZCodeProviderAccountAccess } from "@zcode/shared";
export interface AccountRequestAuthMaterial {
    /** 私有传输字段兼容旧命名；套餐 OAuth 实际传入短期 Project Token。 */
    apiKey?: string;
    apiKeyId?: string;
    headers?: Record<string, string>;
    accountScope?: string;
}
export interface AccountRequestAuthInput {
    providerId: string;
    modelId?: string;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
    expectedAccountScope?: string;
    rejectedProjectTokenFingerprint?: string;
    reason: RequestVerificationReason | "off-peak" | "usage";
}
export interface AccountAccessIdentityInput {
    providerId: string;
    accountAccess: ZCodeProviderAccountAccess | ZCodeAccountAccess;
}
export declare class AccountRequestCredentialUnavailableError extends Error {
    readonly providerId: string;
    constructor(providerId: string);
}
export interface AccountRequestAuthResolver {
    resolveAccessCurrent(access: ZCodeProviderAccountAccess): Promise<ZCodeAccountAccess | null>;
    resolveCurrent(input: AccountRequestAuthInput): Promise<AccountRequestAuthMaterial>;
    assertCurrent(input: AccountAccessIdentityInput): Promise<void>;
}
interface AccountProviderRequestAuthServiceOptions {
    resolveCurrentAccountAccess(access: ZCodeProviderAccountAccess): Promise<ZCodeAccountAccess | null>;
    loadOAuthTokenSet(providerId: OAuthProviderId): Promise<{
        accessToken?: string | null;
        zcodeJwtToken?: string | null;
    } | null>;
    loadIndividualPlanMaterial(providerId: string, family: ProviderFamilyDomain, rejectedProjectTokenFingerprint?: string): Promise<ProjectAccessTokenMaterial | null>;
    resolveTeamPlanMaterial(access: Extract<ZCodeAccountAccess, {
        planKind: "team-coding-plan";
    }>, rejectedProjectTokenFingerprint?: string): Promise<ProjectAccessTokenMaterial | null>;
}
declare class AccountProviderRequestAuthService implements AccountRequestAuthResolver {
    #private;
    constructor(options: AccountProviderRequestAuthServiceOptions);
    resolveAccessCurrent(access: ZCodeProviderAccountAccess): Promise<ZCodeAccountAccess | null>;
    resolveCurrent(input: AccountRequestAuthInput): Promise<AccountRequestAuthMaterial>;
    assertCurrent(input: AccountAccessIdentityInput): Promise<void>;
}
export declare function createAccountProviderRequestAuthService(options: AccountProviderRequestAuthServiceOptions): AccountProviderRequestAuthService;
export {};
//# sourceMappingURL=accountProviderRequestAuthService.d.ts.map