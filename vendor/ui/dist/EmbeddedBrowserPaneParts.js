import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bug, ChevronLeft, ChevronRight, Ellipsis, ExternalLink, Globe, LoaderIcon, MonitorSmartphone, MousePointerClick, RefreshCw, TriangleAlertIcon, } from "lucide-react";
import { TID_BROWSER_ADDRESS_INPUT, TID_BROWSER_BACK_BUTTON, TID_BROWSER_DEVTOOLS_BUTTON, TID_BROWSER_ELEMENT_PICKER_BUTTON, TID_BROWSER_FORWARD_BUTTON, TID_BROWSER_LOAD_ERROR, TID_BROWSER_LOAD_ERROR_CERT_HINT, TID_BROWSER_MORE_BUTTON, TID_BROWSER_OPEN_EXTERNAL_ITEM, TID_BROWSER_REFRESH_BUTTON, TID_BROWSER_RESPONSIVE_BUTTON, } from "@zcode/shared";
import { ControlHintTooltip } from "./ControlHintTooltip.js";
import { Button } from "./components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./components/ui/dropdown-menu.js";
import { Input } from "./components/ui/input.js";
import { isDefaultBrowserOpenableUrl, } from "./embeddedBrowserHelpers.js";
import { runUserAction } from "./lib/userActionTelemetry.js";
export function BrowserToolbar({ addressValue, browserState, permissionControl, formatMessage, onAddressChange, onGoBack, onGoForward, onOpenExternal, onOpenDevTools, onPickElement, onReload, onToggleResponsiveMode, onSubmit, isElementPickerActive, isResponsiveMode, }) {
    return (_jsxs("form", { onSubmit: (event) => runUserAction({
            input: { featureId: "workbench.browser", action: "navigate", trigger: "keyboard" },
            operation: () => onSubmit(event),
            completed: { resultSource: "optimistic_projection" },
            failureStage: "browser_navigate",
        }), className: "flex items-center h-12 px-3 gap-2", children: [_jsx(BrowserIconButton, { icon: _jsx(ChevronLeft, { className: "h-4 w-4" }), title: formatMessage({ id: "browser.back" }), disabled: !browserState.canGoBack, dataTestId: TID_BROWSER_BACK_BUTTON, onClick: onGoBack }), _jsx(BrowserIconButton, { icon: _jsx(ChevronRight, { className: "h-4 w-4" }), title: formatMessage({ id: "browser.forward" }), disabled: !browserState.canGoForward, dataTestId: TID_BROWSER_FORWARD_BUTTON, onClick: onGoForward }), _jsx(BrowserIconButton, { icon: _jsx(RefreshCw, { className: `h-4 w-4 ${browserState.isLoading ? "animate-spin" : ""}` }), title: formatMessage({ id: "browser.reload" }), disabled: !browserState.isReady, dataTestId: TID_BROWSER_REFRESH_BUTTON, onClick: onReload }), _jsxs("div", { className: "group/browser-address relative min-w-0 flex-1", "data-testid": "browser-address-bar", children: [_jsx(Input, { type: "text", value: addressValue, "data-testid": TID_BROWSER_ADDRESS_INPUT, size: "sm", className: "h-8 rounded-full px-14 text-center focus:px-3 focus:text-left", onChange: (event) => onAddressChange(event.target.value), placeholder: formatMessage({ id: "browser.addressPlaceholder" }), spellCheck: false }), _jsx("div", { className: "absolute top-1/2 left-0.5 -translate-y-1/2 group-has-[input:focus]/browser-address:hidden", children: permissionControl })] }), _jsx(BrowserIconButton, { icon: _jsx(MonitorSmartphone, { className: "h-4 w-4" }), title: formatMessage({
                    id: isResponsiveMode ? "browser.responsive.exit" : "browser.responsive.enter",
                }), disabled: false, dataTestId: TID_BROWSER_RESPONSIVE_BUTTON, onClick: onToggleResponsiveMode, active: isResponsiveMode, pressed: isResponsiveMode }), _jsx(BrowserIconButton, { icon: _jsx(MousePointerClick, { className: "h-4 w-4" }), title: formatMessage({
                    id: isElementPickerActive
                        ? "browser.elementPicker.cancel"
                        : "browser.elementPicker.start",
                }), disabled: !browserState.isReady, dataTestId: TID_BROWSER_ELEMENT_PICKER_BUTTON, onClick: onPickElement, active: isElementPickerActive }), _jsx(BrowserToolbarMoreMenu, { canOpenExternal: browserState.isReady && isDefaultBrowserOpenableUrl(browserState.currentUrl), canOpenDevTools: browserState.isReady, formatMessage: formatMessage, onOpenExternal: onOpenExternal, onOpenDevTools: onOpenDevTools })] }));
}
function BrowserToolbarMoreMenu({ canOpenDevTools, canOpenExternal, formatMessage, onOpenDevTools, onOpenExternal, }) {
    const moreLabel = formatMessage({ id: "browser.more" });
    return (_jsxs(DropdownMenu, { children: [_jsx(ControlHintTooltip, { title: moreLabel, children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", size: "icon-md", variant: "ghost", "aria-label": moreLabel, "data-testid": TID_BROWSER_MORE_BUTTON, children: _jsx(Ellipsis, { className: "size-4" }) }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [_jsxs(DropdownMenuItem, { "data-testid": TID_BROWSER_OPEN_EXTERNAL_ITEM, disabled: !canOpenExternal, onSelect: onOpenExternal, children: [_jsx(ExternalLink, { className: "size-4" }), _jsx("span", { children: formatMessage({ id: "browser.openExternal" }) })] }), _jsxs(DropdownMenuItem, { "data-testid": TID_BROWSER_DEVTOOLS_BUTTON, disabled: !canOpenDevTools, onSelect: onOpenDevTools, children: [_jsx(Bug, { className: "size-4" }), _jsx("span", { children: formatMessage({ id: "browser.devtools" }) })] })] })] }));
}
export function BrowserEmptyState({ browserState, formatMessage, isGuestStarting = !browserState.isReady, }) {
    return (_jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background px-6", children: _jsxs("div", { className: "flex max-w-sm flex-col pb-10 items-center text-center", children: [isGuestStarting ? (_jsx(LoaderIcon, { className: "mb-6 size-16 animate-spin text-foreground opacity-30" })) : (_jsx(Globe, { className: "mb-6 size-16 text-foreground opacity-30" })), _jsx("h3", { className: "text-ui-base font-medium text-foreground", children: formatMessage({ id: "browser.title" }) }), _jsx("p", { className: "mt-2 text-ui-base text-foreground-subtle", children: formatMessage({ id: "browser.empty" }) })] }) }));
}
/**
 * 页面加载失败时的可读错误态。
 *
 * Electron 的 `<webview>` 不带 Chrome 的安全插页，被拒的导航只落到一张空的
 * chrome-error 页；过去 errorMessage 只写进 state 没有渲染消费者，空置态又同时被关掉，
 * 用户最终只看到纯黑。证书类失败额外给出放行指引，避免用户无从下手。
 */
export function BrowserLoadErrorState({ errorMessage, formatMessage, isCertificateError, onRetry, }) {
    return (_jsx("div", { "data-testid": TID_BROWSER_LOAD_ERROR, className: "absolute inset-0 z-10 flex items-center justify-center bg-background px-6", children: _jsxs("div", { className: "flex max-w-sm flex-col items-center pb-10 text-center", children: [_jsx(TriangleAlertIcon, { className: "mb-6 size-16 text-warning opacity-60" }), _jsx("h3", { className: "text-ui-base font-medium text-foreground", children: formatMessage({
                        id: isCertificateError ? "browser.loadError.certTitle" : "browser.loadError.title",
                    }) }), _jsx("p", { className: "mt-2 font-mono text-ui-sm break-all text-foreground-subtlest", children: errorMessage }), isCertificateError ? (_jsx("p", { "data-testid": TID_BROWSER_LOAD_ERROR_CERT_HINT, className: "mt-3 text-ui-base text-foreground-subtle", children: formatMessage({ id: "browser.loadError.certHint" }) })) : null, _jsxs(Button, { type: "button", variant: "outline", className: "mt-6", onClick: onRetry, children: [_jsx(RefreshCw, { className: "size-4" }), formatMessage({ id: "browser.loadError.retry" })] })] }) }));
}
/** guest 启动失败时由宿主接管画面；自动重建会形成失败循环，因此只提供显式重试。 */
export function BrowserGuestFailureState({ formatMessage, guestFailure, onRetry, }) {
    return (_jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background px-6", children: _jsxs("div", { className: "flex max-w-sm flex-col items-center pb-10 text-center", children: [_jsx(TriangleAlertIcon, { className: "mb-6 size-16 text-warning opacity-60" }), _jsx("h3", { className: "text-ui-base font-medium text-foreground", children: formatMessage({ id: "browser.guestFailed.title" }) }), _jsx("p", { className: "mt-2 text-ui-base text-foreground-subtle", children: formatMessage({ id: "browser.guestFailed.description" }) }), _jsx("p", { className: "mt-2 font-mono text-ui-sm text-foreground-subtlest", children: formatMessage({ id: "browser.guestFailed.detail" }, { exitCode: guestFailure.exitCode, reason: guestFailure.reason }) }), _jsxs(Button, { type: "button", variant: "outline", className: "mt-6", onClick: onRetry, children: [_jsx(RefreshCw, { className: "size-4" }), formatMessage({ id: "browser.guestFailed.retry" })] })] }) }));
}
function BrowserIconButton({ dataTestId, disabled, icon, onClick, title, active = false, pressed, }) {
    return (_jsx(ControlHintTooltip, { title: title, children: _jsx(Button, { type: "button", size: "icon-md", variant: active ? "secondary" : "ghost", "aria-label": title, "aria-pressed": pressed, "data-testid": dataTestId, disabled: disabled, onClick: onClick, children: icon }) }));
}
//# sourceMappingURL=EmbeddedBrowserPaneParts.js.map