import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState, } from "react";
import { cn } from "../components/lib/utils.js";
import { fillDepthOf, fillMarksOf, framePath, spineFrameBox, } from "../components/workflow-timeline/timeline-frames.js";
import { useFillHeadTarget, useFreshFills, } from "../components/workflow-timeline/WorkflowTimelineFills.js";
const EMPTY = { width: 0, height: 0, boxes: {} };
function sectionOf(root, attribute, value) {
    return [...root.querySelectorAll(`[${attribute}]`)].find((element) => element.getAttribute(attribute) === value);
}
export function useSpineFillFrames(rootRef, model) {
    const fills = model.fills ?? [];
    const marks = fillMarksOf(model.stations, fills);
    const parents = model.holeParents ?? {};
    const fresh = useFreshFills([...fills, ...marks]);
    const [geometry, setGeometry] = useState(EMPTY);
    const any = fills.length + marks.length > 0;
    const measure = () => {
        const root = rootRef.current;
        if (root === null || !any)
            return;
        const rootTop = root.getBoundingClientRect().top - root.scrollTop;
        const top = (element) => element.getBoundingClientRect().top - rootTop;
        const bottom = (element) => top(element) + element.getBoundingClientRect().height;
        const width = root.clientWidth;
        const boxes = {};
        for (const fill of fills) {
            const heading = sectionOf(root, "data-fill-heading", fill.holeId);
            const last = model.stations[fill.to];
            const section = last === undefined ? undefined : sectionOf(root, "data-phase-id", last.id);
            if (heading === undefined || section === undefined)
                continue;
            boxes[fill.holeId] = spineFrameBox({
                bottom: bottom(section),
                depth: fillDepthOf(fill.holeId, fills, parents),
                headed: true,
                top: top(heading),
                width,
            });
        }
        for (const mark of marks) {
            const station = model.stations[mark.index];
            const section = station === undefined ? undefined : sectionOf(root, "data-phase-id", station.id);
            if (section === undefined)
                continue;
            boxes[mark.holeId] = spineFrameBox({
                bottom: bottom(section),
                depth: fillDepthOf(mark.holeId, fills, parents),
                headed: false,
                top: top(section),
                width,
            });
        }
        const next = { boxes, height: root.scrollHeight, width };
        setGeometry((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    // 观察者只建一次，却总要调到最新的一版量法（它闭包里有这一帧的 fills 与站）。
    const measureRef = useRef(measure);
    measureRef.current = measure;
    useLayoutEffect(() => measureRef.current());
    useEffect(() => {
        const root = rootRef.current;
        if (root === null || !any || typeof ResizeObserver === "undefined")
            return undefined;
        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(root);
        // 节展开 / 折叠时列表自己的盒子不变、内容高度变：连同每一节一起观察。框自己的 svg 不观察。
        for (const child of root.children)
            if (!(child instanceof SVGElement))
                observer.observe(child);
        return () => observer.disconnect();
    }, [any, rootRef]);
    const { active, handlers } = useFillHeadTarget(any);
    if (!any)
        return { active: undefined, fresh, frames: null, handlers };
    const frames = (_jsx("svg", { "aria-hidden": true, className: "pointer-events-none absolute left-0 top-0 overflow-visible", "data-testid": "workflow-run-fill-frames", height: geometry.height, width: geometry.width, children: [...fills, ...marks].map(({ holeId }) => {
            const box = geometry.boxes[holeId];
            const isFresh = fresh.has(holeId);
            return (_jsx("path", { className: cn("wf-fill-frame", isFresh && "wf-fill-frame-fresh"), d: box === undefined ? "" : framePath(box), "data-fill-frame": holeId, "data-fill-fresh": isFresh ? "true" : undefined, "data-fill-on": isFresh || active === holeId ? "true" : undefined, "data-testid": "workflow-run-fill-frame", pathLength: 1 }, holeId));
        }) }));
    return { active, fresh, frames, handlers };
}
//# sourceMappingURL=WorkflowRunFillFrames.js.map