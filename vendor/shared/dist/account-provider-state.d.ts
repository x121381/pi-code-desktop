import { z } from "zod";
export declare const accountProviderUnavailableReasonSchema: z.ZodEnum<{
    "not-authenticated": "not-authenticated";
    "not-connected": "not-connected";
    "credential-failed": "credential-failed";
    "not-entitled": "not-entitled";
}>;
export type AccountProviderUnavailableReason = z.infer<typeof accountProviderUnavailableReasonSchema>;
//# sourceMappingURL=account-provider-state.d.ts.map