import type { FormEvent, ReactNode } from "react";
import { type BrowserGuestFailure, type BrowserState } from "@/embeddedBrowserHelpers.js";
export declare function BrowserToolbar({ addressValue, browserState, permissionControl, formatMessage, onAddressChange, onGoBack, onGoForward, onOpenExternal, onOpenDevTools, onPickElement, onReload, onToggleResponsiveMode, onSubmit, isElementPickerActive, isResponsiveMode, }: {
    addressValue: string;
    browserState: BrowserState;
    /** 地址栏左侧的站点设置入口；聚焦编辑 URL 时隐藏但不卸载。 */
    permissionControl?: ReactNode;
    formatMessage: (descriptor: {
        id: string;
    }) => string;
    onAddressChange: (value: string) => void;
    onGoBack: () => void;
    onGoForward: () => void;
    onOpenExternal: () => void;
    onOpenDevTools: () => void;
    onPickElement: () => void;
    onReload: () => void;
    onToggleResponsiveMode: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isElementPickerActive: boolean;
    isResponsiveMode: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function BrowserEmptyState({ browserState, formatMessage, isGuestStarting, }: {
    browserState: BrowserState;
    formatMessage: (descriptor: {
        id: string;
    }) => string;
    isGuestStarting?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 页面加载失败时的可读错误态。
 *
 * Electron 的 `<webview>` 不带 Chrome 的安全插页，被拒的导航只落到一张空的
 * chrome-error 页；过去 errorMessage 只写进 state 没有渲染消费者，空置态又同时被关掉，
 * 用户最终只看到纯黑。证书类失败额外给出放行指引，避免用户无从下手。
 */
export declare function BrowserLoadErrorState({ errorMessage, formatMessage, isCertificateError, onRetry, }: {
    errorMessage: string;
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, number | string>) => string;
    isCertificateError: boolean;
    onRetry: () => void;
}): import("react/jsx-runtime").JSX.Element;
/** guest 启动失败时由宿主接管画面；自动重建会形成失败循环，因此只提供显式重试。 */
export declare function BrowserGuestFailureState({ formatMessage, guestFailure, onRetry, }: {
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, number | string>) => string;
    guestFailure: BrowserGuestFailure;
    onRetry: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmbeddedBrowserPaneParts.d.ts.map