import type { StorageScanEntry } from "../domain/usageAggregate.js";
import type { StoragePathError } from "@zcode/shared";
export interface WalkStorageRootOptions {
    rootPath: string;
    onEntry: (entry: StorageScanEntry) => void;
    onError?: (error: StoragePathError) => void;
    signal?: AbortSignal;
    /** 同时打开的目录数，默认 4。 */
    concurrency?: number;
    /** 每处理多少条目让出一次事件循环，默认 256。 */
    yieldEvery?: number;
}
export interface WalkStorageRootResult {
    directoriesScanned: number;
    filesScanned: number;
    /** 根目录本身不存在时为 true（视为空根，不算错误）。 */
    missingRoot: boolean;
}
export declare function createStorageAbortError(): Error;
export declare function walkStorageRoot(options: WalkStorageRootOptions): Promise<WalkStorageRootResult>;
//# sourceMappingURL=fsWalker.d.ts.map