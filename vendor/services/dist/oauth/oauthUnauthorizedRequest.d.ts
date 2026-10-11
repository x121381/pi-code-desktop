import type { ICredentialService } from "#src/credential/credential.js";
export declare function isOAuthBusinessRequest(options: {
    input: string | URL;
    credentialService: Pick<ICredentialService, "load">;
    env?: NodeJS.ProcessEnv;
    provider?: string | null;
}): Promise<boolean>;
export declare function isCurrentOAuthBusinessCredentialRequest(options: {
    input: string | URL;
    headers: Headers;
    credentialService: Pick<ICredentialService, "load">;
    env?: NodeJS.ProcessEnv;
}): Promise<boolean>;
export declare function isCurrentOAuthCredentialRequest(options: {
    input: string | URL;
    headers: Headers;
    credentialService: Pick<ICredentialService, "load">;
    env?: NodeJS.ProcessEnv;
}): Promise<boolean>;
//# sourceMappingURL=oauthUnauthorizedRequest.d.ts.map