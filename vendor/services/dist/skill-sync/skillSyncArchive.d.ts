export interface SkillSyncArchiveEntry {
    sourcePath: string;
    archivePath: string;
}
export interface SkillSyncArchiveExtractOptions {
    maxExtractedBytes?: number;
}
export declare function createSkillSyncArchive(entries: readonly SkillSyncArchiveEntry[]): Promise<Uint8Array>;
export declare function extractSkillSyncArchive(archive: Uint8Array, targetDir: string, options?: SkillSyncArchiveExtractOptions): Promise<void>;
//# sourceMappingURL=skillSyncArchive.d.ts.map