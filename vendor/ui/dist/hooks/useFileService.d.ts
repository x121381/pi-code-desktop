import type { FileEntry } from "@zcode/shared";
/** 读取目录内容，自带 loading/error/refresh 状态管理 */
export declare function useReaddir(path: string): {
    entries: FileEntry[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
//# sourceMappingURL=useFileService.d.ts.map