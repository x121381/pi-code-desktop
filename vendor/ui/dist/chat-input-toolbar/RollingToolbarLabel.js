import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/lib/utils.js";
const LABEL_ROLL_TRANSITION = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
};
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => {
            setPrefersReducedMotion(query.matches);
        };
        update();
        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", update);
            return () => {
                query.removeEventListener("change", update);
            };
        }
        query.addListener(update);
        return () => {
            query.removeListener(update);
        };
    }, []);
    return prefersReducedMotion;
}
export function RollingToolbarLabel({ label, className, prefix, prefixClassName, value, }) {
    const reducedMotion = usePrefersReducedMotion();
    const content = prefix !== undefined && value !== undefined ? (_jsxs(_Fragment, { children: [_jsx("span", { className: prefixClassName, children: prefix }), _jsx("span", { children: value })] })) : (label);
    return (_jsx("span", { className: cn("relative inline-flex h-[1.3em] min-w-0 items-center overflow-hidden leading-[1.25]", className), title: label, children: reducedMotion ? (_jsx("span", { className: "inline-flex min-w-0 whitespace-nowrap leading-[1.25]", children: content })) : (_jsx(AnimatePresence, { initial: false, mode: "popLayout", children: _jsx(motion.span, { className: "inline-flex min-w-0 whitespace-nowrap leading-[1.25]", initial: { y: "0.75em", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-0.75em", opacity: 0 }, transition: LABEL_ROLL_TRANSITION, children: content }, label) })) }));
}
//# sourceMappingURL=RollingToolbarLabel.js.map