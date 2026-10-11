import { z } from "zod";
/** 文本材料只传递文件引用，不能因跨端上传而退回自动全文注入。 */
export declare const attachmentSourceKindSchema: z.ZodEnum<{
    "clipboard-text": "clipboard-text";
    "topic-history": "topic-history";
}>;
export type AttachmentSourceKind = z.infer<typeof attachmentSourceKindSchema>;
//# sourceMappingURL=attachment-source.d.ts.map