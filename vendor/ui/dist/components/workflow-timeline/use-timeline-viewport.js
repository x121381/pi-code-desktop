import { useEffect, useLayoutEffect, useState } from "react";
const SCROLLING_MS = 800;
const EMPTY = { clientWidth: 0, scrollLeft: 0, scrollWidth: 0, scrolling: false };
function measure(element) {
    return {
        clientWidth: element.clientWidth,
        scrollLeft: element.scrollLeft,
        scrollWidth: element.scrollWidth,
    };
}
/** 把一次测量并进上一份视口；三个数与 scrolling 都没变就返回上一份，React 据此跳过这轮渲染。 */
function merge(previous, measured, scrolling = previous.scrolling) {
    return previous.clientWidth === measured.clientWidth &&
        previous.scrollLeft === measured.scrollLeft &&
        previous.scrollWidth === measured.scrollWidth &&
        previous.scrolling === scrolling
        ? previous
        : { ...measured, scrolling };
}
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
export function useTimelineViewport(
/** 滚动层元素；还没挂上（草稿首帧）或已卸下时为 null。 */
element, 
/** 内容变化的抓手（站数、宽度）：变了就重新量一次。 */
contentKey) {
    const [viewport, setViewport] = useState(EMPTY);
    useIsomorphicLayoutEffect(() => {
        if (element === null)
            return;
        setViewport((previous) => merge(previous, measure(element)));
    }, [element, contentKey]);
    useEffect(() => {
        if (element === null)
            return;
        let frame;
        let timer;
        const onScroll = () => {
            if (frame !== undefined)
                return;
            frame = requestAnimationFrame(() => {
                frame = undefined;
                setViewport((previous) => merge(previous, measure(element), true));
                if (timer !== undefined)
                    clearTimeout(timer);
                timer = setTimeout(() => {
                    timer = undefined;
                    setViewport((previous) => previous.scrolling ? { ...previous, scrolling: false } : previous);
                }, SCROLLING_MS);
            });
        };
        element.addEventListener("scroll", onScroll, { passive: true });
        let observer;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(() => {
                setViewport((previous) => merge(previous, measure(element)));
            });
            observer.observe(element);
            const content = element.firstElementChild;
            if (content !== null)
                observer.observe(content);
        }
        return () => {
            element.removeEventListener("scroll", onScroll);
            if (frame !== undefined)
                cancelAnimationFrame(frame);
            if (timer !== undefined)
                clearTimeout(timer);
            observer?.disconnect();
        };
    }, [element]);
    return viewport;
}
//# sourceMappingURL=use-timeline-viewport.js.map