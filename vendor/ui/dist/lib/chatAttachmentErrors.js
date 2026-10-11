class OversizedInlineAttachmentError extends Error {
    filename;
    maxSizeBytes;
    sizeBytes;
    constructor(name, message, options) {
        super(message);
        this.name = name;
        this.filename = options.filename;
        this.maxSizeBytes = options.maxSizeBytes;
        this.sizeBytes = options.sizeBytes;
    }
}
export class OversizedInlineImageAttachmentError extends OversizedInlineAttachmentError {
    constructor(options) {
        super("OversizedInlineImageAttachmentError", "oversized-inline-image-attachment", options);
    }
}
export class OversizedInlineVideoAttachmentError extends OversizedInlineAttachmentError {
    constructor(options) {
        super("OversizedInlineVideoAttachmentError", "oversized-inline-video-attachment", options);
    }
}
export class OversizedInlinePdfAttachmentError extends OversizedInlineAttachmentError {
    constructor(options) {
        super("OversizedInlinePdfAttachmentError", "oversized-inline-pdf-attachment", options);
    }
}
export class MissingInlinePdfContentError extends Error {
    filename;
    sizeBytes;
    constructor(options) {
        super("missing-inline-pdf-content");
        this.name = "MissingInlinePdfContentError";
        this.filename = options.filename;
        this.sizeBytes = options.sizeBytes;
    }
}
export class MissingInlineImageContentError extends Error {
    filename;
    sizeBytes;
    constructor(options) {
        super("missing-inline-image-content");
        this.name = "MissingInlineImageContentError";
        this.filename = options.filename;
        this.sizeBytes = options.sizeBytes;
    }
}
//# sourceMappingURL=chatAttachmentErrors.js.map