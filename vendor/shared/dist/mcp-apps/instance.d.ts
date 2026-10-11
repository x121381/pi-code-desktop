import { z } from "zod";
/** Agent 签发的内存凭证；Main 的 initId 只用于端口握手。 */
export declare const mcpAppInstanceSchema: z.ZodObject<{
    runtimeId: z.ZodString;
    generation: z.ZodNumber;
    appIdentity: z.ZodString;
    token: z.ZodString;
}, z.core.$strict>;
export type McpAppInstance = z.infer<typeof mcpAppInstanceSchema>;
//# sourceMappingURL=instance.d.ts.map