import { z } from "zod";
export declare const BACKGROUND_BASH_OUTPUT_MAX_BYTES = 8192;
/** 后台详情的单次文件快照；不进入 conversation snapshot 或持久化事件。 */
export declare const backgroundBashOutputSchema: z.ZodObject<{
    kind: z.ZodLiteral<"output">;
    workId: z.ZodString;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        spawn_error: "spawn_error";
        cancelled: "cancelled";
        timed_out: "timed_out";
    }>;
    output: z.ZodString;
    truncated: z.ZodBoolean;
    outputPath: z.ZodString;
}, z.core.$strict>;
export declare const backgroundBashOutputResultSchema: z.ZodUnion<readonly [z.ZodObject<{
    kind: z.ZodLiteral<"output">;
    workId: z.ZodString;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        spawn_error: "spawn_error";
        cancelled: "cancelled";
        timed_out: "timed_out";
    }>;
    output: z.ZodString;
    truncated: z.ZodBoolean;
    outputPath: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodEnum<{
        unavailable: "unavailable";
        unsupported: "unsupported";
        read_failed: "read_failed";
    }>;
    workId: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
}, z.core.$strict>]>;
export type BackgroundBashOutput = z.infer<typeof backgroundBashOutputSchema>;
export type BackgroundBashOutputResult = z.infer<typeof backgroundBashOutputResultSchema>;
//# sourceMappingURL=background-bash-output.d.ts.map