import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/components/lib/utils.js";
const SCROLL_MASK_CLASS_BY_STATE = {
    none: "",
    top: "[mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_100%)]",
    // Tailwind arbitrary value 里用下划线表示 calc 空格，避免生成无效的 calc(100%-24px)。
    bottom: "[mask-image:linear-gradient(to_bottom,black_0,black_calc(100%_-_24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0,black_calc(100%_-_24px),transparent_100%)]",
    both: "[mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_calc(100%_-_24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_24px,black_calc(100%_-_24px),transparent_100%)]",
};
export function ScrollFadeViewport({ className, children, ref, ...props }) {
    const viewportRef = useRef(null);
    const contentRef = useRef(null);
    const [maskState, setMaskState] = useState("none");
    // 渐隐组件与调用方共享同一个滚动节点，Bash 原有吸底/暂停逻辑仍由调用方拥有。
    useImperativeHandle(ref, () => viewportRef.current, []);
    useEffect(() => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        if (!viewport || !content) {
            setMaskState("none");
            return;
        }
        const updateMaskState = () => {
            const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
            if (maxScrollTop <= 1) {
                setMaskState("none");
                return;
            }
            const hasHiddenTop = viewport.scrollTop > 1;
            const hasHiddenBottom = viewport.scrollTop < maxScrollTop - 1;
            setMaskState(hasHiddenTop && hasHiddenBottom
                ? "both"
                : hasHiddenTop
                    ? "top"
                    : hasHiddenBottom
                        ? "bottom"
                        : "none");
        };
        let rafId = null;
        const scheduleUpdate = () => {
            if (rafId !== null)
                return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                updateMaskState();
            });
        };
        updateMaskState();
        viewport.addEventListener("scroll", updateMaskState, { passive: true });
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", scheduleUpdate);
            return () => {
                viewport.removeEventListener("scroll", updateMaskState);
                window.removeEventListener("resize", scheduleUpdate);
                if (rafId !== null)
                    cancelAnimationFrame(rafId);
            };
        }
        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(viewport);
        resizeObserver.observe(content);
        window.addEventListener("resize", scheduleUpdate);
        return () => {
            viewport.removeEventListener("scroll", updateMaskState);
            resizeObserver.disconnect();
            window.removeEventListener("resize", scheduleUpdate);
            if (rafId !== null)
                cancelAnimationFrame(rafId);
        };
    }, [children]);
    return (_jsx("div", { ref: viewportRef, "data-scroll-mask": maskState, className: cn("min-h-0 flex-1 overflow-y-auto", SCROLL_MASK_CLASS_BY_STATE[maskState], className), ...props, children: _jsx("div", { ref: contentRef, children: children }) }));
}
//# sourceMappingURL=scroll-fade-viewport.js.map