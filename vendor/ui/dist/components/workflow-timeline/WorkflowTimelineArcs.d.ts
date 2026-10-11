import type { ReactNode } from "react";
import type { TimelineArc, TimelineBand, TimelineStation } from "./timeline-model.js";
import { type TimelineLayout } from "./timeline-geometry.js";
export declare function WorkflowTimelineArcs({ arcs, bands, children, height, layout, markerId, stations, width, }: {
    arcs: readonly TimelineArc[];
    bands: readonly TimelineBand[];
    /** 全部的站（不是草稿切过的那一段）：弧的下标指向它，要读每一站的轨道。 */
    stations: readonly TimelineStation[];
    layout: TimelineLayout;
    width: number;
    height: number;
    markerId: string;
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowTimelineArcs.d.ts.map