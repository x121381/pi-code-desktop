import { z } from "zod";
export declare const sessionConfigStateSchema: z.ZodObject<{
    modelSelection: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        modelId: z.ZodString;
        options: z.ZodOptional<z.ZodObject<{
            reasoningLevel: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    provider: z.ZodString;
    model: z.ZodString;
    thought: z.ZodString;
    thoughtLevels: z.ZodDefault<z.ZodArray<z.ZodString>>;
    followupMode: z.ZodEnum<{
        queue: "queue";
        guide: "guide";
    }>;
    mode: z.ZodDefault<z.ZodString>;
    planEnabled: z.ZodOptional<z.ZodBoolean>;
    permissionGrant: z.ZodOptional<z.ZodObject<{
        interactionId: z.ZodString;
    }, z.core.$strip>>;
    planTransition: z.ZodOptional<z.ZodObject<{
        toolCallId: z.ZodString;
        planEnabled: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SessionConfigState = z.infer<typeof sessionConfigStateSchema>;
export declare const sessionModelTransitionSchema: z.ZodObject<{
    eventId: z.ZodString;
    origin: z.ZodLiteral<"registryFallback">;
    from: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
    }, z.core.$strip>;
    to: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SessionModelTransition = z.infer<typeof sessionModelTransitionSchema>;
//# sourceMappingURL=session-config.d.ts.map