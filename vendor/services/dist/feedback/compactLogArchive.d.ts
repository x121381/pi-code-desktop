interface ArchiveProgressEvent {
    processedBytes: number;
    totalBytes: number;
}
export declare function prepareCompactLogArchive(options?: {
    full?: boolean;
    createFullArchive?: (sourceDir: string, options?: {
        onProgress?: (event: ArchiveProgressEvent) => void;
    }) => Promise<{
        path: string;
        size: number;
    }>;
    onProgress?: (event: ArchiveProgressEvent) => void;
}): Promise<{
    path: string;
    size: number;
}>;
export declare function cleanupLogArchive(path: string): Promise<void>;
export {};
//# sourceMappingURL=compactLogArchive.d.ts.map