export interface AtomicWriteTextOptions {
    renameRetryDelaysMs?: readonly number[];
    lockRetryDelaysMs?: readonly number[];
    lockOwnerlessGraceMs?: number;
    lockMaxWaitMs?: number;
    tempFileStaleMs?: number;
    useFileLock?: boolean;
    beforeRename?: () => void | Promise<void>;
    runRename?: (renameFile: () => Promise<void>) => Promise<void>;
}
export declare function withAtomicFileLock<T>(filePath: string, task: () => Promise<T>, options?: Pick<AtomicWriteTextOptions, "lockRetryDelaysMs" | "lockOwnerlessGraceMs" | "lockMaxWaitMs">): Promise<T>;
/**
 * 使用临时文件 + rename 实现原子写入。
 * rename 在同文件系统上是原子的，可避免 read-modify-write 并发时的数据覆盖风险。
 * 临时文件写在目标文件同目录下，避免 Windows 跨卷 rename 失败。
 */
export declare function atomicWriteText(filePath: string, content: string, options?: AtomicWriteTextOptions): Promise<void>;
export declare function atomicWriteJson(filePath: string, data: Record<string, unknown>, options?: AtomicWriteTextOptions): Promise<void>;
//# sourceMappingURL=atomicFileUtils.d.ts.map