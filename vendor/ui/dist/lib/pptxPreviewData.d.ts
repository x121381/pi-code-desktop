export declare class PptxPreviewIncompleteFileError extends Error {
    readonly expectedBytes: number;
    readonly actualBytes: number;
    readonly observedFileSize?: number | undefined;
    readonly code = "PPTX_PREVIEW_INCOMPLETE_FILE";
    constructor(expectedBytes: number, actualBytes: number, observedFileSize?: number | undefined);
}
export declare function isPptxPreviewIncompleteFileError(error: unknown): error is PptxPreviewIncompleteFileError;
export declare function assertPptxPreviewDataComplete({ expectedBytes, actualBytes, observedFileSize, }: {
    expectedBytes: number;
    actualBytes: number;
    observedFileSize?: number;
}): void;
export declare function readPptxPreviewData({ fileSize, readRange, isDisposed, }: {
    fileSize: number;
    readRange: (offset: number, length: number) => Promise<Uint8Array>;
    isDisposed: () => boolean;
}): Promise<ArrayBuffer | null>;
//# sourceMappingURL=pptxPreviewData.d.ts.map