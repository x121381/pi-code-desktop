interface BigModelStartPlanZcodeJwtCredentialService {
    load(key: string): Promise<string | null>;
}
export declare function resolveBigModelStartPlanZcodeJwt(params: {
    credentialService?: BigModelStartPlanZcodeJwtCredentialService;
    provider?: {
        readonly apiKey?: string | null;
    } | null;
    trustCachedZcodeJwt?: boolean;
}): Promise<string>;
export {};
//# sourceMappingURL=bigmodelStartPlanZcodeJwt.d.ts.map