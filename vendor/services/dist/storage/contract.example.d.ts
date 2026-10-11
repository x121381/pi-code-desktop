import type { IStorageService, StorageUsageSnapshot } from "./contract.js";
/**
 * 契约用法示例：进入分区时订阅进度并开始扫描，离开时取消；清理后重新扫描。
 * 这是 UI hook 的最小骨架，不含任何实现细节。
 */
export declare function useStorageSection(storage: IStorageService, render: (snapshot: StorageUsageSnapshot) => void): Promise<{
    leave: () => Promise<void>;
    cleanTrajectories: () => Promise<void>;
}>;
//# sourceMappingURL=contract.example.d.ts.map