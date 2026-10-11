export type AccountProviderCredentialScope = {
    readonly providerId: string;
    readonly accountIdentity: string;
} & ({
    readonly planKind: "start-plan" | "individual-coding-plan";
} | {
    readonly planKind: "team-coding-plan";
    readonly productId: string;
    readonly organizationId: string;
    readonly projectId: string;
});
/**
 * Credential Store 的私有物理 key。
 *
 * 旧账号标识同时承担 Config 身份和凭据缓存键，导致账号身份扩散到
 * Provider、Protocol 与 UI。物理键现在只留在拥有账号身份的 Services 凭据边界。
 */
export declare function accountProviderCredentialKey(input: AccountProviderCredentialScope): string;
//# sourceMappingURL=accountProviderCredentialKey.d.ts.map