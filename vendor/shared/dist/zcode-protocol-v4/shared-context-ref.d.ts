import { z } from "zod";
export declare const sharedContextRefSchema: z.ZodObject<{
    kind: z.ZodLiteral<"shared_context_import">;
    context_id: z.ZodString;
}, z.core.$strict>;
export type SharedContextRef = z.infer<typeof sharedContextRefSchema>;
//# sourceMappingURL=shared-context-ref.d.ts.map