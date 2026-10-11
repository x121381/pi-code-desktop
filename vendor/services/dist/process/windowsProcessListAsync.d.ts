import type { ProcessIdentity, ProcessTreeTerminatorOptions } from "#src/process/processTreeTypes.js";
export declare function verifyWindowsProcessIdentityAsync(identity: ProcessIdentity, timeoutMs: number, options?: ProcessTreeTerminatorOptions): Promise<boolean>;
export declare function readWindowsProcessListAsync(options: ProcessTreeTerminatorOptions): Promise<readonly ProcessIdentity[]>;
//# sourceMappingURL=windowsProcessListAsync.d.ts.map