import type { TimelineInk, TimelineStation, WorkflowTimelineModel } from "./timeline-model.js";
import { type TimelineLayout } from "./timeline-geometry.js";
import { type FillSlide } from "./use-fill-growth.js";
/** 画布上的一个点。 */
export interface TimelinePoint {
    x: number;
    y: number;
}
/** 画面上的一段轨道：一条路径、一种墨，外加它接的两站（测试与调试的抓手）。 */
export interface TimelineRailPiece {
    key: string;
    d: string;
    /**
     * 路径的首尾两点，与 `d` 出自同一组数——行进边的光要按这两点铺渐变（`MarchLight`），
     * 而不是回头去解析 `d`。
     */
    start: TimelinePoint;
    end: TimelinePoint;
    ink: TimelineInk;
    /**
     * `fork` / `merge` 是带两端的曲线；`tail` / `stub` 是没有前驱 / 汇合站时主线的那一小截；`stream`
     * 是一条轨道上的流轨——路径在正中断开 `STREAM_GAP`，`chevrons` 是缺口的中心。
     */
    kind?: "fork" | "merge" | "tail" | "stub" | "stream";
    chevrons?: TimelinePoint;
    from?: number;
    to?: number;
}
/**
 * 轨道段 → 路径（纯函数）。一条轨道上的普通段是那一行上的一条直线（灯 + 8 → 灯 − 8）；主线的
 * 那几条穿过分叉点与汇合点，于是主线自然是一条直线。两端都在**不同的带**里的普通段只可能是
 * 相邻两带之间的那一段，画在主线上、从前一带的汇合点到后一带的分叉点。双线段不画在卡上。
 */
export declare function timelineRailPieces(model: Pick<WorkflowTimelineModel, "bands" | "rails" | "stations">, layout: TimelineLayout): TimelineRailPiece[];
/**
 * 轨道与引线，画在弧那一层 SVG 里（只有带时才挂上）。行进的段照弧的老规矩叠一层，只是那一层
 * 如今是**不动的**光（`MarchLight`）：从段的起点淡入、在灯那一头最亮。
 */
export declare function WorkflowTimelineTracks({ folded, layout, model, }: {
    model: Pick<WorkflowTimelineModel, "bands" | "rails" | "stations">;
    layout: TimelineLayout;
    /** 折到檐上的站：它的引线跟着灯一起淡出。 */
    folded: ReadonlySet<number>;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 灯（有带时）：还是 DOM 的 span——状态类、光晕与搏动都在 CSS 里——只是绝对定位到自己那条轨道
 * 的行上，而不再跟着站头排。
 */
export declare function WorkflowTimelineLamps({ draft, folded, layout, slide, stations, }: {
    stations: readonly TimelineStation[];
    layout: TimelineLayout;
    folded: ReadonlySet<number>;
    draft: boolean;
    /** 补全的生长（`use-fill-growth.ts`）：插入列右侧的灯随站滑开。 */
    slide?: FillSlide;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowTimelineTracks.d.ts.map