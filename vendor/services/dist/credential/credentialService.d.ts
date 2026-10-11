import type { ICredentialService } from "./credential.js";
import { type CredentialCipherProvider } from "./providers/credentialCipherProvider.js";
interface CredentialServiceDependencies {
    cipherProvider?: CredentialCipherProvider;
    /** Host 私有的持久化成功通知；不进入 Renderer/RPC 凭据接口。 */
    onDidMutate?: (event: {
        operation: "save" | "delete";
        key: string;
    }) => void;
}
export declare function createCredentialService(dependencies?: CredentialServiceDependencies): ICredentialService;
export {};
//# sourceMappingURL=credentialService.d.ts.map