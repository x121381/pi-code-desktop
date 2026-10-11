import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoIcon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function resolveMcpFailureMessageId(failureKind) {
    return `settings.mcp.failure.${failureKind ?? "connection_failed"}`;
}
export function McpFailurePresentation({ error, failureKind, }) {
    const { intl } = useZCodeIntl();
    const message = intl.formatMessage({
        id: resolveMcpFailureMessageId(failureKind),
    });
    const detailsLabel = intl.formatMessage({
        id: "settings.mcp.failure.technicalDetails",
    });
    return (_jsx("div", { className: "mt-1 min-w-0 space-y-1", children: _jsxs("div", { className: "flex min-w-0 items-center gap-1 text-ui-base text-foreground-subtle", children: [_jsx("span", { className: "min-w-0", children: message }), error ? (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "-my-1 shrink-0 text-foreground-subtlest hover:text-foreground-subtle", "aria-label": detailsLabel, title: detailsLabel, onClick: (event) => event.stopPropagation(), children: _jsx(InfoIcon, { className: "size-3.5", "aria-hidden": "true" }) }) }), _jsxs(PopoverContent, { align: "start", side: "top", className: "w-80 max-w-[calc(100vw-1rem)] gap-2 p-3", onClick: (event) => event.stopPropagation(), children: [_jsx("div", { className: "text-ui-sm font-medium text-foreground", children: detailsLabel }), _jsx("div", { className: "max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-ui-xs text-foreground-subtle select-text", children: error })] })] })) : null] }) }));
}
//# sourceMappingURL=McpFailurePresentation.js.map