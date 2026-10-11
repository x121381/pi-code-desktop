import { z } from "zod";
export const sharedContextRefSchema = z
    .object({
    kind: z.literal("shared_context_import"),
    context_id: z.string().trim().min(1),
})
    .strict();
//# sourceMappingURL=shared-context-ref.js.map