import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@zcode/ui";
import { getWebAuthCopy } from "./webAuthLocale.js";
export function WebCallbackPage({ authService, onRetry, onSuccess }) {
    const copy = getWebAuthCopy();
    const [error, setError] = useState(null);
    useEffect(() => {
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
    return (_jsx("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: _jsx("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: error ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-4 flex size-10 items-center justify-center rounded-lg bg-destructive text-ui-xs font-medium text-destructive-foreground", children: "!" }), _jsx("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.callbackErrorTitle }), _jsx("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.callbackErrorDescription }), _jsx("p", { className: "mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-ui-xs leading-5 text-foreground-subtle", children: error }), _jsx(Button, { type: "button", size: "lg", className: "mt-5 w-full", onClick: onRetry, children: copy.retryAction })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-4 size-9 rounded-full border-2 border-border border-t-primary" }), _jsx("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.callbackTitle }), _jsx("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.callbackDescription })] })) }) }));
}
//# sourceMappingURL=WebCallbackPage.js.map