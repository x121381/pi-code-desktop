import { z } from "zod";
/** Composer 可以显式提交的 Agent mode；auto 是 Runtime 内部状态，不进入用户 Submission。 */
export declare const submissionModeSchema: z.ZodEnum<{
    plan: "plan";
    build: "build";
    edit: "edit";
    yolo: "yolo";
    guarded: "guarded";
}>;
export type SubmissionMode = z.infer<typeof submissionModeSchema>;
//# sourceMappingURL=submission.d.ts.map