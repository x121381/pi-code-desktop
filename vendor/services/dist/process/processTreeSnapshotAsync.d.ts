import type { ChildProcess } from "node:child_process";
import type { ProcessIdentity, ProcessTreeSnapshot, ProcessTreeTerminatorOptions } from "#src/process/processTreeTypes.js";
export { verifyWindowsProcessIdentityAsync } from "#src/process/windowsProcessListAsync.js";
export declare function filterCurrentProcessIdentitiesAsync(identities: readonly ProcessIdentity[], options: ProcessTreeTerminatorOptions): Promise<ProcessIdentity[]>;
export declare function captureProcessTreeSnapshotAsync(child: ChildProcess, options?: ProcessTreeTerminatorOptions): Promise<ProcessTreeSnapshot | undefined>;
export declare function captureExitedRootDescendantsSnapshotAsync(rootPid: number, options?: ProcessTreeTerminatorOptions): Promise<ProcessTreeSnapshot | undefined>;
//# sourceMappingURL=processTreeSnapshotAsync.d.ts.map