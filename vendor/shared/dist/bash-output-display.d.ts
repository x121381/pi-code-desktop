import { z } from "zod";
export declare const bashOutputDisplaySchema: z.ZodObject<{
    kind: z.ZodLiteral<"bash_output">;
    output: z.ZodString;
    truncated: z.ZodBoolean;
    outputPath: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//# sourceMappingURL=bash-output-display.d.ts.map