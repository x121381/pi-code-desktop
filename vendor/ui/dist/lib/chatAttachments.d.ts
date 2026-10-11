import { type CreateTempTextAttachmentResult, type ZCodePromptAttachment } from "@zcode/shared";
export { MissingInlineImageContentError, MissingInlinePdfContentError, OversizedInlineImageAttachmentError, OversizedInlinePdfAttachmentError, OversizedInlineVideoAttachmentError, } from "@/lib/chatAttachmentErrors.js";
export { countClipboardTextLines, formatAttachmentSize, shouldPreferSpreadsheetClipboardText, } from "@/lib/chatAttachmentMetadata.js";
export declare const MAX_CHAT_ATTACHMENTS = 8;
export declare const LONG_PASTE_TEXT_ATTACHMENT_CHAR_THRESHOLD: number;
export type ChatComposerAttachmentSourceKind = "clipboard-text" | "topic-history";
export interface ChatComposerAttachment {
    id: string;
    file?: File;
    filename: string;
    sourceKind?: ChatComposerAttachmentSourceKind;
    messageCount?: number;
    lineCount?: number;
    charCount?: number;
    mimeType: string;
    sizeBytes: number;
    objectUrl?: string;
    localPath?: string;
}
export declare function createChatComposerAttachment(file: File, localPath?: string): ChatComposerAttachment;
export declare function createChatComposerPathAttachment(localPath: string): ChatComposerAttachment;
export declare function createClipboardTextComposerAttachment(text: string, options?: {
    now?: Date;
}): ChatComposerAttachment;
export declare function createClipboardTextPathComposerAttachment(text: string, attachment: CreateTempTextAttachmentResult): ChatComposerAttachment;
export declare function shouldCreateClipboardTextAttachment(text: string): boolean;
export declare function createClipboardTextAttachmentFilenameForDate(now?: Date): string;
export declare function restoreChatComposerAttachment(attachment: ZCodePromptAttachment): ChatComposerAttachment;
export declare function revokeChatComposerAttachment(attachment: ChatComposerAttachment): void;
export declare function serializeChatComposerAttachment(attachment: ChatComposerAttachment): Promise<ZCodePromptAttachment>;
export declare function getChatAttachmentPreviewUrl(attachment: ZCodePromptAttachment): string | null;
export declare function isImageChatComposerAttachment(attachment: ChatComposerAttachment): boolean;
export declare function isVideoChatComposerAttachment(attachment: ChatComposerAttachment): boolean;
export declare function isPdfChatComposerAttachment(attachment: ChatComposerAttachment): boolean;
/** 图片与视频同属媒体组：输入框与消息流统一按媒体卡片渲染。 */
export declare function isMediaChatComposerAttachment(attachment: ChatComposerAttachment): boolean;
//# sourceMappingURL=chatAttachments.d.ts.map