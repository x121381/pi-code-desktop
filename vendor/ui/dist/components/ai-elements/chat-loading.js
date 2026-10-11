"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { LoaderIcon } from "lucide-react";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
export function ChatLoading({ loading, size = "default", className, ...props }) {
    const { intl } = useZCodeIntl();
    if (!loading) {
        return null;
    }
    const sizeClasses = size === "sm" ? "size-4 text-ui-base" : "size-6";
    return (_jsx("div", { "aria-label": intl.formatMessage({ id: "common.loading" }), ...props, "data-zcode-chat-loading-animate": "true", role: "status", className: cn("flex items-center", className), children: _jsx("div", { className: "flex size-4 items-center justify-center", children: _jsx(LoaderIcon, { "aria-hidden": "true", className: cn("animate-spin text-foreground-subtle", sizeClasses) }) }) }));
}
//# sourceMappingURL=chat-loading.js.map