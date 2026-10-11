import { type ZCodeProvider, type ZCodeError } from "@zcode/shared";
export declare const MODEL_CONFIG_MISSING_UI_ERROR_CODE = "model_config_missing";
export type ModelConfigMissingUiError = ZCodeError & {
    code: typeof MODEL_CONFIG_MISSING_UI_ERROR_CODE;
};
export declare function buildModelConfigMissingUiError(): ModelConfigMissingUiError;
export declare function isProviderNotReadyError(error: unknown): boolean;
interface WorkspacePrepareErrorContext {
    workspacePath: string;
    provider: ZCodeProvider;
    reason: "mount" | "retry" | "first-send" | "select-provider" | "reload-session" | "sync-model-config";
    attempt: number;
    maxAttempts: number;
    taskId?: string;
    displayMessage?: string;
}
export declare function getChatErrorMessage(err: unknown): string;
export declare function buildWorkspacePrepareUiError(err: unknown, context: WorkspacePrepareErrorContext): ZCodeError & {
    detail?: string;
};
export declare function buildCachedWorkspacePrepareUiError(message: string, cachedError: (ZCodeError & {
    detail?: string;
}) | null | undefined, context: WorkspacePrepareErrorContext): ZCodeError & {
    detail?: string;
};
export {};
//# sourceMappingURL=chatPrepareError.d.ts.map