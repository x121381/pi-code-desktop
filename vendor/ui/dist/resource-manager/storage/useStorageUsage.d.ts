import type { StorageCleanRequest, StorageCleanResult, StorageManagementBridge, StorageUsageSnapshot } from "@zcode/shared";
export declare const STORAGE_SCAN_BLUR_CANCEL_MS = 60000;
export interface StorageUsageState {
    snapshot: StorageUsageSnapshot | null;
    scanning: boolean;
    rescan: () => Promise<void>;
    clean: (request: StorageCleanRequest) => Promise<StorageCleanResult>;
}
export declare function useStorageUsage({ bridge, enabled, }: {
    bridge: StorageManagementBridge | undefined;
    enabled: boolean;
}): StorageUsageState;
//# sourceMappingURL=useStorageUsage.d.ts.map