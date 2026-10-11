declare class OversizedInlineAttachmentError extends Error {
    readonly filename: string;
    readonly maxSizeBytes: number;
    readonly sizeBytes: number;
    constructor(name: string, message: string, options: {
        filename: string;
        maxSizeBytes: number;
        sizeBytes: number;
    });
}
export declare class OversizedInlineImageAttachmentError extends OversizedInlineAttachmentError {
    constructor(options: {
        filename: string;
        maxSizeBytes: number;
        sizeBytes: number;
    });
}
export declare class OversizedInlineVideoAttachmentError extends OversizedInlineAttachmentError {
    constructor(options: {
        filename: string;
        maxSizeBytes: number;
        sizeBytes: number;
    });
}
export declare class OversizedInlinePdfAttachmentError extends OversizedInlineAttachmentError {
    constructor(options: {
        filename: string;
        maxSizeBytes: number;
        sizeBytes: number;
    });
}
export declare class MissingInlinePdfContentError extends Error {
    readonly filename: string;
    readonly sizeBytes: number;
    constructor(options: {
        filename: string;
        sizeBytes: number;
    });
}
export declare class MissingInlineImageContentError extends Error {
    readonly filename: string;
    readonly sizeBytes: number;
    constructor(options: {
        filename: string;
        sizeBytes: number;
    });
}
export {};
//# sourceMappingURL=chatAttachmentErrors.d.ts.map