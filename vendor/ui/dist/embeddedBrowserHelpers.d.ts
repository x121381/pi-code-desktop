export declare const DEFAULT_BROWSER_URL = "about:blank";
/**
 * 只对已经运行过、但被 Chromium 异常终止的 guest 做原位恢复。
 *
 * 过去只保持 `<webview>` DOM，没有覆盖其 renderer 被系统终止的情况；
 * 但 launch/integrity failure 不是“原页面被回收”，盲目重建只会形成无限循环。
 */
export declare function isRecoverableBrowserGuestExitReason(reason: string): boolean;
export declare function isWebviewDetachedError(error: unknown): boolean;
/**
 * 安全地执行一次 webview 同步调用：
 * - 正常返回调用结果；
 * - 命中“guest 未挂载 / frame 已销毁”这类生命周期竞态错误时，吞掉并返回 fallback，
 *   可选地通过 onDetached 记录（用于 debug 级日志，而非静默）；
 * - 其余错误继续向上抛，避免掩盖真正的 bug。
 */
export declare function safeWebviewCall<T>(call: () => T, fallback: T, onDetached?: (error: unknown) => void): T;
export interface BrowserGuestFailure {
    exitCode: number;
    reason: string;
}
export interface BrowserState {
    canGoBack: boolean;
    canGoForward: boolean;
    currentUrl: string;
    errorMessage: string | null;
    /**
     * 主 frame 加载失败的 Chromium net error 码。
     *
     * Electron 的 `<webview>` 没有 Chrome 的安全插页，被拒的导航只会落到一张空的
     * chrome-error 页，用户看到纯黑。错误码必须随 errorMessage 一起进状态，才能画出可读错误态
     * 并对证书类失败给出放行指引。
     */
    loadErrorCode: number | null;
    /** guest 从未成功出画面的进程级失败；与能画出可读错误态的 load error 分开。 */
    guestFailure: BrowserGuestFailure | null;
    isLoading: boolean;
    isReady: boolean;
    title: string;
}
export interface BrowserNavigationRequest {
    id: string;
    url: string;
}
export declare const INITIAL_BROWSER_STATE: BrowserState;
/**
 * 判断加载失败是否源于证书问题。
 *
 * 只有证书类失败才提示「可开启忽略证书校验」；DNS、连接被拒等失败给这条指引会误导用户。
 */
export declare function isCertificateBrowserLoadErrorCode(code: number | null | undefined): boolean;
export declare function isAllowedBrowserUrl(url: string): boolean;
/** 系统默认浏览器入口接受 Web URL 和 file URL，不能复用内置浏览器更宽的本地/内联协议白名单。 */
export declare function isDefaultBrowserOpenableUrl(url: string): boolean;
export declare function isLocalDevelopmentHost(host: string): boolean;
export declare function isLocalDevelopmentBrowserUrl(url: string): boolean;
export type MessageLinkOpenTarget = "app-browser" | "external-browser";
/**
 * 交互语义：右键菜单的两项是显式互补的目标选择，只有左键单击才走本机/私网启发式。
 * 之前菜单「打开」复用了左键默认行为，公网链接（如飞书文档）两项都会跳系统浏览器。
 */
export declare function resolveMessageLinkOpenTarget(input: {
    href: string;
    forceExternal?: boolean;
    forceInApp?: boolean;
}): MessageLinkOpenTarget;
export declare function normalizeBrowserUrl(input: string): string | null;
export declare function displayBrowserUrl(url: string): string;
//# sourceMappingURL=embeddedBrowserHelpers.d.ts.map