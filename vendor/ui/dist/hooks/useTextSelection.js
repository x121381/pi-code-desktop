import { useCallback, useEffect, useRef, useState } from "react";
/** 统一鼠标、键盘和触控选区的监听；作用域变化后旧选区不能路由到新任务。 */
export function useTextSelection({ rootRef, enabled, inspect, scopeKey, observeSelectionChange = false, }) {
    const [snapshot, setSnapshot] = useState(null);
    const frameRef = useRef(0);
    const close = useCallback(() => {
        window.cancelAnimationFrame(frameRef.current);
        setSnapshot(null);
    }, []);
    useEffect(() => {
        close();
        const root = rootRef.current;
        if (!root || !enabled)
            return;
        const schedule = () => {
            window.cancelAnimationFrame(frameRef.current);
            frameRef.current = window.requestAnimationFrame(() => {
                const value = inspect();
                setSnapshot(value ? { scopeKey, value } : null);
            });
        };
        const onKey = (event) => (event.key === "Escape" ? close() : schedule());
        const onSelection = () => {
            if (window.getSelection()?.isCollapsed)
                close();
            else if (observeSelectionChange)
                schedule();
        };
        root.addEventListener("mouseup", schedule);
        root.addEventListener("touchend", schedule, { passive: true });
        document.addEventListener("keyup", onKey);
        document.addEventListener("selectionchange", onSelection);
        root.addEventListener("scroll", close, { passive: true, capture: true });
        window.addEventListener("resize", close);
        return () => {
            window.cancelAnimationFrame(frameRef.current);
            root.removeEventListener("mouseup", schedule);
            root.removeEventListener("touchend", schedule);
            document.removeEventListener("keyup", onKey);
            document.removeEventListener("selectionchange", onSelection);
            root.removeEventListener("scroll", close, true);
            window.removeEventListener("resize", close);
        };
    }, [close, enabled, inspect, observeSelectionChange, rootRef, scopeKey]);
    return {
        state: enabled && snapshot && snapshot.scopeKey === scopeKey ? snapshot.value : null,
        close,
    };
}
//# sourceMappingURL=useTextSelection.js.map