import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { CheckCircle2Icon, CircleAlertIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../../components/ui/button.js";
import { cn } from "../../components/lib/utils.js";
const ProviderDetailFeedbackContext = createContext({
    showFeedback: () => undefined,
    dismissFeedback: () => undefined,
});
export function useProviderDetailFeedback() {
    return useContext(ProviderDetailFeedbackContext);
}
function resolveDefaultDuration(state) {
    if (state === "pending")
        return 0;
    return state === "failure" ? 8_000 : 3_500;
}
export function ProviderDetailFeedbackBoundary({ children }) {
    const [items, setItems] = useState([]);
    const timersRef = useRef(new Map());
    const dismissFeedback = useCallback((key) => {
        const timer = timersRef.current.get(key);
        if (timer)
            clearTimeout(timer);
        timersRef.current.delete(key);
        setItems((current) => current.filter((item) => item.key !== key));
    }, []);
    const showFeedback = useCallback((input) => {
        const previousTimer = timersRef.current.get(input.key);
        if (previousTimer)
            clearTimeout(previousTimer);
        timersRef.current.delete(input.key);
        setItems((current) => {
            const existingIndex = current.findIndex((item) => item.key === input.key);
            if (existingIndex < 0)
                return [...current, input];
            const next = [...current];
            next[existingIndex] = input;
            return next;
        });
        const durationMs = input.durationMs ?? resolveDefaultDuration(input.state);
        if (durationMs > 0) {
            timersRef.current.set(input.key, setTimeout(() => dismissFeedback(input.key), durationMs));
        }
    }, [dismissFeedback]);
    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            for (const timer of timers.values())
                clearTimeout(timer);
            timers.clear();
        };
    }, []);
    const contextValue = useMemo(() => ({ showFeedback, dismissFeedback }), [dismissFeedback, showFeedback]);
    return (_jsxs(ProviderDetailFeedbackContext.Provider, { value: contextValue, children: [children, _jsx("div", { className: "pointer-events-none absolute inset-3 flex flex-col justify-end sm:inset-4", children: _jsx("div", { className: "sticky bottom-3 z-20 flex flex-col gap-2 sm:bottom-4", "data-testid": "provider-detail-feedback-viewport", "aria-live": "polite", children: items.map((item) => (_jsxs("div", { role: item.state === "failure" ? "alert" : "status", "data-provider-detail-feedback-state": item.state, className: cn("pointer-events-auto flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2.5 backdrop-blur-sm", item.state === "success" &&
                            (item.successEmphasis
                                ? "border-success/30 bg-success/10 text-success shadow-md"
                                : "border-border bg-popover/95 text-foreground shadow-md"), item.state === "failure" &&
                            "border-destructive/30 bg-destructive/10 text-destructive shadow-lg", item.state === "pending" && "border-border bg-popover/95 text-foreground shadow-md"), children: [item.state === "pending" ? (_jsx(Loader2Icon, { className: "size-4 shrink-0 animate-spin", "aria-hidden": "true" })) : item.state === "success" ? (_jsx(CheckCircle2Icon, { className: "size-4 shrink-0 text-success", "aria-hidden": "true" })) : (_jsx(CircleAlertIcon, { className: "size-4 shrink-0", "aria-hidden": "true" })), _jsx("span", { className: "min-w-0 flex-1 text-ui-sm font-medium", children: item.message }), item.actionLabel && item.onAction ? (_jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: item.onAction, children: item.actionLabel })) : null, item.dismissible ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": item.dismissLabel ?? item.message, onClick: () => dismissFeedback(item.key), children: _jsx(XIcon, { className: "size-3.5", "aria-hidden": "true" }) })) : null] }, item.key))) }) })] }));
}
//# sourceMappingURL=ProviderDetailFeedback.js.map