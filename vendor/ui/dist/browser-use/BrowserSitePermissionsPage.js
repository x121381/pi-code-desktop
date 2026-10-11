import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserPermissionIcon } from "@/browser-use/BrowserPermissionIcon.js";
import { BROWSER_PERMISSION_CAPABILITIES } from "@/browser-use/browserPermissionCapabilities.js";
import { Button } from "@/components/ui/button.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useBrowserSitePermissions } from "@/hooks/useBrowserSitePermissions.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/** 站点权限设置标签页：数据源为 main 站点权限 store，「仅本次」临时态不展示。 */
export function BrowserSitePermissionsPage({ origin, isVisible, }) {
    const { intl } = useZCodeIntl();
    const t = (id) => intl.formatMessage({ id: `browser.permission.${id}` });
    const { states, error: readError, refresh, supported, write, setPermission, reset, retryWrite } = useBrowserSitePermissions(origin, isVisible);
    const busy = write.status === "pending";
    const notice = write.status === "succeeded" ? (write.operation.kind === "reset" ? "resetDone" : "saved") : null;
    return (_jsx("div", { className: "h-full min-h-0 overflow-auto bg-background text-foreground", "data-testid": "browser-site-permissions", children: _jsxs("div", { className: "mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6", children: [_jsx("h1", { className: "break-all text-ui-xl font-medium", children: origin }), !supported ? (_jsx("p", { children: t("unsupported") })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("h2", { className: "text-ui-lg font-medium", children: t("settings") }), _jsx(Button, { variant: "outline", disabled: busy || !states, "data-testid": "browser-permission-reset", onClick: () => void reset(), children: t("reset") })] }), _jsx("div", { className: "flex flex-col gap-4", "aria-busy": busy, children: BROWSER_PERMISSION_CAPABILITIES.map((capability) => {
                                const persisted = states?.[capability.key];
                                const setting = persisted === "allow" ? "allow" : persisted === "deny" ? "block" : "ask";
                                return (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", "data-permission-key": capability.key, children: [_jsxs("div", { className: "flex min-w-40 max-w-full flex-1 items-center gap-3", children: [_jsx(BrowserPermissionIcon, { capability: capability.iconKey }), _jsx("div", { className: "min-w-0 text-ui-base break-words", children: intl.formatMessage({ id: capability.labelId }) })] }), _jsxs(Select, { value: setting, disabled: busy, onValueChange: (next) => void setPermission(capability.key, next), children: [_jsx(SelectTrigger, { className: "w-44 max-w-full shrink-0", "aria-label": intl.formatMessage({ id: capability.labelId }), "data-testid": `site-permission-setting-${encodeURIComponent(capability.key)}`, "data-permission-setting": setting, children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: [
                                                        ["ask", "stateAsk"],
                                                        ["allow", "stateAllow"],
                                                        ["block", "stateDeny"],
                                                    ].map(([option, labelId]) => (_jsx(SelectItem, { value: option, "data-testid": `site-permission-option-${option}`, children: t(labelId) }, option))) })] })] }, capability.key));
                            }) }), notice && (_jsx("p", { role: "status", className: "text-ui-sm text-foreground-subtle", "data-testid": notice === "resetDone" ? "browser-permission-reset-done" : "browser-permission-saved", children: t(notice) })), write.status === "failed" && (_jsxs("div", { role: "alert", className: "text-ui-sm text-destructive", children: [t(write.operation.kind === "reset" ? "resetError" : "saveError"), " ", _jsx(Button, { variant: "ghost", onClick: () => void retryWrite(), children: t("retry") })] })), readError && (_jsxs("div", { role: "alert", className: "text-ui-sm text-destructive", children: [t("readError"), " ", _jsx(Button, { variant: "ghost", disabled: busy, onClick: () => void refresh(), children: t("retry") })] }))] }))] }) }));
}
//# sourceMappingURL=BrowserSitePermissionsPage.js.map