import type { IntlInstance } from "./i18n/IntlProvider.js";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
export declare function resolveChatErrorBannerDisplayMessage(error: ZCodeUiError, intl: IntlInstance): string;
export declare function shouldSuppressChatErrorBanner(error: Pick<ZCodeUiError, "code" | "message">): boolean;
export declare function ChatErrorBanner({ error, onRetry, retryLabel, retryDisabled, onDismiss, onOpenModelSettings, onOpenUpgrade, }: {
    error: ZCodeUiError;
    onRetry?: () => void;
    retryLabel?: string;
    retryDisabled?: boolean;
    onDismiss?: () => void;
    onOpenModelSettings?: () => void;
    onOpenUpgrade?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ChatErrorBanner.d.ts.map