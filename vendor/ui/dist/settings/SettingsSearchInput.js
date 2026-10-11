import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, X } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
export function SettingsSearchInput({ className, clearLabel = "Clear search", clearTestId, containerClassName, onClear, ...props }) {
    const canClear = Boolean(onClear && props.value && !props.disabled);
    return (_jsxs("div", { className: cn("relative", containerClassName), children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle", "aria-hidden": "true" }), _jsx(Input, { ...props, type: "search", size: "lg", className: cn("h-9 rounded-xl pl-9 [&::-webkit-search-cancel-button]:appearance-none", canClear && "pr-9", className) }), canClear ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: "absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-foreground-subtle", "aria-label": clearLabel, "data-testid": clearTestId, onClick: onClear, children: _jsx(X, { className: "size-3.5", "aria-hidden": "true" }) })) : null] }));
}
//# sourceMappingURL=SettingsSearchInput.js.map