import { type FocusEvent, type PointerEvent } from "react";
import type { TimelineFill } from "./timeline-holes.js";
import { type TimelineFrame } from "./timeline-frames.js";
/** 补全接进 run 之后框自己画一遍、头染警示色的时长（docs/dynamic-workflow/presentation.md「The stroke」）。 */
export declare const FILL_FRESH_MS = 2000;
/**
 * 哪些补全此刻「新鲜」：`filledAt` 之后两秒内。用 state + 定时器而不是每帧读时钟：模型没有时间，
 * 时钟只在这里、只为这两秒存在。有头的补全与无阶段的补全（笔标）一视同仁。
 */
export declare function useFreshFills(fills: readonly {
    holeId: string;
    filledAt?: number;
}[]): ReadonlySet<string>;
/**
 * 哪一个框此刻该画（卡与侧板共用）：挂在根上的委托只认**头**——`data-fill-head` 的元素（卡上的头、
 * 侧板的标题行、无阶段补全的笔标）。指针在上面，或 focus-visible 的焦点在上面（站头按钮里带笔标的
 * 也算）。只认 focus-visible：点头开侧板时焦点留在头上，不该让框一直亮着。`enabled` 为假时不挂委托。
 */
export declare function useFillHeadTarget(enabled: boolean): {
    active: string | undefined;
    handlers: {
        onPointerOver?: (event: PointerEvent<HTMLDivElement>) => void;
        onPointerLeave?: () => void;
        onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
        onBlur?: () => void;
    };
};
/**
 * 补全的头与框（docs/dynamic-workflow/presentation.md「Holes on the timeline」）。
 *
 * 头：只在有补全的时间线上存在的 24px 一行，笔（12px）对准第一枚新灯的 x，留白的名字（caption、
 * medium、subtle、300px 截断）。没有底、没有线。点它开侧板、落到补全的标题。它（与无阶段补全的笔标）
 * 带 `data-fill-head`：时间线只从这里读悬停与键盘焦点，站与药丸不再点亮任何东西。
 * 框：`timeline-frames.ts` 算好的外接矩形，一条 `pathLength` 为 1 的路径；`data-fill-on` 时虚线偏移
 * 从 1 走到 0（一笔画出，420ms），离开时整根线 160ms 淡出。新鲜的两秒里它带 `wf-fill-frame-fresh`
 * 自己画一遍（动画而不是过渡：它挂载的那一帧就已经是亮的）。头那几行在上缘上挖空（遮罩），所以
 * 头是图例，而且不管时间线落在哪种底上都成立。一次只亮一个框：嵌套的补全不叠。
 * 嵌套的补全与外层同起于一列时，内层的头排在外层的头之后：外层头的右缘再过 12px，同一行——同起点的头
 * 放进同一个 flex 行（gap 12px），由布局而不是量宽度得出；起点不同的头各自对准自己的第一盏灯。
 */
export declare function WorkflowTimelineFills({ active, fills, frames, fresh, height, inset, onOpenFill, width, }: {
    fills: readonly TimelineFill[];
    /** 每次补全一个框（有头的与无阶段的都在，`timelineFrames`）。 */
    frames: readonly TimelineFrame[];
    /** 此刻画出的那一个框：指针在它的头上，或键盘焦点在头上。 */
    active: string | undefined;
    fresh: ReadonlySet<string>;
    height: number;
    width: number;
    inset: number;
    onOpenFill?: (fill: TimelineFill) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowTimelineFills.d.ts.map