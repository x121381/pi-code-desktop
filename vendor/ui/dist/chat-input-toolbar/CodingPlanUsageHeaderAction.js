import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, ChevronRightIcon, InfoIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { TooltipProvider } from "@/components/ui/tooltip.js";
const CONTEXT_USAGE_REFRESH_SUCCESS_MS = 1_000;
export function CodingPlanUsageHeaderAction({ error, loading, onUsageClick, openLabel, refreshingLabel, updatedLabel, warningLabel, }) {
    const [refreshActionState, setRefreshActionState] = useState("idle");
    const previousLoadingRef = useRef(null);
    useEffect(() => {
        const wasLoading = previousLoadingRef.current;
        previousLoadingRef.current = loading;
        if (loading) {
            setRefreshActionState("idle");
            return;
        }
        if (wasLoading === true && !error) {
            setRefreshActionState("success");
            const timeout = window.setTimeout(() => setRefreshActionState("idle"), CONTEXT_USAGE_REFRESH_SUCCESS_MS);
            return () => window.clearTimeout(timeout);
        }
    }, [error, loading]);
    if (loading) {
        return (_jsx("span", { role: "status", "aria-label": refreshingLabel, className: "inline-flex h-6 w-6 shrink-0 items-center justify-center text-foreground-subtle", children: _jsx(Loader2, { className: "size-3.5 animate-spin motion-reduce:animate-none" }) }));
    }
    if (refreshActionState === "success") {
        return (_jsx("span", { role: "status", "aria-label": updatedLabel, className: "inline-flex h-6 w-6 shrink-0 items-center justify-center text-success", children: _jsx(CheckIcon, { className: "size-3.5" }) }));
    }
    return (_jsxs("span", { className: "inline-flex shrink-0 items-center gap-1", children: [warningLabel ? (_jsx(TooltipProvider, { children: _jsx(ControlHintTooltip, { title: warningLabel, children: _jsx("span", { role: "img", "aria-label": warningLabel, className: "inline-flex h-6 w-5 items-center justify-center text-warning", children: _jsx(InfoIcon, { className: "size-3.5", "aria-hidden": "true" }) }) }) })) : null, onUsageClick ? (_jsxs("button", { type: "button", "aria-label": openLabel, className: "inline-flex h-6 shrink-0 items-center gap-0.5 text-ui-sm text-foreground-subtle hover:text-foreground hover:underline", onClick: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onUsageClick();
                }, children: [_jsx("span", { children: openLabel }), _jsx(ChevronRightIcon, { className: "size-3.5" })] })) : null] }));
}
//# sourceMappingURL=CodingPlanUsageHeaderAction.js.map