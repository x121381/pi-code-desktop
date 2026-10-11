const PPTX_RANGE_CHUNK_BYTES = 256 * 1024;
const PPTX_PREVIEW_INCOMPLETE_FILE_ERROR_CODE = "PPTX_PREVIEW_INCOMPLETE_FILE";
export class PptxPreviewIncompleteFileError extends Error {
    expectedBytes;
    actualBytes;
    observedFileSize;
    code = PPTX_PREVIEW_INCOMPLETE_FILE_ERROR_CODE;
    constructor(expectedBytes, actualBytes, observedFileSize) {
        super(observedFileSize === undefined
            ? `PPTX preview read was incomplete: expected ${expectedBytes} bytes, received ${actualBytes}`
            : `PPTX preview file size changed while reading: expected ${expectedBytes} bytes, received ${actualBytes}, current size ${observedFileSize}`);
        this.expectedBytes = expectedBytes;
        this.actualBytes = actualBytes;
        this.observedFileSize = observedFileSize;
        this.name = "PptxPreviewIncompleteFileError";
    }
}
export function isPptxPreviewIncompleteFileError(error) {
    return (error instanceof PptxPreviewIncompleteFileError ||
        (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === PPTX_PREVIEW_INCOMPLETE_FILE_ERROR_CODE));
}
export function assertPptxPreviewDataComplete({ expectedBytes, actualBytes, observedFileSize, }) {
    if (actualBytes !== expectedBytes ||
        (observedFileSize !== undefined && observedFileSize !== expectedBytes)) {
        throw new PptxPreviewIncompleteFileError(expectedBytes, actualBytes, observedFileSize);
    }
}
export async function readPptxPreviewData({ fileSize, readRange, isDisposed, }) {
    const data = new Uint8Array(fileSize);
    let offset = 0;
    for (; offset < fileSize;) {
        const requestedLength = Math.min(PPTX_RANGE_CHUNK_BYTES, fileSize - offset);
        const chunk = await readRange(offset, requestedLength);
        if (isDisposed()) {
            return null;
        }
        if (chunk.length === 0) {
            // readFileRange 可能在文件被并发截断或远端版本不一致时返回空 chunk。
            // 之前这里直接裁剪已读 buffer 并交给 ZIP 解析器，导致原始读取位置丢失且只显示泛化失败。
            throw new PptxPreviewIncompleteFileError(fileSize, offset);
        }
        if (chunk.length > requestedLength) {
            throw new Error(`PPTX preview range exceeded request: requested ${requestedLength} bytes, received ${chunk.length}`);
        }
        data.set(chunk, offset);
        offset += chunk.length;
    }
    assertPptxPreviewDataComplete({ expectedBytes: fileSize, actualBytes: offset });
    return data.buffer;
}
//# sourceMappingURL=pptxPreviewData.js.map