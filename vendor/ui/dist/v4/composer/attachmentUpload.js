import { logger } from "@/logger.js";
function encodeTextToBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
}
function base64ByteLength(dataBase64) {
    const padding = dataBase64.endsWith("==") ? 2 : dataBase64.endsWith("=") ? 1 : 0;
    return Math.floor((dataBase64.length * 3) / 4) - padding;
}
/** 单个附件 → AttachmentRef（需要上传时经 chunk transaction）。返回 null = 无内容可发（丢弃）。 */
export async function uploadComposerAttachment(put, sessionId, attachment, options) {
    const fileName = attachment.filename;
    const mime = attachment.mimeType;
    const source = attachment.kind === "file" && attachment.sourceKind
        ? { sourceKind: attachment.sourceKind, messageCount: attachment.messageCount }
        : {};
    // audio 变体无 sizeBytes 字段；统一经窄化读取。
    const sizeBytes = "sizeBytes" in attachment && typeof attachment.sizeBytes === "number"
        ? attachment.sizeBytes
        : undefined;
    if (attachment.localPath) {
        return {
            ...source,
            ref: attachment.localPath,
            fileName,
            mime,
            bytes: sizeBytes ?? 0,
        };
    }
    const dataBase64 = "dataBase64" in attachment && attachment.dataBase64
        ? attachment.dataBase64
        : "textContent" in attachment && attachment.textContent !== undefined
            ? encodeTextToBase64(attachment.textContent)
            : null;
    if (dataBase64 === null) {
        logger.warn(`[v4-composer] 附件无内容可发（无 localPath/dataBase64/textContent），已丢弃: ${fileName}`);
        return null;
    }
    const { ref } = await put({ sessionId, fileName, mime, dataBase64 }, options);
    return {
        ...source,
        ref,
        fileName,
        mime,
        bytes: sizeBytes ?? base64ByteLength(dataBase64),
    };
}
/**
 * 附件数组 → AttachmentRef[]（顺序保持）。put 失败原样抛出（调用方中止发送，草稿保留）。
 */
export async function uploadComposerAttachments(put, sessionId, attachments) {
    const refs = [];
    for (const attachment of attachments) {
        const ref = await uploadComposerAttachment(put, sessionId, attachment);
        if (ref) {
            refs.push(ref);
        }
    }
    return refs;
}
//# sourceMappingURL=attachmentUpload.js.map