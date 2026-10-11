import type { IStorageService } from "../contract.js";
import type { FsCleanerPort, RootsResolverPort, ScanRunnerPort } from "./ports.js";
export interface StorageServiceDependencies {
    roots: RootsResolverPort;
    scanRunner: ScanRunnerPort;
    cleaner: FsCleanerPort;
    now?: () => number;
    /** 进度事件最小间隔，默认 300ms。 */
    progressThrottleMs?: number;
}
export declare const DEFAULT_STORAGE_PROGRESS_THROTTLE_MS = 300;
export declare function createStorageService(deps: StorageServiceDependencies): IStorageService;
//# sourceMappingURL=storageService.d.ts.map