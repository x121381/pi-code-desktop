import { jsx as _jsx } from "react/jsx-runtime";
// 分屏拖拽分隔条（rAF + CSS 变量方案按分割节点泛化，行/列双向）：
// pointer capture 驱动，拖动中占比只走容器 CSS 变量（ref + rAF 合帧），
// 不进 React state——pane 内容子树在拖动期间零重渲染；
// pointerup 一次性提交到 paneLayoutStore（进持久化）。
import { memo, useCallback, useEffect, useRef, useState, } from "react";
import { TID_V4_SPLIT_DIVIDER } from "@zcode/shared";
import { cn } from "../components/lib/utils.js";
import { clampSplitRatio } from "../v4/paneLayoutTree.js";
import { SPLIT_VAR_PREFIX } from "../v4/workbenchLayout.js";
export const WorkbenchSplitDivider = memo(function WorkbenchSplitDivider({ containerRef, splitId, direction, ratio, regionFraction, style, onCommitRatio, }) {
    const dragRef = useRef(null);
    // 仅分隔条自身的高亮态；切换时 memo pane 子树不受影响。
    const [dragging, setDragging] = useState(false);
    const isRow = direction === "row";
    const ratioFromDrag = useCallback((drag) => {
        if (drag.regionPx <= 0) {
            return drag.startRatio;
        }
        return clampSplitRatio(drag.startRatio + (drag.latestClient - drag.startClient) / drag.regionPx);
    }, []);
    const handlePointerDown = useCallback((event) => {
        if (event.button !== 0 && event.pointerType === "mouse") {
            return;
        }
        const container = containerRef.current;
        if (!container) {
            return;
        }
        event.preventDefault();
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
        catch {
            // e2e 合成 PointerEvent 无活跃 pointerId 时 capture 会抛错；拖动逻辑不依赖 capture 成立。
        }
        const containerRect = container.getBoundingClientRect();
        const client = isRow ? event.clientX : event.clientY;
        dragRef.current = {
            pointerId: event.pointerId,
            regionPx: (isRow ? containerRect.width : containerRect.height) * regionFraction,
            startClient: client,
            startRatio: ratio,
            latestClient: client,
            rafId: null,
        };
        setDragging(true);
    }, [containerRef, isRow, ratio, regionFraction]);
    const handlePointerMove = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
        drag.latestClient = isRow ? event.clientX : event.clientY;
        if (drag.rafId !== null) {
            return;
        }
        drag.rafId = requestAnimationFrame(() => {
            drag.rafId = null;
            containerRef.current?.style.setProperty(`${SPLIT_VAR_PREFIX}${splitId}`, String(ratioFromDrag(drag)));
        });
    }, [containerRef, isRow, ratioFromDrag, splitId]);
    const endDrag = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
        if (drag.rafId !== null) {
            cancelAnimationFrame(drag.rafId);
            drag.rafId = null;
        }
        drag.latestClient = isRow ? event.clientX : event.clientY;
        const finalRatio = ratioFromDrag(drag);
        containerRef.current?.style.setProperty(`${SPLIT_VAR_PREFIX}${splitId}`, String(finalRatio));
        dragRef.current = null;
        setDragging(false);
        // 提交进 store（→ localStorage）；容器 style 下次渲染写入同值，无视觉跳变。
        onCommitRatio(splitId, finalRatio);
    }, [containerRef, isRow, onCommitRatio, ratioFromDrag, splitId]);
    // 卸载（布局变化/关 pane）时清理未跑完的 rAF。
    useEffect(() => () => {
        const drag = dragRef.current;
        if (drag?.rafId != null) {
            cancelAnimationFrame(drag.rafId);
        }
        dragRef.current = null;
    }, []);
    return (_jsx("div", { "data-testid": TID_V4_SPLIT_DIVIDER, "data-split-id": splitId, role: "separator", "aria-orientation": isRow ? "vertical" : "horizontal", "data-dragging": dragging ? "true" : "false", onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, style: style, className: cn("group absolute z-10 touch-none select-none", isRow ? "cursor-col-resize" : "cursor-row-resize"), children: _jsx("div", { className: cn("pointer-events-none transition-colors", isRow ? "mx-auto h-full w-px" : "my-auto h-px w-full", dragging
                ? "bg-[var(--color-brand)]"
                : "bg-[var(--color-border)] group-hover:bg-[var(--color-brand)]") }) }));
});
//# sourceMappingURL=WorkbenchSplitDivider.js.map