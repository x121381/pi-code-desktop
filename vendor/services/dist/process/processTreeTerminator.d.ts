import type { ChildProcess } from "node:child_process";
import type { ProcessTreeTerminationResult, ProcessTreeTerminatorOptions, ProcessTreeTerminatorWaitOptions } from "#src/process/processTreeTypes.js";
export { captureProcessGroupSnapshot, captureExitedRootDescendantsSnapshot, captureProcessTreeSnapshot, } from "#src/process/processTreeSnapshot.js";
export { captureExitedRootDescendantsSnapshotAsync, captureProcessTreeSnapshotAsync, filterCurrentProcessIdentitiesAsync, } from "#src/process/processTreeSnapshotAsync.js";
export type { ProcessIdentity, ProcessTreeSnapshot, ProcessTreeTerminationResult, ProcessTreeTerminatorLogger, ProcessTreeTerminatorOptions, ProcessTreeTerminatorWaitOptions, WindowsTaskkillRequest, WindowsTaskkillResult, WindowsTaskkillRunner, } from "#src/process/processTreeTypes.js";
export declare function shouldSpawnInDetachedProcessGroup(): boolean;
export declare function terminateProcessTree(child: ChildProcess, options?: ProcessTreeTerminatorOptions): void;
export declare function terminateProcessTreeAndWait(child: ChildProcess, options?: ProcessTreeTerminatorWaitOptions): Promise<ProcessTreeTerminationResult>;
//# sourceMappingURL=processTreeTerminator.d.ts.map