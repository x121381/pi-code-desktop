import type { ICredentialService } from "#src/credential/credential.js";
export interface AccountProviderCredentialStore {
    loadApiKey(credentialKey: string): Promise<string | null>;
    saveApiKey(credentialKey: string, apiKey: string): Promise<void>;
    deleteApiKey(credentialKey: string): Promise<void>;
}
export interface AccountProviderCredentialStoreOptions {
    readonly credentialService: Pick<ICredentialService, "load" | "save" | "delete">;
}
/**
 * 保存 Account Provider 的请求期凭据。
 *
 * 只读取账号 Credential Store；旧 Provider Store 不再作为凭据来源。
 */
export declare function createAccountProviderCredentialStore(options: AccountProviderCredentialStoreOptions): AccountProviderCredentialStore;
//# sourceMappingURL=accountProviderCredentialStore.d.ts.map