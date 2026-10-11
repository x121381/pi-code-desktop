import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
function Checkbox({ className, checkIconStrokeWidth, ...props }) {
    return (_jsx(CheckboxPrimitive.Root, { "data-slot": "checkbox", className: cn("peer size-4 shrink-0 rounded-sm border border-input-border bg-input text-primary-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-input-border-focused/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary", className), ...props, children: _jsxs(CheckboxPrimitive.Indicator, { "data-slot": "checkbox-indicator", className: "flex items-center justify-center text-current [&[data-state=indeterminate]_[data-slot=checkbox-checked-icon]]:hidden [&[data-state=indeterminate]_[data-slot=checkbox-indeterminate-icon]]:block", children: [_jsx(Check, { "data-slot": "checkbox-checked-icon", className: cn("size-3", checkIconStrokeWidth !== undefined && "[&_path]:[vector-effect:non-scaling-stroke]"), strokeWidth: checkIconStrokeWidth }), _jsx(Minus, { "data-slot": "checkbox-indeterminate-icon", className: cn("hidden size-3", checkIconStrokeWidth !== undefined && "[&_path]:[vector-effect:non-scaling-stroke]"), strokeWidth: checkIconStrokeWidth })] }) }));
}
export { Checkbox };
//# sourceMappingURL=checkbox.js.map