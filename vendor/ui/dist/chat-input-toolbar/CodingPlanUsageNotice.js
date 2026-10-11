import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoIcon, RefreshCwIcon } from "lucide-react";
export function CodingPlanUsageNotice({ message, onRefresh, refreshLabel, }) {
    return (_jsxs("div", { "data-coding-plan-usage-notice": "true", className: "col-span-full flex w-full min-w-0 items-center gap-2 rounded-lg bg-surface px-2.5 py-2 text-ui-base text-foreground-subtle", children: [_jsx(InfoIcon, { className: "size-3.5 shrink-0 text-warning", "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 flex-1 truncate text-foreground", children: message }), onRefresh ? (_jsx("button", { type: "button", "aria-label": refreshLabel, className: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-foreground-subtle hover:bg-hover hover:text-foreground", onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void onRefresh();
                }, children: _jsx(RefreshCwIcon, { className: "size-3.5", "aria-hidden": "true" }) })) : null] }));
}
//# sourceMappingURL=CodingPlanUsageNotice.js.map