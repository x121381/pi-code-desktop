import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/lib/utils.js";
const FLIP_TRANSITION = {
    duration: 0.16,
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
function isDigitCharacter(character) {
    return /^[0-9]$/.test(character);
}
function getCharacterWidthClass(character) {
    if (isDigitCharacter(character)) {
        return "w-[0.66em]";
    }
    if (character === ":" || character === ".") {
        return "w-[0.34em]";
    }
    return "w-[0.7em]";
}
function MetricCharacter({ character, index, reducedMotion, animateInitial, }) {
    const widthClass = getCharacterWidthClass(character);
    // 数字槽以前用 baseline + 负偏移，冒号和 K/M 单位走静态 inline，
    // 混排时视觉中线不一致；所有字符统一固定高度并居中，翻页只发生在槽内。
    if (!isDigitCharacter(character) || reducedMotion) {
        return (_jsx("span", { "aria-hidden": "true", className: cn("inline-flex h-[1.15em] shrink-0 items-center justify-center leading-none", widthClass), children: character }));
    }
    return (_jsx("span", { "aria-hidden": "true", className: cn("relative inline-flex h-[1.15em] shrink-0 items-center justify-center overflow-hidden leading-none [perspective:8em]", widthClass), children: _jsx(AnimatePresence, { initial: animateInitial, children: _jsx(motion.span, { className: "absolute inset-0 flex items-center justify-center leading-none", initial: { rotateX: -90, y: "-0.45em", opacity: 0 }, animate: { rotateX: 0, y: 0, opacity: 1 }, exit: { rotateX: 90, y: "0.45em", opacity: 0 }, style: { transformOrigin: "50% 50%" }, transition: FLIP_TRANSITION, children: character }, `${index}-${character}`) }) }));
}
export function FlipMetricValue({ value, className, animateInitial = false, }) {
    const reducedMotion = usePrefersReducedMotion();
    const characters = useMemo(() => Array.from(value), [value]);
    return (_jsx("span", { "aria-label": value, "data-animate-initial": animateInitial ? "true" : undefined, className: cn("inline-flex max-w-full items-center overflow-hidden whitespace-nowrap align-middle leading-none", className), role: "text", title: value, children: characters.map((character, index) => (_jsx(MetricCharacter, { character: character, index: index, reducedMotion: reducedMotion, animateInitial: animateInitial }, index))) }));
}
//# sourceMappingURL=flip-metric-value.js.map