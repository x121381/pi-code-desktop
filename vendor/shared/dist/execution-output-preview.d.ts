import { z } from "zod";
/** 两端共用的 Bash 有界输出内容；不包含 replayable 传输恢复状态。 */
export declare const executionOutputPreviewSchema: z.ZodObject<{
    text: z.ZodString;
    fullText: z.ZodString;
    totalLines: z.ZodNumber;
    totalBytes: z.ZodNumber;
    linesEstimated: z.ZodBoolean;
}, z.core.$strict>;
export type ExecutionOutputPreview = z.infer<typeof executionOutputPreviewSchema>;
//# sourceMappingURL=execution-output-preview.d.ts.map