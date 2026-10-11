/**
 * Excel 会同时写入 plain text、HTML 和一张合成 PNG；有表格文本证据时应让文本获胜。
 * 制表符覆盖多列复制，Excel HTML 标记覆盖单单元格和单列复制。
 */
export declare function shouldPreferSpreadsheetClipboardText(text: string, html: string): boolean;
export declare function countClipboardTextLines(text: string): number;
export declare function createClipboardTextAttachmentFilename(now: Date): string;
export declare function basenameFromPath(path: string): string;
export declare function inferAttachmentMimeType(filename: string): string;
export declare function isTextLikeAttachment(attachment: {
    filename: string;
    mimeType: string;
}): boolean;
export declare function formatAttachmentSize(sizeBytes: number): string;
//# sourceMappingURL=chatAttachmentMetadata.d.ts.map