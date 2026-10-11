import type { ChildProcess } from "node:child_process";
import type { ProcessTreeOwnershipResolution, ProcessTreeTerminationResult, ProcessTreeTerminatorOptions, ProcessTreeTerminatorWaitOptions } from "#src/process/processTreeTypes.js";
type TerminateProcessTree = (child: ChildProcess, options: ProcessTreeTerminatorOptions) => void;
export declare function waitForProcessTreeTermination(child: ChildProcess, options: ProcessTreeTerminatorWaitOptions, initialOwnership: ProcessTreeOwnershipResolution, hasWindowsTaskkillTargets: boolean, terminateProcessTree: TerminateProcessTree): Promise<ProcessTreeTerminationResult>;
export {};
//# sourceMappingURL=processTreeWaiter.d.ts.map