import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
export function SettingsBackButton({ children, className, ...props }) {
    return (_jsxs(Button, { type: "button", size: "lg", variant: "ghost", className: cn("-ml-2", className), ...props, children: [_jsx(ArrowLeft, { className: "size-4", "aria-hidden": "true" }), children] }));
}
//# sourceMappingURL=SettingsBackButton.js.map