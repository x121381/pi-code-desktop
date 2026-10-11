"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebLoggedInWaitingPage = WebLoggedInWaitingPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ui_1 = require("@zcode/ui");
const webAuthLocale_js_1 = require("./webAuthLocale.js");
function getAvatarFallback(user) {
    return (user.displayName || user.username || "Z").trim().slice(0, 1).toUpperCase();
}
function WebLoggedInWaitingPage({ onLogout, user }) {
    const copy = (0, webAuthLocale_js_1.getWebAuthCopy)();
    const [isLoggingOut, setIsLoggingOut] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsx)("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: (0, jsx_runtime_1.jsxs)("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-5 flex items-center gap-3", children: [user.avatarUrl ? ((0, jsx_runtime_1.jsx)("img", { src: user.avatarUrl, alt: "", className: "size-10 shrink-0 rounded-full border border-border object-cover" })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-ui-xs font-medium text-foreground", children: getAvatarFallback(user) })), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-ui-xs text-foreground-subtle", children: copy.signedInAs }), (0, jsx_runtime_1.jsx)("div", { className: "truncate text-ui-xs font-medium text-foreground", children: user.displayName || user.username })] })] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.waitingTitle }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.waitingDescription }), onLogout ? ((0, jsx_runtime_1.jsx)(ui_1.Button, { type: "button", variant: "outline", size: "lg", className: "mt-5 w-full", disabled: isLoggingOut, onClick: () => {
                        setIsLoggingOut(true);
                        void Promise.resolve(onLogout()).finally(() => {
                            setIsLoggingOut(false);
                        });
                    }, children: copy.logoutAction })) : null] }) }));
}
//# sourceMappingURL=WebLoggedInWaitingPage.js.map