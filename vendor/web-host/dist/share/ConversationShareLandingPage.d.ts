import type { ConversationSharePreview } from "@zcode/shared";
import { type Theme } from "@zcode/ui/useTheme";
import "./conversationShareLandingPage.css";
import type { WebOAuthProviderId } from "../auth/browserOAuthCredentialRepo.js";
import { type ConversationSharePreviewErrorKind } from "./conversationSharePreviewClient.js";
export type ConversationShareLandingLocale = "zh-CN" | "en-US";
export type ConversationShareLandingState = {
    kind: "loading";
} | {
    kind: "login_required";
} | {
    kind: "ready";
    preview: ConversationSharePreview;
} | {
    kind: "error";
    error: ConversationSharePreviewErrorKind;
};
export declare function ConversationShareLandingPage({ shareCode, preview, locale, theme, onThemeChange, }: {
    shareCode: string;
    preview: ConversationSharePreview;
    locale?: ConversationShareLandingLocale;
    theme?: Theme;
    onThemeChange?: (theme: Theme) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ConversationShareLandingStatus({ state, locale, onLogin, onRetry, }: {
    state: Exclude<ConversationShareLandingState, {
        kind: "ready";
    }>;
    locale?: ConversationShareLandingLocale;
    onLogin?: (provider: WebOAuthProviderId) => void;
    onRetry?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function ConversationShareLandingLoader({ shareCode, client, getAccessToken, onLogin, onLogout, locale, theme, }: {
    shareCode: string;
    client: {
        getPreview: (shareCode: string, accessToken?: string) => Promise<ConversationSharePreview>;
    };
    getAccessToken?: () => string | null;
    onLogin?: (provider: WebOAuthProviderId) => void;
    onLogout?: () => void;
    locale?: ConversationShareLandingLocale;
    theme?: Theme;
}): import("react/jsx-runtime").JSX.Element;
