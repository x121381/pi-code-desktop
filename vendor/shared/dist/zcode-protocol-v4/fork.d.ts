import { z } from "zod";
/** V4 stable assistant fork 的固定 logical-turn 边界。 */
export declare const stableForkTargetSchema: z.ZodObject<{
    productTurnId: z.ZodString;
    transcriptTurnId: z.ZodString;
    orderedMessageIds: z.ZodArray<z.ZodString>;
    boundaryMessageId: z.ZodString;
}, z.core.$strict>;
export type StableForkTarget = z.infer<typeof stableForkTargetSchema>;
export type StableForkTargetResolution = {
    ok: true;
    target: StableForkTarget;
} | {
    ok: false;
    reasonCode: "guard.forkAssistantOnly" | "guard.forkTargetNotStable" | "guard.forkTargetAmbiguous" | "guard.compactOperationLock";
};
//# sourceMappingURL=fork.d.ts.map