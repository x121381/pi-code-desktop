import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@zcode/ui";
import { getWebAuthCopy } from "./webAuthLocale.js";
function getAvatarFallback(user) {
    return (user.displayName || user.username || "Z").trim().slice(0, 1).toUpperCase();
}
export function WebLoggedInWaitingPage({ onLogout, user }) {
    const copy = getWebAuthCopy();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    return (_jsx("main", { className: "flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground", children: _jsxs("section", { className: "w-full max-w-sm rounded-lg border border-card-border bg-card p-5 shadow-sm", children: [_jsxs("div", { className: "mb-5 flex items-center gap-3", children: [user.avatarUrl ? (_jsx("img", { src: user.avatarUrl, alt: "", className: "size-10 shrink-0 rounded-full border border-border object-cover" })) : (_jsx("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-ui-xs font-medium text-foreground", children: getAvatarFallback(user) })), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-ui-xs text-foreground-subtle", children: copy.signedInAs }), _jsx("div", { className: "truncate text-ui-xs font-medium text-foreground", children: user.displayName || user.username })] })] }), _jsx("h1", { className: "text-ui-lg font-medium text-foreground", children: copy.waitingTitle }), _jsx("p", { className: "mt-2 text-ui-xs leading-6 text-foreground-subtle", children: copy.waitingDescription }), onLogout ? (_jsx(Button, { type: "button", variant: "outline", size: "lg", className: "mt-5 w-full", disabled: isLoggingOut, onClick: () => {
                        setIsLoggingOut(true);
                        void Promise.resolve(onLogout()).finally(() => {
                            setIsLoggingOut(false);
                        });
                    }, children: copy.logoutAction })) : null] }) }));
}
//# sourceMappingURL=WebLoggedInWaitingPage.js.map