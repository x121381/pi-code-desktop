import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { BROWSER_VIEW_RESTORE_BOOTSTRAP_URL, TID_BROWSER_WEBVIEW, } from "@zcode/shared";
import { TriangleAlertIcon } from "lucide-react";
import { ResponsiveBrowserViewport } from "@/browser-use/ResponsiveBrowserViewport.js";
import { resolveResponsiveBrowserGuestLayout, } from "@/browser-use/browserViewportZoom.js";
import { cn } from "@/components/lib/utils.js";
import { BrowserEmptyState, BrowserGuestFailureState, BrowserLoadErrorState, } from "@/EmbeddedBrowserPaneParts.js";
import { DEFAULT_BROWSER_URL, isCertificateBrowserLoadErrorCode, } from "@/embeddedBrowserHelpers.js";
export function BrowserViewportSurface({ browserRegionRef, browserState, desktopZoomFactor, isResidencyRestore, formatMessage, isEmptyBrowserState, isComposed, isResponsiveMode, isViewportEmulated = isResponsiveMode, onRetryGuest, onRetryLoad, onViewportResize, onViewportSizeChange, onWebviewRef, shouldMountWebview = true, showResizeWarning, webviewGeneration, viewportSize, viewportZoom, }) {
    const { guestFailure } = browserState;
    // guest 进程级失败优先于 load error：前者连画面都没有，后者只是这次导航被拒。
    const loadError = !guestFailure && browserState.errorMessage ? browserState.errorMessage : null;
    // 自然 viewport 没有 metrics 固定逻辑尺寸，临时 responsive frame 不代表 guest 可以扩张。
    const responsiveGuestLayout = resolveResponsiveBrowserGuestLayout(desktopZoomFactor);
    const responsiveGuestLayoutScale = isViewportEmulated ? responsiveGuestLayout.layoutScale : 1;
    const responsiveGuestTransformScale = isViewportEmulated
        ? responsiveGuestLayout.transformScale
        : 1;
    const needsResponsiveGuestLayout = isResponsiveMode && responsiveGuestLayoutScale !== 1;
    const responsiveGuestLayoutSize = `calc(100% * ${responsiveGuestLayoutScale})`;
    const handleWebviewRef = useCallback((node) => {
        onWebviewRef(node);
    }, [onWebviewRef]);
    return (_jsxs("div", { ref: browserRegionRef, className: "relative min-h-0 min-w-0 flex-1 overflow-hidden bg-background", children: [showResizeWarning ? (_jsxs("div", { role: "status", "aria-live": "polite", "data-browser-resize-warning": "visible", className: "pointer-events-none absolute top-2 right-2 left-2 z-20 mx-auto flex w-fit max-w-full items-center gap-2 rounded-xl border border-popover-border bg-popover px-3 py-2 text-ui-base font-medium text-foreground shadow-md", children: [_jsx("span", { "aria-hidden": "true", "data-browser-resize-warning-accent": "visible", className: "h-5 w-0.5 shrink-0 rounded-full bg-warning" }), _jsx(TriangleAlertIcon, { "aria-hidden": "true", className: "size-4 shrink-0 text-warning" }), _jsx("span", { children: formatMessage({ id: "browser.resizeDuringOperationWarning" }) })] })) : null, _jsxs(ResponsiveBrowserViewport, { active: isResponsiveMode, desktopZoomFactor: desktopZoomFactor, isComposed: isComposed, onResize: onViewportResize, onViewportSizeChange: onViewportSizeChange, viewportSize: viewportSize, zoom: viewportZoom, children: [guestFailure ? (_jsx(BrowserGuestFailureState, { formatMessage: formatMessage, guestFailure: guestFailure, onRetry: onRetryGuest })) : loadError ? (_jsx(BrowserLoadErrorState, { errorMessage: loadError, formatMessage: formatMessage, isCertificateError: isCertificateBrowserLoadErrorCode(browserState.loadErrorCode), onRetry: onRetryLoad })) : isEmptyBrowserState ? (_jsx(BrowserEmptyState, { browserState: browserState, formatMessage: formatMessage, isGuestStarting: shouldMountWebview && !browserState.isReady }, "empty-state")) : null, shouldMountWebview ? (_jsx("webview", { ref: handleWebviewRef, allowpopups: "", src: isResidencyRestore ? BROWSER_VIEW_RESTORE_BOOTSTRAP_URL : DEFAULT_BROWSER_URL, partition: "persist:zcode-embedded-browser", nodeintegrationinsubframes: "true", "data-browser-compositor-scale": isResponsiveMode ? desktopZoomFactor : undefined, "data-browser-layout-scale": isResponsiveMode ? responsiveGuestLayoutScale : undefined, "data-browser-transform-scale": isResponsiveMode ? responsiveGuestTransformScale : undefined, "data-testid": TID_BROWSER_WEBVIEW, "data-browser-resize-dimmed": showResizeWarning ? "true" : undefined, className: cn("browser-use-viewport h-full min-h-0 w-full", isEmptyBrowserState || guestFailure || loadError ? "hidden" : "inline-flex"), 
                        // Electron 的 `<webview>` 独立 guest surface 对 page zoom 的合成并不对称：放大时
                        // 由 main 的 CDP metrics scale 校正 raster；缩小时先按 1 / zoom 扩布局再缩放。
                        // absolute 避免补偿布局污染 Fit 的 scroll extent。
                        // 这里只改变宿主布局/合成；guest zoom、CSS viewport、DPR 与 Browser Use 回读保持不变。
                        style: {
                            // 网页画布默认按浏览器语义使用白色；这里只设置 webview 节点底色，
                            // 不增加覆盖层，也不向 guest 页面注入或覆盖任何样式。
                            backgroundColor: "#fff",
                            // Electron guest surface 可能早于 Tailwind hidden 类完成首次合成，
                            // 导致新 tab 闪一帧白色；创建期内联 visibility 可封住该时序窗口。
                            ...(isEmptyBrowserState ? { visibility: "hidden" } : {}),
                            ...(isResponsiveMode
                                ? {
                                    ...(needsResponsiveGuestLayout
                                        ? {
                                            height: responsiveGuestLayoutSize,
                                            left: 0,
                                            position: "absolute",
                                            top: 0,
                                            width: responsiveGuestLayoutSize,
                                        }
                                        : {}),
                                    ...(responsiveGuestTransformScale !== 1
                                        ? {
                                            transform: `scale(${responsiveGuestTransformScale})`,
                                            transformOrigin: "top left",
                                        }
                                        : {}),
                                }
                                : {}),
                        } }, `webview:${webviewGeneration}`)) : null] })] }));
}
//# sourceMappingURL=BrowserViewportSurface.js.map