import type { TimelineFill, TimelineHole } from "@/components/workflow-timeline/timeline-holes.js";
/**
 * 侧板脊线上的留白零件（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「The pane」）。
 * 从 WorkflowRunPhaseList.tsx 拆出（max-lines 门）。
 *
 * - 留白的节头：虚线灯（等待时警示色描边 + 3px 常亮光晕）落在主轨上；补全后名字后面是笔标。
 * - 等待中的节体：等了多久、「等待主代理补全」。提示全文不在投影里（它随通知走），这里不复述。
 * - 有阶段的补全：一行 24px 的标题站在它写下的第一节之前，笔（14px，底色盖住主轨）落在灯的位置，
 *   然后是名字。补全的几节**不缩进**（用户修订 2026-09-29：嵌套由框套框说出）；标题是这次补全的头，
 *   指针或焦点落在它上面时画出框（WorkflowRunFillFrames.tsx）。
 */
export declare function SpineHoleLamp({ hole, pitch, track, }: {
    hole: TimelineHole;
    pitch: number;
    track?: number;
}): import("react/jsx-runtime").JSX.Element;
/** 等待中的留白的节体（docs/dynamic-workflow/presentation.md「The pane」）：等了多久 + 「等待主代理补全」+ 主代理收到的提示语。 */
export declare function HoleWaitingBody({ hole, now }: {
    hole: TimelineHole;
    now: number;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 补全的标题行：站在它写下的第一节之前。主轨从上到下穿过这一行，笔盖在轨上（底色遮住那一截）。
 * 它是框的图例：笔与名字都带底色，框的上缘从它们后面穿过。悬停只换字色、不铺底（铺了底，名字的
 * 底色就成了一块补丁）。点它与点节头同一条路（展开 / 落点由清单管）；tooltip 与卡上的头同一句。
 */
export declare function FillHeadingRow({ fill, fresh, on, onSelect, textColumn, }: {
    fill: TimelineFill;
    textColumn: {
        paddingLeft: number;
    } | undefined;
    /** 它的框此刻画着。 */
    on?: boolean;
    /** 补全刚接进 run 的两秒：笔与名字染警示色。 */
    fresh?: boolean;
    onSelect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunHoleParts.d.ts.map