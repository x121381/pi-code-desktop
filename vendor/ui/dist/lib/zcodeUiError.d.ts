import type { ZCodeError, ZCodeTaskMeta, TraceId } from "@zcode/shared";
import { type ErrorAttribution } from "@zcode/shared/zcode-protocol-v4";
export interface ZCodeUiError extends ZCodeError {
    attribution?: ErrorAttribution;
    detail?: string;
    underlyingErrorMessage?: string;
    underlyingErrorDetail?: string;
}
interface NormalizeZCodeUiErrorOptions {
    fallbackCode?: string;
    fallbackMessage?: string;
    traceId?: TraceId;
    taskId?: string;
}
export declare function normalizeZCodeUiError(error: unknown, options?: NormalizeZCodeUiErrorOptions): ZCodeUiError;
export declare function normalizeRestoredTaskFailureError(meta: ZCodeTaskMeta): ZCodeUiError | null;
export {};
//# sourceMappingURL=zcodeUiError.d.ts.map