export declare const SERVICE_AUTHORITY_MODE_ENV = "ZCODE_SERVICE_AUTHORITY_MODE";
export declare const serviceAuthorityModes: readonly ["desktop-local", "desktop-attached-remote", "standalone-server"];
export type ServiceAuthorityMode = (typeof serviceAuthorityModes)[number];
export declare function isServiceAuthorityMode(value: unknown): value is ServiceAuthorityMode;
export declare function parseServiceAuthorityMode(env: Record<string, string | undefined>): {
    mode: ServiceAuthorityMode | undefined;
    invalidRawValue: string | undefined;
};
export declare function shouldUseProviderRegistrySourceForAuthorityMode(mode: ServiceAuthorityMode | undefined): boolean;
//# sourceMappingURL=serviceAuthority.d.ts.map