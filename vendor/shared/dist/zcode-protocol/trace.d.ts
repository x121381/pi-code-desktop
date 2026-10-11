import { z } from "zod";
export declare const zcodeProtocolTraceSchema: z.ZodObject<{
    traceId: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
    traceparent: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type ZCodeProtocolTrace = z.infer<typeof zcodeProtocolTraceSchema>;
//# sourceMappingURL=trace.d.ts.map