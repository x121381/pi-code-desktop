import type { FileEntry } from "@zcode/shared";
/**
 * 带文件系统监视的目录读取 hook
 *
 * 与 useReaddir 接口一致，但在挂载时自动 watch 目录，
 * 收到变更事件时自动 refresh。卸载时自动 unwatch。
 */
export declare function useWatchedReaddir(path: string): {
    entries: FileEntry[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useFileWatcherService.d.ts.map