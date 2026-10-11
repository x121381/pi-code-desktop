import { type StorageRootSpec, type StorageRootUsage, type StorageVolume } from "@zcode/shared";
export interface StorageScanEntry {
    relativePath: string;
    bytes: number;
    mtimeMs: number;
}
export interface StorageUsageAccumulator {
    add(entry: StorageScanEntry): void;
    snapshot(volume: StorageVolume | null): StorageRootUsage;
}
export declare const DEFAULT_MAX_ENTRIES_PER_CATEGORY = 100;
export declare function createStorageUsageAccumulator(spec: StorageRootSpec, options?: {
    maxEntriesPerCategory?: number;
}): StorageUsageAccumulator;
//# sourceMappingURL=usageAggregate.d.ts.map