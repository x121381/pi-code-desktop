import { type ServiceLogger } from "#src/logger/serviceLogger.js";
import type { IFileWatcherService } from "./fileWatcher.js";
export declare function resolveFileWatchChangedPath(watchedDirectoryPath: string, fileName: string | Buffer | null): string | undefined;
export declare function createFileWatcherService(options?: {
    logger?: ServiceLogger;
}): IFileWatcherService;
//# sourceMappingURL=fileWatcherService.d.ts.map