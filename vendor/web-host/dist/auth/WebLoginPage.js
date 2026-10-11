import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@zcode/ui";
import { getWebAuthCopy } from "./webAuthLocale.js";
export function WebLoginPage({ onLogin }) {
    const copy = getWebAuthCopy();
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (_jsx("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: _jsxs("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: [_jsxs("div", { className: "mb-5 flex items-center gap-3", children: [_jsx("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-ui-xs font-semibold text-foreground", children: "Z" }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-xs font-medium text-foreground", children: copy.brand }), _jsx("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.loginTitle })] })] }), _jsx("p", { className: "mb-5 text-ui-xs leading-6 text-foreground-subtle", children: copy.loginDescription }), _jsx(Button, { type: "button", size: "lg", className: "w-full", disabled: isSubmitting, onClick: () => {
                        setIsSubmitting(true);
                        onLogin();
                    }, children: copy.loginAction })] }) }));
}
//# sourceMappingURL=WebLoginPage.js.map