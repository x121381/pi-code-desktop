export interface CredentialCipherProvider {
    encrypt(value: string): string;
    decrypt(value: string): string;
}
interface CredentialCipherProviderOptions {
    env?: NodeJS.ProcessEnv;
}
export declare function createCredentialCipherProvider(options?: CredentialCipherProviderOptions): CredentialCipherProvider;
export {};
//# sourceMappingURL=credentialCipherProvider.d.ts.map