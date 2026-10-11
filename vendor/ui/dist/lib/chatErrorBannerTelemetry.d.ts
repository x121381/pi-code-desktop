import { type ArmsCustomEventPayload, type IPlatformService } from "@zcode/shared";
import { type ProviderBusinessErrorUiAction } from "@/lib/providerBusinessError.js";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
export declare const CHAT_ERROR_BANNER_ARMS_EVENT_NAME = "chat_error_banner";
export declare const CHAT_ERROR_BANNER_ARMS_GROUP = "ui_error";
export type ChatErrorBannerSurface = "chat_input_error_banner" | "session_subscription_error";
interface ChatProviderBusinessRecoveryAction {
    kind: ProviderBusinessErrorUiAction;
    providerBusinessCode: string;
}
export declare function resolveVisibleChatErrorTelemetryRecoveryAction(error: Pick<ZCodeUiError, "code" | "message">): ChatProviderBusinessRecoveryAction | null;
export declare function buildChatErrorBannerTelemetryPayload(params: {
    surface?: ChatErrorBannerSurface;
    errorKey?: string | null;
    displayMessage: string;
    error: ZCodeUiError;
    providerBusinessRecoveryAction: ChatProviderBusinessRecoveryAction | null;
}): ArmsCustomEventPayload;
export declare function reportChatErrorBannerTelemetry(platform: Pick<IPlatformService, "reportArmsCustomEvent">, params: {
    surface?: ChatErrorBannerSurface;
    errorKey?: string | null;
    displayMessage: string;
    error: ZCodeUiError;
    providerBusinessRecoveryAction: ChatProviderBusinessRecoveryAction | null;
}): Promise<void>;
export {};
//# sourceMappingURL=chatErrorBannerTelemetry.d.ts.map