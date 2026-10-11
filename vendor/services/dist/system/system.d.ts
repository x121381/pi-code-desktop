import type { IntegratedTerminalShellOption, IntranetProbeRequest, IntranetProbeResult, SystemInfo } from "@zcode/shared";
export interface ISystemService {
    info(): Promise<SystemInfo>;
    listIntegratedTerminalShells(): Promise<IntegratedTerminalShellOption[]>;
    probeIntranet(request: IntranetProbeRequest): Promise<IntranetProbeResult>;
}
export declare const ISystemService: import("../descriptors.js").ServiceDescriptor<ISystemService>;
//# sourceMappingURL=system.d.ts.map