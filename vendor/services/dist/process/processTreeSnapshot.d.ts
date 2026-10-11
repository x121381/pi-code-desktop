import { type ChildProcess } from "node:child_process";
import type { ProcessIdentity, ProcessTreeSnapshot, ProcessTreeTerminatorOptions } from "#src/process/processTreeTypes.js";
export declare function filterCurrentProcessIdentities(identities: readonly ProcessIdentity[], options: ProcessTreeTerminatorOptions): ProcessIdentity[];
export declare function captureProcessTreeSnapshot(child: ChildProcess, options?: ProcessTreeTerminatorOptions): ProcessTreeSnapshot | undefined;
export declare function captureProcessGroupSnapshot(processGroupId: number, options?: ProcessTreeTerminatorOptions): ProcessTreeSnapshot | undefined;
export declare function captureExitedRootDescendantsSnapshot(rootPid: number, options?: ProcessTreeTerminatorOptions): ProcessTreeSnapshot | undefined;
//# sourceMappingURL=processTreeSnapshot.d.ts.map