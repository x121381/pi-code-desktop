export declare const DEFAULT_INTRANET_MACHINE_HOST = "";
type IntranetEnv = {
    INTRANET_MACHINE_HOST?: string;
    ZCODE_DEPS_BASE_URL?: string;
};
export declare function resolveIntranetMachineHost(env?: IntranetEnv): string;
export declare const INTRANET_MACHINE_HOST: string;
export declare const INTRANET_ASSET_SERVICE_PORT = 12345;
export declare const INTRANET_ASSET_BASE_URL: string;
export declare const INTRANET_DEPS_BASE_URL: string;
export declare const INTRANET_PROBE_SERVICE_PORT = 3850;
export declare const INTRANET_PROBE_SERVICE_PATH = "/api/intranet/probe";
export declare const INTRANET_PROBE_SERVICE_URL: string;
export declare function resolveIntranetDepsBaseUrl(env?: IntranetEnv): string;
export {};
//# sourceMappingURL=intranetDefaults.d.ts.map