import type { ChildProcess } from "node:child_process";
import type { ProcessIdentity, ProcessTreeOwnershipResolution, ProcessTreeTerminatorOptions } from "#src/process/processTreeTypes.js";
export declare function resolveCurrentOwnedIdentities(child: ChildProcess, knownIdentities: readonly ProcessIdentity[], options: ProcessTreeTerminatorOptions, allowRootDiscovery?: boolean): ProcessTreeOwnershipResolution;
export declare function resolveCurrentOwnedIdentitiesAsync(child: ChildProcess, knownIdentities: readonly ProcessIdentity[], options: ProcessTreeTerminatorOptions, allowRootDiscovery?: boolean): Promise<ProcessTreeOwnershipResolution>;
//# sourceMappingURL=processTreeOwnership.d.ts.map