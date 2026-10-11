import { z } from "zod";
export declare const ZCODE_PROCESS_DIAGNOSTIC_PREFIX = "[zcode-process-exception] ";
export declare const ZCODE_PROCESS_DIAGNOSTIC_NAME_MAX_CHARS = 128;
export declare const ZCODE_PROCESS_DIAGNOSTIC_MESSAGE_MAX_CHARS = 4000;
export declare const ZCODE_PROCESS_DIAGNOSTIC_STACK_MAX_CHARS = 16000;
export declare const ZCODE_PROCESS_DIAGNOSTIC_MAX_LINE_CHARS: number;
export declare const ZCODE_AGENT_LIFECYCLE_LOG_MARKER = "[zcode-agent-lifecycle-reported]";
export declare const zcodeProcessDiagnosticSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    errorId: z.ZodUUID;
    kind: z.ZodEnum<{
        uncaughtException: "uncaughtException";
        unhandledRejection: "unhandledRejection";
    }>;
    origin: z.ZodEnum<{
        uncaughtException: "uncaughtException";
        unhandledRejection: "unhandledRejection";
    }>;
    name: z.ZodString;
    message: z.ZodString;
    stack: z.ZodOptional<z.ZodString>;
    occurredAt: z.ZodNumber;
}, z.core.$strict>;
export type ZCodeProcessDiagnostic = z.infer<typeof zcodeProcessDiagnosticSchema>;
export declare function parseZCodeProcessDiagnostic(line: string): ZCodeProcessDiagnostic | undefined;
//# sourceMappingURL=process-diagnostic.d.ts.map