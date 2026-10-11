"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebLoginPage = WebLoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@zcode/ui");
const webAuthLocale_js_1 = require("./webAuthLocale.js");
function WebLoginPage({ onLogin }) {
    const copy = (0, webAuthLocale_js_1.getWebAuthCopy)();
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: (0, jsx_runtime_1.jsxs)("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-5 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-ui-xs font-semibold text-foreground", children: "Z" }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-ui-xs font-medium text-foreground", children: copy.brand }), (0, jsx_runtime_1.jsx)("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.loginTitle })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "mb-5 text-ui-xs leading-6 text-foreground-subtle", children: copy.loginDescription }), (0, jsx_runtime_1.jsx)(ui_1.Button, { type: "button", size: "lg", className: "w-full", disabled: isSubmitting, onClick: () => {
                        setIsSubmitting(true);
                        onLogin();
                    }, children: copy.loginAction })] }) }));
}
//# sourceMappingURL=WebLoginPage.js.map