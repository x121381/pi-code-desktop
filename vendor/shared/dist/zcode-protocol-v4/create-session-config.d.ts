import { z } from "zod";
export declare const createSessionRequestedConfigSchema: z.ZodObject<{
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    provider: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    thought: z.ZodOptional<z.ZodString>;
    followupMode: z.ZodOptional<z.ZodEnum<{
        queue: "queue";
        guide: "guide";
    }>>;
    mode: z.ZodOptional<z.ZodString>;
    planEnabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=create-session-config.d.ts.map