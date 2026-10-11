import type { ISystemService } from "./system.js";
interface TcpProbeParams {
    host: string;
    port: number;
    timeoutMs: number;
}
interface CreateSystemServiceOptions {
    env?: NodeJS.ProcessEnv;
    isExecutable?: (path: string) => boolean;
    platform?: NodeJS.Platform;
    tcpProbe?: (params: TcpProbeParams) => Promise<number>;
    serviceProbe?: (params: ServiceProbeParams) => Promise<ServiceProbeResult>;
    now?: () => number;
}
interface ServiceProbeParams {
    url: string;
    timeoutMs: number;
    token?: string;
}
interface ServiceProbeResult {
    latencyMs: number;
    marker?: string;
}
export declare function createSystemService(options?: CreateSystemServiceOptions): ISystemService;
export {};
//# sourceMappingURL=systemService.d.ts.map