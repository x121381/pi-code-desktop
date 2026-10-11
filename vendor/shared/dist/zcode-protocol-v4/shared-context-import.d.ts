import { z } from "zod";
export declare const sharedContextImportStateSchema: z.ZodUnion<readonly [z.ZodObject<{
    contextId: z.ZodString;
    title: z.ZodString;
    shareUrl: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        reserved: "reserved";
        attached: "attached";
        discarded: "discarded";
    }>;
}, z.core.$strict>, z.ZodObject<{
    title: z.ZodString;
}, z.core.$strict>]>;
export type SharedContextImportState = z.infer<typeof sharedContextImportStateSchema>;
//# sourceMappingURL=shared-context-import.d.ts.map