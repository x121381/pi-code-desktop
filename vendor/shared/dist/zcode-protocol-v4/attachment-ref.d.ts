import { z } from "zod";
/** 仅承载已提交内容引用与展示元信息；内容本体不进入 command/topic frame。 */
export declare const attachmentRefSchema: z.ZodObject<{
    ref: z.ZodString;
    fileName: z.ZodString;
    mime: z.ZodString;
    bytes: z.ZodNumber;
    sourceKind: z.ZodOptional<z.ZodEnum<{
        "clipboard-text": "clipboard-text";
        "topic-history": "topic-history";
    }>>;
    messageCount: z.ZodOptional<z.ZodNumber>;
    previewRef: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type AttachmentRef = z.infer<typeof attachmentRefSchema>;
//# sourceMappingURL=attachment-ref.d.ts.map