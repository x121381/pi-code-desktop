import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleAlertIcon } from "lucide-react";
export function ModelTrajectoryErrorBlock({ error, }) {
    return (_jsxs("div", { "data-trajectory-call-error": "", className: "col-span-full flex items-start gap-2 rounded-lg bg-destructive/10 px-2 py-1.5", children: [_jsx(CircleAlertIcon, { "data-trajectory-call-error-icon": "", "aria-hidden": "true", className: "mt-0.5 size-4 shrink-0 text-destructive" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "text-ui-base font-medium text-destructive", children: [error.name, ": ", error.message] }), error.stack ? (_jsx("pre", { className: "mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-ui-xs text-destructive/80", children: error.stack })) : null] })] }));
}
//# sourceMappingURL=ModelTrajectoryErrorBlock.js.map