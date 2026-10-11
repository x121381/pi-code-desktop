export interface SharedFileLockOptions {
    lockRetryDelaysMs?: readonly number[];
    lockOwnerlessGraceMs?: number;
    lockMaxWaitMs?: number;
}
export declare function withFileLock<T>(filePath: string, operation: () => Promise<T>, options?: SharedFileLockOptions): Promise<T>;
export declare function atomicWritePrivateTextFile(filePath: string, content: string, renameRetryDelaysMs?: readonly number[]): Promise<void>;
export declare function backupCorruptFile(filePath: string): Promise<string>;
//# sourceMappingURL=privateFilePersistence.d.ts.map