import type { TimelineStation } from "./timeline-model.js";
import { type HoleParents, type TimelineFill } from "./timeline-holes.js";
import { type TimelineLayout } from "./timeline-geometry.js";
/**
 * 补全的框（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「Filled with phases」与
 * 「The stroke」）：一根 1px 的线、圆角 8，围住一次补全写下的东西，只在指针落在它的**头**上（或键盘
 * 焦点在头上）时画出；补全接进 run 后的两秒里它自己画一遍。线是**一笔**：从上缘的起点出发、顺时针
 * 绕一圈回到起点——有头的补全起点是笔的 x（头是图例，线从名字的右端冒出来、收在笔上），没有头的
 * 从左上角起。纯几何，无 React、无 DOM。
 *
 * 修复原因（2026-09-29 实测）：此前的「区域」是一块着色的底，指针落在补全里任一站 / 药丸上都会亮，
 * 横扫卡片时一路闪；嵌套的补全叠成深浅两块，读起来像面板；侧板上则什么都没有。
 */
/** 框越过它所围的列两侧的量。 */
export declare const FRAME_OUTSET = 8;
/** 同起于一列的嵌套框每层向里收的量。 */
export declare const FRAME_NEST_INSET = 4;
/** 框的圆角。 */
export declare const FRAME_RADIUS = 8;
/** 头那一行两侧给线留的空。 */
export declare const FRAME_LEGEND_GAP = 4;
/** 框的外接矩形（整数像素），`start` 是笔在上缘的 x；缺席即从左上角起笔。 */
export interface FrameBox {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    start?: number;
}
export interface TimelineFrame {
    holeId: string;
    box: FrameBox;
    /** 补全的时刻：新鲜态（两秒）按它算。 */
    filledAt?: number;
}
/**
 * 一笔画完的路径：从上缘的 `start` 出发，向右、顺时针绕一圈、回到 `start`。1px 的线落在半像素上
 * 才不糊：矩形向里收半个像素。`pathLength` 由调用方给 1，虚线偏移从 1 走到 0 就是「画出来」。
 */
export declare function framePath(box: FrameBox, radius?: number): string;
/** 无阶段的补全：留白自己的站带笔标、不在 `fills` 里的那些（它们的框只围自己一列）。 */
export interface FillMark {
    holeId: string;
    index: number;
    filledAt?: number;
}
export declare function fillMarksOf(stations: readonly Pick<TimelineStation, "hole">[], fills: readonly Pick<TimelineFill, "holeId">[]): FillMark[];
/** 包着 `holeId` 的补全有几层（侧板的框按它向里收）。 */
export declare function fillDepthOf(holeId: string, fills: readonly Pick<TimelineFill, "holeId">[], parents: HoleParents): number;
/**
 * 卡上的框。有头的补全：x 从首列左缘 − 8 到末列右缘 + 8，y 从头那一行的中线到它最高那一列药丸之下 8px
 * （那几列没有药丸——比如卡收起时——就到轨道行 / 站台行之下 4px）；同起于一列的嵌套框每层左、右、
 * 下各收 4px。无阶段的补全：它那一列，轨道行之上 4px 到它的药丸之下 8px，从左上角起笔。一律夹在
 * 时间线的画布里（首列与末列的框才不会被滚动层裁掉半根线）。
 */
export declare function timelineFrames({ columnHeight, fills, height, inset, layout, parents, stations, width, }: {
    fills: readonly TimelineFill[];
    stations: readonly Pick<TimelineStation, "hole" | "track">[];
    layout: Pick<TimelineLayout, "pillsTop" | "rowY">;
    /** 第 i 站药丸列的高（没有药丸为 0）。 */
    columnHeight: (index: number) => number;
    height: number;
    width: number;
    inset: number;
    parents: HoleParents;
}): TimelineFrame[];
/** 头那一行在上缘上挖的空（图例）：一行一个矩形，两侧各让 4px。宽度量不到（0）时不挖。 */
export declare function legendGaps(rows: readonly {
    left: number;
    width: number;
}[]): {
    x: number;
    width: number;
}[];
/**
 * 侧板的框：x 从 8 到列表右缘 − 12，每层嵌套各收 4px；有标题的补全从标题的中线起、到它最后一节之下
 * 4px，起笔在轨道的 x（21，笔盖着那一截）；无阶段的补全围自己那一节，上下各收 2px，从左上角起笔。
 * 纵向位置由调用方从 DOM 量来（节的展开 / 折叠会改它们）。
 */
export declare const SPINE_FRAME_LEFT = 8;
export declare const SPINE_FRAME_RIGHT = 12;
export declare const SPINE_RAIL_X = 21;
export declare function spineFrameBox({ bottom, depth, headed, top, width, }: {
    /** 标题行的顶（有头）或那一节的顶（无头），相对列表内容。 */
    top: number;
    /** 最后一节的底。 */
    bottom: number;
    width: number;
    depth: number;
    headed: boolean;
}): FrameBox;
//# sourceMappingURL=timeline-frames.d.ts.map