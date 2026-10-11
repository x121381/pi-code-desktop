import type { ZCodePromptAttachment } from "@zcode/shared";
import type { AttachmentRef, V4AttachmentPutParams, V4AttachmentPutResult } from "@zcode/shared/zcode-protocol-v4";
import type { AttachmentUploadOptions } from "@/v4/attachmentUploadTransaction.js";
export type AttachmentPutFn = (params: V4AttachmentPutParams, options?: AttachmentUploadOptions) => Promise<V4AttachmentPutResult>;
/** 单个附件 → AttachmentRef（需要上传时经 chunk transaction）。返回 null = 无内容可发（丢弃）。 */
export declare function uploadComposerAttachment(put: AttachmentPutFn, sessionId: string, attachment: ZCodePromptAttachment, options?: AttachmentUploadOptions): Promise<AttachmentRef | null>;
/**
 * 附件数组 → AttachmentRef[]（顺序保持）。put 失败原样抛出（调用方中止发送，草稿保留）。
 */
export declare function uploadComposerAttachments(put: AttachmentPutFn, sessionId: string, attachments: readonly ZCodePromptAttachment[]): Promise<AttachmentRef[]>;
//# sourceMappingURL=attachmentUpload.d.ts.map