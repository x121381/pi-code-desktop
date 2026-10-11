"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCallbackPage = WebCallbackPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@zcode/ui");
const webAuthLocale_js_1 = require("./webAuthLocale.js");
function WebCallbackPage({ authService, onRetry, onSuccess }) {
    const copy = (0, webAuthLocale_js_1.getWebAuthCopy)();
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        authService
            .handleCallback(window.location.href)
            .then((result) => {
            if (!isMounted || !result) {
                return;
            }
            onSuccess(result);
        })
            .catch((caught) => {
            if (!isMounted) {
                return;
            }
            setError(caught instanceof Error ? caught.message : String(caught));
        });
        return () => {
            isMounted = false;
        };
    }, [authService, onSuccess]);
    return ((0, jsx_runtime_1.jsx)("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: (0, jsx_runtime_1.jsx)("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: error ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 flex size-10 items-center justify-center rounded-lg bg-destructive text-ui-xs font-medium text-destructive-foreground", children: "!" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.callbackErrorTitle }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.callbackErrorDescription }), (0, jsx_runtime_1.jsx)("p", { className: "mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-xs leading-5 text-foreground-subtle", children: error }), (0, jsx_runtime_1.jsx)(ui_1.Button, { type: "button", size: "lg", className: "mt-5 w-full", onClick: onRetry, children: copy.retryAction })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 size-9 rounded-full border-2 border-border border-t-primary" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.callbackTitle }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.callbackDescription })] })) }) }));
}
//# sourceMappingURL=WebCallbackPage.js.map