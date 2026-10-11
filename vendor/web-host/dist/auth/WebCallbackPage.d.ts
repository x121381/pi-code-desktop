import type { WebAuthCallbackResult, WebAuthService } from "./webAuthService.js";
interface WebCallbackPageProps {
    authService: Pick<WebAuthService, "handleCallback">;
    onSuccess: (result: WebAuthCallbackResult) => void;
    onRetry: () => void;
}
export declare function WebCallbackPage({ authService, onRetry, onSuccess }: WebCallbackPageProps): import("react/jsx-runtime").JSX.Element;
export {};
